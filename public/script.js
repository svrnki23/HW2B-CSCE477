// Client-side validation helps the user, but the server must check again.
const form = document.getElementById('loginForm');
const message = document.getElementById('message');

function showMessage(text, isError) {
  // textContent displays user-visible text without treating it as HTML.
  message.textContent = text;
  message.className = isError ? 'message error' : 'message success';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    return showMessage('Both fields are required.', true);
  }
  if (!email.includes('@')) {
    return showMessage('Email must contain @.', true);
  }
  if (password.length < 8) {
    return showMessage('Password must be at least 8 characters.', true);
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    showMessage(result.message, !response.ok);
  } catch {
    showMessage('Could not reach the server. Try again.', true);
  }
});
