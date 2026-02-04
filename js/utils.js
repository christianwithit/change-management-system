// Utility functions

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
    showToast(message, type);
}

// Toast Notification System
function showToast(message, type = 'success') {
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
}

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
        showAlert('No data to export', 'warning');
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

// Initialize page
function initializePage() {
    // Check authentication
    const user = checkAuth();
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

// Update user info in sidebar
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

// Export functions
window.utils = {
    formatDate,
    formatDateTime,
    getStatusBadge,
    getPriorityBadge,
    showModal,
    hideModal,
    showAlert,
    showToast,
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
