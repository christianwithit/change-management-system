/* global checkAuth, API, utils */
// Head of Technology Review Page Logic

let currentRequest = null;
let allRequests = [];
let itDevelopers = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user has access to Head of Tech Review (headoftech or admin only)
    if (user.role !== 'headoftech' && user.role !== 'admin') {
        alert('Access denied. This page is only for Head of Technology and Administrators.');
        window.location.href = 'dashboard.html';
        return;
    }

    if (user.role === 'hod' || user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const reportsLink = document.getElementById('reportsLink');
        if (reportsLink) reportsLink.style.display = 'flex';
    }

    if (user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const devLink = document.getElementById('developmentLink');
        const itReviewLink = document.getElementById('itReviewLink');
        if (devLink) devLink.style.display = 'flex';
        if (itReviewLink) itReviewLink.style.display = 'flex';
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    loadRequests();
    loadITDevelopers();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);
    
    // Tech Decision change handler
    const techDecision = document.getElementById('techDecision');
    if (techDecision) {
        techDecision.addEventListener('change', function() {
            const assignmentSection = document.getElementById('assignmentSection');
            if (this.value === 'Approved') {
                assignmentSection.classList.remove('hidden');
            } else {
                assignmentSection.classList.add('hidden');
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
        case 'open-review-modal':
            openReviewModal(target.dataset.requestId);
            break;
        case 'close-modal':
            closeModal();
            break;
        case 'submit-review':
            submitReview();
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

// Load IT developers
function loadITDevelopers() {
    // In production, this would fetch from API
    // For now, we'll use mock data
    itDevelopers = [
        { id: 'it1', name: 'Felix Ssembajjwe Bashabe', role: 'it' },
        { id: 'it2', name: 'Emmanuel Cliff Mughanwa', role: 'it' },
        { id: 'it3', name: 'IT Administrator', role: 'it' }
    ];
}

// Load requests
function loadRequests() {
    allRequests = API.getRequests();
    
    console.log('All requests loaded:', allRequests.length);
    
    // Filter requests that are in "Head of Tech Review" status
    allRequests = allRequests.filter(r => r.status === 'Head of Tech Review');
    
    console.log('Requests pending Head of Tech Review:', allRequests.length);
    console.log('Pending requests:', allRequests.map(r => ({ id: r.id, title: r.title, status: r.status })));

    updateStatistics();
    displayRequests();
}

// Update statistics
function updateStatistics() {
    const pending = allRequests.filter(r => !r.headOfTechReview || r.headOfTechReview.status === 'Pending').length;
    const assigned = allRequests.filter(r => r.headOfTechReview && r.headOfTechReview.status === 'Approved').length;
    const rejected = allRequests.filter(r => r.headOfTechReview && r.headOfTechReview.status === 'Rejected').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('assignedCount').textContent = assigned;
    document.getElementById('rejectedCount').textContent = rejected;
}

// Display requests
function displayRequests() {
    const container = document.getElementById('requestsList');

    if (allRequests.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-clipboard-text"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No requests pending review</h3>
                <p class="text-gray-500">Requests will appear here when approved by HOD</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allRequests.map(request => {
        const priorityClass = request.priority === 'High' ? 'bg-red-100 text-red-700' :
            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700';

        const reviewStatus = request.headOfTechReview ? request.headOfTechReview.status : 'Pending';
        const statusClass = reviewStatus === 'Approved' ? 'bg-green-100 text-green-700' :
            reviewStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
            'bg-amber-100 text-amber-700';

        const assignedDev = request.headOfTechReview ? request.headOfTechReview.assignedDeveloper : null;

        return `
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-visionRed transition-all">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="font-bold text-gray-800 text-lg">${request.title}</h4>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityClass}">
                                ${request.priority}
                            </span>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                                ${reviewStatus}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 mb-2">${request.id} • ${request.type}</p>
                        <p class="text-gray-700 mb-3">${request.description}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <i class="ph ph-building"></i>
                    <span><strong>${request.department}</strong> • ${request.requestor} • ${utils.formatDate(request.dateSubmitted)}</span>
                </div>

                ${request.hodComments ? `
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                    <p class="text-sm font-semibold text-blue-900 mb-1">HOD Comments:</p>
                    <p class="text-sm text-blue-800">${request.hodComments}</p>
                </div>
                ` : ''}

                ${assignedDev ? `
                <div class="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-4">
                    <p class="text-sm font-semibold text-green-900 mb-1">Assigned to:</p>
                    <p class="text-sm text-green-800">${assignedDev}</p>
                    ${request.headOfTechReview.technicalNotes ? `
                        <p class="text-sm text-green-800 mt-2"><strong>Notes:</strong> ${request.headOfTechReview.technicalNotes}</p>
                    ` : ''}
                </div>
                ` : ''}

                <div class="flex gap-2">
                    ${!request.headOfTechReview || request.headOfTechReview.status === 'Pending' ? `
                        <button data-action="open-review-modal" data-request-id="${request.id}"
                                class="px-4 py-2 bg-visionRed hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                            <i class="ph ph-user-gear"></i> Review & Assign
                        </button>
                    ` : `
                        <button data-action="open-review-modal" data-request-id="${request.id}"
                                class="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-all border border-gray-300">
                            <i class="ph ph-eye"></i> View Details
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// Open review modal
function openReviewModal(requestId) {
    currentRequest = allRequests.find(r => r.id === requestId);
    if (!currentRequest) return;

    const modalInfo = document.getElementById('modalRequestInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Request ID: <strong class="text-gray-800">${currentRequest.id}</strong></p>
            <p class="font-bold text-gray-800">${currentRequest.title}</p>
            <p class="text-sm text-gray-600 mt-2">
                Department: <strong>${currentRequest.department}</strong> • 
                Requestor: <strong>${currentRequest.requestor}</strong>
            </p>
        </div>
    `;

    // Populate developer dropdown
    const developerSelect = document.getElementById('assignedDeveloper');
    developerSelect.innerHTML = '<option value="">Select developer</option>';
    itDevelopers.forEach(dev => {
        const option = document.createElement('option');
        option.value = dev.name;
        option.textContent = dev.name;
        developerSelect.appendChild(option);
    });

    // Pre-fill if already reviewed
    if (currentRequest.headOfTechReview) {
        document.getElementById('techDecision').value = currentRequest.headOfTechReview.status;
        document.getElementById('techComments').value = currentRequest.headOfTechReview.comments || '';
        
        if (currentRequest.headOfTechReview.status === 'Approved') {
            document.getElementById('assignmentSection').classList.remove('hidden');
            document.getElementById('assignedDeveloper').value = currentRequest.headOfTechReview.assignedDeveloper || '';
            document.getElementById('technicalNotes').value = currentRequest.headOfTechReview.technicalNotes || '';
            document.getElementById('priorityLevel').value = currentRequest.headOfTechReview.priority || 'Medium';
        }
    } else {
        // Reset form
        document.getElementById('techDecision').value = '';
        document.getElementById('techComments').value = '';
        document.getElementById('assignedDeveloper').value = '';
        document.getElementById('technicalNotes').value = '';
        document.getElementById('priorityLevel').value = 'Medium';
        document.getElementById('assignmentSection').classList.add('hidden');
    }

    const modal = document.getElementById('reviewModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    currentRequest = null;
}

// Submit review
function submitReview() {
    if (!currentRequest) return;

    const decision = document.getElementById('techDecision').value;
    const comments = document.getElementById('techComments').value.trim();

    if (!decision) {
        utils.showAlert('Please select a decision', 'warning');
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const updates = {
        headOfTechReview: {
            reviewedBy: user.fullName,
            reviewDate: new Date().toISOString().split('T')[0],
            status: decision,
            comments: comments
        }
    };

    if (decision === 'Approved') {
        const assignedDeveloper = document.getElementById('assignedDeveloper').value;
        const technicalNotes = document.getElementById('technicalNotes').value.trim();
        const priority = document.getElementById('priorityLevel').value;

        if (!assignedDeveloper) {
            utils.showAlert('Please assign a developer', 'warning');
            return;
        }

        updates.headOfTechReview.assignedDeveloper = assignedDeveloper;
        updates.headOfTechReview.technicalNotes = technicalNotes;
        updates.headOfTechReview.priority = priority;
        updates.assignedDeveloper = assignedDeveloper;
        updates.assignedDate = new Date().toISOString().split('T')[0];
        updates.status = 'Development';
        updates.itDecision = 'Accepted'; // Mark as accepted for development
    } else if (decision === 'Rejected') {
        updates.status = 'Rejected';
    }

    API.updateRequest(currentRequest.id, updates);

    const message = decision === 'Approved' 
        ? `Request assigned to ${updates.headOfTechReview.assignedDeveloper}` 
        : 'Request rejected';
    
    utils.showAlert(message, 'success');
    closeModal();

    setTimeout(() => {
        loadRequests();
    }, 500);
}
