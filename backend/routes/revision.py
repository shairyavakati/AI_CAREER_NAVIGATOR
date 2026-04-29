"""
Revision System routes: View forgetting curve stages and revision history.
"""

from datetime import date
from flask import Blueprint, jsonify
from helpers import get_supabase, token_required

revision_bp = Blueprint("revision", __name__)


@revision_bp.route("/stages", methods=["GET"])
@token_required
def get_revision_stages(current_user_id):
    sb = get_supabase()
    today = date.today()

    revisions = (
        sb.table("study_sessions")
        .select("*, learning_topics(title)")
        .eq("user_id", current_user_id)
        .eq("type", "REVISE")
        .order("scheduled_date")
        .execute()
    )

    d1_t = d1_c = d3_t = d3_c = d7_t = d7_c = 0
    for rev in revisions.data:
        rd = date.fromisoformat(rev["scheduled_date"]) if isinstance(rev["scheduled_date"], str) else rev["scheduled_date"]
        diff = (rd - today).days
        if diff <= 1:
            d1_t += 1
            d1_c += 1 if rev["completed"] else 0
        elif diff <= 3:
            d3_t += 1
            d3_c += 1 if rev["completed"] else 0
        else:
            d7_t += 1
            d7_c += 1 if rev["completed"] else 0

    learn_done = sb.table("study_sessions").select("id").eq("user_id", current_user_id).eq("type", "LEARN").eq("completed", True).execute()

    stages = [
        {"id": 1, "label": "Learn", "status": "completed" if learn_done.data else "upcoming", "color": "#4F46E5", "day": "Today", "total": len(learn_done.data), "completed": len(learn_done.data), "description": "Initial learning session"},
        {"id": 2, "label": "Day 1", "status": "completed" if d1_c else ("in-progress" if d1_t else "upcoming"), "color": "#06B6D4", "day": "Tomorrow", "total": d1_t, "completed": d1_c, "description": "First revision to reinforce memory"},
        {"id": 3, "label": "Day 3", "status": "completed" if d3_c else ("in-progress" if d3_t else "upcoming"), "color": "#8B5CF6", "day": "In 3 days", "total": d3_t, "completed": d3_c, "description": "Second revision to strengthen recall"},
        {"id": 4, "label": "Day 7", "status": "completed" if d7_c else ("in-progress" if d7_t else "upcoming"), "color": "#10B981", "day": "In 7 days", "total": d7_t, "completed": d7_c, "description": "Final revision for long-term retention"},
    ]

    upcoming = (
        sb.table("study_sessions").select("*, learning_topics(title)")
        .eq("user_id", current_user_id).eq("type", "REVISE").eq("completed", False)
        .gte("scheduled_date", today.isoformat()).order("scheduled_date").limit(10).execute()
    )

    upcoming_list = [{"id": r["id"], "title": (r.get("learning_topics") or {}).get("title", "Revision"), "date": r["scheduled_date"]} for r in upcoming.data]

    return jsonify({"stages": stages, "upcoming_revisions": upcoming_list})
