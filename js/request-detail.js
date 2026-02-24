/* global checkAuth, getCurrentUser, apiClient, showToast */
// Request Detail Page Logic

let currentRequest = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async function () {
    const user = checkAuth();
    if (!user) return;

    // Show navigation based on role
    if (user.role === 'hod') {
        const hodLink = document.getElementById('hodReviewLink');
        if (hodLink) hodLink.style.display = 'flex';
    }
    if (user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const itLink = document.getElementById('itReviewLink');
        if (itLink) itLink.style.display = 'flex';
    }
    if (user.role === 'hod' || user.role === 'it' || user.role === 'admin' || user.role === 'headoftech') {
        const reportsLink = document.getElementById('reportsLink');
        if (reportsLink) reportsLink.style.display = 'flex';
    }

    initializeEventListeners();

    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    if (requestId) {
        await loadRequestDetails(requestId);
    } else {
        showToast('Request ID not found', 'error');
        setTimeout(() => window.location.href = 'my-requests.html', 2000);
    }
});

function initializeEventListeners() {
    document.addEventListener('click', handleDocumentClick);
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.addEventListener('click', closeMobileSidebar);
}

function handleDocumentClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    switch(action) {
        case 'toggle-mobile-sidebar': toggleMobileSidebar(); break;
        case 'logout': handleLogout(); break;
        case 'print': window.print(); break;
        case 'back': history.back(); break;
        case 'switch-tab': switchTab(target.dataset.tab); break;
    }
}

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

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

async function loadRequestDetails(id) {
    try {
        const response = await apiClient.getChangeRequest(id);
        currentRequest = response;

        if (!currentRequest) {
            showToast('Request not found', 'error');
            setTimeout(() => window.location.href = 'my-requests.html', 2000);
            return;
        }

        console.log('Loaded request:', currentRequest);
        console.log('HOD Review:', currentRequest.change_ms_hod_review);

        displayRequestHeader();
        displayRequestDetails();
        displaySupportingDocuments();
        displayTimeline();
    } catch (error) {
        console.error('Failed to load request:', error);
        showToast('Failed to load request details', 'error');
        setTimeout(() => window.location.href = 'my-requests.html', 2000);
    }
}

