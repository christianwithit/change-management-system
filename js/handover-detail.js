/* global checkAuth, getCurrentUser, API, utils */
// Handover Detail Page Logic

let currentUser = null;
let handover = null;
let mySignature = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    currentUser = checkAuth();
    if (!currentUser) return;

    // Check if user can access handovers
    if (window.canAccessHandovers && !window.canAccessHandovers(currentUser)) {
        alert('You do not have permission to access this page.');
        window.location.href = 'dashboard.html';
        return;
    }

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
    // Show handover link (user already has access if they got here)
    const handoverLink = document.getElementById('handoverLink');
    if (handoverLink) handoverLink.style.display = 'flex';

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
    const project = API.getRequest(handover.projectId);

    // Memo Header
    let html = `
        <div class="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h1 class="text-2xl font-bold tracking-wide text-gray-900 uppercase">Vision Group</h1>
            <h2 class="text-xl font-bold tracking-wide text-gray-800 uppercase mt-1">Internal Memo</h2>
        </div>

        <div class="grid grid-cols-[120px_1fr] gap-y-4 text-sm mb-8">
            <div class="font-bold text-gray-900 uppercase">To:</div>
            <div class="text-gray-800">Head of Technology</div>
            <div class="font-bold text-gray-900 uppercase">From:</div>
            <div class="text-gray-800">${handover.initiatedBy}</div>
            <div class="font-bold text-gray-900 uppercase">Prepared By:</div>
            <div class="text-gray-800">${handover.initiatedBy}</div>
            <div class="font-bold text-gray-900 uppercase">Date:</div>
            <div class="text-gray-800">${utils.formatDate(handover.initiatedDate)}</div>
            <div class="font-bold text-gray-900 uppercase mt-4">Subject:</div>
            <div class="text-gray-900 font-bold mt-4 text-lg">${handover.projectTitle} - Handover Report</div>
        </div>

        <!-- 1. Overview -->
        <section class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3">1. Overview</h3>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">${handover.systemSpecs.overview || project?.description || 'System overview and description.'}</p>
        </section>

        <!-- 2. Purpose of the System -->
        <section class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3">2. Purpose of the System</h3>
            <ol class="list-decimal list-outside ml-5 space-y-1 text-gray-700">
                ${(handover.systemSpecs.purpose || [
                    'Provide a centralized system for ' + handover.projectDepartment,
                    'Improve operational efficiency and reduce manual processes',
                    'Enable better data management and reporting',
                    'Facilitate collaboration and workflow automation'
                ]).map(item => `<li class="pl-1">${item}</li>`).join('')}
            </ol>
        </section>

        <!-- 3. Hosting and Access Details -->
        <section class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3">3. Hosting and Access Details</h3>
            <div class="border border-gray-300 rounded-sm overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-900 font-bold border-b border-gray-300">
                        <tr>
                            <th class="p-3 w-1/3 border-r border-gray-300">Environment</th>
                            <th class="p-3">Description</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300">
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">Server</td>
                            <td class="p-3">${handover.systemSpecs.serverEnvironment || 'VPS - Vision Group Infrastructure'}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">Public Access</td>
                            <td class="p-3">${handover.systemSpecs.publicURL ? `<a href="${handover.systemSpecs.publicURL}" target="_blank" class="text-blue-600 underline">${handover.systemSpecs.publicURL}</a>` : 'Internal access only'}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">Intranet Access</td>
                            <td class="p-3">${handover.systemSpecs.intranetAccess || 'Restricted access with authentication'}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">SSL/HTTPS</td>
                            <td class="p-3">${handover.systemSpecs.sslStatus || 'Enabled'}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">Database</td>
                            <td class="p-3">${handover.systemSpecs.databaseLocation || 'Hosted on same server instance'}</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-medium border-r border-gray-300">Backup</td>
                            <td class="p-3">${handover.systemSpecs.backupStrategy || 'Managed by IT; scheduled incremental backups'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 4. System Users and Access Rights -->
        <section class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3">4. System Users and Access Rights</h3>
            <div class="border border-gray-300 rounded-sm overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-900 font-bold border-b border-gray-300">
                        <tr>
                            <th class="p-3 w-1/4 border-r border-gray-300">Role</th>
                            <th class="p-3 w-1/3 border-r border-gray-300">Description</th>
                            <th class="p-3">Access Level</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300">
                        ${(handover.systemSpecs.systemUsers || [
                            { role: 'End User', description: 'Department staff members', accessLevel: 'View and submit data, generate reports' },
                            { role: 'Department Admin', description: 'Department administrators', accessLevel: 'Manage users, configure settings, full access to department data' },
                            { role: 'IT Support', description: 'IT team managing backend', accessLevel: 'System administration, maintenance, monitoring' }
                        ]).map(u => `
                            <tr>
                                <td class="p-3 font-medium border-r border-gray-300">${u.role}</td>
                                <td class="p-3 border-r border-gray-300">${u.description}</td>
                                <td class="p-3">${u.accessLevel}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 5. Current Status -->
        <section class="mb-8">
            <h3 class="font-bold text-gray-900 mb-3">5. Current Status</h3>
            <div class="border border-gray-300 rounded-sm overflow-hidden">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-900 font-bold border-b border-gray-300">
                        <tr>
                            <th class="p-3 w-1/4 border-r border-gray-300">Component</th>
                            <th class="p-3 w-1/4 border-r border-gray-300">Status</th>
                            <th class="p-3">Remarks</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300">
                        ${(handover.systemSpecs.currentStatus || [
                            { component: 'System Core', status: 'Functional', remarks: 'All core features operational' },
                            { component: 'User Interface', status: 'Functional', remarks: 'Responsive and accessible' },
                            { component: 'Documentation', status: 'Completed', remarks: 'User guides and technical docs provided' },
                            { component: 'Training', status: 'Completed', remarks: 'End user training conducted' },
                            { component: 'Testing', status: 'Completed', remarks: 'UAT completed successfully' },
                            { component: 'Deployment', status: 'Ready', remarks: 'System ready for production use' }
                        ]).map(item => `
                            <tr>
                                <td class="p-3 font-medium border-r border-gray-300">${item.component}</td>
                                <td class="p-3 border-r border-gray-300 flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full ${item.status === 'Functional' || item.status === 'Completed' ? 'bg-green-500' : item.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}"></span>
                                    ${item.status}
                                </td>
                                <td class="p-3">${item.remarks}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    // My Sign-off Card (if pending and active)
    if (mySignature && mySignature.status === 'pending' && mySignature.stage === 'active') {
        html += renderSignoffCard();
    }

    // Formal Sign-off Section
    html += `
        <section class="mt-12 pt-8 border-t-4 border-gray-900">
            <h3 class="font-bold text-xl text-gray-900 mb-6 uppercase tracking-wide">Formal Sign-off & Handover</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    `;

    // Render signature cards
    handover.signatures.forEach(sig => {
        html += renderSignatureCard(sig);
    });

    html += `
            </div>
        </section>
    `;

    container.innerHTML = html;
}

// Render signature card for formal sign-off section
function renderSignatureCard(sig) {
    const isCompleted = sig.status === 'approved' || sig.status === 'approved-with-conditions';
    const isRejected = sig.status === 'rejected';
    const isPending = sig.status === 'pending';
    const isLocked = sig.stage === 'locked';
    const isActive = sig.stage === 'active';

    const checklists = {
        'Project Developer': [
            { question: 'Do you confirm that the system has been developed and delivered according to the required specifications and is fully functional?', checked: isCompleted },
            { question: 'Have all relevant system documentation, access details, and source code been handed over to the designated technology team?', checked: isCompleted },
            { question: 'Do you confirm that key milestones and future enhancements have been communicated as part of the project roadmap?', checked: isCompleted }
        ],
        'Project Manager': [
            { question: 'Do you confirm that the system has been developed and delivered according to the required specifications and is fully functional for both internal and external users?', checked: isCompleted },
            { question: 'Have all relevant system documentation, access details, and source code (if applicable) been handed over to the designated technology team?', checked: isCompleted },
            { question: 'Do you confirm that the key upcoming milestones have been communicated as part of the future roadmap?', checked: isCompleted }
        ],
        'Information Security': [
            { question: 'Have you reviewed and approved the current security setup, including SSL/HTTPS enforcement and user access levels?', checked: isCompleted },
            { question: 'Do you acknowledge the access control model and confirm that it aligns with the organization\'s security standards?', checked: isCompleted },
            { question: 'Do you support the recommendation for regular security checks and scheduled backups as part of the system\'s ongoing maintenance plan?', checked: isCompleted }
        ],
        'Head of Technology': [
            { question: 'Do you acknowledge receipt and understanding of the system\'s technical overview, including its hosting and current access controls?', checked: isCompleted },
            { question: 'Do you accept the ongoing responsibility for system maintenance, monitoring, security, and overseeing planned integrations?', checked: isCompleted },
            { question: 'Do you confirm that the IT Support team will manage user accounts and system administration?', checked: isCompleted }
        ],
        'End User (HR)': [
            { question: 'Have you been trained on and do you understand how to use the system for your operational needs?', checked: isCompleted },
            { question: 'Do you acknowledge the system features and workflow changes introduced?', checked: isCompleted },
            { question: 'Do you accept operational responsibility for the system within your department?', checked: isCompleted }
        ],
        'End User (HOD)': [
            { question: 'Have you been trained on and do you understand how to use the system for departmental operations?', checked: isCompleted },
            { question: 'Do you confirm that the system meets the original requirements and expectations?', checked: isCompleted },
            { question: 'Do you accept operational responsibility for the system and its use within your department?', checked: isCompleted }
        ]
    };

    const checklist = checklists[sig.role] || [];
    
    let statusBadge = '';
    if (isCompleted) statusBadge = `<div class="flex items-center text-green-600"><i class="ph ph-check-circle text-xl mr-1"></i> Signed</div>`;
    else if (isRejected) statusBadge = `<div class="flex items-center text-red-600"><i class="ph ph-x-circle text-xl mr-1"></i> Rejected</div>`;
    else if (isLocked) statusBadge = `<div class="flex items-center text-gray-400"><i class="ph ph-lock text-xl mr-1"></i> Locked</div>`;
    else if (isActive) statusBadge = `<div class="flex items-center text-amber-600"><i class="ph ph-warning-circle text-xl mr-1"></i> Pending</div>`;

    let checklistHtml = checklist.map((item, idx) => `
        <div class="flex items-start gap-3">
            <input 
                type="checkbox" 
                class="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                ${item.checked ? 'checked' : ''}
                disabled
            />
            <span class="text-sm text-gray-700">${item.question}</span>
        </div>
    `).join('');

    return `
        <div class="border rounded-lg p-6 transition-all ${isCompleted ? 'bg-green-50 border-green-200' : isRejected ? 'bg-red-50 border-red-200' : isLocked ? 'bg-gray-50 border-gray-200 opacity-50' : 'bg-white border-gray-200'}">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-lg text-gray-900">${sig.role}</h3>
                    <p class="text-sm text-gray-500">${sig.assignedTo}</p>
                </div>
                ${statusBadge}
            </div>

            <div class="space-y-3 mb-6">
                ${checklistHtml}
            </div>

            ${(sig.comments && (isCompleted || isRejected)) ? `
                <div class="mb-4">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Comments</label>
                    <p class="text-sm text-gray-800 italic">${sig.comments}</p>
                </div>
            ` : ''}

            <div class="border-t pt-4 flex justify-between items-end">
                <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Signature</p>
                    ${isCompleted || isRejected ? 
                        `<div class="font-handwriting text-xl text-blue-900 mt-1">${sig.signedBy}</div>` :
                        `<div class="h-8 border-b border-dashed border-gray-300 w-48 mt-1"></div>`
                    }
                </div>
                <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                    <p class="text-sm font-medium mt-1">${sig.signedDate ? utils.formatDate(sig.signedDate) : 'DD/MM/YYYY'}</p>
                </div>
            </div>
        </div>
    `;
}

// Render sign-off card (for active user)
function renderSignoffCard() {
    const checklists = {
        'Project Developer': [
            { id: 'system_functional', label: 'Do you confirm that the system has been developed and delivered according to the required specifications and is fully functional?' },
            { id: 'documentation_received', label: 'Have all relevant system documentation, access details, and source code been handed over to the designated technology team?' },
            { id: 'roadmap_confirmed', label: 'Do you confirm that key milestones and future enhancements have been communicated as part of the project roadmap?' }
        ],
        'Project Manager': [
            { id: 'system_functional', label: 'Do you confirm that the system has been developed and delivered according to the required specifications and is fully functional for both internal and external users?' },
            { id: 'documentation_received', label: 'Have all relevant system documentation, access details, and source code (if applicable) been handed over to the designated technology team?' },
            { id: 'roadmap_confirmed', label: 'Do you confirm that the key upcoming milestones have been communicated as part of the future roadmap?' }
        ],
        'Information Security': [
            { id: 'security_audit_passed', label: 'Have you reviewed and approved the current security setup, including SSL/HTTPS enforcement and user access levels?' },
            { id: 'access_control_approved', label: 'Do you acknowledge the access control model and confirm that it aligns with the organization\'s security standards?' },
            { id: 'backup_confirmed', label: 'Do you support the recommendation for regular security checks and scheduled backups as part of the system\'s ongoing maintenance plan?' }
        ],
        'Head of Technology': [
            { id: 'infrastructure_acknowledged', label: 'Do you acknowledge receipt and understanding of the system\'s technical overview, including its hosting and current access controls?' },
            { id: 'maintenance_accepted', label: 'Do you accept the ongoing responsibility for system maintenance, monitoring, security, and overseeing planned integrations?' },
            { id: 'it_support_confirmed', label: 'Do you confirm that the IT Support team will manage user accounts and system administration?' }
        ],
        'End User (HR)': [
            { id: 'training_confirmed', label: 'Have you been trained on and do you understand how to use the system for your operational needs?' },
            { id: 'workflow_understood', label: 'Do you acknowledge the system features and workflow changes introduced?' },
            { id: 'operational_responsibility', label: 'Do you accept operational responsibility for the system within your department?' }
        ],
        'End User (HOD)': [
            { id: 'training_confirmed', label: 'Have you been trained on and do you understand how to use the system for departmental operations?' },
            { id: 'requirements_met', label: 'Do you confirm that the system meets the original requirements and expectations?' },
            { id: 'operational_responsibility', label: 'Do you accept operational responsibility for the system and its use within your department?' }
        ]
    };

    const checklist = checklists[mySignature.role] || [];

    return `
        <div class="border-4 border-visionRed rounded-lg p-6 mb-8 bg-red-50">
            <h3 class="text-xl font-bold text-visionBlack mb-4 flex items-center gap-2">
                <i class="ph ph-pencil-line text-visionRed"></i>
                Your Sign-off Required
            </h3>
            
            <div class="bg-white p-5 rounded-lg">
                <div class="flex items-center gap-3 mb-5">
                    <i class="ph ph-identification-card text-3xl text-visionRed"></i>
                    <div>
                        <div class="font-bold text-gray-800">${mySignature.role}</div>
                        <div class="text-sm text-gray-600">${mySignature.assignedTo}</div>
                    </div>
                </div>

                <div class="space-y-3 mb-5">
                    <h4 class="font-semibold text-gray-800">Please confirm the following:</h4>
                    ${checklist.map(item => `
                        <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                            <input type="checkbox" id="${item.id}" 
                                class="mt-1 w-5 h-5 text-visionRed border-gray-300 rounded focus:ring-visionRed checklist-item">
                            <span class="text-sm text-gray-700">${item.label}</span>
                        </label>
                    `).join('')}
                </div>

                <div class="mb-5">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Comments (Optional)</label>
                    <textarea id="signoffComments" rows="3"
                        placeholder="Add any comments, recommendations, or conditions..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-visionRed focus:ring-1 focus:ring-visionRed outline-none transition-all"></textarea>
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
    const checkboxes = document.querySelectorAll('.checklist-item');
    let allChecked = true;

    checkboxes.forEach(checkbox => {
        checklistResponses[checkbox.id] = checkbox.checked;
        if (!checkbox.checked) allChecked = false;
    });

    if (!allChecked) {
        utils.showAlert('Please check all items in the checklist before approving', 'warning');
        return;
    }

    const comments = document.getElementById('signoffComments').value.trim();

    if (!confirm('Are you sure you want to approve and sign this handover document? This action cannot be undone.')) {
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
