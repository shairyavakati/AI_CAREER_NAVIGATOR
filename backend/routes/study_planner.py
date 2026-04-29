"""
Study Planner routes: Time-Aware daily plan generation,
mark tasks complete, and trigger Forgetting Curve revisions.
"""

from datetime import date, timedelta
from flask import Blueprint, request, jsonify
from helpers import get_supabase, token_required

study_planner_bp = Blueprint("study_planner", __name__)


@study_planner_bp.route("/today", methods=["GET"])
@token_required
def get_today_plan(current_user_id):
    """
    Generate / retrieve the daily study plan using the Time-Aware algorithm.
    1. Always fetch mandatory revisions for TODAY first.
    2. Fill remaining time with NEW learning topics.
    """
    sb = get_supabase()
    today = date.today().isoformat()

    # Get user's time commitment
    user_result = sb.table("users").select("time_commitment, chosen_role").eq("id", current_user_id).execute()
    if not user_result.data:
        return jsonify({"error": "User not found"}), 404

    user = user_result.data[0]
    available_mins = user.get("time_commitment", 60)

    # 1. Get today's revision sessions
    revisions = (
        sb.table("study_sessions")
        .select("*, learning_topics(*)")
        .eq("user_id", current_user_id)
        .eq("scheduled_date", today)
        .eq("type", "REVISE")
        .execute()
    )

    today_plan = []
    time_used = 0

    for rev in revisions.data:
        topic = rev.get("learning_topics", {})
        est_time = topic.get("estimated_time", 30) if topic else 30
        today_plan.append({
            "id": rev["id"],
            "topic_id": rev["topic_id"],
            "title": topic.get("title", "Revision Task") if topic else "Revision Task",
            "type": "revision",
            "completed": rev["completed"],
            "time": f"{est_time} min",
            "estimated_time": est_time
        })
        time_used += est_time

    # 2. Get today's learning sessions (already scheduled)
    learn_sessions = (
        sb.table("study_sessions")
        .select("*, learning_topics(*)")
        .eq("user_id", current_user_id)
        .eq("scheduled_date", today)
        .eq("type", "LEARN")
        .execute()
    )

    for session in learn_sessions.data:
        topic = session.get("learning_topics", {})
        est_time = topic.get("estimated_time", 30) if topic else 30
        today_plan.append({
            "id": session["id"],
            "topic_id": session["topic_id"],
            "title": topic.get("title", "Learning Task") if topic else "Learning Task",
            "type": "learning",
            "completed": session["completed"],
            "time": f"{est_time} min",
            "estimated_time": est_time
        })
        time_used += est_time

    # 3. If we have remaining time, auto-schedule new topics
    if time_used < available_mins:
        # Get all completed topic IDs
        all_sessions = (
            sb.table("study_sessions")
            .select("topic_id")
            .eq("user_id", current_user_id)
            .eq("type", "LEARN")
            .execute()
        )
        scheduled_topic_ids = {s["topic_id"] for s in all_sessions.data}

        # Get the user's role skills
        role = user.get("chosen_role", "developer")
        skills = sb.table("skills").select("id").eq("role", role).execute()
        skill_ids = [s["id"] for s in skills.data]

        # Get next unscheduled topics
        if skill_ids:
            next_topics = (
                sb.table("learning_topics")
                .select("*")
                .in_("skill_id", skill_ids)
                .order("sequence_order")
                .execute()
            )

            for topic in next_topics.data:
                if topic["id"] in scheduled_topic_ids:
                    continue
                if time_used + topic["estimated_time"] > available_mins:
                    break

                # Auto-schedule this topic
                new_session = sb.table("study_sessions").insert({
                    "user_id": current_user_id,
                    "topic_id": topic["id"],
                    "type": "LEARN",
                    "scheduled_date": today,
                    "completed": False
                }).execute()

                if new_session.data:
                    session_data = new_session.data[0]
                    today_plan.append({
                        "id": session_data["id"],
                        "topic_id": topic["id"],
                        "title": topic["title"],
                        "type": "learning",
                        "completed": False,
                        "time": f"{topic['estimated_time']} min",
                        "estimated_time": topic["estimated_time"]
                    })
                    time_used += topic["estimated_time"]
                    scheduled_topic_ids.add(topic["id"])

    return jsonify({
        "plan": today_plan,
        "date": today,
        "time_used": time_used,
        "time_available": available_mins,
        "total_tasks": len(today_plan),
        "completed_tasks": sum(1 for t in today_plan if t["completed"])
    })


