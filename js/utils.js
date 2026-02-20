// Utility functions

// Get role display name
window.getRoleDisplayName = function(role) {
    const roleNames = {
        'staff': 'Staff Member',
        'hod': 'Head of Department',
        'it': 'IT Administrator',
        'admin': 'System Administrator'
    };
    return roleNames[role] || 'Staff Member';
};

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format date with time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        'Pending HOD Approval': 'badge-pending',
        'Approved': 'badge-approved',
        'Rejected': 'badge-rejected',
        'IT Review': 'badge-in-progress',
        'In Progress': 'badge-in-progress',
        'Completed': 'badge-completed',
        'Deferred': 'badge-deferred'
    };
    
    const badgeClass = badges[status] || 'badge-pending';
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

// Get priority badge
function getPriorityBadge(priority) {
    const badges = {
        'High': 'badge-danger',
        'Medium': 'badge-pending',
        'Low': 'badge-in-progress'
    };
    
    const badgeClass = badges[priority] || 'badge-pending';
    return `<span class="badge ${badgeClass}">${priority}</span>`;
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show alert (legacy - use showToast instead)
function showAlert(message, type = 'info') {
    window.showToast(message, type);
}

// Global Toast Notification System (called from HTML scripts)
window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    const iconMap = {
        success: 'ph-check-circle',
        error: 'ph-x-circle',
        warning: 'ph-warning',
        info: 'ph-info'
    };
    const colorMap = {
        success: 'border-green-500',
        error: 'border-visionRed',
        warning: 'border-yellow-500',
        info: 'border-blue-500',
        danger: 'border-visionRed'
    };
    
    const borderColor = colorMap[type] || colorMap.success;
    const icon = iconMap[type] || iconMap.success;
    
    toast.className = `fixed top-6 right-6 z-50 bg-white ${borderColor} border-l-4 shadow-xl flex items-center p-4 rounded-lg min-w-[300px] max-w-md animate-slide-in`;
    toast.innerHTML = `
        <i class="ph ${icon} text-2xl mr-3 ${type === 'success' ? 'text-green-500' : type === 'error' || type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}"></i>
        <span class="text-gray-800 font-medium flex-1">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-3 text-gray-400 hover:text-gray-600">
            <i class="ph ph-x text-xl"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Confirm action
function confirmAction(message) {
    return confirm(message);
}

// Generate random ID
function generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}

// Export data to CSV
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        window.showToast('No data to export', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header] || '';
            return `"${value}"`;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Search and filter table
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Sort table
function sortTable(tableId, columnIndex, ascending = true) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        if (ascending) {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Initialize page (not currently used but kept for future use)
function initializePage() {
    // Check authentication
    const user = window.checkAuth();
    if (!user) return;
    
    // Update user info in sidebar
    updateUserInfo(user);
    
    // Initialize tooltips
    initTooltips();
    
    // Setup modal close handlers
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Update user info in sidebar (not currently used but kept for future use)
function updateUserInfo(user) {
    const userNameElement = document.querySelector('.user-details h4');
    const userRoleElement = document.querySelector('.user-details p');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (userNameElement) userNameElement.textContent = user.fullName;
    if (userRoleElement) {
        const roleNames = {
            'staff': 'Staff Member',
            'hod': 'Head of Department',
            'it': 'IT Department',
            'admin': 'System Administrator'
        };
        userRoleElement.textContent = roleNames[user.role] || user.role;
    }
    if (userAvatarElement) {
        userAvatarElement.textContent = user.fullName.charAt(0).toUpperCase();
    }
}

// Check for due date warnings/notifications
window.checkDueDateNotifications = function() {
    const user = window.getCurrentUser();
    if (!user || (user.role !== 'it' && user.role !== 'admin')) return [];
    
    const projects = window.API.getRequests().filter(r => 
        r.timelineDeadline && r.developmentStatus !== 'Completed'
    );
    
    const warnings = [];
    const today = new Date('2026-02-10'); // Current date from system
    
    projects.forEach(project => {
        const deadline = new Date(project.timelineDeadline);
        const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil < 0) {
            warnings.push({
                type: 'overdue',
                severity: 'critical',
                project: project,
                daysUntil: daysUntil,
                message: `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} overdue`
            });
        } else if (daysUntil <= 3) {
            warnings.push({
                type: 'due-soon',
                severity: daysUntil === 0 ? 'high' : 'medium',
                project: project,
                daysUntil: daysUntil,
                message: daysUntil === 0 ? 'Due TODAY' : `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
            });
        }
    });
    
    // Sort by severity: overdue first, then by days until due
    warnings.sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return a.daysUntil - b.daysUntil;
    });
    
    return warnings;
};

// Get warning status for a specific task (for timeline pills)
window.getTaskWarningStatus = function(deadline) {
    if (!deadline) return { status: 'none', text: '', color: 'green', icon: 'ph-check-circle' };
    
    const today = new Date('2026-02-10');
    const dueDate = new Date(deadline);
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
        return { 
            status: 'overdue', 
            text: `${Math.abs(daysUntil)} DAY${Math.abs(daysUntil) !== 1 ? 'S' : ''} OVERDUE`, 
            color: 'red',
            icon: 'ph-x-circle'
        };
    }
    if (daysUntil === 0) {
        return { 
            status: 'warning', 
            text: 'DUE TODAY', 
            color: 'yellow',
            icon: 'ph-warning-circle'
        };
    }
    if (daysUntil <= 3) {
        return { 
            status: 'warning', 
            text: `DUE IN ${daysUntil} DAY${daysUntil !== 1 ? 'S' : ''}`, 
            color: 'yellow',
            icon: 'ph-warning-circle'
        };
    }
    return { 
        status: 'on-track', 
        text: '', 
        color: 'green',
        icon: 'ph-check-circle'
    };
};

// Check if user can access handover section
window.canAccessHandovers = function(user) {
    if (!user) return false;
    
    // IT/Admin always have access
    const HANDOVER_ROLES = ['it', 'admin'];
    if (HANDOVER_ROLES.includes(user.role)) {
        return true;
    }
    
    // Known signatories have access
    const HANDOVER_SIGNATORIES = [
        'Felix Ssembajjwe Bashabe',      // Project Manager
        'Emmanuel Cliff Mughanwa',        // Information Security
        'Paul Ikanza',                    // Head of Technology
        'Agatha Joyday Gloria',           // HR
        'Marjorie Nalubowa'               // HOD
    ];
    if (HANDOVER_SIGNATORIES.includes(user.fullName)) {
        return true;
    }
    
    // HODs have access (potential signatories)
    if (user.role === 'hod') {
        return true;
    }
    
    return false;
};

// Export functions
window.utils = {
    formatDate,
    formatDateTime,
    getStatusBadge,
    getPriorityBadge,
    showModal,
    hideModal,
    showAlert,
    confirmAction,
    generateId,
    validateForm,
    exportToCSV,
    debounce,
    filterTable,
    sortTable,
    initializePage,
    updateUserInfo
};

// Add showToast to utils after it's defined on window
window.utils.showToast = window.showToast;
