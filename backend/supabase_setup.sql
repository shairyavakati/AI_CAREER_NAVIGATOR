-- ============================================================
-- AI Career Navigator - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables
-- ============================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    chosen_role TEXT,
    time_commitment INTEGER DEFAULT 60,
    level TEXT DEFAULT 'Beginner',
    streak_count INTEGER DEFAULT 0,
    last_login_date DATE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    difficulty_level TEXT DEFAULT 'Beginner',
    role TEXT NOT NULL
);

-- 3. User Skill Gaps
CREATE TABLE IF NOT EXISTS user_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    current_level INTEGER DEFAULT 0,
    target_level INTEGER DEFAULT 100,
    status TEXT DEFAULT 'missing',
    UNIQUE(user_id, skill_id)
);

-- 4. Learning Topics
CREATE TABLE IF NOT EXISTS learning_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    resource_link TEXT,
    estimated_time INTEGER DEFAULT 30,
    sequence_order INTEGER DEFAULT 0
);

-- 5. Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES learning_topics(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('LEARN', 'REVISE')),
    scheduled_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Evaluations (Quiz Results)
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER,
    total_questions INTEGER DEFAULT 10,
    quiz_data JSONB,
    triggered_redirection BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    requirement_type TEXT,
    requirement_value INTEGER
);

-- 8. User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 9. Skill Evolution History
CREATE TABLE IF NOT EXISTS skill_evolution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Resources
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
    type TEXT,
    title TEXT NOT NULL,
    provider TEXT,
    duration TEXT,
    rating FLOAT DEFAULT 0,
    difficulty TEXT,
    color TEXT,
    tags TEXT[],
    url TEXT
);

-- ============================================================
-- Seed Data: Default Skills per Role
-- ============================================================

INSERT INTO skills (name, category, difficulty_level, role) VALUES
-- Software Developer
('React Fundamentals', 'Frontend', 'Beginner', 'developer'),
('TypeScript', 'Frontend', 'Intermediate', 'developer'),
('State Management', 'Frontend', 'Intermediate', 'developer'),
('Testing', 'Quality', 'Intermediate', 'developer'),
('Performance Optimization', 'Frontend', 'Advanced', 'developer'),
('Node.js Backend', 'Backend', 'Intermediate', 'developer'),
('Database Design', 'Backend', 'Intermediate', 'developer'),
('API Development', 'Backend', 'Beginner', 'developer'),
('Git & Version Control', 'DevOps', 'Beginner', 'developer'),
('CI/CD Pipelines', 'DevOps', 'Advanced', 'developer'),
-- Product Manager
('Product Strategy', 'Strategy', 'Intermediate', 'manager'),
('User Research', 'Research', 'Beginner', 'manager'),
('Data Analytics', 'Analytics', 'Intermediate', 'manager'),
('Roadmap Planning', 'Planning', 'Beginner', 'manager'),
('Stakeholder Management', 'Leadership', 'Advanced', 'manager'),
-- Student
('Programming Basics', 'Fundamentals', 'Beginner', 'student'),
('Data Structures', 'CS Core', 'Intermediate', 'student'),
('Algorithms', 'CS Core', 'Intermediate', 'student'),
('Web Development', 'Applied', 'Beginner', 'student'),
('Problem Solving', 'Fundamentals', 'Beginner', 'student'),
-- Designer
('UI Design Principles', 'Design', 'Beginner', 'designer'),
('UX Research', 'Research', 'Intermediate', 'designer'),
('Figma Mastery', 'Tools', 'Beginner', 'designer'),
('Design Systems', 'Design', 'Advanced', 'designer'),
('Prototyping', 'Design', 'Intermediate', 'designer');

-- ============================================================
-- Seed Data: Learning Topics per Skill
-- ============================================================

INSERT INTO learning_topics (skill_id, title, estimated_time, sequence_order)
SELECT s.id, t.title, t.est_time, t.seq
FROM skills s
CROSS JOIN LATERAL (
    VALUES
    ('Intro to ' || s.name, 20, 1),
    (s.name || ' Core Concepts', 30, 2),
    (s.name || ' Hands-on Practice', 45, 3),
    ('Advanced ' || s.name, 40, 4),
    (s.name || ' Project Build', 60, 5)
) AS t(title, est_time, seq);

-- ============================================================
-- Seed Data: Default Achievements
-- ============================================================

INSERT INTO achievements (title, description, icon, color, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first lesson', 'Trophy', '#F59E0B', 'completion', 1),
('7-Day Streak', 'Study for 7 consecutive days', 'Flame', '#EF4444', 'streak', 7),
('Quick Learner', 'Complete 5 topics in one week', 'Star', '#8B5CF6', 'weekly_completion', 5),
('Speed Master', 'Finish a quiz under 2 minutes', 'Zap', '#06B6D4', 'quiz_speed', 120),
('Perfect Score', 'Get 100% on any quiz', 'Award', '#10B981', 'quiz_score', 100),
('Skill Master', 'Master all core skills for your role', 'Target', '#4F46E5', 'mastery', 100),
('30-Day Streak', 'Study for 30 consecutive days', 'Flame', '#EF4444', 'streak', 30),
('Revision Champion', 'Complete 20 revision sessions', 'BookOpen', '#06B6D4', 'revision_count', 20);

-- ============================================================
-- Seed Data: Default Resources
-- ============================================================

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Course', 'Advanced TypeScript Patterns', 'Frontend Masters', '4 hours', 4.8, 'Advanced', '#4F46E5',
       ARRAY['TypeScript', 'Design Patterns'], 'https://frontendmasters.com' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Advanced TypeScript Patterns');

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Article', 'State Management Best Practices', 'React Docs', '15 min read', 4.9, 'Intermediate', '#06B6D4',
       ARRAY['State Management', 'React'], 'https://react.dev' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'State Management Best Practices');

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Book', 'Testing JavaScript Applications', 'O''Reilly', '8 chapters', 4.7, 'Intermediate', '#10B981',
       ARRAY['Testing', 'Jest', 'TDD'], 'https://oreilly.com' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Testing JavaScript Applications');

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Practice', 'React Performance Challenges', 'CodeSignal', '12 exercises', 4.6, 'Advanced', '#F59E0B',
       ARRAY['Performance', 'Optimization'], 'https://codesignal.com' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'React Performance Challenges');

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Course', 'Modern React Hooks Deep Dive', 'Egghead.io', '3.5 hours', 4.9, 'Intermediate', '#8B5CF6',
       ARRAY['React', 'Hooks'], 'https://egghead.io' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Modern React Hooks Deep Dive');

INSERT INTO resources (type, title, provider, duration, rating, difficulty, color, tags, url)
SELECT 'Article', 'Building Scalable Apps with Redux', 'Medium', '20 min read', 4.5, 'Advanced', '#EF4444',
       ARRAY['Redux', 'Architecture'], 'https://medium.com' WHERE NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Building Scalable Apps with Redux');

-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_type ON study_sessions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_user_skill_gaps_user ON user_skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_evolution_user ON skill_evolution(user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_evaluations_user ON evaluations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_skills_role ON skills(role);
