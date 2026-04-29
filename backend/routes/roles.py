"""
Role selection routes: List roles, select a role, get role skills.
"""

from flask import Blueprint, request, jsonify
from helpers import get_supabase, token_required

roles_bp = Blueprint("roles", __name__)


# Static role definitions matching the UI
ROLES = [
    {"id": "developer", "title": "Software Developer", "desc": "Frontend, Backend, Full Stack", "color": "#4F46E5"},
    {"id": "manager", "title": "Product Manager", "desc": "Strategy, Roadmap, Analytics", "color": "#06B6D4"},
    {"id": "student", "title": "Student", "desc": "Learning & Development", "color": "#8B5CF6"},
    {"id": "designer", "title": "Designer", "desc": "UI/UX, Visual Design", "color": "#10B981"},
]


@roles_bp.route("/", methods=["GET"])
@token_required
def list_roles(current_user_id):
    """List all available roles with suggestions based on detected skills."""
    sb = get_supabase()
    detected = []
    
    try:
        user_result = sb.table("users").select("detected_skills").eq("id", current_user_id).execute()
        detected = user_result.data[0].get("detected_skills", []) if user_result.data else []
    except Exception as e:
        print(f"Warning: Could not fetch detected_skills from users (column might be missing): {e}")
        # Fallback: Try to get it from the latest evaluation
        try:
            eval_result = sb.table("evaluations").select("quiz_data").eq("user_id", current_user_id).order("created_at", desc=True).limit(1).execute()
            if eval_result.data:
                detected = eval_result.data[0].get("quiz_data", {}).get("detected", [])
        except Exception as e2:
            print(f"Warning: Fallback to evaluations also failed: {e2}")
    
    # Simple heuristic for role suggestion
    suggestions = []
    if any(s in ["Python", "JavaScript", "Mobile Dev", "React Native"] for s in detected):
        suggestions.append("developer")
    if any(s in ["Management", "Agile"] for s in detected):
        suggestions.append("manager")
    if any(s in ["Web Design", "UI/UX"] for s in detected):
        suggestions.append("designer")
        
    if not suggestions:
        suggestions = ["student"]

    return jsonify({
        "roles": ROLES,
        "suggestions": suggestions,
        "detected_skills": detected
    })


@roles_bp.route("/select", methods=["POST"])
@token_required
def select_role(current_user_id):
    """User selects their desired role."""
    data = request.get_json()
    role_id = data.get("role_id", "")

    valid_ids = [r["id"] for r in ROLES]
    if role_id not in valid_ids:
        return jsonify({"error": "Invalid role selected"}), 400

    sb = get_supabase()

    # Update user's chosen role
    sb.table("users").update({"chosen_role": role_id}).eq("id", current_user_id).execute()

    # Get skills for this role
    skills_result = sb.table("skills").select("*").eq("role", role_id).execute()

    # Initialize skill gaps for the user
    for skill in skills_result.data:
        # Upsert: insert if not exists
        existing = (
            sb.table("user_skill_gaps")
            .select("id")
            .eq("user_id", current_user_id)
            .eq("skill_id", skill["id"])
            .execute()
        )
        if not existing.data:
            sb.table("user_skill_gaps").insert({
                "user_id": current_user_id,
                "skill_id": skill["id"],
                "current_level": 0,
                "target_level": 100,
                "status": "missing"
            }).execute()

    return jsonify({
        "message": "Role selected successfully",
        "role": role_id,
        "skills": skills_result.data
    })


@roles_bp.route("/skills/<role_id>", methods=["GET"])
def get_role_skills(role_id):
    """Get all skills required for a specific role."""
    sb = get_supabase()
    result = sb.table("skills").select("*").eq("role", role_id).execute()
    return jsonify({"skills": result.data})
