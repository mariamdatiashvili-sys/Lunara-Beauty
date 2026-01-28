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
            const email = form.email.value;
            const password = form.password.value;
            await login(email, password);
        };
    }
}

const MANUAL_ADMIN = {
    email: 'admin@lunara.com',
    password: '12345' // <-- Set your manual admin password here
};

async function login(email, password) {
    try {
        let response;

        // 1. Clean Inputs
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        // 2. Check for Manual Admin (Bypass API)
        if (cleanEmail === MANUAL_ADMIN.email.toLowerCase() && cleanPassword === MANUAL_ADMIN.password) {
            response = {
                name: 'Administrator',
                email: cleanEmail,
                role: 'admin',
                token: 'manual-admin-token'
            };
        } else {
            // 3. Everrest API Login
            const payload = { email: cleanEmail, password: cleanPassword }; // Send cleaned data
            response = await api.post('https://api.everrest.educata.dev/auth/signin', payload);
        }

        if (response) {
            // Save the entire response (tokens + user info if available)
            // If the API only returns a token, we might need to decode it or fetch profile later.
            // For now, we assume success means we are logged in.
            // We'll augment the saved user with the email since we have it.
            const user = { ...response, email };

            // Simple Admin Check based on email (temporary until roles are strictly defined in API)
            // Or if API returns generic role
            if (response.role) {
                user.role = response.role;
            } else if (email.includes('admin')) {
                user.role = 'admin'; // Fallback for testing/demo
            }

            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            alert(`Welcome back!`);
            document.getElementById('loginModal').style.display = 'none';
            updateAuthUI();
            location.reload();
        }
    } catch (error) {
        console.error(error);
        alert('Login failed. Please check your credentials.');
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
        const displayName = user.username || user.name || user.email || 'User';
        authLi.innerHTML = `<a href="#" id="logoutBtn" style="color: #d6749d;">Logout (${displayName})</a>`;
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
                    <label>Email</label>
                    <input type="email" name="email" required>
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
