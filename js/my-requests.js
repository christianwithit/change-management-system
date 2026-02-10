/* global checkAuth, getCurrentUser, API, utils */
// My Requests Page Logic

let allRequests = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

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
    populateDepartmentFilter();
    loadRequests();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);

    // Search and filter inputs
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');

    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(filterRequests, 300));
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

// Populate department filter
function populateDepartmentFilter() {
    const select = document.getElementById('departmentFilter');
    if (!select) return;

    const departments = API.getDepartments();
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });
}

// Load requests
function loadRequests() {
    const user = getCurrentUser();
    allRequests = API.getRequests();

    if (user.role === 'staff') {
        allRequests = allRequests.filter(r => r.requestor === user.fullName);
    } else if (user.role === 'hod') {
        allRequests = allRequests.filter(r => r.department === user.department);
    }

    displayRequests(allRequests);
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

        const statusClass = request.status === 'Completed' ? 'bg-green-100 text-green-700' :
            request.status === 'Rejected' ? 'bg-red-100 text-red-700' :
            request.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
            'bg-orange-100 text-orange-700';

        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4"><strong class="text-gray-800">${request.id}</strong></td>
                <td class="px-6 py-4 font-medium text-gray-800">${request.title}</td>
                <td class="px-6 py-4"><span class="text-gray-600 text-sm">${request.type}</span></td>
                <td class="px-6 py-4 text-gray-700">${request.department}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityClass}">
                        ${request.priority}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
                        ${request.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-gray-600 text-sm">${utils.formatDate(request.dateSubmitted)}</td>
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;

    let filtered = allRequests;

    if (searchTerm) {
        filtered = filtered.filter(r =>
            r.id.toLowerCase().includes(searchTerm) ||
            r.title.toLowerCase().includes(searchTerm) ||
            r.description.toLowerCase().includes(searchTerm)
        );
    }

    if (statusFilter) {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (departmentFilter) {
        filtered = filtered.filter(r => r.department === departmentFilter);
    }

    displayRequests(filtered);
}

// View request
function viewRequest(id) {
    window.location.href = `request-detail.html?id=${id}`;
}

// Export current view
function exportCurrentView() {
    const data = API.getRequests();
    utils.exportToCSV(data, `cms-export-${new Date().toISOString().split('T')[0]}.csv`);
}
