/* global checkAuth, apiClient, showToast */
// Dashboard Page Logic

// Helper: Get display status for a request
function getDisplayStatus(request) {
    const hodReview = request.change_ms_hod_review;
    const status = request.request_status;

    if (status === 'Rejected' && hodReview?.already_in_progress) {
        return { label: 'Already in Progress', class: 'bg-purple-100 text-purple-700' };
    }
    if (status === 'Rejected' && hodReview?.already_exists) {
        return { label: 'Already Exists', class: 'bg-slate-100 text-slate-700' };
    }
    if (status === 'Rejected') {
        return { label: 'Rejected', class: 'bg-red-100 text-red-700' };
    }
    if (status === 'Completed') {
        return { label: 'Completed', class: 'bg-green-100 text-green-700' };
    }
    if (status === 'Development') {
        return { label: 'In Development', class: 'bg-purple-100 text-purple-700' };
    }
    if (status === 'IT Review') {
        return { label: 'IT Review', class: 'bg-blue-100 text-blue-700' };
    }
    if (status === 'Pending HOD approval') {
        return { label: 'Pending HOD Approval', class: 'bg-orange-100 text-orange-700' };
    }
    return { label: status, class: 'bg-gray-100 text-gray-700' };
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
    const user = checkAuth();
    if (!user) return;

    // Initialize event listeners
    initializeEventListeners();

    // Update user info in sidebar
    updateSidebarUserInfo(user);

    // Show navigation based on role
    updateNavigationVisibility(user);

    // Load dashboard data from backend
    await loadStatistics(user);
    loadQuickActions(user.role);
    await loadRecentRequests(user);
    
    // Check for due date warnings (IT/Admin only)
    if (user.role === 'it' || user.role === 'admin') {
        showDueDateWarnings();
    }
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

// Load statistics from backend
async function loadStatistics(user) {
    try {
        let requests = [];

        // Fetch requests based on user role
        if (user.role === 'staff') {
            // Staff: Get only their own requests
            if (!user.staffId) {
                console.error('User does not have staffId');
                showToast('Unable to load statistics: User ID missing', 'error');
                return;
            }
            const response = await apiClient.getChangeRequestsByStaff(user.staffId);
            requests = response.data || response;
        } else if (user.role === 'hod') {
            // HOD: Get requests from their department
            // You'll need to add departmentId to the user object or fetch all and filter
            const response = await apiClient.getAllChangeRequests();
            requests = (response.data || response).filter(r => 
                r.department?.department_name === user.department
            );
        } else {
            // IT/Admin: Get all requests
            const response = await apiClient.getAllChangeRequests();
            requests = response.data || response;
        }

        // Calculate statistics
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.request_status === 'Pending HOD approval').length,
            inProgress: requests.filter(r => r.request_status === 'Development' || r.request_status === 'IT Review').length,
            completed: requests.filter(r => r.request_status === 'Completed').length
        };

        // Update UI
        document.getElementById('totalRequests').textContent = stats.total;
        document.getElementById('pendingRequests').textContent = stats.pending;
        document.getElementById('inProgressRequests').textContent = stats.inProgress;
        document.getElementById('completedRequests').textContent = stats.completed;

    } catch (error) {
        console.error('Failed to load statistics:', error);
        showToast('Failed to load statistics', 'error');
        
        // Show 0 for all stats on error
        document.getElementById('totalRequests').textContent = '0';
        document.getElementById('pendingRequests').textContent = '0';
        document.getElementById('inProgressRequests').textContent = '0';
        document.getElementById('completedRequests').textContent = '0';
    }
}

