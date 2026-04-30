/**
 * API Service - Connects React frontend to Flask backend
 */

const API_BASE = '/api';

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

function setToken(token: string) {
  authToken = token;
  localStorage.setItem('auth_token', token);
}

function clearToken() {
  authToken = null;
  localStorage.removeItem('auth_token');
}

export function getToken(): string | null {
  return authToken;
}

// Base fetch helper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    throw new Error('Failed to parse response from server');
  }

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

// ============ AUTH ============

export async function signup(name: string, email: string, password: string) {
  const data = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getProfile() {
  return apiFetch('/auth/me');
}

export function logout() {
  clearToken();
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ============ ROLES ============

export async function listRoles() {
  return apiFetch('/roles/');
}

export async function selectRole(roleId: string) {
  return apiFetch('/roles/select', {
    method: 'POST',
    body: JSON.stringify({ role_id: roleId }),
  });
}

export async function getRoleSkills(roleId: string) {
  return apiFetch(`/roles/skills/${roleId}`);
}

// ============ ASSESSMENT ============

export async function getAssessmentQuestions() {
  return apiFetch('/assessment/questions');
}

export async function submitAssessment(answers: Array<{ question_id: number; selected_option: number }>) {
  return apiFetch('/assessment/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

// ============ LEARNING PATH ============

export async function getLearningPath() {
  return apiFetch('/learning-path/');
}

// ============ STUDY PLANNER ============

export async function getTodayPlan() {
  return apiFetch('/planner/today');
}

export async function completeTask(sessionId: string) {
  return apiFetch(`/planner/complete/${sessionId}`, { method: 'POST' });
}

export async function updateTimeCommitment(minutes: number) {
  return apiFetch('/planner/update-time', {
    method: 'POST',
    body: JSON.stringify({ time_commitment: minutes }),
  });
}

// ============ ANALYTICS ============

export async function getDashboard() {
  return apiFetch('/analytics/dashboard');
}

// ============ QUIZ ============

export async function generateQuiz() {
  return apiFetch('/quiz/generate');
}

export async function submitQuiz(answers: Array<{ question_id: number; selected_option: number }>, timeTaken: number) {
  return apiFetch('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ answers, time_taken: timeTaken }),
  });
}

// ============ REVISION ============

export async function getRevisionStages() {
  return apiFetch('/revision/stages');
}

// ============ MOTIVATION ============

export async function getMotivation() {
  return apiFetch('/motivation/');
}

// ============ RESOURCES ============

export async function getResources(type: string = 'All') {
  const param = type !== 'All' ? `?type=${type}` : '';
  return apiFetch(`/resources/${param}`);
}

// ============ SKILL EVOLUTION ============

export async function getSkillEvolution() {
  return apiFetch('/skill-evolution/');
}
