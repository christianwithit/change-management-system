/* global checkAuth, getCurrentUser, apiClient, showToast, utils */
// My Requests Page Logic

let allRequests = [];

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

// Initialize page
document.addEventListener('DOMContentLoaded', async function () {
    const user = checkAuth();
    if (!user) return;

    // Update page header based on role
    updatePageHeader(user);

    // Show navigation based on role
    if (user.role === 'hod') {
        const hodLink = document.getElementById('hodReviewLink');
        if (hodLink) hodLink.style.display = 'flex';
    }
    if (user.role === 'it' || user.role === 'admin') {
        const itLink = document.getElementById('itReviewLink');
        if (itLink) itLink.style.display = 'flex';
    }
    if (user.role === 'hod' || user.role === 'it' || user.role === 'admin') {
        const reportsLink = document.getElementById('reportsLink');
        if (reportsLink) reportsLink.style.display = 'flex';
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    await populateDepartmentFilter();
    await loadRequests();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);

    // Search and filter inputs
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');

    if (searchInput && utils && utils.debounce) {
        searchInput.addEventListener('input', utils.debounce(filterRequests, 300));
    } else if (searchInput) {
        searchInput.addEventListener('input', filterRequests);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterRequests);
    }
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterRequests);
    }

    // Overlay click
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
}

// Central event handler
function handleDocumentClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    switch(action) {
        case 'toggle-mobile-sidebar':
            toggleMobileSidebar();
            break;
        case 'logout':
            handleLogout();
            break;
        case 'navigate':
            navigateTo(target.dataset.page);
            break;
        case 'export-view':
            exportCurrentView();
            break;
        case 'view-request':
            viewRequest(target.dataset.requestId);
            break;
    }
}

// Mobile sidebar
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) sidebar.classList.toggle('-translate-x-full');
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

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

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

// Update page header based on role
function updatePageHeader(user) {
    const header = document.querySelector('h2');
    const subtext = document.querySelector('header p');
    
    if (user.role === 'hod') {
        if (header) header.textContent = 'Department Change Requests';
        if (subtext) subtext.textContent = `Track and manage all change requests from ${user.department}.`;
    } else if (user.role === 'it' || user.role === 'admin') {
        if (header) header.textContent = 'All Change Requests';
        if (subtext) subtext.textContent = 'Track and manage all change requests across the organization.';
    }
}

// Populate department filter
async function populateDepartmentFilter() {
    const select = document.getElementById('departmentFilter');
    if (!select) return;

    try {
        const response = await apiClient.getDepartments();
        const departments = response.data || response;
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.attributes?.department_name || dept.department_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load departments:', error);
    }
}

// Load requests from backend
// Load requests from backend
// Load requests from backend
async function loadRequests() {
    const user = getCurrentUser();
    
    if (!user.staffId && user.role === 'staff') {
        console.error('User does not have staffId');
        showToast('Unable to load requests: User ID missing', 'error');
        return;
    }

    try {
        let response;
        
        if (user.role === 'staff') {
            // Staff: Get only their own requests
            response = await apiClient.getChangeRequestsByStaff(user.staffId);
            allRequests = response.data || response;
        } else if (user.role === 'hod') {
            // HOD: Get ALL requests from their department
            response = await apiClient.getAllChangeRequests();
            let allRequestsData = response.data || response;
            allRequests = allRequestsData.filter(r => 
                r.department?.department_name === user.department
            );
        } else {
            // IT/Admin: Get all requests
            response = await apiClient.getAllChangeRequests();
            allRequests = response.data || response;
        }

        displayRequests(allRequests);
        
    } catch (error) {
        console.error('Failed to load requests:', error);
        showToast('Failed to load requests', 'error');
        displayRequests([]);
    }
}
// Display requests
function displayRequests(requests) {
    const tbody = document.getElementById('requestsBody');
    const countElement = document.getElementById('requestCount');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('tableContainer');

    if (!tbody || !countElement) return;

    countElement.textContent = `${requests.length} request${requests.length !== 1 ? 's' : ''}`;

    if (requests.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (tableContainer) tableContainer.classList.add('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = requests.map(request => {
    const priorityClass = request.priority === 'High' ? 'bg-red-100 text-red-700' :
        request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-blue-100 text-blue-700';

    const { label: statusLabel, class: statusClass } = getDisplayStatus(request);

    const departmentName = request.department?.department_name || 'N/A';
    const formattedDate = new Date(request.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4"><strong class="text-gray-800">${request.id}</strong></td>
            <td class="px-6 py-4 font-medium text-gray-800">${request.title}</td>
            <td class="px-6 py-4"><span class="text-gray-600 text-sm">${request.change_type}</span></td>
            <td class="px-6 py-4 text-gray-700">${departmentName}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityClass}">
                    ${request.priority}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
                    ${displayStatus}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">${formattedDate}</td>
            <td class="px-6 py-4 text-right">
                <button data-action="view-request" data-request-id="${request.id}"
                    class="bg-visionRed hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                    View Details
                </button>
            </td>
        </tr>
    `;
}).join('');
}

// Filter requests
function filterRequests() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    const departmentValue = departmentFilter ? departmentFilter.value : '';

    let filtered = allRequests;

    if (searchTerm) {
        filtered = filtered.filter(r =>
            String(r.id).toLowerCase().includes(searchTerm) ||
            r.title.toLowerCase().includes(searchTerm) ||
            r.description.toLowerCase().includes(searchTerm)
        );
    }

    if (statusValue) {
        filtered = filtered.filter(r => r.request_status === statusValue);
    }

    if (departmentValue) {
        filtered = filtered.filter(r => r.department?.id === parseInt(departmentValue));
    }

    displayRequests(filtered);
}

// View request
function viewRequest(id) {
    window.location.href = `request-detail.html?id=${id}`;
}

// Export current view
function exportCurrentView() {
    if (typeof showToast === 'function') {
        showToast('Export feature coming soon!', 'info');
    } else {
        alert('Export feature coming soon!');
    }
}