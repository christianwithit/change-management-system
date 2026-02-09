// Mock user database - In production, this would be handled by backend API
const MOCK_USERS = {
    'staff': { password: 'staff123', role: 'staff', fullName: 'Staff Member', department: 'General' },
    'hod': { password: 'hod123', role: 'hod', fullName: 'Head of Department', department: 'IT Department' },
    'it': { password: 'it123', role: 'it', fullName: 'IT Administrator', department: 'IT Department' },
    'admin': { password: 'admin123', role: 'admin', fullName: 'System Administrator', department: 'Administration' }
};

// Authentication handling
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.toLowerCase();
            const password = document.getElementById('password').value;

            // Mock authentication - In production, this would call an API
            if (username && password) {
                const userAccount = MOCK_USERS[username];
                
                if (userAccount && userAccount.password === password) {
                    // Store user session
                    const user = {
                        username: username,
                        role: userAccount.role,
                        fullName: userAccount.fullName,
                        department: userAccount.department,
                        loginTime: new Date().toISOString()
                    };

                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Redirect to dashboard
                    window.location.href = 'pages/dashboard.html';
                } else {
                    alert('Invalid username or password');
                }
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
