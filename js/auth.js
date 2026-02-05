// Authentication handling
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            // Mock authentication - In production, this would call an API
            if (username && password && role) {
                // Store user session
                const user = {
                    username: username,
                    role: role,
                    fullName: username.charAt(0).toUpperCase() + username.slice(1),
                    department: role === 'hod' ? 'IT Department' : 'General',
                    loginTime: new Date().toISOString()
                };

                localStorage.setItem('currentUser', JSON.stringify(user));

                // Redirect to dashboard
                window.location.href = 'pages/dashboard.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = '../index.html';
        return null;
    }
    return JSON.parse(user);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}
