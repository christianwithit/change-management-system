/* global API, utils, loadProjects */
// Handover Initiation Logic

/**
 * Open the initiate handover modal and populate with project data
 * @param {string} projectId - The ID of the project to initiate handover for
 */
/**
 * Open the initiate handover modal and populate with project data
 * @param {string} projectId - The ID of the project to initiate handover for
 */
function openInitiateHandoverModal(projectId) {
    const project = API.getRequest(projectId);
    if (!project) {
        utils.showAlert('Project not found', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        utils.showAlert('User session not found. Please login again.', 'error');
        return;
    }

    // Set project ID in hidden field
    document.getElementById('handoverProjectId').value = projectId;

    // Set initiator name
    const initiatorField = document.getElementById('handoverInitiator');
    if (initiatorField) initiatorField.value = user.fullName;

    // Populate project info
    const infoContainer = document.getElementById('handoverProjectInfo');
    infoContainer.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wider">Initiating Handover For:</p>
            <h4 class="font-bold text-gray-800 text-lg">${project.title}</h4>
            <div class="flex gap-4 mt-2 text-sm text-gray-600">
                <span><i class="ph ph-hash"></i> ${project.id}</span>
                <span><i class="ph ph-buildings"></i> ${project.department}</span>
            </div>
        </div>
    `;

    // Set default projects covered
    document.getElementById('handoverProjectsCovered').value = project.title;

    // Set default overview if empty
    if (!document.getElementById('handoverOverview').value) {
        document.getElementById('handoverOverview').value = project.description || '';
    }

    // Clear and populate dynamic sections
    const purposeContainer = document.getElementById('handoverPurposeContainer');
    purposeContainer.innerHTML = '';
    const defaultPurposes = [
        `Automate ${project.title.toLowerCase()} processes`,
        'Improve operational efficiency',
        'Enable centralized data management'
    ];
    defaultPurposes.forEach(p => addPurposeItem(p));

    const usersTableBody = document.getElementById('handoverUsersTableBody');
    usersTableBody.innerHTML = '';
    const defaultUsers = [
        { role: 'End User', description: 'Staff members', accessLevel: 'View and submit data' },
        { role: 'System Admin', description: 'IT team', accessLevel: 'Full access' }
    ];
    defaultUsers.forEach(u => addUserRow(u.role, u.description, u.accessLevel));

    const statusTableBody = document.getElementById('handoverStatusTableBody');
    statusTableBody.innerHTML = '';
    const defaultStatus = [
        { component: 'System Core', status: 'Functional', remarks: 'Stable' },
        { component: 'Documentation', status: 'Completed', remarks: 'Technical guides provided' }
    ];
    defaultStatus.forEach(s => addStatusRow(s.component, s.status, s.remarks));

    // Open modal
    const modal = document.getElementById('initiateHandoverModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

/**
 * Add a purpose item input
 */
function addPurposeItem(value = '') {
    const container = document.getElementById('handoverPurposeContainer');
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2 group';
    div.innerHTML = `
        <input type="text" class="handover-purpose-input flex-1 px-3 py-2 border border-gray-300 rounded focus:border-visionRed outline-none text-sm" value="${value}" placeholder="Enter purpose item...">
        <button type="button" class="text-gray-400 hover:text-red-600 transition-colors" onclick="this.parentElement.remove()">
            <i class="ph ph-trash-simple text-lg"></i>
        </button>
    `;
    container.appendChild(div);
}

/**
 * Add a user row to the table
 */
function addUserRow(role = '', desc = '', access = '') {
    const tbody = document.getElementById('handoverUsersTableBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="px-4 py-2"><input type="text" class="user-role-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none" value="${role}" placeholder="e.g. End User"></td>
        <td class="px-4 py-2"><input type="text" class="user-desc-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none" value="${desc}" placeholder="e.g. Staff members"></td>
        <td class="px-4 py-2"><input type="text" class="user-access-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none" value="${access}" placeholder="e.g. Read/Write"></td>
        <td class="px-4 py-2 text-center">
            <button type="button" class="text-gray-400 hover:text-red-600 transition-colors" onclick="this.closest('tr').remove()">
                <i class="ph ph-trash-simple text-lg"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

/**
 * Add a status row to the table
 */
function addStatusRow(comp = '', status = 'Functional', remarks = '') {
    const tbody = document.getElementById('handoverStatusTableBody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="px-4 py-2"><input type="text" class="status-comp-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none" value="${comp}" placeholder="e.g. Core System"></td>
        <td class="px-4 py-2">
            <select class="status-val-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none">
                <option value="Functional" ${status === 'Functional' ? 'selected' : ''}>Functional</option>
                <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Ready" ${status === 'Ready' ? 'selected' : ''}>Ready</option>
                <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            </select>
        </td>
        <td class="px-4 py-2"><input type="text" class="status-remarks-input w-full px-2 py-1 border border-transparent hover:border-gray-200 focus:border-visionRed rounded outline-none" value="${remarks}" placeholder="..."></td>
        <td class="px-4 py-2 text-center">
            <button type="button" class="text-gray-400 hover:text-red-600 transition-colors" onclick="this.closest('tr').remove()">
                <i class="ph ph-trash-simple text-lg"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

/**
 * Submit the handover initiation form
 */
async function submitHandoverInit() {
    const projectId = document.getElementById('handoverProjectId').value;
    const initiator = document.getElementById('handoverInitiator') ? document.getElementById('handoverInitiator').value : 'IT Team';
    const overview = document.getElementById('handoverOverview').value.trim();
    const projectsCovered = document.getElementById('handoverProjectsCovered').value.trim();
    
    const serverEnvironment = document.getElementById('handoverServer').value.trim();
    const publicURL = document.getElementById('handoverPublicURL').value.trim();
    const intranetAccess = document.getElementById('handoverIntranet').value.trim();
    const sslStatus = document.getElementById('handoverSSL').value;
    const databaseLocation = document.getElementById('handoverDB').value.trim();
    const backupStrategy = document.getElementById('handoverBackup').value.trim();

    // Collect dynamic data
    const purpose = Array.from(document.querySelectorAll('.handover-purpose-input'))
        .map(input => input.value.trim())
        .filter(val => val !== '');

    const systemUsers = Array.from(document.querySelectorAll('#handoverUsersTableBody tr')).map(tr => ({
        role: tr.querySelector('.user-role-input').value.trim(),
        description: tr.querySelector('.user-desc-input').value.trim(),
        accessLevel: tr.querySelector('.user-access-input').value.trim()
    })).filter(u => u.role !== '');

    const currentStatus = Array.from(document.querySelectorAll('#handoverStatusTableBody tr')).map(tr => ({
        component: tr.querySelector('.status-comp-input').value.trim(),
        status: tr.querySelector('.status-val-input').value,
        remarks: tr.querySelector('.status-remarks-input').value.trim()
    })).filter(s => s.component !== '');

    if (!overview) {
        utils.showAlert('Please provide a system overview', 'warning');
        return;
    }

    if (!confirm('Are you sure you want to initiate the digital handover process?')) {
        return;
    }

    const handoverData = {
        initiatedBy: initiator,
        systemSpecs: {
            overview: overview,
            projectsCovered: projectsCovered,
            purpose: purpose,
            serverEnvironment: serverEnvironment || 'Vision Group Infrastructure',
            publicURL: publicURL || null,
            intranetAccess: intranetAccess || 'Authorized users only',
            sslStatus: sslStatus,
            databaseLocation: databaseLocation || 'Production DB Server',
            backupStrategy: backupStrategy || 'Automated nightly backups',
            systemUsers: systemUsers,
            currentStatus: currentStatus
        }
    };

    try {
        const handover = API.createHandover(projectId, handoverData);
        
        if (handover) {
            utils.showAlert('Handover process initiated successfully!', 'success');
            
            // Close modal and reset form
            if (typeof closeModal === 'function') {
                closeModal('initiateHandoverModal');
            } else {
                document.getElementById('initiateHandoverModal').classList.add('hidden');
                document.getElementById('initiateHandoverModal').classList.remove('flex');
            }
            document.getElementById('handoverForm').reset();
            
            // Refresh project list to reflect changes
            if (typeof loadProjects === 'function') {
                loadProjects();
            }
        } else {
            utils.showAlert('Failed to initiate handover. Please check if it was already initiated.', 'error');
        }
    } catch (error) {
        console.error('Error initiating handover:', error);
        utils.showAlert('An error occurred while initiating handover', 'error');
    }
}

// Add event listeners for dynamic action buttons
document.addEventListener('click', function(e) {
    const actionTarget = e.target.closest('[data-action]');
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    
    if (action === 'submit-handover-init') {
        submitHandoverInit();
    } else if (action === 'add-purpose-item') {
        addPurposeItem();
    } else if (action === 'add-user-row') {
        addUserRow();
    } else if (action === 'add-status-row') {
        addStatusRow();
    }
});
