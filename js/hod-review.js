/* global checkAuth, getCurrentUser, apiClient, showToast */
// HOD Review Page Logic

let currentUser = null;
let allRequests = [];
let filteredRequests = [];
let currentRequest = null;
let currentAction = null;

document.addEventListener('DOMContentLoaded', async function () {
    currentUser = checkAuth();
    if (!currentUser) return;

    // Check if user is HOD
    if (currentUser.role !== 'hod') {
        alert('Access denied. This page is only for Heads of Department.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Update user info in sidebar
    const userName = document.getElementById('userName');
    const userDept = document.getElementById('userDept');
    const userInitials = document.getElementById('userInitials');
    
    if (userName) userName.textContent = currentUser.fullName;
    if (userDept) userDept.textContent = 'Head of Department';
    if (userInitials) userInitials.textContent = currentUser.fullName.charAt(0);

    // Show navigation links based on role
    const itReviewLink = document.getElementById('itReviewLink');
    const developmentLink = document.getElementById('developmentLink');
    const reportsLink = document.getElementById('reportsLink');
    
    if (currentUser.role === 'it' || currentUser.role === 'admin' || currentUser.role === 'headoftech') {
        if (itReviewLink) itReviewLink.classList.remove('hidden');
        if (developmentLink) developmentLink.classList.remove('hidden');
    }
    if (currentUser.role === 'hod' || currentUser.role === 'it' || currentUser.role === 'admin' || currentUser.role === 'headoftech') {
        if (reportsLink) reportsLink.classList.remove('hidden');
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    await loadRequests();
    await populateStaffFilter();
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

// Load requests from backend
async function loadRequests() {
    try {
        // Get all change requests for HOD's department
        const response = await apiClient.getAllChangeRequests();
        const allRequestsData = response.data || response;
        
        // Filter by department and populate with HOD review info
        allRequests = allRequestsData.filter(r => 
            r.department?.department_name === currentUser.department
        );
        
        filteredRequests = [...allRequests];
        updateStatistics();
        renderRequestsTable();
    } catch (error) {
        console.error('Failed to load requests:', error);
        showToast('Failed to load requests', 'error');
        allRequests = [];
        filteredRequests = [];
        updateStatistics();
        renderRequestsTable();
    }
}

function updateStatistics() {
    const pending = allRequests.filter(r => {
        if (!r.change_ms_hod_review) return r.request_status === 'Pending HOD approval';
        return r.change_ms_hod_review.approval_status === 'Pending';
    }).length;
    
    const clarification = allRequests.filter(r => 
        r.change_ms_hod_review?.approval_status === 'Clarification needed'
    ).length;
    
    const approved = allRequests.filter(r => 
        r.change_ms_hod_review?.approval_status === 'Approved'
    ).length;
    
    // Only count TRUE rejections, not already_in_progress or already_exists
    const rejected = allRequests.filter(r => 
        r.change_ms_hod_review?.approval_status === 'Rejected' &&
        !r.change_ms_hod_review?.already_in_progress &&
        !r.change_ms_hod_review?.already_exists
    ).length;

    const pendingEl = document.getElementById('pendingCount');
    const clarificationEl = document.getElementById('clarificationCount');
    const approvedEl = document.getElementById('approvedCount');
    const rejectedEl = document.getElementById('rejectedCount');
    
    if (pendingEl) pendingEl.textContent = pending;
    if (clarificationEl) clarificationEl.textContent = clarification;
    if (approvedEl) approvedEl.textContent = approved;
    if (rejectedEl) rejectedEl.textContent = rejected;
}

async function populateStaffFilter() {
    const staffSet = new Set();
    allRequests.forEach(r => {
        const staffName = r.staff?.staff_name;
        if (staffName) staffSet.add(staffName);
    });
    
    const staffSelect = document.getElementById('filterStaff');
    if (!staffSelect) return;
    
    staffSet.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff;
        option.textContent = staff;
        staffSelect.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('filterStatus')?.value;
    const priorityFilter = document.getElementById('filterPriority')?.value;
    const staffFilter = document.getElementById('filterStaff')?.value;

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
            matches = matches && request.staff?.staff_name === staffFilter;
        }

        return matches;
    });

    renderRequestsTable();
}

function getHODStatus(request) {
    if (!request.change_ms_hod_review) {
        return request.request_status === 'Pending HOD approval' ? 'pending' : 'pending';
    }
    
    const status = request.change_ms_hod_review.approval_status;
    if (status === 'Pending') return 'pending';
    if (status === 'Clarification needed') return 'clarification';
    if (status === 'Approved') return 'approved';
    if (status === 'Rejected') return 'rejected';
    return 'pending';
}

function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    const requestCount = document.getElementById('requestCount');
    
    if (!tbody) return;
    
    if (requestCount) {
        requestCount.textContent = `${filteredRequests.length} request${filteredRequests.length !== 1 ? 's' : ''}`;
    }

    if (filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-slate-500">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRequests.map(request => {
        const statusBadge = getStatusBadge(request);
        const priorityBadge = getPriorityBadge(request.priority);
        const staffName = request.staff?.staff_name || 'N/A';
        const formattedDate = new Date(request.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">${request.id}</td>
                <td class="px-6 py-4 font-medium text-slate-900">${request.title}</td>
                <td class="px-6 py-4 text-slate-700">${staffName}</td>
                <td class="px-6 py-4">${priorityBadge}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-slate-600">${formattedDate}</td>
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
    const hodReview = request.change_ms_hod_review;
    const status = request.request_status;

    // Check flags first before falling back to approval_status
    if (status === 'Rejected' && hodReview?.already_in_progress) {
        return '<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Already in Progress</span>';
    }
    if (status === 'Rejected' && hodReview?.already_exists) {
        return '<span class="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">Already Exists</span>';
    }

    const hodStatus = getHODStatus(request);
    const badges = {
        'pending': '<span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">Pending Review</span>',
        'clarification': '<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Clarification Requested</span>',
        'approved': '<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">Approved</span>',
        'rejected': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>'
    };
    return badges[hodStatus] || badges['pending'];
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
    currentRequest = allRequests.find(r => r.id === parseInt(requestId));
    if (!currentRequest) return;

    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;

    const hodStatus = getHODStatus(currentRequest);
    const isReviewed = hodStatus === 'approved' || hodStatus === 'rejected';
    const hodReview = currentRequest.change_ms_hod_review;
    const staffName = currentRequest.staff?.staff_name || 'N/A';
    const sectionName = currentRequest.change_ms_section?.section_name || 'N/A';
    const formattedDate = new Date(currentRequest.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

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
                        <span class="font-medium text-slate-900 ml-2">${staffName}</span>
                    </div>
                    <div>
                        <span class="text-slate-600">Date Submitted:</span>
                        <span class="font-medium text-slate-900 ml-2">${formattedDate}</span>
                    </div>
                    <div class="col-span-2">
                        <span class="text-slate-600">Section:</span>
                        <span class="font-medium text-slate-900 ml-2">${sectionName}</span>
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
                <p class="text-slate-700">${currentRequest.change_type}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Justification</h4>
                <p class="text-slate-700">${currentRequest.justification}</p>
            </div>

            <div>
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Expected Benefits</h4>
                <p class="text-slate-700">${currentRequest.expected_benefits}</p>
            </div>

            ${currentRequest.clarification_response ? `
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-chat-circle-text text-green-600"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-green-900 mb-1">Staff Clarification Response</h4>
                        <p class="text-green-800 text-sm">${currentRequest.clarification_response}</p>
                    </div>
                </div>
            </div>
            ` : ''}

            ${hodReview && hodReview.comments ? `
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-lg text-slate-800 mb-2">Previous HOD Comments</h4>
                <p class="text-slate-700">${hodReview.comments}</p>
                ${hodReview.clarification_notes ? `<p class="text-slate-700 mt-2"><strong>Clarification Notes:</strong> ${hodReview.clarification_notes}</p>` : ''}
                <p class="text-sm text-slate-600 mt-2">Status: ${hodReview.approval_status}</p>
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
        Approve Request
    </button>
    <button data-action="show-action-form" data-form-action="reject"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
        <i class="ph ph-x-circle text-xl"></i>
        Reject Request
    </button>
    <button data-action="show-action-form" data-form-action="in_progress"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
        <i class="ph ph-gear-six text-xl"></i>
        Already in Progress
    </button>
    <button data-action="show-action-form" data-form-action="already_exists"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all md:col-span-2">
        <i class="ph ph-check-square text-xl"></i>
        Already Exists
    </button>
</div>
            </div>

            <!-- Action Form (Hidden by default) -->
            <div id="actionForm" class="hidden border-t pt-6">
                <h4 class="font-semibold text-lg text-slate-800 mb-4" id="actionFormTitle">Action Details</h4>
                <div class="space-y-4">
                    <div id="clarificationSection" class="hidden">
                        <label class="text-sm font-semibold text-slate-700 mb-2 block">Clarification Notes</label>
                        <textarea id="clarificationNotes" rows="3"
                            class="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-visionRed focus:outline-none"
                            placeholder="What clarification do you need from the staff member?"></textarea>
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
    const clarificationSection = document.getElementById('clarificationSection');
    const commentLabel = document.getElementById('commentLabel');

    if (!actionForm || !actionFormTitle || !commentLabel) return;

    const titles = {
        'clarification': 'Request Clarification',
        'approve': 'Approve Request',
        'reject': 'Reject Request',
        'in_progress': 'Mark as Already in Progress',
        'already_exists': 'Mark as Already Exists'
    };

    const commentLabels = {
        'clarification': 'Additional Comments (Optional)',
        'approve': 'Approval Comments (Optional)',
        'reject': 'Rejection Reason',
        'in_progress': 'Details about existing development',
        'already_exists': 'Details about existing solution'
    };

    actionFormTitle.textContent = titles[action];
    commentLabel.textContent = commentLabels[action];

    // Show clarification section only for clarification action
    if (clarificationSection) {
        if (action === 'clarification') {
            clarificationSection.classList.remove('hidden');
        } else {
            clarificationSection.classList.add('hidden');
        }
    }

    actionForm.classList.remove('hidden');
    
    const actionComment = document.getElementById('actionComment');
    const clarificationNotes = document.getElementById('clarificationNotes');
    if (actionComment) actionComment.value = '';
    if (clarificationNotes) clarificationNotes.value = '';
}

// Hide action form
function hideActionForm() {
    const actionForm = document.getElementById('actionForm');
    if (actionForm) actionForm.classList.add('hidden');
    currentAction = null;
}

// Submit action
async function submitAction() {
    const comment = document.getElementById('actionComment')?.value.trim();
    const clarificationNotes = document.getElementById('clarificationNotes')?.value.trim();

    // Validation
    if (currentAction === 'reject' && !comment) {
        alert('Please provide a reason for rejection');
        return;
    }
    if (currentAction === 'clarification' && !clarificationNotes && !comment) {
        alert('Please provide clarification notes or comments');
        return;
    }
    if ((currentAction === 'in_progress' || currentAction === 'already_exists') && !comment) {
        alert('Please provide details');
        return;
    }

    // Show loading state on submit button
    const submitBtn = document.querySelector('[data-action="submit-action"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    try {
        // Map action to approval_status
        // Note: in_progress and already_exists use 'Rejected' in DB
        // but we use boolean flags so staff sees the correct banner
        const statusMap = {
            'clarification': 'Clarification needed',
            'approve': 'Approved',
            'reject': 'Rejected',
            'in_progress': 'Rejected',
            'already_exists': 'Rejected'
        };

        const approvalStatus = statusMap[currentAction];

        // Build review data with all flags correctly set
        const reviewData = {
            approval_status: approvalStatus,
            comments: comment || '',
            clarification_notes: currentAction === 'clarification' ? (clarificationNotes || comment || '') : '',
            clarification_needed: currentAction === 'clarification',
            already_in_progress: currentAction === 'in_progress',
            already_exists: currentAction === 'already_exists',
            change_ms_change_request: currentRequest.id
        };

        console.log('Submitting review data:', reviewData);

        let hodReviewId = currentRequest.change_ms_hod_review?.id;

        if (hodReviewId) {
            // Update existing review
            await apiClient.updateHODReview(hodReviewId, reviewData);
        } else {
            // Create new review
            const newReview = await apiClient.createHODReview(reviewData);
            hodReviewId = newReview.review?.id;

            if (hodReviewId) {
                // Link the review to the change request
                await apiClient.updateChangeRequest(currentRequest.id, {
                    change_ms_hod_review: hodReviewId
                });
            }
        }

        // Update change request status
        let newStatus;
        if (currentAction === 'approve') {
            newStatus = 'Head of Tech Review'; // Changed from 'IT Review' to 'Head of Tech Review'
        } else if (currentAction === 'reject' || currentAction === 'in_progress' || currentAction === 'already_exists') {
            newStatus = 'Rejected';
        } else if (currentAction === 'clarification') {
            newStatus = 'Pending HOD approval';
        }

        await apiClient.updateChangeRequest(currentRequest.id, {
            request_status: newStatus
        });

        // Show user-friendly success message
        const successMessages = {
            'clarification': 'Clarification request sent to staff',
            'approve': 'Request approved and sent to Head of Technology for review',
            'reject': 'Request has been rejected',
            'in_progress': 'Staff notified that this is already in progress',
            'already_exists': 'Staff notified that this already exists'
        };

        showToast(successMessages[currentAction], 'success');
        closeModal();
        await loadRequests();

    } catch (error) {
        console.error('Failed to submit action:', error);
        showToast('Failed to submit review. Please try again.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
}
// Close modal
function closeModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.remove('active');
    currentRequest = null;
    currentAction = null;
}