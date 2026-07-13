const API_URL = 'http://localhost:5000/api/auth';

// Helper to save token and redirect
const authSuccess = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.name);
  window.location.href = 'dashboard.html';
};

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (res.ok) authSuccess(data); else alert(data.message);
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) authSuccess(data); else alert(data.message);
});

// Google Authentication Handlers
window.handleCredentialResponse = async (response) => {
  const res = await fetch(`${API_URL}/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: response.credential })
  });
  const data = await res.json();
  if (res.ok) authSuccess(data); else alert(data.message);
};

// Forgot Password
document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  const res = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  alert(data.message);
});

// Reset Password
document.getElementById('resetForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/reset-password/${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Password updated! Redirecting to login.');
    window.location.href = 'index.html';
  } else {
    alert(data.message);
  }
});