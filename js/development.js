/* global checkAuth, API, utils */
// Development Projects Page Logic

let currentTab = 'active';
let allProjects = [];
let filteredProjects = [];
let currentProject = null;

// Timeline state
let timelineZoom = 'day'; // 'day', 'week', 'month'
let timelineFilters = {
    overdue: true,
    'due-soon': true,
    'on-track': true
};
let timelineGroupBy = 'none'; // 'none', 'department', 'status', 'priority'

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user has access to Development (IT or Admin only)
    if (user.role !== 'it' && user.role !== 'admin') {
        alert('Access denied. This page is only for IT personnel and Administrators.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Show navigation links based on role
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

    // Load data
    loadProjects();
    populateDepartmentFilter();
});

// Initialize event listeners
function initializeEventListeners() {
    // Use event delegation on the main container
    const container = document.getElementById('development-container');
    if (container) {
        container.addEventListener('click', handleContainerClick);
    }

    // Timeline rows delegation
    document.addEventListener('click', handleTimelineClick);

    document.addEventListener('click', handleDocumentClick);

    // Filter change handlers
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterDepartment').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);

    // Calculate deadline on input change
    const startDateInput = document.getElementById('taskStartDate');
    const durationInput = document.getElementById('taskDuration');
    if (startDateInput) startDateInput.addEventListener('change', calculateDeadline);
    if (durationInput) durationInput.addEventListener('input', calculateDeadline);

    // Overlay click
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
}

// Handle timeline clicks (event delegation)
function handleTimelineClick(e) {
    const pillElement = e.target.closest('[data-project-id]');
    
    if (pillElement && pillElement.classList.contains('timeline-pill')) {
        const projectId = pillElement.dataset.projectId;
        showTimelineActionMenu(projectId, e);
        return;
    }

    // Close action menu if clicking outside
    const actionMenu = document.getElementById('timelineActionMenu');
    if (actionMenu && !actionMenu.contains(e.target)) {
        actionMenu.classList.add('hidden');
    }
}

// Handle clicks within the development container (event delegation)
function handleContainerClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) {
        // Check if clicking on timeline task bar
        if (e.target.closest('.timeline-task-bar')) {
            const taskBar = e.target.closest('.timeline-task-bar');
            showTimelinePopover(taskBar.dataset.projectId, e);
            return;
        }
        return;
    }

    const action = target.dataset.action;

    switch(action) {
        case 'switch-tab':
            switchTab(target.dataset.tab);
            break;
        case 'view-project-detail':
            viewProjectDetail(target.dataset.projectId);
            break;
        case 'open-update-status-modal':
            openUpdateStatusModal(target.dataset.projectId);
            break;
        case 'open-milestones-modal':
            openMilestonesModal(target.dataset.projectId);
            break;
        case 'open-logs-modal':
            openLogsModal(target.dataset.projectId);
            break;
        case 'open-accept-task-modal':
            openAcceptTaskModal(target.dataset.projectId);
            break;
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
        case 'apply-filters':
            applyFilters();
            break;
        case 'view-project-detail':
            viewProjectDetail(target.dataset.projectId);
            break;
        case 'open-update-status-modal':
            openUpdateStatusModal(target.dataset.projectId);
            break;
        case 'close-modal':
            closeModal(target.dataset.modal);
            break;
        case 'submit-status-update':
            submitStatusUpdate();
            break;
        case 'open-milestones-modal':
            openMilestonesModal(target.dataset.projectId);
            break;
        case 'submit-milestones':
            submitMilestones();
            break;
        case 'toggle-milestone':
            toggleMilestone(target.dataset.projectId, target.dataset.milestone);
            break;
        case 'open-logs-modal':
            openLogsModal(target.dataset.projectId);
            break;
        case 'open-add-log-modal':
            openAddLogModal();
            break;
        case 'submit-log-entry':
            submitLogEntry();
            break;
        case 'submit-accept-task':
            submitAcceptTask();
            break;
        case 'set-zoom':
            setTimelineZoom(target.dataset.zoom);
            break;
        case 'toggle-timeline-group':
            toggleTimelineGroup(target.dataset.groupId);
            break;
    }
}

// Timeline zoom control
function setTimelineZoom(zoom) {
    timelineZoom = zoom;
    
    // Update button styles
    document.querySelectorAll('.zoom-btn').forEach(btn => {
        if (btn.dataset.zoom === zoom) {
            btn.classList.remove('text-gray-700', 'hover:bg-gray-100');
            btn.classList.add('text-white', 'bg-visionRed');
        } else {
            btn.classList.remove('text-white', 'bg-visionRed');
            btn.classList.add('text-gray-700', 'hover:bg-gray-100');
        }
    });
    
    renderTimeline();
}

// Timeline filter change handler
function handleTimelineFilterChange() {
    document.querySelectorAll('[data-timeline-filter]').forEach(checkbox => {
        const filter = checkbox.dataset.timelineFilter;
        timelineFilters[filter] = checkbox.checked;
    });
    renderTimeline();
}

// Timeline group by change handler
function handleTimelineGroupByChange() {
    const select = document.getElementById('timeline-group-by');
    if (select) {
        timelineGroupBy = select.value;
        renderTimeline();
    }
}

