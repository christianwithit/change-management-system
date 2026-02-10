/* global checkAuth, getCurrentUser, API, utils, showToast */
// Approvals Page Logic

let currentReviewRequest = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user is HOD
    if (user.role !== 'hod') {
        utils.showAlert('Access denied. This page is for Heads of Department only.', 'danger');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }

    // Hide IT Review link if not IT
    if (user.role !== 'it' && user.role !== 'admin') {
        const itReviewLink = document.getElementById('itReviewLink');
        if (itReviewLink) itReviewLink.style.display = 'none';
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    loadPendingApprovals();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);
    
    // Overlay click to close sidebar
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
        case 'refresh':
            location.reload();
            break;
        case 'view-request-detail':
            viewRequestDetail(target.dataset.requestId);
            break;
        case 'open-approval-modal':
            openApprovalModal(target.dataset.requestId, target.dataset.modalAction);
            break;
        case 'close-modal':
            closeModal(target.dataset.modal);
            break;
        case 'approve-request':
            approveRequest();
            break;
        case 'reject-request':
            rejectRequest();
            break;
    }
}

// Mobile sidebar functions
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

// Load pending approvals
function loadPendingApprovals() {
    const user = getCurrentUser();
    const allRequests = API.getRequests();

    const pendingRequests = allRequests.filter(r =>
        r.status === 'Pending HOD Approval' &&
        r.department === user.department
    );

    const approvedToday = allRequests.filter(r =>
        r.hodApproval === 'Approved' &&
        r.department === user.department
    ).length;

    const rejected = allRequests.filter(r =>
        r.status === 'Rejected' &&
        r.department === user.department
    ).length;

    document.getElementById('pendingCount').textContent = pendingRequests.length;
    document.getElementById('approvedToday').textContent = approvedToday;
    document.getElementById('rejectedCount').textContent = rejected;

    displayPendingRequests(pendingRequests);
}

// Display pending requests
function displayPendingRequests(requests) {
    const emptyState = document.getElementById('emptyState');
    const pendingContainer = document.getElementById('pendingRequestsContainer');

    if (requests.length === 0) {
        emptyState.classList.remove('hidden');
        pendingContainer.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    pendingContainer.innerHTML = '<div id="pendingRequestsList" class="space-y-4"></div>';
    const listContainer = document.getElementById('pendingRequestsList');

    listContainer.innerHTML = requests.map(request => {
        const priorityClass = request.priority === 'High' ? 'bg-red-100/50 text-red-700 border-red-200' :
            request.priority === 'Medium' ? 'bg-amber-100/50 text-amber-700 border-amber-200' :
            'bg-blue-100/50 text-blue-700 border-blue-200';

        return `
            <div class="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-visionRed transition-all">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-800 text-lg mb-1">${request.title}</h4>
                        <p class="text-sm text-slate-500 mb-2">${request.id} • ${request.type}</p>
                        <p class="text-slate-700">${request.description}</p>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityClass}">
                        ${request.priority}
                    </span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <i class="ph ph-user"></i>
                    <span class="font-medium text-slate-900">${request.requestor}</span> • ${request.section} • ${utils.formatDate(request.dateSubmitted)}
                </div>
                <div class="flex gap-2">
                    <button data-action="view-request-detail" data-request-id="${request.id}"
                            class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-all border border-slate-300">
                        View Full Details
                    </button>
                    <button data-action="open-approval-modal" data-request-id="${request.id}" data-modal-action="approve"
                            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-1">
                        <i class="ph ph-check"></i> Approve
                    </button>
                    <button data-action="open-approval-modal" data-request-id="${request.id}" data-modal-action="reject"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-1">
                        <i class="ph ph-x"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Open approval modal
function openApprovalModal(requestId) {
    currentReviewRequest = API.getRequest(requestId);

    const modalDetails = document.getElementById('modalRequestDetails');
    modalDetails.innerHTML = `
        <div class="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div><span class="text-sm text-slate-600">Request ID:</span> <strong class="font-medium text-slate-900">${currentReviewRequest.id}</strong></div>
            <div><span class="text-sm text-slate-600">Title:</span> <strong class="font-medium text-slate-900">${currentReviewRequest.title}</strong></div>
            <div><span class="text-sm text-slate-600">Requestor:</span> <strong class="font-medium text-slate-900">${currentReviewRequest.requestor}</strong> (${currentReviewRequest.section})</div>
            <div><span class="text-sm text-slate-600">Business Justification:</span> <p class="text-slate-700 mt-1">${currentReviewRequest.justification}</p></div>
        </div>
    `;

    const modal = document.getElementById('approvalModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Approve request
function approveRequest() {
    if (!currentReviewRequest) return;

    const comments = document.getElementById('approvalComments').value;

    API.updateRequest(currentReviewRequest.id, {
        status: 'IT Review',
        hodApproval: 'Approved',
        hodComments: comments
    });

    showToast('Request approved successfully!', 'success');
    closeModal('approvalModal');
    document.getElementById('approvalComments').value = '';
    setTimeout(() => loadPendingApprovals(), 500);
}

// Reject request
function rejectRequest() {
    if (!currentReviewRequest) return;

    const comments = document.getElementById('approvalComments').value;

    if (!comments.trim()) {
        showToast('Please provide a reason for rejection', 'warning');
        return;
    }

    API.updateRequest(currentReviewRequest.id, {
        status: 'Rejected',
        hodApproval: 'Rejected',
        hodComments: comments
    });

    showToast('Request rejected', 'info');
    closeModal('approvalModal');
    document.getElementById('approvalComments').value = '';
    setTimeout(() => loadPendingApprovals(), 500);
}

// View request detail
function viewRequestDetail(id) {
    window.location.href = `request-detail.html?id=${id}`;
}
