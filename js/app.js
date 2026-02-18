/* global getCurrentUser, API, utils */
// Main application logic

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on a page that requires authentication
    if (window.location.pathname.includes('/pages/')) {
        initializePage();
    }

    // Initialize mobile sidebar
    initializeMobileSidebar();

    // Set active navigation
    setActiveNav();
    
    // Update user info in sidebar
    updateUserInfo();
});

// Initialize page with user authentication and role-based access
function initializePage() {
    const user = getCurrentUser();
    if (!user) return;
    
    updateUserInfo();
    updateNavigationVisibility(user);
}

// Update user information in sidebar
function updateUserInfo() {
    const user = getCurrentUser();
    if (!user) return;

    // Update user name
    const userNameElements = document.querySelectorAll('#sidebarUserName, #userName');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.fullName;
    });

    // Update user initial
    const userInitialElements = document.querySelectorAll('#sidebarUserInitial, #userInitials');
    userInitialElements.forEach(el => {
        if (el) el.textContent = user.fullName.charAt(0).toUpperCase();
    });

    // Update user role with proper display name
    const roleDisplayName = window.getRoleDisplayName ? window.getRoleDisplayName(user.role) : getRoleDisplayNameLocal(user.role);
    const userRoleElements = document.querySelectorAll('#sidebarUserRole, #userRole, #userDept');
    userRoleElements.forEach(el => {
        if (el) el.textContent = roleDisplayName;
    });
}

// Local fallback for role display name (in case utils.js isn't loaded)
function getRoleDisplayNameLocal(role) {
    const roleNames = {
        'staff': 'Staff Member',
        'hod': 'Head of Department',
        'it': 'IT Administrator',
        'admin': 'System Administrator'
    };
    return roleNames[role] || 'User';
}

// Update navigation visibility based on user role
function updateNavigationVisibility(user) {
    // Show Review Requests for HOD
    const hodReviewLink = document.getElementById('hodReviewLink');
    if (hodReviewLink) {
        if (user.role === 'hod') {
            hodReviewLink.classList.remove('hidden');
            hodReviewLink.style.display = 'flex';
        }
    }

    // Show IT Review for IT and Admin
    const itReviewLink = document.getElementById('itReviewLink');
    if (itReviewLink) {
        if (user.role === 'it' || user.role === 'admin') {
            itReviewLink.classList.remove('hidden');
            itReviewLink.style.display = 'flex';
        }
    }

    // Show Development for IT and Admin
    const developmentLink = document.getElementById('developmentLink');
    if (developmentLink) {
        if (user.role === 'it' || user.role === 'admin') {
            developmentLink.classList.remove('hidden');
            developmentLink.style.display = 'flex';
        }
    }

    // Show Reports for HOD, IT, and Admin
    const reportsLink = document.getElementById('reportsLink');
    if (reportsLink) {
        if (user.role === 'hod' || user.role === 'it' || user.role === 'admin') {
            reportsLink.classList.remove('hidden');
            reportsLink.style.display = 'flex';
        }
    }
}

// Mobile sidebar functionality
function initializeMobileSidebar() {
    // Handle mobile overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
}

// Global function for mobile sidebar toggle (called from HTML onclick)
window.toggleMobileSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }

    if (overlay) {
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
            }, 10);
        } else {
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300); // Match transition duration
        }
    }
};

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.add('-translate-x-full');
    }

    if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

// Global navigation function (called from HTML onclick)
window.navigateTo = function(page) {
    window.location.href = page;
};

// Smart Sidebar Highlighting
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('aside nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Remove active classes from all links
        link.classList.remove('bg-white/10', 'text-white', 'border-l-4', 'border-visionRed');
        link.classList.add('text-gray-400');

        // Remove font-medium from span
        const span = link.querySelector('span');
        if (span) span.classList.remove('font-medium');

        // Add active classes to matching link
        if (href && (href === currentPage || href.includes(currentPage))) {
            link.classList.remove('text-gray-400', 'hover:bg-white/5', 'hover:text-white');
            link.classList.add('bg-white/10', 'text-white', 'border-l-4', 'border-visionRed');

            // Make the span bold
            if (span) span.classList.add('font-medium');
        }
    });
}

// Global function for handling file uploads (called from HTML onchange)
window.handleFileUpload = function(input) {
    const files = input.files;
    const fileList = document.getElementById('fileList');

    if (fileList && files.length > 0) {
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mb-2';
            fileItem.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="ph ph-file text-gray-400"></i>
                    <span class="text-sm text-gray-700">${file.name}</span>
                </div>
                <span class="text-xs text-gray-500">${(file.size / 1024).toFixed(2)} KB</span>
            `;
            fileList.appendChild(fileItem);
        });
    }
};

// Global function for refreshing data (called from HTML onclick)
window.refreshData = function() {
    location.reload();
};

// Global function for exporting current view (called from HTML onclick)
window.exportCurrentView = function(format = 'csv') {
    const data = API.getRequests();
    if (format === 'csv') {
        utils.exportToCSV(data, `cms-export-${new Date().toISOString().split('T')[0]}.csv`);
    }
};
