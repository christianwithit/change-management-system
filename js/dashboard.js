/* global checkAuth, API */
// Dashboard Page Logic

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Initialize event listeners
    initializeEventListeners();

    // Update user info in sidebar
    updateSidebarUserInfo(user);

    // Show navigation based on role
    updateNavigationVisibility(user);

    // Load dashboard data
    loadStatistics();
    loadQuickActions(user.role);
    loadRecentRequests();
});

// Initialize all event listeners using event delegation
function initializeEventListeners() {
    // Use event delegation on document for dynamically added elements
    document.addEventListener('click', handleDocumentClick);
}

// Central event handler using event delegation
function handleDocumentClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    
    switch(action) {
        case 'toggle-mobile-sidebar':
            toggleMobileSidebar();
            break;
        case 'navigate':
            navigateTo(target.dataset.page);
            break;
        case 'logout':
            handleLogout();
            break;
        case 'view-request':
            viewRequest(target.dataset.requestId);
            break;
    }
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }

    if (overlay) {
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        } else {
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

// Handle overlay click to close sidebar
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
});

// Navigation
function navigateTo(page) {
    window.location.href = page;
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

// View request details
function viewRequest(requestId) {
    window.location.href = `request-detail.html?id=${requestId}`;
}

// Update sidebar user info
function updateSidebarUserInfo(user) {
    const userNameEl = document.getElementById('sidebarUserName');
    const userInitialEl = document.getElementById('sidebarUserInitial');
    const userRoleEl = document.getElementById('sidebarUserRole');

    if (userNameEl) userNameEl.textContent = user.fullName;
    if (userInitialEl) userInitialEl.textContent = user.fullName.charAt(0).toUpperCase();
    
    if (userRoleEl) {
        const roleNames = {
            'staff': 'Staff Member',
            'hod': 'Head of Department',
            'it': 'IT Administrator',
            'admin': 'System Administrator'
        };
        userRoleEl.textContent = roleNames[user.role] || 'Staff Member';
    }
}

// Update navigation visibility based on role
function updateNavigationVisibility(user) {
    const hodReviewLink = document.getElementById('hodReviewLink');
    const itReviewLink = document.getElementById('itReviewLink');
    const reportsLink = document.getElementById('reportsLink');

    if (hodReviewLink && user.role === 'hod') {
        hodReviewLink.classList.remove('hidden');
    }

    if (itReviewLink && (user.role === 'it' || user.role === 'admin')) {
        itReviewLink.classList.remove('hidden');
    }

    if (reportsLink && (user.role === 'hod' || user.role === 'it' || user.role === 'admin')) {
        reportsLink.classList.remove('hidden');
    }
}

// Load statistics
function loadStatistics() {
    const stats = API.getStats();
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('inProgressRequests').textContent = stats.inDevelopment;
    document.getElementById('completedRequests').textContent = stats.completed;
}

// Load quick actions based on role
function loadQuickActions(role) {
    const quickActionsSection = document.getElementById('quickActionsSection');
    if (!quickActionsSection) return;

    const user = window.getCurrentUser();
    if (!user) return;

    let html = '';

    // HOD: Show Pending Approvals Action Card
    if (role === 'hod') {
        const allRequests = API.getRequests();
        const departmentPending = allRequests.filter(r => 
            (r.status === 'Pending HOD Approval' || r.hodApproval === 'Pending' || !r.hodApproval) && 
            r.department === user.department
        ).length;

        if (departmentPending > 0) {
            html = `
                <div class="bg-white border-l-4 border-amber-500 rounded-lg shadow-sm hover:shadow-md transition-all p-5">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="ph ph-bell text-2xl text-amber-600"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">
                                    ${departmentPending} Request${departmentPending !== 1 ? 's' : ''} Awaiting Your Review
                                </h3>
                                <p class="text-sm text-slate-600 mt-0.5">
                                    Your department has pending approvals that need attention
                                </p>
                            </div>
                        </div>
                        <a href="hod-review.html" 
                           class="bg-visionRed hover:bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium whitespace-nowrap">
                            <i class="ph ph-check-square font-bold"></i> Review Now
                        </a>
                    </div>
                </div>
            `;
        }
    }

    // IT: Show IT Review Queue Action Card
    if (role === 'it' || role === 'admin') {
        const itReviewCount = API.getRequests().filter(r => 
            r.status === 'Pending IT Review' || r.status === 'IT Review'
        ).length;

        if (itReviewCount > 0) {
            html = `
                <div class="bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all p-5">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="ph ph-wrench text-2xl text-blue-600"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">
                                    ${itReviewCount} Request${itReviewCount !== 1 ? 's' : ''} in IT Review Queue
                                </h3>
                                <p class="text-sm text-slate-600 mt-0.5">
                                    Technical review and feasibility assessment needed
                                </p>
                            </div>
                        </div>
                        <a href="it-review.html" 
                           class="bg-visionRed hover:bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium whitespace-nowrap">
                            <i class="ph ph-wrench font-bold"></i> Review Now
                        </a>
                    </div>
                </div>
            `;
        }
    }

    if (html) {
        quickActionsSection.innerHTML = html;
        quickActionsSection.classList.remove('hidden');
    }
}

// Load recent requests
function loadRecentRequests() {
    const user = window.getCurrentUser();
    if (!user) return;

    let requests = API.getRequests();

    // Filter based on role
    if (user.role === 'staff') {
        requests = requests.filter(r => r.requestor === user.fullName);
    } else if (user.role === 'hod') {
        requests = requests.filter(r => r.department === user.department);
    }

    // Get 5 most recent
    requests = requests.slice(0, 5);

    const tbody = document.getElementById('recentRequestsBody');
    if (!tbody) return;

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(request => {
        const statusColors = {
            'Pending HOD Approval': 'bg-amber-100 text-amber-800',
            'IT Review': 'bg-blue-100 text-blue-800',
            'In Progress': 'bg-purple-100 text-purple-800',
            'Completed': 'bg-emerald-100 text-emerald-800',
            'Rejected': 'bg-red-100 text-red-800'
        };

        const statusClass = statusColors[request.status] || 'bg-slate-100 text-slate-800';

        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">${request.id}</td>
                <td class="px-6 py-4 font-medium text-slate-900">${request.title}</td>
                <td class="px-6 py-4 text-slate-700">${request.department}</td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
                        ${request.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-slate-600">${request.dateSubmitted}</td>
                <td class="px-6 py-4 text-right">
                    <button data-action="view-request" data-request-id="${request.id}"
                        class="text-visionRed hover:text-red-700 font-medium transition-colors">
                        View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
