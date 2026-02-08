document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const error = document.getElementById('loginError');

  if (login === 'admin' && senha === '123456') {
    window.location.href = 'pages/dashboard.html';
  } else {
    error.classList.remove('hidden');
  }
});
