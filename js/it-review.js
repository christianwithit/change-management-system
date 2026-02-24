/* global checkAuth, API, utils */
// IT Review Page Logic

let currentStage = 'review';
let currentReviewRequest = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user has access to IT Review (IT, Admin, or Head of Tech)
    if (user.role !== 'it' && user.role !== 'admin' && user.role !== 'headoftech') {
        alert('Access denied. This page is only for IT personnel, Head of Technology, and Administrators.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Show navigation links based on role
    if (user.role === 'hod') {
        const hodLink = document.getElementById('hodReviewLink');
        if (hodLink) hodLink.style.display = 'flex';
    }
    if (user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const devLink = document.getElementById('developmentLink');
        if (devLink) devLink.style.display = 'flex';
    }
    if (user.role === 'hod' || user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const reportsLink = document.getElementById('reportsLink');
        if (reportsLink) reportsLink.style.display = 'flex';
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    loadITRequests();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);
    
    // IT Decision change handler
    const itDecision = document.getElementById('itDecision');
    if (itDecision) {
        itDecision.addEventListener('change', function() {
            const methodologySection = document.getElementById('methodologySection');
            if (this.value === 'Accepted') {
                methodologySection.classList.remove('hidden');
            } else {
                methodologySection.classList.add('hidden');
            }
        });
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
        case 'refresh':
            location.reload();
            break;
        case 'switch-stage':
            switchStage(target.dataset.stage);
            break;
        case 'view-request-detail':
            viewRequestDetail(target.dataset.requestId);
            break;
        case 'open-it-review-modal':
            openITReviewModal(target.dataset.requestId);
            break;
        case 'close-modal':
            closeModal(target.dataset.modal);
            break;
        case 'submit-it-review':
            submitITReview();
            break;
        case 'mark-completed':
            markAsCompleted(target.dataset.requestId);
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

// Load IT requests
function loadITRequests() {
    const allRequests = API.getRequests();

    const reviewRequests = allRequests.filter(r => r.status === 'IT Review');
    const progressRequests = allRequests.filter(r => r.itStatus === 'In Progress');
    const completedRequests = allRequests.filter(r => r.status === 'Completed');

    document.getElementById('reviewCount').textContent = reviewRequests.length;
    document.getElementById('progressCount').textContent = progressRequests.length;
    document.getElementById('completedCount').textContent = completedRequests.length;

    displayRequests(currentStage);
}

// Switch stage
function switchStage(stage) {
    currentStage = stage;

    // Update tab styling
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('text-visionRed', 'border-b-2', 'border-visionRed');
        tab.classList.add('text-gray-500', 'hover:text-gray-700');
    });

    const activeTab = document.querySelector(`[data-stage="${stage}"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-visionRed', 'border-b-2', 'border-visionRed');
    }

    displayRequests(stage);
}

// Display requests
function displayRequests(stage) {
    const allRequests = API.getRequests();
    let requests = [];

    if (stage === 'review') {
        requests = allRequests.filter(r => r.status === 'IT Review');
    } else if (stage === 'progress') {
        requests = allRequests.filter(r => r.itStatus === 'In Progress');
    } else if (stage === 'completed') {
        requests = allRequests.filter(r => r.status === 'Completed');
    }

    const container = document.getElementById('requestsList');

    if (requests.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-clipboard-text"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No requests in this stage</h3>
                <p class="text-gray-500">Requests will appear here when they reach this stage</p>
            </div>
        `;
        return;
    }

    container.innerHTML = requests.map(request => {
        const priorityClass = request.priority === 'High' ? 'bg-red-100 text-red-700' :
            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700';

        return `
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-visionRed transition-all">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800 text-lg mb-1">${request.title}</h4>
                        <p class="text-sm text-gray-500 mb-2">${request.id} • ${request.type}</p>
                        <p class="text-gray-700">${request.description}</p>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityClass}">
                        ${request.priority}
                    </span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <i class="ph ph-building"></i>
                    <span><strong>${request.department}</strong> • ${request.requestor} • ${utils.formatDate(request.dateSubmitted)}</span>
                </div>
                <div class="flex gap-2">
                    <button data-action="view-request-detail" data-request-id="${request.id}"
                            class="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-all border border-gray-300">
                        View Details
                    </button>
                    ${stage === 'review' ? `
                        <button data-action="open-it-review-modal" data-request-id="${request.id}"
                                class="px-4 py-2 bg-visionRed hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                            Review & Define Methodology
                        </button>
                    ` : ''}
                    ${stage === 'progress' ? `
                        <button data-action="mark-completed" data-request-id="${request.id}"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                            Mark as Completed
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Open IT review modal
function openITReviewModal(requestId) {
    currentReviewRequest = API.getRequest(requestId);

    const modalInfo = document.getElementById('modalRequestInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Request ID: <strong class="text-gray-800">${currentReviewRequest.id}</strong></p>
            <p class="font-bold text-gray-800">${currentReviewRequest.title}</p>
        </div>
    `;

    const modal = document.getElementById('itReviewModal');
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

// Submit IT review
function submitITReview() {
    if (!currentReviewRequest) return;

    const decision = document.getElementById('itDecision').value;
    const methodology = document.getElementById('methodology').value;
    const deliverables = document.getElementById('deliverables').value;
    const estimatedTime = document.getElementById('estimatedTime').value;
    const estimatedCost = document.getElementById('estimatedCost').value;
    const risks = document.getElementById('risks').value;
    const comments = document.getElementById('itComments').value;

    if (!decision) {
        utils.showAlert('Please select an IT decision', 'warning');
        return;
    }

    if (decision === 'Accepted' && (!methodology || !deliverables)) {
        utils.showAlert('Please provide methodology and deliverables for accepted requests', 'warning');
        return;
    }

    const updates = {
        itDecision: decision,
        itComments: comments
    };

    if (decision === 'Accepted') {
        updates.itStatus = 'In Progress';
        updates.status = 'Approved';
        updates.methodology = methodology;
        updates.deliverables = deliverables;
        updates.estimatedTime = estimatedTime;
        updates.estimatedCost = estimatedCost;
        updates.risks = risks;
    } else if (decision === 'Rejected') {
        updates.status = 'Rejected';
        updates.itStatus = 'Rejected';
    } else if (decision === 'Deferred') {
        updates.status = 'Deferred';
        updates.itStatus = 'Deferred';
    }

    API.updateRequest(currentReviewRequest.id, updates);

    utils.showAlert('IT review submitted successfully!', 'success');
    closeModal('itReviewModal');

    // Clear form
    document.getElementById('itDecision').value = '';
    document.getElementById('methodology').value = '';
    document.getElementById('deliverables').value = '';
    document.getElementById('estimatedTime').value = '';
    document.getElementById('estimatedCost').value = '';
    document.getElementById('risks').value = '';
    document.getElementById('itComments').value = '';

    setTimeout(() => loadITRequests(), 500);
}

// Mark as completed
function markAsCompleted(requestId) {
    if (confirm('Mark this request as completed?')) {
        API.updateRequest(requestId, {
            status: 'Completed',
            itStatus: 'Completed'
        });

        utils.showAlert('Request marked as completed!', 'success');
        setTimeout(() => loadITRequests(), 500);
    }
}

// View request detail
function viewRequestDetail(id) {
    window.location.href = `request-detail.html?id=${id}`;
}
