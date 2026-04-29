# AI Learning Assistant - Implementation Plan

This implementation plan outlines the technical strategy, architecture, and phased development approach for building the AI Learning Assistant. It specifically focuses on delivering the 11 core features, including the complex algorithms for the Time-Aware Learning Path, Forgetting Curve Revision System, and Intelligent Redirection.

---

## 1. Technology Stack Recommendations

To ensure scalability, real-time interactivity, and seamless AI integration, the following tech stack is recommended:

*   **Frontend**: React.js / Next.js (for fast rendering and SEO if needed), Tailwind CSS (for rapid, aesthetic styling), and Framer Motion (for dynamic micro-animations).
*   **Data Visualization (Crucial for Feature 8)**: Recharts or Chart.js (for rendering the Skill Evolution Timeline and Analytics Dashboard).
*   **Backend**: Node.js with Express / NestJS OR Python with FastAPI (Python is often preferred for heavy ML/AI integrations).
*   **Database**: PostgreSQL (Relational mapping for Users, Roles, Skills, Progress) + Redis (for caching streaks and real-time dashboard stats).
*   **AI/LLM Engine**: OpenAI API (GPT-4o) or Anthropic Claude (for generating MCQs, analyzing skill gaps, and intelligent redirection suggestions).
*   **Scheduling/Cron Jobs**: Celery (Python) or BullMQ (Node) for automatically scheduling the Forgetting Curve revisions.

---

## 2. Core Data Schema (High Level)

*   `User`: id, name, chosen_role, time_commitment (30/60/120), level (Beginner/Inter/Adv), streak_count.
*   `Skill`: id, name, category, difficulty_level.
*   `UserSkillGap`: user_id, skill_id, status (missing/learning/mastered).
*   `LearningTopic`: id, skill_id, title, resource_link, estimated_time.
*   `StudySession`: id, user_id, topic_id, type (LEARN/REVISE), scheduled_date, completion_status.
*   `Evaluation`: id, user_id, score, timestamp, triggered_redirection (boolean).

---

## 3. Phased Implementation Strategy

### Phase 1: Onboarding & Assessment (Features 1, 2, 3)
**Goal:** Successfully onboard the user, evaluate their current standing, and identify what they need to learn.
*   **Role Selection Engine:** Create a simple UI mapping roles to a static/AI-generated list of required skills. Implement the AI fallback for "Backup Roles".
*   **Dynamic MCQ Generator:** Integrate the LLM to generate 10 questions dynamically based on the selected role.
*   **Skill Gap Analyzer:** Compare the user's assessment score against the required role blueprint to output a list of missing skills and required tools.

### Phase 2: The Core Learning Engine (Features 4, 5, 9)
**Goal:** Build the daily engagement mechanism using the Time-Aware Path and Forgetting Curve.
*   **Time-Aware Path Algorithm:**
    *   Map `estimated_time` to all topics.
    *   If User = 30m/day: Assign 1 topic.
    *   If User = 120m/day: Assign 3-4 topics (mix of new + revision).
*   **Forgetting Curve Scheduler (The Engine):**
    *   When a user marks a topic as "Learned" (Day 0), insert three future records into the `StudySession` table with type `REVISE` at `Day + 1`, `Day + 3`, and `Day + 7`.
*   **Smart Study Planner UI:** A daily dashboard view pulling `StudySession` records for `scheduled_date == TODAY()`, splitting them visually into **🆕 New Learning** and **🔁 Revision Tasks**.
*   **Resource Recommendation:** Map missing skills to a curated database of courses (Udemy, Coursera, YouTube).

### Phase 3: Analytics & Visual Engagement (Features 7, 8, 10)
**Goal:** Keep the user motivated and visually show them their progress (Judge-Winning Features).
*   **Analytics Dashboard:** Calculate progress % (Completed Topics / Total Role Topics), query retention score (based on revision completion), and calculate study consistency.
*   **Skill Evolution Timeline:**
    *   **Data Prep:** Track the user's level change over time in a historical table.
    *   **UI:** Use Recharts to draw a dynamic line graph. Plot points like "Day 1: Beginner", "Day 10: Basic", "Day 20: Intermediate".
    *   **Micro-interaction:** Add a prominent callout card: *"🔥 You improved 60% in 2 weeks!"*
*   **Gamification System:** Track consecutive days logged in. Award badges for "7-Day Revision Streak" or "First Module Mastered".

### Phase 4: Evaluation & Redirection (Features 6, 11)
**Goal:** Ensure the user is actually learning and intervene if they are failing.
*   **Periodic Quizzes:** Set a trigger that after every 5 `LEARN` sessions, a quiz is generated. Combine questions from the new topics and topics scheduled for Day 7 revision.
*   **Intelligent Redirection:**
    *   **Trigger:** If quiz scores fall below 40% two times in a row, or if revision tasks are consistently skipped.
    *   **Action:** Prompt the LLM with the user's struggle data. Present a modal: *"It looks like you're finding X challenging. Would you like to slow the pace to 30 mins/day, or switch to an easier foundational path?"*

---

## 4. Key Algorithm Implementations

### A. The Forgetting Curve Revision Cron
```python
def schedule_revisions(user_id, topic_id, completion_date):
    revision_intervals = [1, 3, 7] # Days
    for interval in revision_intervals:
        rev_date = completion_date + timedelta(days=interval)
        db.study_sessions.insert({
            "user_id": user_id,
            "topic_id": topic_id,
            "type": "REVISE",
            "scheduled_date": rev_date
        })
```

### B. Time-Aware Study Planner Logic
```javascript
function generateDailyPlan(userId) {
    const user = getUser(userId);
    const availableMins = user.time_commitment; // e.g., 60
    
    // 1. Always fetch mandatory revisions for TODAY first
    let todayPlan = getRevisionsForToday(userId); 
    let timeUsed = todayPlan.reduce((sum, task) => sum + task.estimated_time, 0);
    
    // 2. Fill the remaining time with NEW learning topics
    const nextTopics = getNextSequentialTopics(userId);
    for (let topic of nextTopics) {
        if (timeUsed + topic.estimated_time <= availableMins) {
            todayPlan.push({...topic, type: "LEARN"});
            timeUsed += topic.estimated_time;
        } else {
            break; // Daily capacity reached
        }
    }
    return todayPlan;
}
```

---

## 5. UI/UX & Design Guidelines

To make this a "judge-winning" application, the UI must feel premium:
*   **Color Palette:** Deep dark mode (e.g., `#0f172a` background) with vibrant neon accents (electric blue for Learning, energetic orange/purple for Revisions) to signify a modern "AI" feel.
*   **Typography:** 'Inter' or 'Outfit' for clean, highly legible text.
*   **Micro-Animations:** Use Framer Motion. When a user completes a topic, the progress bar should smoothly fill, and a small confetti or checkmark animation should pop.
*   **The Evolution Graph:** Make it interactive. Hovering over a node on the graph should show a tooltip with exactly what they learned on that day.