// Load quick actions based on role
async function loadQuickActions(role) {
    const quickActionsSection = document.getElementById('quickActionsSection');
    if (!quickActionsSection) return;

    const user = window.getCurrentUser();
    if (!user) return;

    let html = '';

    try {
        // HOD: Show Pending Approvals Action Card
        if (role === 'hod') {
            const response = await apiClient.getAllChangeRequests();
            const allRequests = response.data || response;
            
            const departmentPending = allRequests.filter(r => 
                r.request_status === 'Pending HOD approval' && 
                r.department?.department_name === user.department
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
            const response = await apiClient.getAllChangeRequests();
            const allRequests = response.data || response;
            
            const itReviewCount = allRequests.filter(r => 
                r.request_status === 'IT Review'
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
    } catch (error) {
        console.error('Failed to load quick actions:', error);
    }
}

// Load recent requests from backend
async function loadRecentRequests(user) {
    const tbody = document.getElementById('recentRequestsBody');
    if (!tbody) return;

    try {
        let requests = [];

        // Fetch requests based on role
        if (user.role === 'staff') {
            if (!user.staffId) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">User ID missing</td></tr>';
                return;
            }
            const response = await apiClient.getChangeRequestsByStaff(user.staffId);
            requests = response.data || response;
        } else if (user.role === 'hod') {
            const response = await apiClient.getAllChangeRequests();
            const allRequests = response.data || response;
            requests = allRequests.filter(r => r.department?.department_name === user.department);
        } else {
            const response = await apiClient.getAllChangeRequests();
            requests = response.data || response;
        }

        // Sort by creation date (most recent first) and get top 5
        requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        requests = requests.slice(0, 5);

        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">No requests found</td></tr>';
            return;
        }

        tbody.innerHTML = requests.map(request => {
    const { label: statusLabel, class: statusClass } = window.getDisplayStatus(request);
    const departmentName = request.department?.department_name || 'N/A';
    const formattedDate = new Date(request.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-sm text-slate-600 font-medium">${request.id}</td>
            <td class="px-6 py-4 font-medium text-slate-900">${request.title}</td>
            <td class="px-6 py-4 text-slate-700">${departmentName}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
                    ${statusLabel}
                </span>
            </td>
            <td class="px-6 py-4 text-slate-600">${formattedDate}</td>
            <td class="px-6 py-4 text-right">
                <button data-action="view-request" data-request-id="${request.id}"
                    class="text-visionRed hover:text-red-700 font-medium transition-colors">
                    View
                </button>
            </td>
        </tr>
    `;
}).join('');

    } catch (error) {
        console.error('Failed to load recent requests:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-red-500">Failed to load requests</td></tr>';
    }
}

// Show due date warnings for IT/Admin
function showDueDateWarnings() {
    // This functionality depends on your project tracking system
    // For now, we'll leave it as is since it uses mock data
    if (typeof window.checkDueDateNotifications !== 'function') {
        return;
    }
    
    const warnings = window.checkDueDateNotifications();
    
    if (warnings.length === 0) return;
    
    // Show toast notification
    const criticalCount = warnings.filter(w => w.severity === 'critical').length;
    const message = criticalCount > 0 
        ? `🔴 ${criticalCount} overdue task${criticalCount > 1 ? 's' : ''} + ${warnings.length - criticalCount} due soon`
        : `⚠️ ${warnings.length} task${warnings.length > 1 ? 's' : ''} need attention`;
    
    if (typeof window.showToast === 'function') {
        window.showToast(message, 'warning');
    }
    
    // Show warning card on dashboard
    const container = document.getElementById('dueDateWarnings');
    const list = document.getElementById('warningsList');
    
    if (!container || !list) return;
    
    list.innerHTML = warnings.map(w => {
        const icon = w.severity === 'critical' ? 'ph-x-circle text-red-600' : 'ph-warning-circle text-amber-600';
        return `
            <div class="flex items-center gap-2 text-sm">
                <i class="ph ${icon}"></i>
                <span class="font-medium text-slate-800">${w.project.id}:</span>
                <span class="text-slate-700">${w.project.title}</span>
                <span class="font-medium ${w.severity === 'critical' ? 'text-red-700' : 'text-amber-700'}">(${w.message})</span>
            </div>
        `;
    }).join('');
    
    container.classList.remove('hidden');
}