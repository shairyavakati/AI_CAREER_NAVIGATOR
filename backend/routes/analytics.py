"""
Analytics routes: Progress stats, skill levels, study consistency.
"""

from datetime import date, timedelta
from flask import Blueprint, jsonify
from helpers import get_supabase, token_required

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@token_required
def get_dashboard(current_user_id):
    """Get comprehensive analytics dashboard data."""
    sb = get_supabase()

    # Get user info
    user_result = sb.table("users").select("*").eq("id", current_user_id).execute()
    if not user_result.data:
        return jsonify({"error": "User not found"}), 404
    user = user_result.data[0]
    user.pop("password_hash", None)

    role = user.get("chosen_role", "developer")

    # === 1. Overall Progress ===
    skills_result = sb.table("skills").select("id").eq("role", role).execute()
    skill_ids = [s["id"] for s in skills_result.data]

    total_topics_result = sb.table("learning_topics").select("id").in_("skill_id", skill_ids).execute()
    total_topics = len(total_topics_result.data)

    completed_sessions = (
        sb.table("study_sessions")
        .select("topic_id")
        .eq("user_id", current_user_id)
        .eq("type", "LEARN")
        .eq("completed", True)
        .execute()
    )
    completed_topics = len(set(s["topic_id"] for s in completed_sessions.data))
    progress_pct = int((completed_topics / total_topics * 100)) if total_topics > 0 else 0

    # === 2. Skill Levels ===
    gaps_result = (
        sb.table("user_skill_gaps")
        .select("*, skills(name)")
        .eq("user_id", current_user_id)
        .in_("skill_id", skill_ids)
        .execute()
    )
    skill_levels = []
    for g in gaps_result.data:
        skill_levels.append({
            "skill": g.get("skills", {}).get("name", "Unknown"),
            "level": g["current_level"]
        })
    mastered_count = sum(1 for g in gaps_result.data if g["status"] == "mastered")

    # === 3. Study Hours ===
    all_completed = (
        sb.table("study_sessions")
        .select("*, learning_topics(estimated_time)")
        .eq("user_id", current_user_id)
        .eq("completed", True)
        .execute()
    )
    total_minutes = sum(
        s.get("learning_topics", {}).get("estimated_time", 30)
        for s in all_completed.data
        if s.get("learning_topics")
    )
    study_hours = round(total_minutes / 60, 1)

    # === 4. Completion Rate (revisions completed vs scheduled) ===
    today = date.today()
    all_revisions = (
        sb.table("study_sessions")
        .select("completed")
        .eq("user_id", current_user_id)
        .eq("type", "REVISE")
        .lte("scheduled_date", today.isoformat())
        .execute()
    )
    total_revisions = len(all_revisions.data)
    completed_revisions = sum(1 for r in all_revisions.data if r["completed"])
    completion_rate = int((completed_revisions / total_revisions * 100)) if total_revisions > 0 else 100

    # === 5. Weekly Progress Data (last 6 weeks) ===
    weekly_progress = []
    for i in range(5, -1, -1):
        week_end = today - timedelta(weeks=i)
        week_start = week_end - timedelta(days=6)

        week_sessions = (
            sb.table("study_sessions")
            .select("id")
            .eq("user_id", current_user_id)
            .eq("completed", True)
            .gte("scheduled_date", week_start.isoformat())
            .lte("scheduled_date", week_end.isoformat())
            .execute()
        )
        weekly_progress.append({
            "week": f"Week {6 - i}",
            "score": len(week_sessions.data) * 10  # Simple scoring
        })

    # === Stats Summary ===
    stats = [
        {"label": "Overall Progress", "value": f"{progress_pct}%", "change": f"+{min(progress_pct, 12)}%", "color": "#4F46E5"},
        {"label": "Skills Mastered", "value": str(mastered_count), "change": f"+{mastered_count}", "color": "#10B981"},
        {"label": "Study Hours", "value": f"{study_hours}h", "change": f"+{study_hours}h", "color": "#06B6D4"},
        {"label": "Completion Rate", "value": f"{completion_rate}%", "change": f"+{min(completion_rate, 5)}%", "color": "#8B5CF6"},
    ]

    return jsonify({
        "stats": stats,
        "skill_levels": skill_levels,
        "weekly_progress": weekly_progress,
        "user": user
    })