function getStatusBanner() {
    const hodReview = currentRequest.change_ms_hod_review;
    const status = currentRequest.request_status;

    console.log('getStatusBanner - hodReview:', hodReview);
    console.log('getStatusBanner - status:', status);

    // 1. Clarification Needed - check FIRST before rejected
    if (hodReview?.clarification_needed === true) {
        const alreadyResponded = !!currentRequest.clarification_response;
        const question = hodReview.clarification_notes || hodReview.comments || 
                        'Your HOD needs more information about this request.';
        return `
            <div class="p-4 border-b border-amber-200 bg-amber-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-question text-xl text-amber-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-amber-900 mb-1">Clarification Required by HOD</h3>
                        <p class="text-amber-800 text-sm mb-3">${question}</p>
                        ${alreadyResponded ? `
                        <div class="bg-white border border-amber-200 rounded-lg p-3 mb-2">
                            <p class="text-xs font-bold text-amber-700 uppercase mb-1">Your Response:</p>
                            <p class="text-sm text-gray-700">${currentRequest.clarification_response}</p>
                        </div>
                        <p class="text-xs text-amber-700 flex items-center gap-1">
                            <i class="ph ph-check-circle"></i>
                            Response submitted. Awaiting HOD review.
                        </p>
                        ` : `
                        <div class="space-y-3">
                            <textarea id="clarificationResponse" rows="3"
                                class="w-full px-4 py-3 rounded-lg border border-amber-300 focus:border-amber-500 outline-none resize-none text-sm"
                                placeholder="Type your clarification here..."></textarea>
                            <button onclick="submitClarificationResponse()"
                                class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                                <i class="ph ph-paper-plane-tilt"></i> Submit Clarification
                            </button>
                        </div>
                        `}
                    </div>
                </div>
            </div>`;
    }

    // 2. Already in Progress - check BEFORE rejected
    if (hodReview?.already_in_progress === true) {
        return `
            <div class="p-4 border-b border-purple-200 bg-purple-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-gear-six text-xl text-purple-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-purple-900 mb-1">Already in Development</h3>
                        <p class="text-purple-800 text-sm">
                            Your HOD has indicated that this request is already being worked on. 
                            Thank you for your suggestion!
                        </p>
                        ${hodReview.comments ? `
                        <div class="mt-2 bg-white border border-purple-200 rounded-lg p-3">
                            <p class="text-xs font-bold text-purple-700 uppercase mb-1">HOD Comments:</p>
                            <p class="text-sm text-gray-700">${hodReview.comments}</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    }

    // 3. Already Exists - check BEFORE rejected
    if (hodReview?.already_exists === true) {
        return `
            <div class="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-check-square text-xl text-slate-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-900 mb-1">System Already Exists</h3>
                        <p class="text-slate-700 text-sm">
                            Your HOD has indicated that this system or feature already exists. 
                            Thank you for your suggestion!
                        </p>
                        ${hodReview.comments ? `
                        <div class="mt-2 bg-white border border-slate-200 rounded-lg p-3">
                            <p class="text-xs font-bold text-slate-700 uppercase mb-1">HOD Comments:</p>
                            <p class="text-sm text-gray-700">${hodReview.comments}</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    }

    // 4. Truly Rejected (not in_progress or already_exists)
    if (hodReview?.approval_status === 'Rejected') {
        return `
            <div class="p-4 border-b border-red-200 bg-red-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-x-circle text-xl text-red-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-red-900 mb-1">Request Not Approved</h3>
                        <p class="text-red-800 text-sm">
                            Your request could not be approved at this time.
                        </p>
                        ${hodReview?.comments ? `
                        <div class="mt-2 bg-white border border-red-200 rounded-lg p-3">
                            <p class="text-xs font-bold text-red-700 uppercase mb-1">HOD Comments:</p>
                            <p class="text-sm text-gray-700">${hodReview.comments}</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    }

    // 5. Approved / IT Review
    if (hodReview?.approval_status === 'Approved' || status === 'IT Review') {
        return `
            <div class="p-4 border-b border-blue-200 bg-blue-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-wrench text-xl text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-blue-900 mb-1">Approved - Under IT Review</h3>
                        <p class="text-blue-800 text-sm">
                            Your request has been approved by your HOD and is being reviewed by the IT team.
                        </p>
                        ${hodReview?.comments ? `
                        <div class="mt-2 bg-white border border-blue-200 rounded-lg p-3">
                            <p class="text-xs font-bold text-blue-700 uppercase mb-1">HOD Comments:</p>
                            <p class="text-sm text-gray-700">${hodReview.comments}</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    }

    // 6. In Development
    if (status === 'Development') {
        return `
            <div class="p-4 border-b border-purple-200 bg-purple-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-code text-xl text-purple-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-purple-900 mb-1">In Development</h3>
                        <p class="text-purple-800 text-sm">
                            Great news! The IT team has started working on your request.
                        </p>
                    </div>
                </div>
            </div>`;
    }

    // 7. Completed
    if (status === 'Completed') {
        return `
            <div class="p-4 border-b border-green-200 bg-green-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-check-circle text-xl text-green-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-green-900 mb-1">Request Completed!</h3>
                        <p class="text-green-800 text-sm">
                            Your change request has been successfully implemented.
                        </p>
                    </div>
                </div>
            </div>`;
    }

    // 8. Pending HOD Approval
    if (status === 'Pending HOD approval') {
        return `
            <div class="p-4 border-b border-orange-200 bg-orange-50 rounded-t-xl">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-hourglass-high text-xl text-orange-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-orange-900 mb-1">Pending HOD Approval</h3>
                        <p class="text-orange-800 text-sm">
                            Your request has been submitted and is awaiting review by your Head of Department.
                        </p>
                    </div>
                </div>
            </div>`;
    }

    return '';
}

