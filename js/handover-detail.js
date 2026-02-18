/* global checkAuth, getCurrentUser, API, utils */
// Handover Detail Page Logic

let currentUser = null;
let handover = null;
let mySignature = null;

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

    // Load handover
    loadHandover();
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
        case 'approve-handover':
            approveHandover();
            break;
        case 'reject-handover':
            rejectHandover();
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

// Load handover
function loadHandover() {
    const urlParams = new URLSearchParams(window.location.search);
    const handoverId = urlParams.get('id');

    if (!handoverId) {
        utils.showAlert('No handover ID provided', 'error');
        setTimeout(() => window.location.href = 'handover.html', 1000);
        return;
    }

    handover = API.getHandover(handoverId);

    if (!handover) {
        utils.showAlert('Handover not found', 'error');
        setTimeout(() => window.location.href = 'handover.html', 1000);
        return;
    }

    // Find user's signature
    mySignature = handover.signatures.find(sig => sig.assignedTo === currentUser.fullName);

    // Update subtitle
    document.getElementById('handoverSubtitle').textContent = `${handover.id} • ${handover.projectTitle}`;

    // Render document
    renderDocument();
}

// Render document
function renderDocument() {
    const container = document.getElementById('documentContent');

    // Memo Header
    let html = `
        <div class="border-b-4 border-visionRed pb-6 mb-6">
            <div class="flex items-center gap-4 mb-4">
                <img src="../images/vision-group-logo.png" alt="Vision Group" class="h-16">
                <div>
                    <h1 class="text-2xl font-bold text-visionBlack">VISION GROUP</h1>
                    <p class="text-sm text-gray-600 uppercase tracking-wider">Internal Memo - System Handover Report</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
                <span class="font-semibold text-gray-700">TO:</span>
                <span class="text-gray-900">Head of Technology</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">FROM:</span>
                <span class="text-gray-900">${handover.initiatedBy}</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">DATE:</span>
                <span class="text-gray-900">${utils.formatDate(handover.initiatedDate)}</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">SUBJECT:</span>
                <span class="text-gray-900">${handover.projectTitle} Handover Report</span>
            </div>
        </div>

        <!-- System Overview -->
        <div class="mb-6">
            <h3 class="text-lg font-bold text-visionBlack mb-3 flex items-center gap-2">
                <i class="ph ph-info text-visionRed"></i>
                System Overview
            </h3>
            <div class="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div><span class="font-semibold">Project ID:</span> ${handover.projectId}</div>
                <div><span class="font-semibold">Project Title:</span> ${handover.projectTitle}</div>
                <div><span class="font-semibold">Department:</span> ${handover.projectDepartment}</div>
                ${handover.systemSpecs.serverEnvironment ? `<div><span class="font-semibold">Server:</span> ${handover.systemSpecs.serverEnvironment}</div>` : ''}
                ${handover.systemSpecs.publicURL ? `<div><span class="font-semibold">URL:</span> <a href="${handover.systemSpecs.publicURL}" target="_blank" class="text-visionRed hover:underline">${handover.systemSpecs.publicURL}</a></div>` : ''}
                ${handover.systemSpecs.sslStatus ? `<div><span class="font-semibold">SSL:</span> ${handover.systemSpecs.sslStatus === 'Enabled' ? '✓' : '✗'} ${handover.systemSpecs.sslStatus}</div>` : ''}
                ${handover.systemSpecs.databaseLocation ? `<div><span class="font-semibold">Database:</span> ${handover.systemSpecs.databaseLocation}</div>` : ''}
                ${handover.systemSpecs.backupStrategy ? `<div><span class="font-semibold">Backup:</span> ${handover.systemSpecs.backupStrategy}</div>` : ''}
            </div>
        </div>

        <!-- Sign-off Progress -->
        <div class="mb-6">
            <h3 class="text-lg font-bold text-visionBlack mb-3 flex items-center gap-2">
                <i class="ph ph-check-square text-visionRed"></i>
                Sign-off Progress
            </h3>
            <div class="space-y-3">
    `;

    // Render each signature
    handover.signatures.forEach((sig, index) => {
        const isCompleted = sig.status === 'approved' || sig.status === 'approved-with-conditions';
        const isRejected = sig.status === 'rejected';
        const isPending = sig.status === 'pending';
        const isLocked = sig.stage === 'locked';
        const isActive = sig.stage === 'active';

        let statusIcon, statusColor, statusText;
        
        if (isCompleted) {
            statusIcon = 'ph-check-circle';
            statusColor = 'text-green-600';
            statusText = `Signed ${utils.formatDate(sig.signedDate)}`;
        } else if (isRejected) {
            statusIcon = 'ph-x-circle';
            statusColor = 'text-red-600';
            statusText = `Rejected ${utils.formatDate(sig.signedDate)}`;
        } else if (isLocked) {
            statusIcon = 'ph-lock';
            statusColor = 'text-gray-400';
            statusText = 'Locked';
        } else if (isActive) {
            statusIcon = 'ph-hourglass-high';
            statusColor = 'text-amber-600';
            statusText = 'Pending';
        }

        html += `
            <div class="flex items-center gap-3 p-3 rounded-lg ${isCompleted ? 'bg-green-50' : isRejected ? 'bg-red-50' : isActive ? 'bg-amber-50' : 'bg-gray-50'}">
                <i class="ph ${statusIcon} text-2xl ${statusColor}"></i>
                <div class="flex-1">
                    <div class="font-semibold text-gray-800">${sig.role}</div>
                    <div class="text-sm text-gray-600">${sig.assignedTo}</div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-medium ${statusColor}">${statusText}</div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // My Sign-off Card (if pending and active)
    if (mySignature && mySignature.status === 'pending' && mySignature.stage === 'active') {
        html += renderSignoffCard();
    }

    // All Signatures (Audit Trail)
    html += `
        <div class="mb-6">
            <h3 class="text-lg font-bold text-visionBlack mb-3 flex items-center gap-2">
                <i class="ph ph-clipboard-text text-visionRed"></i>
                Signature Details
            </h3>
            <div class="space-y-4">
    `;

    handover.signatures.forEach(sig => {
        if (sig.status === 'approved' || sig.status === 'approved-with-conditions' || sig.status === 'rejected') {
            html += `
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <div class="font-semibold text-gray-800">${sig.role}</div>
                            <div class="text-sm text-gray-600">${sig.signedBy}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-medium ${sig.status === 'rejected' ? 'text-red-600' : 'text-green-600'}">
                                ${sig.status === 'rejected' ? 'Rejected' : 'Approved'}
                            </div>
                            <div class="text-xs text-gray-500">${utils.formatDate(sig.signedDate)}</div>
                            <div class="text-xs text-gray-400">IP: ${sig.ipAddress}</div>
                        </div>
                    </div>
                    ${sig.comments ? `
                        <div class="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <strong>Comments:</strong> ${sig.comments}
                        </div>
                    ` : ''}
                    ${sig.status === 'rejected' && sig.rejectionReason ? `
                        <div class="mt-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                            <strong>Rejection Reason:</strong> ${sig.rejectionReason}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Render sign-off card
function renderSignoffCard() {
    const checklists = {
        'Project Manager': [
            { id: 'system_functional', label: 'System is fully functional for intended users?' },
            { id: 'documentation_received', label: 'Documentation and source code received?' },
            { id: 'roadmap_confirmed', label: 'Project roadmap and future enhancements confirmed?' }
        ],
        'Information Security': [
            { id: 'security_audit_passed', label: 'Security audit completed and passed?' },
            { id: 'ssl_approved', label: 'SSL/HTTPS and access controls approved?' },
            { id: 'data_protection', label: 'Data protection measures in place?' },
            { id: 'backup_confirmed', label: 'Backup and recovery strategy confirmed?' }
        ],
        'Head of Technology': [
            { id: 'infrastructure_acknowledged', label: 'Hosting and infrastructure acknowledged?' },
            { id: 'maintenance_accepted', label: 'Maintenance responsibility and SLA accepted?' },
            { id: 'integration_confirmed', label: 'Integration with existing systems confirmed?' }
        ],
        'End User (HR)': [
            { id: 'training_confirmed', label: 'Training on system completed and satisfactory?' },
            { id: 'workflow_understood', label: 'Workflow changes understood and approved?' },
            { id: 'operational_responsibility', label: 'Operational responsibility accepted?' }
        ],
        'End User (HOD)': [
            { id: 'requirements_met', label: 'System meets original requirements?' },
            { id: 'staff_trained', label: 'Staff training completed?' },
            { id: 'ready_to_use', label: 'Ready to use in daily operations?' }
        ]
    };

    const checklist = checklists[mySignature.role] || [];

    return `
        <div class="border-4 border-visionRed rounded-lg p-6 mb-6 bg-red-50">
            <h3 class="text-xl font-bold text-visionBlack mb-4 flex items-center gap-2">
                <i class="ph ph-pencil-line text-visionRed"></i>
                Your Sign-off Required
            </h3>
            
            <div class="bg-white p-4 rounded-lg mb-4">
                <div class="flex items-center gap-3 mb-4">
                    <i class="ph ph-identification-card text-3xl text-visionRed"></i>
                    <div>
                        <div class="font-bold text-gray-800">${mySignature.role}</div>
                        <div class="text-sm text-gray-600">${mySignature.assignedTo}</div>
                    </div>
                </div>

                <div class="space-y-3 mb-4">
                    <h4 class="font-semibold text-gray-800">Checklist:</h4>
                    ${checklist.map(item => `
                        <label class="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" id="${item.id}" 
                                class="mt-1 w-5 h-5 text-visionRed border-gray-300 rounded focus:ring-visionRed">
                            <span class="text-sm text-gray-700">${item.label}</span>
                        </label>
                    `).join('')}
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Comments (Optional)</label>
                    <textarea id="signoffComments" rows="3"
                        placeholder="Add any comments or recommendations..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-visionRed focus:outline-none"></textarea>
                </div>

                <div class="flex gap-3">
                    <button data-action="reject-handover"
                        class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <i class="ph ph-x-circle"></i> Reject
                    </button>
                    <button data-action="approve-handover"
                        class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <i class="ph ph-check-circle"></i> Approve & Sign
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Approve handover
function approveHandover() {
    // Get checklist responses
    const checklistResponses = {};
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let allChecked = true;

    checkboxes.forEach(checkbox => {
        checklistResponses[checkbox.id] = checkbox.checked;
        if (!checkbox.checked) allChecked = false;
    });

    if (!allChecked) {
        utils.showAlert('Please check all items in the checklist', 'warning');
        return;
    }

    const comments = document.getElementById('signoffComments').value.trim();

    if (!confirm('Are you sure you want to approve and sign this handover?')) {
        return;
    }

    // Update signature
    const updatedHandover = API.updateHandoverSignature(handover.id, mySignature.sequence, {
        status: 'approved',
        signedBy: currentUser.fullName,
        checklistResponses: checklistResponses,
        comments: comments || null,
        conditions: []
    });

    if (updatedHandover) {
        utils.showAlert('Handover approved and signed successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'handover.html';
        }, 1500);
    } else {
        utils.showAlert('Failed to sign handover', 'error');
    }
}

// Reject handover
function rejectHandover() {
    const reason = prompt('Please provide a reason for rejection:');
    
    if (!reason || reason.trim() === '') {
        utils.showAlert('Rejection reason is required', 'warning');
        return;
    }

    if (!confirm('Are you sure you want to reject this handover? The project will be sent back to development.')) {
        return;
    }

    const comments = document.getElementById('signoffComments').value.trim();

    // Update signature
    const updatedHandover = API.updateHandoverSignature(handover.id, mySignature.sequence, {
        status: 'rejected',
        signedBy: currentUser.fullName,
        rejectionReason: reason,
        rejectionCategory: 'Technical',
        comments: comments || null
    });

    if (updatedHandover) {
        utils.showAlert('Handover rejected. Project sent back to development.', 'success');
        setTimeout(() => {
            window.location.href = 'handover.html';
        }, 1500);
    } else {
        utils.showAlert('Failed to reject handover', 'error');
    }
}
