"""
Skill Evolution Timeline routes.
"""

from flask import Blueprint, jsonify
from helpers import get_supabase, token_required

skill_evolution_bp = Blueprint("skill_evolution", __name__)


@skill_evolution_bp.route("/", methods=["GET"])
@token_required
def get_skill_evolution(current_user_id):
    sb = get_supabase()

    user = sb.table("users").select("chosen_role").eq("id", current_user_id).execute()
    role = user.data[0]["chosen_role"] if user.data else "developer"

    skills = sb.table("skills").select("*").eq("role", role).execute()
    skill_map = {s["id"]: s["name"] for s in skills.data}
    skill_ids = list(skill_map.keys())

    # Get evolution history
    history = (
        sb.table("skill_evolution").select("*")
        .eq("user_id", current_user_id).in_("skill_id", skill_ids)
        .order("recorded_at").execute()
    )

    # Group by month
    monthly = {}
    for entry in history.data:
        ts = entry["recorded_at"][:7]  # "2026-04"
        month_label = ts
        if month_label not in monthly:
            monthly[month_label] = {}
        skill_name = skill_map.get(entry["skill_id"], "Unknown")
        monthly[month_label][skill_name] = entry["level"]

    # Build chart data
    chart_data = []
    for month, skills_data in sorted(monthly.items()):
        point = {"month": month}
        point.update(skills_data)
        chart_data.append(point)

    # Current levels
    gaps = sb.table("user_skill_gaps").select("*, skills(name)").eq("user_id", current_user_id).in_("skill_id", skill_ids).execute()

    current_levels = {}
    for g in gaps.data:
        name = g.get("skills", {}).get("name", "Unknown")
        current_levels[name] = g["current_level"]

    # Calculate growth
    if chart_data and len(chart_data) >= 2:
        first_vals = [v for k, v in chart_data[0].items() if k != "month" and isinstance(v, (int, float))]
        last_vals = [v for k, v in chart_data[-1].items() if k != "month" and isinstance(v, (int, float))]
        first_avg = sum(first_vals) / len(first_vals) if first_vals else 1
        last_avg = sum(last_vals) / len(last_vals) if last_vals else 0
        growth = int(((last_avg - first_avg) / max(first_avg, 1)) * 100)
    else:
        growth = 0

    # Milestones
    milestones = []
    for entry in history.data:
        level = entry["level"]
        skill_name = skill_map.get(entry["skill_id"], "Unknown")
        if level >= 80:
            milestones.append({"month": entry["recorded_at"][:7], "skill": skill_name, "achievement": f"Mastered {skill_name}", "icon": "🏆"})
        elif level >= 50:
            milestones.append({"month": entry["recorded_at"][:7], "skill": skill_name, "achievement": f"Intermediate in {skill_name}", "icon": "🚀"})

    # Deduplicate milestones
    seen = set()
    unique_milestones = []
    for m in milestones:
        key = f"{m['skill']}_{m['achievement']}"
        if key not in seen:
            seen.add(key)
            unique_milestones.append(m)

    skill_names = list(skill_map.values())

    return jsonify({
        "chart_data": chart_data,
        "skill_names": skill_names,
        "current_levels": current_levels,
        "overall_growth": growth,
        "milestones": unique_milestones[:8]
    })
