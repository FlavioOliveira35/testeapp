// Autenticação local simplificada (sem Firebase)
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM - Login
    const loginContainer = document.getElementById('login-container');
    const mainContent = document.getElementById('main-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // Credenciais fixas
    const validEmail = 'flavio_cesar_oliveira@hotmail.com';
    const validPassword = '123456';

    // Verificar se já está logado (usando localStorage)
    const checkLoginStatus = function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // Usuário está logado
            loginContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            carregarDados(); // Carregar dados após login
        } else {
            // Usuário não está logado
            loginContainer.classList.remove('hidden');
            mainContent.classList.add('hidden');
        }
    };

    // Verificar estado de autenticação ao carregar a página
    checkLoginStatus();

    // Login
    loginBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            loginError.textContent = 'Por favor, preencha todos os campos.';
            return;
        }
        
        loginError.textContent = '';
        
        // Verificar credenciais
        if (email === validEmail && password === validPassword) {
            // Login bem-sucedido
            localStorage.setItem('isLoggedIn', 'true');
            loginContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            carregarDados(); // Carregar dados após login
        } else {
            // Erro no login
            loginError.textContent = 'Email ou senha incorretos. Tente novamente.';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        loginContainer.classList.remove('hidden');
        mainContent.classList.add('hidden');
    });
});
