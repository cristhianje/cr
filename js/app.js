// app.js - login & registration
const loginForm = document.getElementById('login-form');
const registerBtn = document.getElementById('show-register');
const registerArea = document.getElementById('register-area');
const registerForm = document.getElementById('register-form');
const messageP = document.getElementById('message');
const forgotPasswordLink = document.getElementById('forgotPassword');

registerBtn.addEventListener('click', () => {
  registerArea.classList.toggle('hidden');
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  messageP.textContent = 'Entrando...';
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // redireciona para dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    messageP.textContent = 'Senha ou Login inválido';
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('r-email').value.trim();
  const password = document.getElementById('r-password').value;
  messageP.textContent = 'Criando conta...';
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    messageP.textContent = 'Conta criada! Redirecionando...';
    window.location.href = 'dashboard.html';
  } catch (err) {
    messageP.textContent = 'Senha ou Login inválido';
  }
});

//recuperar a senha

forgotPasswordLink.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) {
    messageP.textContent = 'Por favor, informe seu e-mail para recuperação.';
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email);
    messageP.textContent = 'E-mail de recuperação enviado. Verifique sua caixa de entrada.';
  } catch (error) {
    messageP.textContent = 'Erro ao enviar e-mail de recuperação. Verifique o e-mail informado.';
  }
});


// Se usuário já estiver logado, vai direto ao dashboard
auth.onAuthStateChanged(user => {
  if (user && window.location.pathname.endsWith('/index.html')) {
    // já logado na página de login -> redireciona ao dashboard
    window.location.href = 'dashboard.html';
  }
});