// Toggle timeline group
function toggleTimelineGroup(groupId) {
    const header = document.querySelector(`[data-group-id="${groupId}"]`);
    const content = document.getElementById(`group-content-${groupId}`);
    
    if (header && content) {
        header.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
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

// Load projects
function loadProjects() {
    const allRequests = API.getRequests();
    
    // Get projects that have been accepted by IT (in development)
    allProjects = allRequests.filter(r => 
        r.itDecision === 'Accepted' || r.developmentStatus
    );

    // Initialize development status if not set
    allProjects.forEach(project => {
        if (!project.developmentStatus) {
            project.developmentStatus = 'Not Started';
        }
        if (!project.developmentStartDate && project.itReviewDate) {
            project.developmentStartDate = project.itReviewDate;
        }
        // Initialize milestones if not set
        if (project.documentationUploaded === undefined) project.documentationUploaded = false;
        if (project.trainingConducted === undefined) project.trainingConducted = false;
        if (project.solutionDelivered === undefined) project.solutionDelivered = false;
        if (project.completionReportGenerated === undefined) project.completionReportGenerated = false;
    });

    filteredProjects = [...allProjects];
    updateStatistics();
    displayProjects();
}

// Update statistics
function updateStatistics() {
    const active = allProjects.filter(p => 
        p.developmentStatus !== 'Completed' && p.developmentStatus !== 'On Hold'
    ).length;
    
    const inProgress = allProjects.filter(p => 
        p.developmentStatus === 'Development' || 
        p.developmentStatus === 'Testing' || 
        p.developmentStatus === 'UAT'
    ).length;
    
    const onHold = allProjects.filter(p => p.developmentStatus === 'On Hold').length;
    const completed = allProjects.filter(p => p.developmentStatus === 'Completed').length;

    document.getElementById('activeCount').textContent = active;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('onHoldCount').textContent = onHold;
    document.getElementById('completedCount').textContent = completed;
}

// Populate department filter
function populateDepartmentFilter() {
    const departments = API.getDepartments();
    const select = document.getElementById('filterDepartment');
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const departmentFilter = document.getElementById('filterDepartment').value;
    const priorityFilter = document.getElementById('filterPriority').value;

    filteredProjects = allProjects.filter(project => {
        let matches = true;

        if (statusFilter) {
            matches = matches && project.developmentStatus === statusFilter;
        }

        if (departmentFilter) {
            matches = matches && project.department === departmentFilter;
        }

        if (priorityFilter) {
            matches = matches && project.priority === priorityFilter;
        }

        return matches;
    });

    displayProjects();
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

    // Show/hide appropriate view
    const projectsList = document.getElementById('projectsList');
    const timelineView = document.getElementById('timeline-view');
    const timelineControls = document.getElementById('timeline-controls');

    if (tab === 'timeline') {
        projectsList.classList.add('hidden');
        timelineView.classList.remove('hidden');
        if (timelineControls) timelineControls.classList.remove('hidden');
        
        // Add event listeners for timeline controls
        document.querySelectorAll('[data-timeline-filter]').forEach(checkbox => {
            checkbox.addEventListener('change', handleTimelineFilterChange);
        });
        
        const groupBySelect = document.getElementById('timeline-group-by');
        if (groupBySelect) {
            groupBySelect.addEventListener('change', handleTimelineGroupByChange);
        }
        
        renderTimeline();
    } else {
        projectsList.classList.remove('hidden');
        timelineView.classList.add('hidden');
        if (timelineControls) timelineControls.classList.add('hidden');
        displayProjects();
    }
}

// Display projects
function displayProjects() {
    let projectsToShow = [...filteredProjects];

    // Filter by tab
    if (currentTab === 'active') {
        projectsToShow = projectsToShow.filter(p => 
            p.developmentStatus !== 'Completed'
        );
    } else if (currentTab === 'completed') {
        projectsToShow = projectsToShow.filter(p => 
            p.developmentStatus === 'Completed'
        );
    }

    const container = document.getElementById('projectsList');

    if (projectsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-folder-open"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No projects found</h3>
                <p class="text-gray-500">Projects will appear here when they enter development</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projectsToShow.map(project => {
        const priorityClass = project.priority === 'High' ? 'bg-red-100 text-red-700' :
            project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700';

        const statusClass = getStatusClass(project.developmentStatus);
        const progress = calculateProgress(project);
        const daysElapsed = calculateDaysElapsed(project.developmentStartDate);

        return `
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-visionRed transition-all">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="font-bold text-gray-800 text-lg">${project.title}</h4>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityClass}">
                                ${project.priority}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 mb-2">${project.id} • ${project.type}</p>
                        <p class="text-gray-700 mb-3">${project.description}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <i class="ph ph-building"></i>
                    <span><strong>${project.department}</strong> • ${project.requestor}</span>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">Status: 
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
                                ${project.developmentStatus}
                            </span>
                        </span>
                        <span class="text-sm text-gray-600">${daysElapsed} days elapsed</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1 text-right">${progress}% complete</div>
                </div>

                ${project.estimatedTime ? `
                <div class="mb-4 text-sm text-gray-600">
                    <i class="ph ph-clock"></i> Estimated: ${project.estimatedTime}
                    ${project.estimatedCost ? ` • <i class="ph ph-currency-circle-dollar"></i> ${project.estimatedCost}` : ''}
                </div>
                ` : ''}

                <!-- Milestones -->
                <div class="mb-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="text-sm font-semibold text-gray-700">Project Milestones</h5>
                        <button data-action="open-milestones-modal" data-project-id="${project.id}"
                            class="text-xs text-visionRed hover:text-red-700 font-medium">
                            Manage
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="ph ${project.documentationUploaded ? 'ph-check-circle text-green-600' : 'ph-circle text-gray-300'} text-lg"></i>
                            <span class="${project.documentationUploaded ? 'text-green-700 font-medium' : 'text-gray-500'}">Documentation</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ph ${project.trainingConducted ? 'ph-check-circle text-green-600' : 'ph-circle text-gray-300'} text-lg"></i>
                            <span class="${project.trainingConducted ? 'text-green-700 font-medium' : 'text-gray-500'}">Training</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ph ${project.solutionDelivered ? 'ph-check-circle text-green-600' : 'ph-circle text-gray-300'} text-lg"></i>
                            <span class="${project.solutionDelivered ? 'text-green-700 font-medium' : 'text-gray-500'}">Solution</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="ph ${project.completionReportGenerated ? 'ph-check-circle text-green-600' : 'ph-circle text-gray-300'} text-lg"></i>
                            <span class="${project.completionReportGenerated ? 'text-green-700 font-medium' : 'text-gray-500'}">Report</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 flex-wrap">
                    <button data-action="view-project-detail" data-project-id="${project.id}"
                            class="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-all border border-gray-300">
                        <i class="ph ph-eye"></i> View Details
                    </button>
                    <button data-action="open-logs-modal" data-project-id="${project.id}"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                        <i class="ph ph-clock-clockwise"></i> View Logs
                    </button>
                    ${!project.timelineStartDate ? `
                    <button data-action="open-accept-task-modal" data-project-id="${project.id}"
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                        <i class="ph ph-check-circle"></i> Accept Task
                    </button>
                    ` : ''}
                    <button data-action="open-update-status-modal" data-project-id="${project.id}"
                            class="px-4 py-2 bg-visionRed hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
                        <i class="ph ph-arrows-clockwise"></i> Update Status
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get status class
function getStatusClass(status) {
    const statusClasses = {
        'Not Started': 'bg-gray-100 text-gray-700',
        'Requirements Analysis': 'bg-blue-100 text-blue-700',
        'Design': 'bg-indigo-100 text-indigo-700',
        'Development': 'bg-purple-100 text-purple-700',
        'Testing': 'bg-orange-100 text-orange-700',
        'UAT': 'bg-yellow-100 text-yellow-700',
        'Deployment': 'bg-teal-100 text-teal-700',
        'On Hold': 'bg-red-100 text-red-700',
        'Completed': 'bg-green-100 text-green-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
}

// Calculate progress
function calculateProgress(project) {
    // Base progress from status (70% weight)
    const statusProgress = {
        'Not Started': 0,
        'Requirements Analysis': 15,
        'Design': 25,
        'Development': 40,
        'Testing': 55,
        'UAT': 65,
        'Deployment': 75,
        'Completed': 100,
        'On Hold': 0
    };
    
    const baseProgress = statusProgress[project.developmentStatus] || 0;
    
    // Milestone progress (30% weight, 7.5% each)
    let milestoneProgress = 0;
    if (project.documentationUploaded) milestoneProgress += 7.5;
    if (project.trainingConducted) milestoneProgress += 7.5;
    if (project.solutionDelivered) milestoneProgress += 7.5;
    if (project.completionReportGenerated) milestoneProgress += 7.5;
    
    // If completed, always 100%
    if (project.developmentStatus === 'Completed') {
        return 100;
    }
    
    return Math.min(Math.round(baseProgress + milestoneProgress), 100);
}

// Calculate days elapsed
function calculateDaysElapsed(startDate) {
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Open update status modal
function openUpdateStatusModal(projectId) {
    currentProject = allProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    const modalInfo = document.getElementById('modalProjectInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Project ID: <strong class="text-gray-800">${currentProject.id}</strong></p>
            <p class="font-bold text-gray-800">${currentProject.title}</p>
            <p class="text-sm text-gray-600 mt-2">Current Status: 
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(currentProject.developmentStatus)}">
                    ${currentProject.developmentStatus}
                </span>
            </p>
        </div>
    `;

    // Set current status as default (but allow changing to same status with remarks)
    document.getElementById('newStatus').value = '';
    document.getElementById('statusRemarks').value = '';

    const modal = document.getElementById('updateStatusModal');
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
    currentProject = null;
}

// Submit status update
function submitStatusUpdate() {
    if (!currentProject) return;

    const newStatus = document.getElementById('newStatus').value;
    const remarks = document.getElementById('statusRemarks').value.trim();

    if (!newStatus) {
        utils.showAlert('Please select a new status', 'warning');
        return;
    }

    const previousStatus = currentProject.developmentStatus;

    // Update project
    const updates = {
        developmentStatus: newStatus,
        lastStatusChange: new Date().toISOString().split('T')[0]
    };

    // If starting development for first time, set start date
    if (!currentProject.developmentStartDate && newStatus !== 'Not Started') {
        updates.developmentStartDate = new Date().toISOString().split('T')[0];
    }

    // If completed, mark as completed
    if (newStatus === 'Completed') {
        updates.status = 'Completed';
        updates.completionDate = new Date().toISOString().split('T')[0];
    }

    API.updateRequest(currentProject.id, updates);

    // Create development log entry
    const daysSinceStart = calculateDaysElapsed(currentProject.developmentStartDate || updates.developmentStartDate);
    API.addDevelopmentLog(currentProject.id, {
        logType: 'Status Change',
        previousStatus,
        newStatus,
        remarks: remarks || `Status changed from ${previousStatus} to ${newStatus}`,
        daysSinceStart
    });

    utils.showAlert(`Project status updated to ${newStatus}`, 'success');
    closeModal('updateStatusModal');

    setTimeout(() => {
        loadProjects();
    }, 500);
}

// View project detail
function viewProjectDetail(id) {
    window.location.href = `request-detail.html?id=${id}`;
}

// Open milestones modal
function openMilestonesModal(projectId) {
    currentProject = allProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    const modalInfo = document.getElementById('modalMilestoneProjectInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Project ID: <strong class="text-gray-800">${currentProject.id}</strong></p>
            <p class="font-bold text-gray-800">${currentProject.title}</p>
        </div>
    `;

    // Set checkbox states
    document.getElementById('milestone_documentation').checked = currentProject.documentationUploaded || false;
    document.getElementById('milestone_training').checked = currentProject.trainingConducted || false;
    document.getElementById('milestone_solution').checked = currentProject.solutionDelivered || false;
    document.getElementById('milestone_report').checked = currentProject.completionReportGenerated || false;

    // Show completion dates if available
    if (currentProject.documentationUploadedDate) {
        const docDate = document.getElementById('doc_date');
        docDate.textContent = `✓ Completed: ${utils.formatDate(currentProject.documentationUploadedDate)}`;
        docDate.classList.remove('hidden');
    } else {
        document.getElementById('doc_date').classList.add('hidden');
    }

    if (currentProject.trainingConductedDate) {
        const trainDate = document.getElementById('training_date');
        trainDate.textContent = `✓ Completed: ${utils.formatDate(currentProject.trainingConductedDate)}`;
        trainDate.classList.remove('hidden');
    } else {
        document.getElementById('training_date').classList.add('hidden');
    }

    if (currentProject.solutionDeliveredDate) {
        const solDate = document.getElementById('solution_date');
        solDate.textContent = `✓ Completed: ${utils.formatDate(currentProject.solutionDeliveredDate)}`;
        solDate.classList.remove('hidden');
    } else {
        document.getElementById('solution_date').classList.add('hidden');
    }

    if (currentProject.completionReportGeneratedDate) {
        const repDate = document.getElementById('report_date');
        repDate.textContent = `✓ Completed: ${utils.formatDate(currentProject.completionReportGeneratedDate)}`;
        repDate.classList.remove('hidden');
    } else {
        document.getElementById('report_date').classList.add('hidden');
    }

    const modal = document.getElementById('milestonesModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Submit milestones
function submitMilestones() {
    if (!currentProject) return;

    const today = new Date().toISOString().split('T')[0];
    
    const updates = {
        documentationUploaded: document.getElementById('milestone_documentation').checked,
        trainingConducted: document.getElementById('milestone_training').checked,
        solutionDelivered: document.getElementById('milestone_solution').checked,
        completionReportGenerated: document.getElementById('milestone_report').checked
    };

    // Set completion dates for newly checked milestones
    if (updates.documentationUploaded && !currentProject.documentationUploaded) {
        updates.documentationUploadedDate = today;
    }
    if (updates.trainingConducted && !currentProject.trainingConducted) {
        updates.trainingConductedDate = today;
    }
    if (updates.solutionDelivered && !currentProject.solutionDelivered) {
        updates.solutionDeliveredDate = today;
    }
    if (updates.completionReportGenerated && !currentProject.completionReportGenerated) {
        updates.completionReportGeneratedDate = today;
    }

    // Clear dates for unchecked milestones
    if (!updates.documentationUploaded && currentProject.documentationUploaded) {
        updates.documentationUploadedDate = null;
    }
    if (!updates.trainingConducted && currentProject.trainingConducted) {
        updates.trainingConductedDate = null;
    }
    if (!updates.solutionDelivered && currentProject.solutionDelivered) {
        updates.solutionDeliveredDate = null;
    }
    if (!updates.completionReportGenerated && currentProject.completionReportGenerated) {
        updates.completionReportGeneratedDate = null;
    }

    API.updateRequest(currentProject.id, updates);

    utils.showAlert('Milestones updated successfully', 'success');
    closeModal('milestonesModal');

    setTimeout(() => {
        loadProjects();
    }, 500);
}

// Toggle milestone (quick toggle from card)
function toggleMilestone(projectId, milestone) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const today = new Date().toISOString().split('T')[0];
    const updates = {};

    switch(milestone) {
        case 'documentation':
            updates.documentationUploaded = !project.documentationUploaded;
            if (updates.documentationUploaded) {
                updates.documentationUploadedDate = today;
            } else {
                updates.documentationUploadedDate = null;
            }
            break;
        case 'training':
            updates.trainingConducted = !project.trainingConducted;
            if (updates.trainingConducted) {
                updates.trainingConductedDate = today;
            } else {
                updates.trainingConductedDate = null;
            }
            break;
        case 'solution':
            updates.solutionDelivered = !project.solutionDelivered;
            if (updates.solutionDelivered) {
                updates.solutionDeliveredDate = today;
            } else {
                updates.solutionDeliveredDate = null;
            }
            break;
        case 'report':
            updates.completionReportGenerated = !project.completionReportGenerated;
            if (updates.completionReportGenerated) {
                updates.completionReportGeneratedDate = today;
            } else {
                updates.completionReportGeneratedDate = null;
            }
            break;
    }

    API.updateRequest(projectId, updates);
    loadProjects();
}

// Open logs modal
function openLogsModal(projectId) {
    currentProject = allProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    const modalInfo = document.getElementById('modalLogsProjectInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Project ID: <strong class="text-gray-800">${currentProject.id}</strong></p>
            <p class="font-bold text-gray-800">${currentProject.title}</p>
            <p class="text-sm text-gray-600 mt-2">
                Started: ${currentProject.developmentStartDate ? utils.formatDate(currentProject.developmentStartDate) : 'Not started'} • 
                ${calculateDaysElapsed(currentProject.developmentStartDate)} days elapsed
            </p>
        </div>
    `;

    // Load and display logs
    displayLogs(projectId);

    const modal = document.getElementById('logsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Display logs
function displayLogs(projectId) {
    const logs = API.getDevelopmentLogs(projectId);
    const timeline = document.getElementById('logsTimeline');

    if (logs.length === 0) {
        timeline.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-clock-clockwise"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No logs yet</h3>
                <p class="text-gray-500">Development logs will appear here as the project progresses</p>
            </div>
        `;
        return;
    }

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.changeDate) - new Date(a.changeDate));

    timeline.innerHTML = sortedLogs.map((log, index) => {
        const isLast = index === sortedLogs.length - 1;
        const logTypeIcon = getLogTypeIcon(log.logType);
        const logTypeColor = getLogTypeColor(log.logType);

        return `
            <div class="flex gap-4">
                <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full ${logTypeColor} flex items-center justify-center text-white">
                        <i class="ph ${logTypeIcon} text-lg"></i>
                    </div>
                    ${!isLast ? '<div class="w-0.5 h-full bg-gray-200 mt-2"></div>' : ''}
                </div>
                <div class="flex-1 pb-8">
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${logTypeColor.replace('bg-', 'bg-').replace('-600', '-100')} ${logTypeColor.replace('bg-', 'text-').replace('-600', '-700')}">
                                    ${log.logType}
                                </span>
                                ${log.previousStatus && log.newStatus ? `
                                    <span class="text-sm text-gray-600 ml-2">
                                        ${log.previousStatus} → ${log.newStatus}
                                    </span>
                                ` : ''}
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium text-gray-800">${utils.formatDate(log.changeDate)}</div>
                                <div class="text-xs text-gray-500">Day ${log.daysSinceStart || 0}</div>
                            </div>
                        </div>
                        <p class="text-gray-700 text-sm">${log.remarks}</p>
                        ${log.loggedBy ? `
                            <div class="text-xs text-gray-500 mt-2">
                                <i class="ph ph-user"></i> ${log.loggedBy}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get log type icon
function getLogTypeIcon(logType) {
    const icons = {
        'Status Change': 'ph-arrows-clockwise',
        'Update': 'ph-note',
        'Note': 'ph-note-pencil',
        'Issue': 'ph-warning',
        'Milestone': 'ph-flag'
    };
    return icons[logType] || 'ph-note';
}

// Get log type color
function getLogTypeColor(logType) {
    const colors = {
        'Status Change': 'bg-blue-600',
        'Update': 'bg-purple-600',
        'Note': 'bg-gray-600',
        'Issue': 'bg-red-600',
        'Milestone': 'bg-green-600'
    };
    return colors[logType] || 'bg-gray-600';
}

// Open add log modal
function openAddLogModal() {
    if (!currentProject) return;

    document.getElementById('logType').value = '';
    document.getElementById('logDescription').value = '';

    const modal = document.getElementById('addLogModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Submit log entry
function submitLogEntry() {
    if (!currentProject) return;

    const logType = document.getElementById('logType').value;
    const description = document.getElementById('logDescription').value.trim();

    if (!logType) {
        utils.showAlert('Please select a log type', 'warning');
        return;
    }

    if (!description) {
        utils.showAlert('Please enter a description', 'warning');
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const daysSinceStart = calculateDaysElapsed(currentProject.developmentStartDate);

    API.addDevelopmentLog(currentProject.id, {
        logType,
        remarks: description,
        daysSinceStart,
        loggedBy: user ? user.fullName : 'IT Team'
    });

    utils.showAlert('Log entry added successfully', 'success');
    closeModal('addLogModal');

    // Refresh logs display
    displayLogs(currentProject.id);
}

// ============ TIMELINE FUNCTIONALITY ============

// Render timeline view with grid-based layout
function renderTimeline() {
    const timelineView = document.getElementById('timeline-view');
    
    // Get projects with timeline data (accepted tasks)
    let timelineProjects = filteredProjects.filter(p => 
        p.timelineStartDate && p.timelineDuration
    );

    if (timelineProjects.length === 0) {
        timelineView.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-calendar-blank"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No scheduled tasks</h3>
                <p class="text-gray-500">Accept tasks to see them on the timeline</p>
            </div>
        `;
        return;
    }

    const today = new Date('2026-02-10');
    today.setHours(0, 0, 0, 0);

    // Apply timeline filters
    timelineProjects = timelineProjects.filter(project => {
        const deadline = new Date(project.timelineDeadline);
        deadline.setHours(0, 0, 0, 0);
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline < 0 && !timelineFilters.overdue) return false;
        if (daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && !timelineFilters['due-soon']) return false;
        if (daysUntilDeadline > 3 && !timelineFilters['on-track']) return false;
        
        return true;
    });

    if (timelineProjects.length === 0) {
        timelineView.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <i class="ph ph-filter"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">No tasks match filters</h3>
                <p class="text-gray-500">Adjust your filters to see more tasks</p>
            </div>
        `;
        return;
    }

    // Check for warnings
    const warnings = window.checkDueDateNotifications();
    const timelineWarnings = warnings.filter(w => 
        timelineProjects.some(p => p.id === w.project.id)
    );

    // Group projects if needed
    const groupedProjects = groupTimelineProjects(timelineProjects);

    // Calculate date range based on zoom level
    const dateRange = calculateDateRange(timelineProjects, timelineZoom);
    const { dates, totalUnits } = dateRange;

    // Build timeline HTML
    let html = '';
    
    // Add warning banner if there are warnings
    if (timelineWarnings.length > 0) {
        const criticalCount = timelineWarnings.filter(w => w.severity === 'critical').length;
        html += `
            <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-sm p-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-warning text-xl text-amber-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-base font-bold text-slate-900">
                            ${timelineWarnings.length} Task${timelineWarnings.length !== 1 ? 's' : ''} Need${timelineWarnings.length === 1 ? 's' : ''} Attention
                        </h3>
                        <p class="text-sm text-slate-700 mt-1">
                            ${criticalCount > 0 ? `${criticalCount} overdue, ` : ''}${timelineWarnings.length - criticalCount} due soon
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '<div class="timeline-container">';
    
    // Header row with dates - using CSS Grid
    const gridCols = `repeat(${totalUnits}, minmax(${getColumnWidth()}, 1fr))`;
    html += '<div class="timeline-header-row">';
    html += '<div class="timeline-label-col">Project</div>';
    html += `<div class="timeline-calendar-col" style="grid-template-columns: ${gridCols};">`;
    
    html += renderTimelineHeader(dates);
    
    html += '</div></div>';

    // Task rows with grouping
    html += '<div id="timeline-rows">';
    
    if (timelineGroupBy === 'none') {
        html += renderTimelineProjects(timelineProjects, dates, totalUnits, gridCols, today);
    } else {
        Object.keys(groupedProjects).forEach((groupName, index) => {
            const groupId = `group-${index}`;
            const projects = groupedProjects[groupName];
            
            html += `
                <div class="timeline-group-header" data-action="toggle-timeline-group" data-group-id="${groupId}">
                    <i class="ph ph-caret-down text-lg"></i>
                    <span>${groupName}</span>
                    <span class="text-sm text-gray-500">(${projects.length})</span>
                </div>
                <div id="group-content-${groupId}" class="timeline-group-content">
                    ${renderTimelineProjects(projects, dates, totalUnits, gridCols, today)}
                </div>
            `;
        });
    }
    
    html += '</div></div>';
    timelineView.innerHTML = html;
}

// Group timeline projects
function groupTimelineProjects(projects) {
    if (timelineGroupBy === 'none') {
        return { 'All Projects': projects };
    }
    
    const grouped = {};
    
    projects.forEach(project => {
        let groupKey;
        
        switch(timelineGroupBy) {
            case 'department':
                groupKey = project.department || 'Unknown';
                break;
            case 'status':
                groupKey = project.developmentStatus || 'Unknown';
                break;
            case 'priority':
                groupKey = project.priority || 'Unknown';
                break;
            default:
                groupKey = 'All Projects';
        }
        
        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }
        grouped[groupKey].push(project);
    });
    
    return grouped;
}

// Calculate date range based on zoom level
function calculateDateRange(projects, zoom) {
    let earliestDate = null;
    let latestDate = null;
    
    projects.forEach(project => {
        const startDate = new Date(project.timelineStartDate);
        const endDate = new Date(project.timelineDeadline);
        
        if (!earliestDate || startDate < earliestDate) {
            earliestDate = new Date(startDate);
        }
        if (!latestDate || endDate > latestDate) {
            latestDate = new Date(endDate);
        }
    });
    
    // Add buffer
    latestDate.setDate(latestDate.getDate() + 7);
    
    const dates = [];
    let totalUnits = 0;
    
    if (zoom === 'day') {
        const currentDate = new Date(earliestDate);
        while (currentDate <= latestDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
            totalUnits++;
        }
    } else if (zoom === 'week') {
        // Start from beginning of week
        const currentDate = new Date(earliestDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
        
        while (currentDate <= latestDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7);
            totalUnits++;
        }
    } else if (zoom === 'month') {
        // Start from beginning of month
        const currentDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
        
        while (currentDate <= latestDate) {
            dates.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
            totalUnits++;
        }
    }
    
    return { dates, totalUnits, earliestDate, latestDate };
}

// Get column width based on zoom
function getColumnWidth() {
    switch(timelineZoom) {
        case 'day': return '100px';
        case 'week': return '120px';
        case 'month': return '150px';
        default: return '100px';
    }
}

// Render timeline header
function renderTimelineHeader(dates) {
    const today = new Date('2026-02-10');
    today.setHours(0, 0, 0, 0);
    
    let html = '';
    
    dates.forEach(date => {
        let isToday = false;
        let label = '';
        
        if (timelineZoom === 'day') {
            isToday = date.toDateString() === today.toDateString();
            const dayNum = date.getDate();
            const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
            label = `<div class="text-xs text-gray-500">${monthShort}</div><div class="font-semibold">${dayNum}</div>`;
        } else if (timelineZoom === 'week') {
            const weekEnd = new Date(date);
            weekEnd.setDate(weekEnd.getDate() + 6);
            isToday = today >= date && today <= weekEnd;
            const weekNum = getWeekNumber(date);
            const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
            label = `<div class="text-xs text-gray-500">${monthShort}</div><div class="font-semibold">W${weekNum}</div>`;
        } else if (timelineZoom === 'month') {
            isToday = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });
            const year = date.getFullYear();
            label = `<div class="font-semibold">${monthName}</div><div class="text-xs text-gray-500">${year}</div>`;
        }
        
        html += `<div class="timeline-day-marker ${isToday ? 'today' : ''}">${label}</div>`;
    });
    
    return html;
}

// Get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Render timeline projects
function renderTimelineProjects(projects, dates, totalUnits, gridCols, today) {
    let html = '';
    
    projects.forEach(project => {
        const startDate = new Date(project.timelineStartDate);
        const deadline = new Date(project.timelineDeadline);
        
        // Calculate grid column positions based on zoom
        const { gridColumnStart, gridColumnEnd } = calculateGridPosition(
            startDate, deadline, dates, timelineZoom
        );
        
        // Determine status color and get warning info
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const statusClass = getTimelineStatusClassByDays(daysUntilDeadline);
        const statusIcon = getTimelineStatusIcon(statusClass);
        
        // Get warning status for badge
        const warning = window.getTaskWarningStatus(project.timelineDeadline);
        
        html += `
            <div class="timeline-task-row">
                <div class="timeline-task-info">
                    <div class="font-semibold text-sm text-gray-800 truncate">${project.title}</div>
                    <div class="text-xs text-gray-500 mt-1">${project.id}</div>
                    <div class="text-xs text-gray-600 mt-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusClass(project.developmentStatus)}">
                            ${project.developmentStatus}
                        </span>
                    </div>
                </div>
                <div class="timeline-task-canvas" style="grid-template-columns: ${gridCols};">
                    ${generateDayColumnsForGrid(dates, today, totalUnits)}
                    <div class="timeline-pill ${statusClass}" 
                         data-project-id="${project.id}"
                         style="grid-column: ${gridColumnStart} / ${gridColumnEnd};">
                        <div class="timeline-pill-start">
                            <i class="ph ph-play-circle text-base"></i>
                            <span class="font-medium">${formatShortDate(startDate)}</span>
                        </div>
                        <div class="timeline-pill-center">
                            <i class="ph ${statusIcon} text-base"></i>
                            ${warning.text ? `<span class="text-xs font-bold ml-2">• ${warning.text}</span>` : ''}
                        </div>
                        <div class="timeline-pill-end">
                            <span class="font-medium">${formatShortDate(deadline)}</span>
                            <i class="ph ph-flag-checkered text-base"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Calculate grid position based on zoom level
function calculateGridPosition(startDate, endDate, dates, zoom) {
    let gridColumnStart = 1;
    let gridColumnEnd = 2;
    
    if (zoom === 'day') {
        const earliestDate = dates[0];
        const startDayIndex = Math.floor((startDate - earliestDate) / (1000 * 60 * 60 * 24));
        const endDayIndex = Math.floor((endDate - earliestDate) / (1000 * 60 * 60 * 24));
        gridColumnStart = startDayIndex + 1;
        gridColumnEnd = endDayIndex + 2;
    } else if (zoom === 'week') {
        // Find which week the start and end dates fall into
        for (let i = 0; i < dates.length; i++) {
            const weekStart = dates[i];
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            if (startDate >= weekStart && startDate <= weekEnd && gridColumnStart === 1) {
                gridColumnStart = i + 1;
            }
            if (endDate >= weekStart && endDate <= weekEnd) {
                gridColumnEnd = i + 2;
                break;
            }
        }
    } else if (zoom === 'month') {
        // Find which month the start and end dates fall into
        for (let i = 0; i < dates.length; i++) {
            const monthStart = dates[i];
            const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            
            if (startDate >= monthStart && startDate <= monthEnd && gridColumnStart === 1) {
                gridColumnStart = i + 1;
            }
            if (endDate >= monthStart && endDate <= monthEnd) {
                gridColumnEnd = i + 2;
                break;
            }
        }
    }
    
    return { gridColumnStart, gridColumnEnd };
}

// Generate day columns for grid layout with "today" highlight
function generateDayColumnsForGrid(dates, today, totalDays) {
    let html = '';
    
    dates.forEach((date, index) => {
        const isToday = date.toDateString() === today.toDateString();
        // Grid columns are 1-indexed
        const gridColumn = index + 1;
        html += `<div class="timeline-day-column ${isToday ? 'today' : ''}" style="grid-column: ${gridColumn};"></div>`;
    });
    return html;
}

// Generate day columns for date range with "today" highlight
function generateDayColumnsForDateRange(dates, today) {
    let html = '';
    const totalDays = dates.length;
    
    dates.forEach((date, index) => {
        const isToday = date.toDateString() === today.toDateString();
        const leftPercent = (index / totalDays) * 100;
        const widthPercent = (1 / totalDays) * 100;
        html += `<div class="timeline-day-column ${isToday ? 'today' : ''}" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>`;
    });
    return html;
}

// Get timeline status class based on days until deadline
function getTimelineStatusClassByDays(daysUntilDeadline) {
    if (daysUntilDeadline < 0) {
        return 'status-overdue'; // Red - Overdue
    } else if (daysUntilDeadline <= 3) {
        return 'status-warning'; // Amber - Due within 72 hours
    } else {
        return 'status-success'; // Emerald - On track
    }
}

// Generate day columns with "today" highlight (legacy - kept for compatibility)
function generateDayColumns(daysInMonth, currentDay) {
    let html = '';
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDay;
        const leftPercent = ((day - 1) / daysInMonth) * 100;
        html += `<div class="timeline-day-column ${isToday ? 'today' : ''}" style="left: ${leftPercent}%;"></div>`;
    }
    return html;
}

// Get timeline status class based on deadline (legacy - kept for compatibility)
function getTimelineStatusClass(project, currentDay, deadlineDay) {
    const daysUntilDeadline = deadlineDay - currentDay;
    return getTimelineStatusClassByDays(daysUntilDeadline);
}

// Get status icon
function getTimelineStatusIcon(statusClass) {
    const icons = {
        'status-success': 'ph-check-circle',
        'status-warning': 'ph-warning-circle',
        'status-overdue': 'ph-x-circle'
    };
    return icons[statusClass] || 'ph-circle';
}

// Format date for pill display
function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Show timeline action menu
function showTimelineActionMenu(projectId, event) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const menu = document.getElementById('timelineActionMenu');
    
    menu.innerHTML = `
        <button data-action="open-update-status-modal" data-project-id="${projectId}">
            <i class="ph ph-arrows-clockwise text-lg"></i>
            <span>Update Progress</span>
        </button>
        <button data-action="open-accept-task-modal" data-project-id="${projectId}">
            <i class="ph ph-calendar-dots text-lg"></i>
            <span>Edit Dates</span>
        </button>
        <button data-action="view-project-detail" data-project-id="${projectId}">
            <i class="ph ph-eye text-lg"></i>
            <span>View Details</span>
        </button>
    `;

    // Position menu near cursor
    menu.style.left = `${event.clientX + 10}px`;
    menu.style.top = `${event.clientY + 10}px`;
    
    menu.classList.remove('hidden');

    // Prevent immediate close
    event.stopPropagation();
}

// Get timeline status color based on deadline (legacy function for compatibility)
function getTimelineStatusColor(project, currentDate) {
    const deadline = new Date(project.timelineDeadline);
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) {
        return 'red';
    } else if (daysUntilDeadline <= 3) {
        return 'yellow';
    } else {
        return 'green';
    }
}

// Show timeline popover (legacy - replaced by action menu)
function showTimelinePopover(projectId, event) {
    showTimelineActionMenu(projectId, event);
}

// Timeline drag functionality (removed - simplified design)
let dragState = {
    isDragging: false,
    projectId: null,
    startX: 0,
    originalDuration: 0
};

function handleTimelineDragStart(e) {
    // Removed drag functionality for cleaner design
}

function handleTimelineDrag(e) {
    // Removed drag functionality for cleaner design
}

function handleTimelineDragEnd(e) {
    // Removed drag functionality for cleaner design
}

// Open accept task modal
function openAcceptTaskModal(projectId) {
    currentProject = allProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    const modalInfo = document.getElementById('acceptTaskProjectInfo');
    modalInfo.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Project ID: <strong class="text-gray-800">${currentProject.id}</strong></p>
            <p class="font-bold text-gray-800">${currentProject.title}</p>
        </div>
    `;

    // Set default start date to today
    const today = new Date('2026-02-10');
    document.getElementById('taskStartDate').value = today.toISOString().split('T')[0];
    document.getElementById('taskStartDate').min = today.toISOString().split('T')[0];
    document.getElementById('taskDuration').value = '';
    document.getElementById('calculatedDeadline').classList.add('hidden');

    const modal = document.getElementById('acceptTaskModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Calculate deadline
function calculateDeadline() {
    const startDate = document.getElementById('taskStartDate').value;
    const duration = parseInt(document.getElementById('taskDuration').value);

    if (startDate && duration > 0) {
        const start = new Date(startDate);
        const deadline = new Date(start);
        deadline.setDate(start.getDate() + duration - 1);

        document.getElementById('deadlineDisplay').textContent = deadline.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('calculatedDeadline').classList.remove('hidden');
    } else {
        document.getElementById('calculatedDeadline').classList.add('hidden');
    }
}

// Submit accept task
function submitAcceptTask() {
    if (!currentProject) return;

    const startDate = document.getElementById('taskStartDate').value;
    const duration = parseInt(document.getElementById('taskDuration').value);

    if (!startDate) {
        utils.showAlert('Please select a start date', 'warning');
        return;
    }

    if (!duration || duration < 1) {
        utils.showAlert('Please enter a valid duration', 'warning');
        return;
    }

    // Calculate deadline
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() + duration - 1);

    // Update project with timeline data
    API.updateRequest(currentProject.id, {
        timelineStartDate: startDate,
        timelineDuration: duration,
        timelineDeadline: deadline.toISOString().split('T')[0],
        developmentStatus: 'Development',
        developmentStartDate: startDate
    });

    // Add log entry
    API.addDevelopmentLog(currentProject.id, {
        logType: 'Milestone',
        remarks: `Task accepted and scheduled. Start: ${startDate}, Duration: ${duration} days, Deadline: ${deadline.toISOString().split('T')[0]}`,
        daysSinceStart: 0
    });

    utils.showAlert('Task accepted and scheduled successfully', 'success');
    closeModal('acceptTaskModal');

    setTimeout(() => {
        loadProjects();
        switchTab('timeline');
    }, 500);
}
