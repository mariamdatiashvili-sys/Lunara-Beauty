/**
 * Authentication Service
 * Handles Login, Logout, and User Persistance
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

const AUTH_KEY = 'lunaraUser';

function initAuth() {
    injectLoginModal();
    updateAuthUI();

    // Event Delegation for Login/Logout triggers
    document.addEventListener('click', (e) => {
        if (e.target.id === 'loginBtn') {
            e.preventDefault();
            document.getElementById('loginModal').style.display = 'block';
        }
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            logout();
        }
    });

    // Close Modal Logic
    const modal = document.getElementById('loginModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => {
            if (e.target == modal) modal.style.display = 'none';
        }

        // Login Form Submit
        const form = document.getElementById('loginForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const username = form.username.value;
            const password = form.password.value;
            await login(username, password);
        };
    }
}

async function login(username, password) {
    try {
        const users = await api.get('users');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            document.getElementById('loginModal').style.display = 'none';
            updateAuthUI();
            location.reload(); // Reload to refresh UI (e.g. show Admin buttons)
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(AUTH_KEY);
        updateAuthUI();
        location.reload();
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
}

function updateAuthUI() {
    const user = getCurrentUser();
    const navList = document.querySelector('.navbar nav ul');

    // Clean up existing elements to prevent duplicates
    const oldAuth = document.getElementById('authLi');
    if (oldAuth) oldAuth.remove();

    const authLi = document.createElement('li');
    authLi.id = 'authLi';

    if (user) {
        authLi.innerHTML = `<a href="#" id="logoutBtn" style="color: #d6749d;">Logout (${user.username})</a>`;
    } else {
        authLi.innerHTML = `<a href="#" id="loginBtn">Login</a>`;
    }

    navList.appendChild(authLi);
}

function injectLoginModal() {
    // Only inject if not already present
    if (document.getElementById('loginModal')) return;

    const modalHTML = `
    <div id="loginModal" class="modal">
        <div class="modal-content" style="max-width: 400px;">
            <span class="close-modal">&times;</span>
            <h2 style="text-align:center; color: #682d3b;">Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Login</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
