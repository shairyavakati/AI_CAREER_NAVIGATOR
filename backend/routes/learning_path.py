"""
Learning Path routes: Generate and retrieve adaptive learning paths.
"""

from flask import Blueprint, jsonify
from helpers import get_supabase, token_required

learning_path_bp = Blueprint("learning_path", __name__)


@learning_path_bp.route("/", methods=["GET"])
@token_required
def get_learning_path(current_user_id):
    """Get the user's adaptive learning path with topics and revision schedule."""
    sb = get_supabase()

    # Get user info
    user_result = sb.table("users").select("chosen_role, time_commitment").eq("id", current_user_id).execute()
    if not user_result.data:
        return jsonify({"error": "User not found"}), 404

    user = user_result.data[0]
    role = user.get("chosen_role", "developer")

    # Get skills for the role
    skills_result = sb.table("skills").select("*").eq("role", role).execute()
    skill_ids = [s["id"] for s in skills_result.data]

    # Get skill gaps
    gaps_result = (
        sb.table("user_skill_gaps")
        .select("*, skills(*)")
        .eq("user_id", current_user_id)
        .in_("skill_id", skill_ids)
        .execute()
    )

    # Get learning topics for these skills
    topics_result = (
        sb.table("learning_topics")
        .select("*")
        .in_("skill_id", skill_ids)
        .order("sequence_order")
        .execute()
    )

    # Get completed sessions for the user
    sessions_result = (
        sb.table("study_sessions")
        .select("topic_id, completed, type")
        .eq("user_id", current_user_id)
        .execute()
    )

    completed_topic_ids = set()
    in_progress_topic_ids = set()
    for session in sessions_result.data:
        if session["completed"] and session["type"] == "LEARN":
            completed_topic_ids.add(session["topic_id"])
        elif not session["completed"]:
            in_progress_topic_ids.add(session["topic_id"])

    # Build path with status
    path_topics = []
    for topic in topics_result.data:
        if topic["id"] in completed_topic_ids:
            status = "completed"
        elif topic["id"] in in_progress_topic_ids:
            status = "in-progress"
        else:
            status = "upcoming"

        # Get revisions scheduled for this topic
        revisions_result = (
            sb.table("study_sessions")
            .select("scheduled_date, completed")
            .eq("user_id", current_user_id)
            .eq("topic_id", topic["id"])
            .eq("type", "REVISE")
            .order("scheduled_date")
            .execute()
        )

        revisions = []
        for rev in revisions_result.data:
            revisions.append({
                "date": rev["scheduled_date"],
                "completed": rev["completed"]
            })

        # Find the skill name
        skill_name = ""
        for skill in skills_result.data:
            if skill["id"] == topic["skill_id"]:
                skill_name = skill["name"]
                break

        path_topics.append({
            "id": topic["id"],
            "title": topic["title"],
            "skill": skill_name,
            "status": status,
            "duration": f"{topic['estimated_time']} min",
            "estimated_time": topic["estimated_time"],
            "revisions": revisions,
            "sequence_order": topic["sequence_order"]
        })

    # Sort: in-progress first, then upcoming by sequence, completed last
    status_order = {"in-progress": 0, "upcoming": 1, "completed": 2}
    path_topics.sort(key=lambda t: (status_order.get(t["status"], 1), t["sequence_order"]))

    return jsonify({
        "path": path_topics,
        "skill_gaps": [
            {
                "skill_name": g.get("skills", {}).get("name", "Unknown"),
                "current_level": g["current_level"],
                "target_level": g["target_level"],
                "status": g["status"]
            }
            for g in gaps_result.data
        ],
        "total_topics": len(path_topics),
        "completed_topics": len(completed_topic_ids),
        "time_commitment": user.get("time_commitment", 60)
    })
