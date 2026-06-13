/* ==========================================================================
   Login / signup form handling.
   ========================================================================== */

(function () {
  if (isLoggedIn()) {
    window.location.href = '/dashboard.html';
    return;
  }

  const errorBox = document.getElementById('formError');

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.classList.remove('visible');
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in…';
      try {
        const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
        setSession(data.token, data.user);
        window.location.href = '/dashboard.html';
      } catch (err) {
        showError(err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log in';
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (password.length < 6) {
        showError('Password must be at least 6 characters.');
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account…';
      try {
        const data = await apiFetch('/auth/signup', { method: 'POST', body: { name, email, password } });
        setSession(data.token, data.user);
        window.location.href = '/dashboard.html';
      } catch (err) {
        showError(err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create account';
      }
    });
  }
})();