function displayRequestHeader() {
    const header = document.getElementById('requestHeader');

    const hodReview = currentRequest.change_ms_hod_review;
    const status = currentRequest.request_status;

    // For staff display: hide "Rejected" if it's actually in_progress or already_exists
    let displayStatus = status;
    let statusClass = 'bg-orange-100 text-orange-700';

    if (status === 'Rejected' && (hodReview?.already_in_progress || hodReview?.already_exists)) {
        displayStatus = 'Closed';
        statusClass = 'bg-slate-100 text-slate-700';
    } else if (status === 'Rejected') {
        displayStatus = 'Not Approved';
        statusClass = 'bg-red-100 text-red-700';
    } else if (status === 'Completed') {
        statusClass = 'bg-green-100 text-green-700';
    } else if (status === 'Development') {
        statusClass = 'bg-purple-100 text-purple-700';
    } else if (status === 'IT Review') {
        statusClass = 'bg-blue-100 text-blue-700';
    }

    const priorityClass = currentRequest.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
        currentRequest.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
        'bg-blue-100 text-blue-700 border-blue-200';

    const departmentName = currentRequest.department?.department_name || 'N/A';
    const sectionName = currentRequest.change_ms_section?.section_name || 'N/A';
    const staffName = currentRequest.staff?.staff_name || 'N/A';

    const formattedDate = new Date(currentRequest.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    const statusBanner = getStatusBanner();

    header.innerHTML = `
        ${statusBanner}
        <div class="p-6">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${currentRequest.title}</h2>
                    <p class="text-gray-500 font-medium">ID: ${currentRequest.id}</p>
                </div>
                <div class="flex gap-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                        ${displayStatus}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityClass}">
                        ${currentRequest.priority}
                    </span>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Requestor</label>
                    <span class="text-gray-800 font-medium">${staffName}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Department</label>
                    <span class="text-gray-800 font-medium">${departmentName}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Section</label>
                    <span class="text-gray-800 font-medium">${sectionName}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Date Submitted</label>
                    <span class="text-gray-800 font-medium">${formattedDate}</span>
                </div>
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Type</label>
                    <span class="text-gray-800 font-medium">${currentRequest.change_type}</span>
                </div>
            </div>
        </div>`;
}

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
            <p class="text-gray-700 leading-relaxed">${currentRequest.expected_benefits}</p>
        </div>
        <div>
            <label class="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">Priority</label>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                currentRequest.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                currentRequest.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-blue-100 text-blue-700 border-blue-200'}">
                ${currentRequest.priority}
            </span>
        </div>`;
}

function displayTimeline() {
    const timeline = document.getElementById('timelineContent');
    const hodReview = currentRequest.change_ms_hod_review;
    const status = currentRequest.request_status;

    const events = [{
        date: currentRequest.createdAt,
        title: 'Request Submitted',
        description: `Submitted by ${currentRequest.staff?.staff_name || 'Staff'}`,
        icon: 'ph-paper-plane-tilt',
        color: 'blue'
    }];

    if (hodReview) {
        if (hodReview.approval_status === 'Clarification needed') {
            events.push({
                date: currentRequest.updatedAt,
                title: 'Clarification Requested',
                description: 'HOD has requested clarification',
                icon: 'ph-question',
                color: 'amber'
            });
            if (currentRequest.clarification_response) {
                events.push({
                    date: currentRequest.updatedAt,
                    title: 'Clarification Provided',
                    description: 'Staff has submitted clarification response',
                    icon: 'ph-chat-circle-text',
                    color: 'blue'
                });
            }
        } else if (hodReview.already_in_progress) {
            events.push({
                date: currentRequest.updatedAt,
                title: 'Already in Progress',
                description: 'HOD noted this is already being developed',
                icon: 'ph-gear-six',
                color: 'purple'
            });
        } else if (hodReview.already_exists) {
            events.push({
                date: currentRequest.updatedAt,
                title: 'Already Exists',
                description: 'HOD noted this system/feature already exists',
                icon: 'ph-check-square',
                color: 'slate'
            });
        } else if (hodReview.approval_status === 'Approved') {
            events.push({
                date: currentRequest.updatedAt,
                title: 'Approved by HOD',
                description: 'Request approved and forwarded to IT',
                icon: 'ph-check-circle',
                color: 'green'
            });
        } else if (hodReview.approval_status === 'Rejected') {
            events.push({
                date: currentRequest.updatedAt,
                title: 'Not Approved',
                description: hodReview.comments || 'Request could not be approved',
                icon: 'ph-x-circle',
                color: 'red'
            });
        }
    }

    if (status === 'IT Review') {
        events.push({
            date: currentRequest.updatedAt,
            title: 'IT Review',
            description: 'Technical review and feasibility assessment',
            icon: 'ph-wrench',
            color: 'blue'
        });
    }

    if (status === 'Development') {
        events.push({
            date: currentRequest.updatedAt,
            title: 'Development Started',
            description: 'IT team has started working on this request',
            icon: 'ph-code',
            color: 'purple'
        });
    }

    if (status === 'Completed') {
        events.push({
            date: currentRequest.updatedAt,
            title: 'Request Completed',
            description: 'Change has been implemented and delivered',
            icon: 'ph-check-circle',
            color: 'green'
        });
    }

    timeline.innerHTML = events.map((event, index) => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        return `
            <div class="flex gap-4">
                <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-${event.color}-100 text-${event.color}-600 flex items-center justify-center">
                        <i class="ph ${event.icon} text-xl"></i>
                    </div>
                    ${index < events.length - 1 ? '<div class="w-0.5 h-full bg-gray-200 my-2"></div>' : ''}
                </div>
                <div class="flex-1 pb-8">
                    <div class="text-sm text-gray-500 mb-1">${eventDate}</div>
                    <h4 class="font-bold text-gray-800 mb-1">${event.title}</h4>
                    <p class="text-gray-600">${event.description}</p>
                </div>
            </div>`;
    }).join('');
}


// Display supporting documents
function displaySupportingDocuments() {
    const documentsTab = document.getElementById('documents');
    if (!documentsTab) return;

    const documents = currentRequest.supporting_documents;
    
    if (!documents || documents.length === 0) {
        documentsTab.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-file-text"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No documents attached</h3>
                <p class="text-gray-500">No supporting documents were uploaded with this request</p>
            </div>
        `;
        return;
    }

    documentsTab.innerHTML = `
        <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Supporting Documents (${documents.length})</h3>
            <div class="space-y-3">
                ${documents.map(doc => {
                    const fileUrl = apiClient.getFileUrl(doc);
                    const fileName = doc.name || 'Document';
                    const fileSize = doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '';
                    const fileExt = doc.ext || doc.mime?.split('/')[1]?.toUpperCase() || '';
                    
                    return `
                        <a href="${fileUrl}" target="_blank" download
                            class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group">
                            <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-300">
                                <i class="ph ph-file text-2xl text-gray-600 group-hover:text-visionRed transition-colors"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-800 group-hover:text-visionRed transition-colors truncate">${fileName}</p>
                                <p class="text-xs text-gray-500 mt-0.5">${fileExt}${fileSize ? ` • ${fileSize}` : ''}</p>
                            </div>
                            <i class="ph ph-download-simple text-xl text-gray-400 group-hover:text-visionRed transition-colors"></i>
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

async function submitClarificationResponse() {
    const responseText = document.getElementById('clarificationResponse')?.value.trim();

    if (!responseText) {
        showToast('Please enter your clarification response', 'error');
        return;
    }

    const btn = document.querySelector('button[onclick="submitClarificationResponse()"]');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Submitting...';
    }

    try {
        await apiClient.submitClarificationResponse(currentRequest.id, responseText);
        showToast('Clarification submitted successfully!', 'success');
        await loadRequestDetails(currentRequest.id);
    } catch (error) {
        console.error('Failed to submit clarification:', error);
        showToast('Failed to submit clarification. Please try again.', 'error');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Submit Clarification';
        }
    }
}

window.submitClarificationResponse = submitClarificationResponse;

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(t => {
        t.classList.remove('text-visionRed', 'border-b-2', 'border-visionRed');
        t.classList.add('text-gray-500', 'hover:text-gray-700');
    });
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) selectedContent.classList.add('active');
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-visionRed', 'border-b-2', 'border-visionRed');
    }
}