/* global checkAuth, getCurrentUser, API, utils */
// Handover List Page Logic

let currentTab = 'pending';
let allHandovers = [];
let currentUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    currentUser = checkAuth();
    if (!currentUser) return;

    // Show navigation links based on role
    if (currentUser.role === 'hod') {
        const hodLink = document.getElementById('hodReviewLink');
        if (hodLink) hodLink.style.display = 'flex';
    }
    if (currentUser.role === 'it' || currentUser.role === 'admin') {
        const itLink = document.getElementById('itReviewLink');
        const devLink = document.getElementById('developmentLink');
        if (itLink) itLink.style.display = 'flex';
        if (devLink) devLink.style.display = 'flex';
    }
    if (currentUser.role === 'hod' || currentUser.role === 'it' || currentUser.role === 'admin') {
        const reportsLink = document.getElementById('reportsLink');
        if (reportsLink) reportsLink.style.display = 'flex';
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load data
    loadHandovers();
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
            location.reload();
            break;
        case 'switch-tab':
            switchTab(target.dataset.tab);
            break;
        case 'view-handover':
            viewHandover(target.dataset.handoverId);
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

// Load handovers
function loadHandovers() {
    allHandovers = API.getAllHandovers();
    updateStatistics();
    displayHandovers();
}

// Update statistics
function updateStatistics() {
    const pendingMy = allHandovers.filter(h => {
        return h.signatures.some(sig => 
            sig.assignedTo === currentUser.fullName && 
            sig.status === 'pending' && 
            sig.stage === 'active'
        );
    }).length;

    const inProgress = allHandovers.filter(h => h.status === 'in-progress').length;
    const completed = allHandovers.filter(h => h.status === 'completed').length;

    document.getElementById('pendingMySignatureCount').textContent = pendingMy;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
}

// Switch tab
function switchTab(tab) {
    currentTab = tab;

    // Update tab styling
    document.querySelectorAll('.tab').forEach(tabEl => {
        tabEl.classList.remove('text-visionRed', 'border-b-2', 'border-visionRed');
        tabEl.classList.add('text-gray-500', 'hover:text-gray-700');
    });

    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-visionRed', 'border-b-2', 'border-visionRed');
    }

    displayHandovers();
}

// Display handovers
function displayHandovers() {
    let handoversToShow = [...allHandovers];

    // Filter by tab
    if (currentTab === 'pending') {
        handoversToShow = handoversToShow.filter(h => {
            return h.signatures.some(sig => 
                sig.assignedTo === currentUser.fullName && 
                sig.status === 'pending' && 
                sig.stage === 'active'
            );
        });
    } else if (currentTab === 'in-progress') {
        handoversToShow = handoversToShow.filter(h => h.status === 'in-progress');
    } else if (currentTab === 'completed') {
        handoversToShow = handoversToShow.filter(h => h.status === 'completed');
    }

    const container = document.getElementById('handoversList');

    if (handoversToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-file-text"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No handovers found</h3>
                <p class="text-gray-500">Handover documents will appear here when available</p>
            </div>
        `;
        return;
    }

    container.innerHTML = handoversToShow.map(handover => {
        const statusClass = handover.status === 'completed' ? 'bg-green-100 text-green-700' :
            handover.status === 'rejected' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700';

        // Find user's signature
        const mySignature = handover.signatures.find(sig => sig.assignedTo === currentUser.fullName);
        const myRole = mySignature ? mySignature.role : 'N/A';
        const myStatus = mySignature ? mySignature.status : 'N/A';

        // Count signatures
        const totalSignatures = handover.signatures.length;
        const completedSignatures = handover.signatures.filter(s => s.status === 'approved' || s.status === 'approved-with-conditions').length;

        return `
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-visionRed transition-all">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="font-bold text-gray-800 text-lg">${handover.projectTitle}</h4>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                                ${handover.status === 'in-progress' ? 'In Progress' : handover.status === 'completed' ? 'Completed' : 'Rejected'}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 mb-2">${handover.id} • ${handover.projectId}</p>
                        <p class="text-gray-700 mb-3">Department: ${handover.projectDepartment}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <i class="ph ph-user"></i>
                    <span>Initiated by <strong>${handover.initiatedBy}</strong> on ${utils.formatDate(handover.initiatedDate)}</span>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">Progress: ${completedSignatures}/${totalSignatures} signatures</span>
                        ${mySignature ? `
                            <span class="text-sm text-gray-600">
                                Your role: <strong>${myRole}</strong> - 
                                ${myStatus === 'pending' ? '<span class="text-amber-600">Pending</span>' : 
                                  myStatus === 'approved' ? '<span class="text-green-600">Approved</span>' : 
                                  '<span class="text-red-600">Rejected</span>'}
                            </span>
                        ` : ''}
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-visionRed h-2 rounded-full transition-all" style="width: ${(completedSignatures / totalSignatures) * 100}%"></div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button data-action="view-handover" data-handover-id="${handover.id}"
                        class="px-4 py-2 bg-visionRed hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                        <i class="ph ph-eye"></i> ${mySignature && mySignature.status === 'pending' && mySignature.stage === 'active' ? 'Review & Sign' : 'View Details'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// View handover
function viewHandover(handoverId) {
    window.location.href = `handover-detail.html?id=${handoverId}`;
}
