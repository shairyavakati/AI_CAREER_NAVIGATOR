"""
Assessment routes: Dynamic MCQ generation, submission, and scoring.
"""

import random
from flask import Blueprint, request, jsonify
from helpers import get_supabase, token_required

assessment_bp = Blueprint("assessment", __name__)

# Question bank organized by skill category
QUESTION_BANK = {
    "developer": [
        {"question": "What is the purpose of useEffect hook in React?", "options": ["To manage component state", "To handle side effects in functional components", "To create custom hooks", "To optimize rendering performance"], "correct": 1},
        {"question": "What is your experience with React Hooks?", "options": ["Never used", "Basic understanding", "Comfortable", "Expert"], "correct": None, "type": "self_assess"},
        {"question": "How familiar are you with TypeScript?", "options": ["Never used", "Basic types", "Advanced types", "Expert"], "correct": None, "type": "self_assess"},
        {"question": "What does the 'async/await' syntax do in JavaScript?", "options": ["Creates threads", "Handles promises more readably", "Speeds up execution", "Creates web workers"], "correct": 1},
        {"question": "What is the Virtual DOM?", "options": ["A backup of the real DOM", "A lightweight copy of the DOM for diffing", "A server-side DOM", "A browser extension"], "correct": 1},
        {"question": "What is your experience with state management?", "options": ["None", "Local state only", "Redux/Context", "Advanced patterns"], "correct": None, "type": "self_assess"},
        {"question": "Which HTTP method is used to update a resource?", "options": ["GET", "POST", "PUT", "DELETE"], "correct": 2},
        {"question": "What is the purpose of a REST API?", "options": ["Database management", "Client-server communication", "File storage", "Code compilation"], "correct": 1},
        {"question": "What is Git branching used for?", "options": ["Backing up code", "Parallel development workflows", "Compiling code", "Deploying to production"], "correct": 1},
        {"question": "What is CI/CD?", "options": ["Code Integration/Code Deployment", "Continuous Integration/Continuous Delivery", "Computer Interface/Computer Design", "Cloud Infrastructure/Cloud Data"], "correct": 1},
    ],
    "manager": [
        {"question": "What is a product roadmap?", "options": ["A list of bugs", "A strategic plan showing product evolution over time", "A daily standup agenda", "A design document"], "correct": 1},
        {"question": "What is an OKR?", "options": ["Objective and Key Result", "Online Key Resource", "Organized Knowledge Repository", "Output Key Ratio"], "correct": 0},
        {"question": "How do you prioritize features?", "options": ["By personal preference", "Using frameworks like RICE or MoSCoW", "Random selection", "By team vote only"], "correct": 1},
        {"question": "What is user persona?", "options": ["A real user", "A fictional representation of target users", "A login system", "A design tool"], "correct": 1},
        {"question": "What does A/B testing measure?", "options": ["Code quality", "User preference between two variants", "Server performance", "Design aesthetics"], "correct": 1},
    ],
    "student": [
        {"question": "What is a variable in programming?", "options": ["A fixed value", "A named storage for data", "A function", "A loop"], "correct": 1},
        {"question": "What is the time complexity of binary search?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correct": 1},
        {"question": "What is a for loop used for?", "options": ["Defining variables", "Repeating code a set number of times", "Creating functions", "Importing modules"], "correct": 1},
        {"question": "What is HTML used for?", "options": ["Styling web pages", "Structuring web content", "Backend logic", "Database queries"], "correct": 1},
        {"question": "What is an algorithm?", "options": ["A programming language", "A step-by-step procedure to solve a problem", "A type of variable", "A web framework"], "correct": 1},
    ],
    "designer": [
        {"question": "What is the purpose of whitespace in design?", "options": ["Wasting space", "Improving readability and focus", "Reducing content", "Making pages longer"], "correct": 1},
        {"question": "What is a wireframe?", "options": ["A final design", "A low-fidelity layout sketch", "A coding framework", "A color palette"], "correct": 1},
        {"question": "What does UX stand for?", "options": ["Universal Experience", "User Experience", "Unified Extension", "User Execution"], "correct": 1},
        {"question": "What is a design system?", "options": ["A type of software", "A collection of reusable design components and guidelines", "A project management tool", "A color picker"], "correct": 1},
        {"question": "What is prototyping?", "options": ["Final product deployment", "Creating interactive mockups for testing", "Writing code", "User research"], "correct": 1},
    ],
    "initial": [
        {"question": "Which of these programming languages are you familiar with?", "options": ["None", "Python", "JavaScript", "Both Python & JS"], "correct": None, "type": "skill_detect", "skills": ["Python", "JavaScript"]},
        {"question": "Do you have experience with Web Design?", "options": ["No", "Basic (HTML/CSS)", "Intermediate (Figma/Layouts)", "Expert"], "correct": None, "type": "skill_detect", "skills": ["Web Design", "UI/UX"]},
        {"question": "Are you familiar with Data Analysis?", "options": ["No", "Basic Excel", "Intermediate (SQL/Pandas)", "Advanced Statistics"], "correct": None, "type": "skill_detect", "skills": ["Data Analysis", "SQL"]},
        {"question": "What is your comfort level with Project Management?", "options": ["None", "Have led small teams", "Familiar with Agile/Scrum", "Experienced PM"], "correct": None, "type": "skill_detect", "skills": ["Management", "Agile"]},
        {"question": "Do you have experience with Mobile Development?", "options": ["No", "Basic React Native/Flutter", "Intermediate", "Published Apps"], "correct": None, "type": "skill_detect", "skills": ["Mobile Dev", "React Native"]},
    ]
}


