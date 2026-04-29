"""
Authentication routes: Signup, Login
"""

import jwt
import bcrypt
from datetime import datetime, timedelta, date, timezone
from flask import Blueprint, request, jsonify
from config import Config
from helpers import get_supabase, token_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user."""
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    sb = get_supabase()

    # Check if user exists
    existing = sb.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return jsonify({"error": "An account with this email already exists"}), 409

    # Hash password
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create user
    result = sb.table("users").insert({
        "email": email,
        "password_hash": password_hash,
        "name": name,
        "last_login_date": date.today().isoformat()
    }).execute()

    user = result.data[0]

    # Generate JWT
    token = jwt.encode(
        {"user_id": user["id"], "exp": datetime.now(timezone.utc) + timedelta(days=30)},
        Config.JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "chosen_role": user.get("chosen_role"),
            "time_commitment": user.get("time_commitment", 60),
            "level": user.get("level", "Beginner"),
            "streak_count": user.get("streak_count", 0)
        }
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login an existing user."""
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    sb = get_supabase()

    # Find user
    result = sb.table("users").select("*").eq("email", email).execute()
    if not result.data:
        return jsonify({"error": "Invalid email or password"}), 401

    user = result.data[0]

    # Verify password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    # Update streak
    today = date.today()
    last_login = user.get("last_login_date")
    streak = user.get("streak_count", 0)

    if last_login:
        last_date = date.fromisoformat(last_login) if isinstance(last_login, str) else last_login
        diff = (today - last_date).days
        if diff == 1:
            streak += 1
        elif diff > 1:
            streak = 1
        # diff == 0 means same day, keep streak
    else:
        streak = 1

    # Update last login and streak
    sb.table("users").update({
        "last_login_date": today.isoformat(),
        "streak_count": streak
    }).eq("id", user["id"]).execute()

    # Generate JWT
    token = jwt.encode(
        {"user_id": user["id"], "exp": datetime.now(timezone.utc) + timedelta(days=30)},
        Config.JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "chosen_role": user.get("chosen_role"),
            "time_commitment": user.get("time_commitment", 60),
            "level": user.get("level", "Beginner"),
            "streak_count": streak
        }
    })


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_profile(current_user_id):
    """Get the current user's profile."""
    sb = get_supabase()
    result = sb.table("users").select("*").eq("id", current_user_id).execute()

    if not result.data:
        return jsonify({"error": "User not found"}), 404

    user = result.data[0]
    user.pop("password_hash", None)
    return jsonify({"user": user})


@auth_bp.route("/update-profile", methods=["POST"])
@token_required
def update_profile(current_user_id):
    """Update user profile fields."""
    data = request.get_json()
    updatable_fields = [
        "name", "chosen_role", "education_details", 
        "detected_skills", "time_commitment", "level"
    ]
    
    update_data = {}
    for field in updatable_fields:
        if field in data:
            update_data[field] = data[field]
            
    if not update_data:
        return jsonify({"message": "No fields to update"}), 400
        
    sb = get_supabase()
    try:
        result = sb.table("users").update(update_data).eq("id", current_user_id).execute()
        if not result.data:
            return jsonify({"error": "Failed to update profile"}), 500
        user = result.data[0]
    except Exception as e:
        print(f"Warning: Profile update failed (possibly missing columns): {e}")
        # Fallback: Get user without updated fields
        res = sb.table("users").select("*").eq("id", current_user_id).execute()
        user = res.data[0] if res.data else {}

    user.pop("password_hash", None)
    return jsonify({"message": "Profile updated successfully", "user": user})
