// Main application logic

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on a page that requires authentication
    if (window.location.pathname.includes('/pages/')) {
        initializePage();
    }

    // Initialize mobile sidebar
    initializeMobileSidebar();

    // Set active navigation
    setActiveNav();
});

// Mobile sidebar functionality
function initializeMobileSidebar() {
    // Handle mobile overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
}

function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }

    if (overlay) {
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
            }, 10);
        } else {
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300); // Match transition duration
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.add('-translate-x-full');
    }

    if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

// Navigation handling
function navigateTo(page) {
    window.location.href = page;
}

// Smart Sidebar Highlighting
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('aside nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Remove active classes from all links
        link.classList.remove('bg-white/10', 'text-white', 'border-l-4', 'border-visionRed');
        link.classList.add('text-gray-400');

        // Remove font-medium from span
        const span = link.querySelector('span');
        if (span) span.classList.remove('font-medium');

        // Add active classes to matching link
        if (href && (href === currentPage || href.includes(currentPage))) {
            link.classList.remove('text-gray-400', 'hover:bg-white/5', 'hover:text-white');
            link.classList.add('bg-white/10', 'text-white', 'border-l-4', 'border-visionRed');

            // Make the span bold
            if (span) span.classList.add('font-medium');
        }
    });
}

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Handle file upload preview
function handleFileUpload(input) {
    const files = input.files;
    const fileList = document.getElementById('fileList');

    if (fileList && files.length > 0) {
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mb-2';
            fileItem.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="ph ph-file text-gray-400"></i>
                    <span class="text-sm text-gray-700">${file.name}</span>
                </div>
                <span class="text-xs text-gray-500">${(file.size / 1024).toFixed(2)} KB</span>
            `;
            fileList.appendChild(fileItem);
        });
    }
}

// Print functionality
function printPage() {
    window.print();
}

// Refresh data
function refreshData() {
    location.reload();
}

// Export current view
function exportCurrentView(format = 'csv') {
    const data = API.getRequests();
    if (format === 'csv') {
        utils.exportToCSV(data, `cms-export-${new Date().toISOString().split('T')[0]}.csv`);
    }
}
