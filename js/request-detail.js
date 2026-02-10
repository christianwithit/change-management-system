/* global checkAuth, API, utils, showToast */
// Request Detail Page Logic

let currentRequest = null;

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

    // Load request details
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    if (requestId) {
        loadRequestDetails(requestId);
    } else {
        showToast('Request ID not found', 'error');
        setTimeout(() => window.location.href = 'my-requests.html', 2000);
    }
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);

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
        case 'print':
            window.print();
            break;
        case 'back':
            history.back();
            break;
        case 'switch-tab':
            switchTab(target.dataset.tab);
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

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

// Load request details
function loadRequestDetails(id) {
    currentRequest = API.getRequest(id);

    if (!currentRequest) {
        showToast('Request not found', 'error');
        setTimeout(() => window.location.href = 'my-requests.html', 2000);
        return;
    }

    displayRequestHeader();
    displayRequestDetails();
    displayTimeline();
}

// Display request header
function displayRequestHeader() {
    const header = document.getElementById('requestHeader');
    
    const statusClass = currentRequest.status === 'Completed' ? 'bg-green-100 text-green-700' :
        currentRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' :
        currentRequest.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
        'bg-orange-100 text-orange-700';

    const priorityClass = currentRequest.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
        currentRequest.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
        'bg-blue-100 text-blue-700 border-blue-200';

    const hodApprovalClass = currentRequest.hodApproval === 'Approved' ? 'bg-green-100 text-green-700' :
        currentRequest.hodApproval === 'Rejected' ? 'bg-red-100 text-red-700' :
        'bg-orange-100 text-orange-700';

    header.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${currentRequest.title}</h2>
                    <p class="text-gray-500 font-medium">${currentRequest.id}</p>
                </div>
                <div class="flex gap-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                        ${currentRequest.status}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityClass}">
                        ${currentRequest.priority}
                    </span>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Requestor</label>
                    <span class="text-gray-800 font-medium">${currentRequest.requestor}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Department</label>
                    <span class="text-gray-800 font-medium">${currentRequest.department}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Section</label>
                    <span class="text-gray-800 font-medium">${currentRequest.section}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Date Submitted</label>
                    <span class="text-gray-800 font-medium">${utils.formatDate(currentRequest.dateSubmitted)}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Type</label>
                    <span class="text-gray-800 font-medium">${currentRequest.type}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">HOD Approval</label>
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${hodApprovalClass}">
                        ${currentRequest.hodApproval}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Display request details
function displayRequestDetails() {
    const content = document.getElementById('detailsContent');
    content.innerHTML = `
        <div>
            <label class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">Description</label>
            <p class="text-gray-700 leading-relaxed">${currentRequest.description}</p>
        </div>
        <div>
            <label class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">Business Justification</label>
            <p class="text-gray-700 leading-relaxed">${currentRequest.justification}</p>
        </div>
        <div>
            <label class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">Expected Benefits</label>
            <p class="text-gray-700 leading-relaxed">${currentRequest.expectedBenefits}</p>
        </div>
        <div>
            <label class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">IT Status</label>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                currentRequest.itStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                currentRequest.itStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
            }">
                ${currentRequest.itStatus || 'Pending'}
            </span>
        </div>
    `;
}

// Display timeline
function displayTimeline() {
    const timeline = document.getElementById('timelineContent');
    const events = [
        {
            date: currentRequest.dateSubmitted,
            title: 'Request Submitted',
            description: `Submitted by ${currentRequest.requestor}`,
            icon: 'ph-paper-plane-tilt',
            color: 'blue'
        }
    ];

    if (currentRequest.hodApproval === 'Approved') {
        events.push({
            date: currentRequest.dateSubmitted,
            title: 'HOD Approved',
            description: 'Request approved by Head of Department',
            icon: 'ph-check-circle',
            color: 'green'
        });
    }

    if (currentRequest.itStatus === 'In Progress') {
        events.push({
            date: currentRequest.dateSubmitted,
            title: 'IT Development Started',
            description: 'IT team has started working on this request',
            icon: 'ph-gear-six',
            color: 'purple'
        });
    }

    if (currentRequest.status === 'Completed') {
        events.push({
            date: currentRequest.dateSubmitted,
            title: 'Request Completed',
            description: 'Change has been implemented and delivered',
            icon: 'ph-check-circle',
            color: 'green'
        });
    }

    timeline.innerHTML = events.map((event, index) => `
        <div class="flex gap-4">
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-${event.color}-100 text-${event.color}-600 flex items-center justify-center">
                    <i class="ph ${event.icon} text-xl"></i>
                </div>
                ${index < events.length - 1 ? '<div class="w-0.5 h-full bg-gray-200 my-2"></div>' : ''}
            </div>
            <div class="flex-1 pb-8">
                <div class="text-sm text-gray-500 mb-1">${utils.formatDate(event.date)}</div>
                <h4 class="font-bold text-gray-800 mb-1">${event.title}</h4>
                <p class="text-gray-600">${event.description}</p>
            </div>
        </div>
    `).join('');
}

// Switch tab
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('text-visionRed', 'border-b-2', 'border-visionRed');
        tab.classList.add('text-gray-500', 'hover:text-gray-700');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Add active class to clicked tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-visionRed', 'border-b-2', 'border-visionRed');
    }
}
