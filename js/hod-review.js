/* global checkAuth, MOCK_DATA */
// HOD Review Page Logic

let currentUser = null;
let allRequests = [];
let filteredRequests = [];
let currentRequest = null;
let currentAction = null;

document.addEventListener('DOMContentLoaded', function () {
    currentUser = checkAuth();
    if (!currentUser) return;

    // Check if user is HOD
    if (currentUser.role !== 'hod') {
        alert('Access denied. This page is only for Heads of Department.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Update user info in sidebar
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userDept').textContent = window.getRoleDisplayName ? window.getRoleDisplayName(currentUser.role) : 'Head of Department';
    document.getElementById('userInitials').textContent = currentUser.fullName.charAt(0);

    // Show navigation links based on role
    if (currentUser.role === 'it' || currentUser.role === 'admin') {
        document.getElementById('itReviewLink').classList.remove('hidden');
        document.getElementById('developmentLink').classList.remove('hidden');
    }
    if (currentUser.role === 'hod' || currentUser.role === 'it' || currentUser.role === 'admin') {
        document.getElementById('reportsLink').classList.remove('hidden');
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    loadRequests();
    populateStaffFilter();
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
        case 'refresh':
            loadRequests();
            break;
        case 'apply-filters':
            applyFilters();
            break;
        case 'open-review-modal':
            openReviewModal(target.dataset.requestId);
            break;
        case 'close-modal':
            closeModal();
            break;
        case 'show-action-form':
            showActionForm(target.dataset.formAction);
            break;
        case 'hide-action-form':
            hideActionForm();
            break;
        case 'submit-action':
            submitAction();
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

function loadRequests() {
    // Get all requests for HOD's department
    allRequests = MOCK_DATA.requests.filter(req => req.department === currentUser.department);
    
    filteredRequests = [...allRequests];
    updateStatistics();
    renderRequestsTable();
}

function updateStatistics() {
    const pending = allRequests.filter(r => r.hodApproval === 'Pending' || !r.hodApproval).length;
    const clarification = allRequests.filter(r => r.hodApproval === 'Clarification Requested').length;
    const approved = allRequests.filter(r => r.hodApproval === 'Approved').length;
    const rejected = allRequests.filter(r => r.hodApproval === 'Rejected' || r.hodApproval === 'Already in Development' || r.hodApproval === 'Already in Use').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('clarificationCount').textContent = clarification;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
}

function populateStaffFilter() {
    const staffSet = new Set(allRequests.map(r => r.requestor));
    const staffSelect = document.getElementById('filterStaff');
    
    staffSet.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff;
        option.textContent = staff;
        staffSelect.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const staffFilter = document.getElementById('filterStaff').value;

    filteredRequests = allRequests.filter(request => {
        let matches = true;

        if (statusFilter) {
            const hodStatus = getHODStatus(request);
            matches = matches && hodStatus === statusFilter;
        }

        if (priorityFilter) {
            matches = matches && request.priority === priorityFilter;
        }

        if (staffFilter) {
            matches = matches && request.requestor === staffFilter;
        }

        return matches;
    });

    renderRequestsTable();
}

function getHODStatus(request) {
    if (!request.hodApproval || request.hodApproval === 'Pending') return 'pending';
    if (request.hodApproval === 'Clarification Requested') return 'clarification';
    if (request.hodApproval === 'Approved') return 'approved';
    if (request.hodApproval === 'Rejected' || request.hodApproval === 'Already in Development' || request.hodApproval === 'Already in Use') return 'rejected';
    return 'pending';
}

function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    document.getElementById('requestCount').textContent = `${filteredRequests.length} request${filteredRequests.length !== 1 ? 's' : ''}`;

    if (filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-500">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRequests.map(request => {
        const statusBadge = getStatusBadge(request);
        const priorityBadge = getPriorityBadge(request.priority);

        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">${request.id}</td>
                <td class="px-6 py-4 font-medium text-slate-900">${request.title}</td>
                <td class="px-6 py-4 text-slate-700">${request.requestor}</td>
                <td class="px-6 py-4">${priorityBadge}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-slate-600">${request.dateSubmitted}</td>
                <td class="px-6 py-4 text-right">
                    <button data-action="open-review-modal" data-request-id="${request.id}"
                        class="bg-visionRed hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                        Review
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusBadge(request) {
    const status = getHODStatus(request);
    const badges = {
        'pending': '<span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">Pending Review</span>',
        'clarification': '<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Clarification Requested</span>',
        'approved': '<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">Approved</span>',
        'rejected': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>'
    };
    return badges[status] || badges['pending'];
}

function getPriorityBadge(priority) {
    const badges = {
        'High': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">High</span>',
        'Medium': '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Medium</span>',
        'Low': '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Low</span>'
    };
    return badges[priority] || badges['Medium'];
}

// Open review modal
function openReviewModal(requestId) {
    currentRequest = allRequests.find(r => r.id === requestId);
    if (!currentRequest) return;

    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');

    const hodStatus = getHODStatus(currentRequest);
    const isReviewed = hodStatus === 'approved' || hodStatus === 'rejected';

    modalContent.innerHTML = `
        <div class="space-y-6">
            <!-- Request Details -->
            <div class="bg-slate-50 p-4 rounded-lg">
                <h4 class="font-semibold text-lg text-slate-800 mb-3">Request Details</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-slate-600">Request ID:</span>
                        <span class="font-medium text-slate-900 ml-2">${currentRequest.id}</span>
                    </div>
                    <div>
                        <span class="text-slate-600">Priority:</span>
                        <span class="ml-2">${getPriorityBadge(currentRequest.priority)}</span>
                    </div>
                    <div>
                        <span class="text-slate-600">Staff Member:</span>
                        <span class="font-medium text-slate-900 ml-2">${currentRequest.requestor}</span>
                    </div>
                    <div>
                        <span class="text-slate-600">Date Submitted:</span>
                        <span class="font-medium text-slate-900 ml-2">${currentRequest.dateSubmitted}</span>
                    </div>
                    <div class="col-span-2">
                        <span class="text-slate-600">Section:</span>
                        <span class="font-medium text-slate-900 ml-2">${currentRequest.section}</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Title</h4>
                <p class="text-slate-700">${currentRequest.title}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Description</h4>
                <p class="text-slate-700">${currentRequest.description}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Type</h4>
                <p class="text-slate-700">${currentRequest.type}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Justification</h4>
                <p class="text-slate-700">${currentRequest.justification}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Expected Benefits</h4>
                <p class="text-slate-700">${currentRequest.expectedBenefits}</p>
            </div>

            ${currentRequest.hodComments ? `
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Previous HOD Comments</h4>
                <p class="text-slate-700">${currentRequest.hodComments}</p>
                ${currentRequest.hodApprovedDate ? `<p class="text-sm text-slate-600 mt-2">Reviewed on: ${currentRequest.hodApprovedDate}</p>` : ''}
            </div>
            ` : ''}

            ${!isReviewed ? `
            <!-- Action Buttons -->
            <div class="border-t pt-6">
                <h4 class="font-semibold text-lg text-slate-800 mb-4">Take Action</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button data-action="show-action-form" data-form-action="clarification"
                        class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
                        <i class="ph ph-chat-circle-dots text-xl"></i>
                        Ask for Clarification
                    </button>
                    <button data-action="show-action-form" data-form-action="approve"
                        class="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all">
                        <i class="ph ph-check-circle text-xl"></i>
                        Accept Request
                    </button>
                    <button data-action="show-action-form" data-form-action="reject"
                        class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
                        <i class="ph ph-x-circle text-xl"></i>
                        Reject Request
                    </button>
                    <button data-action="show-action-form" data-form-action="in_development"
                        class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
                        <i class="ph ph-gear-six text-xl"></i>
                        Already in Development
                    </button>
                    <button data-action="show-action-form" data-form-action="in_use"
                        class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all md:col-span-2">
                        <i class="ph ph-check-square text-xl"></i>
                        Already in Use
                    </button>
                </div>
            </div>

            <!-- Action Form (Hidden by default) -->
            <div id="actionForm" class="hidden border-t pt-6">
                <h4 class="font-semibold text-lg text-slate-800 mb-4" id="actionFormTitle">Action Details</h4>
                <div class="space-y-4">
                    <div id="reasonSection" class="hidden">
                        <label class="text-sm font-semibold text-slate-700 mb-2 block">Reason</label>
                        <select id="actionReason" class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-visionRed focus:outline-none">
                            <option value="">Select a reason</option>
                            <option value="duplicate">Duplicate Request</option>
                            <option value="out_of_scope">Out of Scope</option>
                            <option value="budget">Budget Constraints</option>
                            <option value="resources">Lack of Resources</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-700 mb-2 block" id="commentLabel">Comments</label>
                        <textarea id="actionComment" rows="4"
                            class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-visionRed focus:outline-none"
                            placeholder="Enter your comments here..."></textarea>
                    </div>
                    <div class="flex gap-3">
                        <button data-action="submit-action"
                            class="flex-1 bg-visionRed hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                            Submit
                        </button>
                        <button data-action="hide-action-form"
                            class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            ` : `
            <div class="bg-slate-100 p-4 rounded-lg text-center">
                <p class="text-slate-600">This request has already been reviewed.</p>
            </div>
            `}
        </div>
    `;

    modal.classList.add('active');
}

// Show action form
function showActionForm(action) {
    currentAction = action;
    const actionForm = document.getElementById('actionForm');
    const actionFormTitle = document.getElementById('actionFormTitle');
    const reasonSection = document.getElementById('reasonSection');
    const commentLabel = document.getElementById('commentLabel');

    const titles = {
        'clarification': 'Request Clarification',
        'approve': 'Approve Request',
        'reject': 'Reject Request',
        'in_development': 'Mark as Already in Development',
        'in_use': 'Mark as Already in Use'
    };

    const commentLabels = {
        'clarification': 'Questions for Staff Member',
        'approve': 'Approval Comments (Optional)',
        'reject': 'Rejection Comments',
        'in_development': 'Development Details',
        'in_use': 'Existing Solution Details'
    };

    actionFormTitle.textContent = titles[action];
    commentLabel.textContent = commentLabels[action];

    // Show reason dropdown only for reject action
    if (action === 'reject') {
        reasonSection.classList.remove('hidden');
    } else {
        reasonSection.classList.add('hidden');
    }

    actionForm.classList.remove('hidden');
    document.getElementById('actionComment').value = '';
    document.getElementById('actionReason').value = '';
}

// Hide action form
function hideActionForm() {
    document.getElementById('actionForm').classList.add('hidden');
    currentAction = null;
}

// Submit action
function submitAction() {
    const comment = document.getElementById('actionComment').value.trim();
    const reason = document.getElementById('actionReason').value;

    // Validation
    if (currentAction === 'reject' && !reason) {
        alert('Please select a reason for rejection');
        return;
    }

    if (!comment && (currentAction === 'clarification' || currentAction === 'reject' || currentAction === 'in_development' || currentAction === 'in_use')) {
        alert('Please provide comments');
        return;
    }

    // Update request
    const actionMap = {
        'clarification': 'Clarification Requested',
        'approve': 'Approved',
        'reject': 'Rejected',
        'in_development': 'Already in Development',
        'in_use': 'Already in Use'
    };

    currentRequest.hodApproval = actionMap[currentAction];
    currentRequest.hodComments = reason ? `${reason}: ${comment}` : comment;
    currentRequest.hodApprovedDate = new Date().toISOString().split('T')[0];
    currentRequest.hodReviewer = currentUser.fullName;

    // If approved, update workflow stage
    if (currentAction === 'approve') {
        currentRequest.workflowStage = 'Pending IT Review';
        currentRequest.status = 'Pending IT Review';
    } else if (currentAction === 'reject' || currentAction === 'in_development' || currentAction === 'in_use') {
        currentRequest.workflowStage = 'Closed';
        currentRequest.status = actionMap[currentAction];
    }

    alert(`Request ${currentRequest.id} has been ${actionMap[currentAction].toLowerCase()}`);
    
    closeModal();
    loadRequests();
}

// Close modal
function closeModal() {
    document.getElementById('reviewModal').classList.remove('active');
    currentRequest = null;
    currentAction = null;
}
