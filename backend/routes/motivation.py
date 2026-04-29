"""
Motivation & Gamification routes: Streaks, achievements, badges, points.
"""

from flask import Blueprint, jsonify
from helpers import get_supabase, token_required

motivation_bp = Blueprint("motivation", __name__)


@motivation_bp.route("/", methods=["GET"])
@token_required
def get_motivation_data(current_user_id):
    sb = get_supabase()

    user = sb.table("users").select("streak_count, total_points").eq("id", current_user_id).execute()
    streak = user.data[0]["streak_count"] if user.data else 0
    points = user.data[0].get("total_points", 0) if user.data else 0

    # Get all achievements
    all_ach = sb.table("achievements").select("*").execute()

    # Get user's unlocked achievements
    unlocked = sb.table("user_achievements").select("achievement_id").eq("user_id", current_user_id).execute()
    unlocked_ids = {u["achievement_id"] for u in unlocked.data}

    # Check and auto-unlock streak achievements
    for ach in all_ach.data:
        if ach["id"] in unlocked_ids:
            continue
        if ach["requirement_type"] == "streak" and streak >= ach["requirement_value"]:
            sb.table("user_achievements").insert({"user_id": current_user_id, "achievement_id": ach["id"]}).execute()
            unlocked_ids.add(ach["id"])
        elif ach["requirement_type"] == "completion":
            done = sb.table("study_sessions").select("id").eq("user_id", current_user_id).eq("completed", True).execute()
            if len(done.data) >= ach["requirement_value"]:
                sb.table("user_achievements").insert({"user_id": current_user_id, "achievement_id": ach["id"]}).execute()
                unlocked_ids.add(ach["id"])

    achievements = []
    for ach in all_ach.data:
        achievements.append({
            "id": ach["id"], "title": ach["title"], "desc": ach["description"],
            "icon": ach["icon"], "color": ach["color"], "unlocked": ach["id"] in unlocked_ids
        })

    next_milestone = 30 if streak < 30 else 60 if streak < 60 else 100
    return jsonify({
        "streak_days": streak, "total_points": points,
        "next_milestone": next_milestone,
        "achievements": achievements,
        "unlocked_count": len(unlocked_ids),
        "total_count": len(all_ach.data)
    })