@assessment_bp.route("/questions", methods=["GET"])
@token_required
def get_questions(current_user_id):
    """Get assessment questions based on user's selected role."""
    sb = get_supabase()

    # Get user's role
    user_result = sb.table("users").select("chosen_role").eq("id", current_user_id).execute()
    
    role = user_result.data[0].get("chosen_role") if user_result.data else None
    
    if not role:
        # Initial assessment
        questions = QUESTION_BANK["initial"]
    else:
        questions = QUESTION_BANK.get(role, QUESTION_BANK["developer"])

    # Select up to 10 questions, shuffle
    selected = random.sample(questions, min(10, len(questions)))

    # Remove correct answers from response (don't send to client)
    client_questions = []
    for q in selected:
        # Find the original index to use as ID
        original_id = questions.index(q)
        client_questions.append({
            "id": original_id,
            "question": q["question"],
            "options": q["options"],
            "type": q.get("type", "mcq")
        })

    return jsonify({"questions": client_questions, "total": len(client_questions)})


@assessment_bp.route("/submit", methods=["POST"])
@token_required
def submit_assessment(current_user_id):
    """Submit assessment answers and calculate score."""
    data = request.get_json()
    answers = data.get("answers", [])  # List of {question_id, selected_option}

    sb = get_supabase()

    # Get user's role
    user_result = sb.table("users").select("chosen_role").eq("id", current_user_id).execute()
    role = user_result.data[0].get("chosen_role") if user_result.data else None

    is_initial = role is None
    questions = QUESTION_BANK.get(role, QUESTION_BANK["developer"]) if role else QUESTION_BANK["initial"]

    # Calculate score and detect skills
    correct = 0
    total_scored = 0
    self_assess_scores = []
    detected_skills = []

    for answer in answers:
        qid = answer.get("question_id", 0)
        selected = answer.get("selected_option", 0)

        if qid < len(questions):
            q = questions[qid]
            if q.get("type") == "self_assess":
                self_assess_scores.append(selected * 33)
            elif q.get("type") == "skill_detect":
                # If they picked anything other than "None" (option 0)
                if selected > 0:
                    detected_skills.extend(q.get("skills", []))
            elif q.get("correct") is not None:
                total_scored += 1
                if selected == q["correct"]:
                    correct += 1

    # Calculate overall score
    mcq_score = (correct / total_scored * 100) if total_scored > 0 else 50
    avg_self = sum(self_assess_scores) / len(self_assess_scores) if self_assess_scores else 50
    overall_score = int((mcq_score * 0.6) + (avg_self * 0.4))

    if is_initial:
        # Save detected skills for initial assessment
        try:
            sb.table("users").update({"detected_skills": list(set(detected_skills))}).eq("id", current_user_id).execute()
        except Exception as e:
            print(f"Warning: Could not save detected_skills (column might be missing): {e}")
    else:
        # Update user skill gaps based on score for specific role
        skills_result = sb.table("skills").select("*").eq("role", role).execute()
        for i, skill in enumerate(skills_result.data):
            variance = random.randint(-15, 15)
            skill_level = max(0, min(100, overall_score + variance))

            sb.table("user_skill_gaps").update({
                "current_level": skill_level,
                "target_level": max(80, skill_level + 20),
                "status": "mastered" if skill_level >= 80 else "learning" if skill_level >= 40 else "missing"
            }).eq("user_id", current_user_id).eq("skill_id", skill["id"]).execute()

            sb.table("skill_evolution").insert({
                "user_id": current_user_id,
                "skill_id": skill["id"],
                "level": skill_level
            }).execute()

    # Save evaluation record
    sb.table("evaluations").insert({
        "user_id": current_user_id,
        "score": overall_score,
        "total_questions": len(answers),
        "quiz_data": {"answers": answers, "mcq_score": mcq_score, "self_score": avg_self, "detected": detected_skills},
        "triggered_redirection": overall_score < 40
    }).execute()

    return jsonify({
        "score": overall_score,
        "mcq_score": int(mcq_score),
        "self_assessment_score": int(avg_self),
        "detected_skills": list(set(detected_skills)),
        "correct_answers": correct,
        "total_questions": len(answers),
        "is_initial": is_initial
    })
