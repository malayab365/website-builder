/* ==========================================================================
   Tiny API + auth helper used by every page.
   ========================================================================== */

const API_BASE = '/api';
const TOKEN_KEY = 'wbs_token';
const USER_KEY = 'wbs_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (e) {
    return null;
  }
}
function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
function isLoggedIn() {
  return !!getToken();
}
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
  }
}

async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    /* empty body */
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function logout() {
  clearSession();
  window.location.href = '/login.html';
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
