"""
Quiz routes: Periodic quiz generation, submission, and intelligent redirection.
"""

import random
from flask import Blueprint, request, jsonify
from helpers import get_supabase, token_required

quiz_bp = Blueprint("quiz", __name__)


@quiz_bp.route("/generate", methods=["GET"])
@token_required
def generate_quiz(current_user_id):
    """
    Generate a periodic quiz.
    Triggered after every 5 LEARN sessions.
    Combines questions from recent new topics and Day-7 revision topics.
    """
    sb = get_supabase()

    # Get user's role
    user_result = sb.table("users").select("chosen_role").eq("id", current_user_id).execute()
    role = user_result.data[0]["chosen_role"] if user_result.data else "developer"

    # Get recently completed learning topics
    recent_sessions = (
        sb.table("study_sessions")
        .select("topic_id, learning_topics(title, skill_id)")
        .eq("user_id", current_user_id)
        .eq("type", "LEARN")
        .eq("completed", True)
        .order("completed_at", desc=True)
        .limit(10)
        .execute()
    )

    # Build questions based on recent topics
    questions = []
    topic_titles = []

    for session in recent_sessions.data:
        topic = session.get("learning_topics", {})
        if topic:
            topic_titles.append(topic.get("title", ""))

    # Generate contextual questions (in a real app, this would call an LLM)
    question_templates = [
        {"question": "What is the main concept behind {topic}?",
         "options": ["Data storage pattern", "Core implementation technique", "Testing methodology", "Deployment strategy"],
         "correct": 1},
        {"question": "Which best describes the purpose of {topic}?",
         "options": ["Performance optimization", "Building scalable solutions", "Code organization", "User interface design"],
         "correct": 1},
        {"question": "How would you apply {topic} in a real project?",
         "options": ["As a utility function", "As a core architectural pattern", "As a testing framework", "As a styling approach"],
         "correct": 1},
        {"question": "What prerequisite is most important for {topic}?",
         "options": ["Advanced math", "Basic programming concepts", "Database knowledge", "Network protocols"],
         "correct": 1},
        {"question": "Which scenario best demonstrates mastery of {topic}?",
         "options": ["Writing documentation", "Building a complete feature using the concept", "Setting up a server", "Creating test cases"],
         "correct": 1},
    ]

    for i, title in enumerate(topic_titles[:10]):
        template = question_templates[i % len(question_templates)]
        questions.append({
            "id": i,
            "question": template["question"].replace("{topic}", title),
            "options": template["options"],
            "topic_title": title
        })

    # Ensure at least 5 questions
    while len(questions) < 5:
        questions.append({
            "id": len(questions),
            "question": f"Review question #{len(questions) + 1}: Which approach is most effective for learning?",
            "options": ["Cramming all at once", "Spaced repetition", "Passive reading", "Just watching videos"],
            "topic_title": "General"
        })

    # Shuffle and limit to 10
    random.shuffle(questions)
    questions = questions[:10]

    # Re-index
    for i, q in enumerate(questions):
        q["id"] = i

    # Check if redirection is needed (2 consecutive low scores)
    recent_evals = (
        sb.table("evaluations")
        .select("score")
        .eq("user_id", current_user_id)
        .order("created_at", desc=True)
        .limit(2)
        .execute()
    )

    consecutive_low = all(e["score"] < 40 for e in recent_evals.data) if len(recent_evals.data) >= 2 else False

    return jsonify({
        "questions": questions,
        "total": len(questions),
        "time_limit": 120,
        "redirection_warning": consecutive_low
    })


@quiz_bp.route("/submit", methods=["POST"])
@token_required
def submit_quiz(current_user_id):
    """
    Submit quiz answers and calculate score.
    Implements Intelligent Redirection if scores fall below 40% twice in a row.
    """
    data = request.get_json()
    answers = data.get("answers", [])
    time_taken = data.get("time_taken", 120)

    sb = get_supabase()

    # Simple scoring: each correct answer = 10 points
    correct = sum(1 for a in answers if a.get("selected_option") == 1)  # Template correct = 1
    total = len(answers) if answers else 1
    score = int((correct / total) * 100)

    # Save evaluation
    sb.table("evaluations").insert({
        "user_id": current_user_id,
        "score": score,
        "total_questions": total,
        "quiz_data": {"answers": answers, "time_taken": time_taken},
        "triggered_redirection": False
    }).execute()

    # Check for Intelligent Redirection trigger
    recent_evals = (
        sb.table("evaluations")
        .select("score")
        .eq("user_id", current_user_id)
        .order("created_at", desc=True)
        .limit(2)
        .execute()
    )

    needs_redirection = False
    redirection_message = None

    if len(recent_evals.data) >= 2:
        if all(e["score"] < 40 for e in recent_evals.data):
            needs_redirection = True
            redirection_message = (
                "It looks like you're finding some topics challenging. "
                "Would you like to slow the pace to 30 mins/day, "
                "or switch to an easier foundational path?"
            )
            # Mark the evaluation as triggering redirection
            sb.table("evaluations").update({
                "triggered_redirection": True
            }).eq("user_id", current_user_id).order("created_at", desc=True).limit(1).execute()

    # Check for speed achievement (quiz under 2 minutes)
    if time_taken < 120:
        # Award Speed Master achievement
        speed_achievement = sb.table("achievements").select("id").eq("requirement_type", "quiz_speed").execute()
        if speed_achievement.data:
            ach_id = speed_achievement.data[0]["id"]
            existing = (
                sb.table("user_achievements")
                .select("id")
                .eq("user_id", current_user_id)
                .eq("achievement_id", ach_id)
                .execute()
            )
            if not existing.data:
                sb.table("user_achievements").insert({
                    "user_id": current_user_id,
                    "achievement_id": ach_id
                }).execute()

    # Check for Perfect Score achievement
    if score == 100:
        perfect_achievement = sb.table("achievements").select("id").eq("requirement_type", "quiz_score").execute()
        if perfect_achievement.data:
            ach_id = perfect_achievement.data[0]["id"]
            existing = (
                sb.table("user_achievements")
                .select("id")
                .eq("user_id", current_user_id)
                .eq("achievement_id", ach_id)
                .execute()
            )
            if not existing.data:
                sb.table("user_achievements").insert({
                    "user_id": current_user_id,
                    "achievement_id": ach_id
                }).execute()

    return jsonify({
        "score": score,
        "correct": correct,
        "total": total,
        "time_taken": time_taken,
        "needs_redirection": needs_redirection,
        "redirection_message": redirection_message,
        "is_correct": score >= 60
    })