@study_planner_bp.route("/complete/<session_id>", methods=["POST"])
@token_required
def complete_task(current_user_id, session_id):
    """
    Mark a study session as complete.
    If it's a LEARN task, schedule Forgetting Curve revisions at Day+1, Day+3, Day+7.
    """
    sb = get_supabase()
    today = date.today()

    # Get the session
    session_result = (
        sb.table("study_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", current_user_id)
        .execute()
    )

    if not session_result.data:
        return jsonify({"error": "Session not found"}), 404

    session = session_result.data[0]

    # Mark as complete
    sb.table("study_sessions").update({
        "completed": True,
        "completed_at": today.isoformat() + "T" + "00:00:00+00:00"
    }).eq("id", session_id).execute()

    # If it's a LEARN session, schedule Forgetting Curve revisions
    revisions_scheduled = []
    if session["type"] == "LEARN":
        revision_intervals = [1, 3, 7]  # Days after completion
        for interval in revision_intervals:
            rev_date = today + timedelta(days=interval)

            # Check if revision already exists
            existing = (
                sb.table("study_sessions")
                .select("id")
                .eq("user_id", current_user_id)
                .eq("topic_id", session["topic_id"])
                .eq("type", "REVISE")
                .eq("scheduled_date", rev_date.isoformat())
                .execute()
            )

            if not existing.data:
                sb.table("study_sessions").insert({
                    "user_id": current_user_id,
                    "topic_id": session["topic_id"],
                    "type": "REVISE",
                    "scheduled_date": rev_date.isoformat(),
                    "completed": False
                }).execute()
                revisions_scheduled.append(f"Day +{interval} ({rev_date.isoformat()})")

    # Update user skill gap progress
    topic_result = sb.table("learning_topics").select("skill_id").eq("id", session["topic_id"]).execute()
    if topic_result.data:
        skill_id = topic_result.data[0]["skill_id"]
        gap = (
            sb.table("user_skill_gaps")
            .select("*")
            .eq("user_id", current_user_id)
            .eq("skill_id", skill_id)
            .execute()
        )
        if gap.data:
            current = gap.data[0]["current_level"]
            new_level = min(100, current + 5)  # Increment by 5 per completion
            new_status = "mastered" if new_level >= 80 else "learning"
            sb.table("user_skill_gaps").update({
                "current_level": new_level,
                "status": new_status
            }).eq("user_id", current_user_id).eq("skill_id", skill_id).execute()

            # Record evolution
            sb.table("skill_evolution").insert({
                "user_id": current_user_id,
                "skill_id": skill_id,
                "level": new_level
            }).execute()

    # Award points
    points = 10 if session["type"] == "LEARN" else 5
    sb.table("users").update({
        "total_points": sb.table("users").select("total_points").eq("id", current_user_id).execute().data[0].get("total_points", 0) + points
    }).eq("id", current_user_id).execute()

    return jsonify({
        "message": "Task completed successfully!",
        "revisions_scheduled": revisions_scheduled,
        "points_earned": points
    })


@study_planner_bp.route("/update-time", methods=["POST"])
@token_required
def update_time_commitment(current_user_id):
    """Update the user's daily time commitment."""
    data = request.get_json()
    time_commitment = data.get("time_commitment", 60)

    if time_commitment not in [30, 60, 120]:
        return jsonify({"error": "Time must be 30, 60, or 120 minutes"}), 400

    sb = get_supabase()
    sb.table("users").update({"time_commitment": time_commitment}).eq("id", current_user_id).execute()

    return jsonify({"message": "Time commitment updated", "time_commitment": time_commitment})
