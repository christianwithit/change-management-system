/* global checkAuth, getCurrentUser, apiClient, Chart */

let statusChart = null;
let trendChart = null;
let statusChartPill = null;
let allRequests = [];

document.addEventListener('DOMContentLoaded', async function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user has access to reports
    if (user.role !== 'hod' && user.role !== 'it' && user.role !== 'admin') {
        alert('Access denied. This page is only for HODs, IT personnel, and Administrators.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Update sidebar user info
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserInitial = document.getElementById('sidebarUserInitial');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    if (sidebarUserName) sidebarUserName.textContent = user.fullName;
    if (sidebarUserInitial) sidebarUserInitial.textContent = user.fullName.charAt(0).toUpperCase();
    if (sidebarUserRole) {
        const roleNames = {
            'hod': 'Head of Department',
            'it': 'IT Administrator',
            'admin': 'System Administrator'
        };
        sidebarUserRole.textContent = roleNames[user.role] || 'Staff Member';
    }

    // Show navigation links based on role
    const hodReviewLink = document.getElementById('hodReviewLink');
    const itReviewLink = document.getElementById('itReviewLink');
    if (hodReviewLink && user.role === 'hod') hodReviewLink.style.display = 'flex';
    if (itReviewLink && (user.role === 'it' || user.role === 'admin')) itReviewLink.style.display = 'flex';

    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    document.getElementById('dateTo').valueAsDate = today;
    document.getElementById('dateFrom').valueAsDate = thirtyDaysAgo;

    // Load all requests from backend
    await loadAllRequests(user);

    // Populate department filter
    await populateDepartmentFilter(user);

    // Initialize charts and generate report
    initializeCharts();
    generateReport();

    // Initialize event listeners
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('change', handleFilterChange);
    document.addEventListener('click', handleDocumentClick);

    // Overlay click
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
}

function handleFilterChange(e) {
    const target = e.target;
    if (['reportType', 'dateFrom', 'dateTo', 'departmentFilter'].includes(target.id)) {
        generateReport();
    }
}

function handleDocumentClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    switch (action) {
        case 'logout':
            handleLogout();
            break;
        case 'print':
            window.print();
            break;
        case 'export-report':
            exportReport();
            break;
        case 'toggle-sidebar':
            toggleMobileSidebar();
            break;
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

// Load all requests from backend
async function loadAllRequests(user) {
    try {
        let response;

        if (user.role === 'hod') {
            // HOD: Get department requests only
            response = await apiClient.getAllChangeRequests();
            const data = response.data || response;
            allRequests = data.filter(r =>
                r.department?.department_name === user.department
            );
        } else {
            // IT/Admin: Get all requests
            response = await apiClient.getAllChangeRequests();
            allRequests = response.data || response;
        }
    } catch (error) {
        console.error('Failed to load requests:', error);
        allRequests = [];
    }
}

// Populate department filter from backend
async function populateDepartmentFilter(user) {
    const select = document.getElementById('departmentFilter');
    if (!select) return;

    try {
        if (user.role === 'hod') {
            // HOD only sees their department
            const option = document.createElement('option');
            option.value = user.department;
            option.textContent = user.department;
            select.appendChild(option);
            select.value = user.department;
            select.disabled = true;
        } else {
            // IT/Admin sees all departments
            const response = await apiClient.getDepartments();
            const departments = response.data || response;
            departments.forEach(dept => {
                const option = document.createElement('option');
                const name = dept.attributes?.department_name || dept.department_name;
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load departments:', error);
    }
}

// Generate report based on current filters
function generateReport() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const department = document.getElementById('departmentFilter').value;

    let filtered = [...allRequests];

    // Filter by department
    if (department) {
        filtered = filtered.filter(r =>
            r.department?.department_name === department
        );
    }

    // Filter by date range
    if (dateFrom) {
        filtered = filtered.filter(r =>
            new Date(r.createdAt) >= new Date(dateFrom)
        );
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59);
        filtered = filtered.filter(r =>
            new Date(r.createdAt) <= toDate
        );
    }

    updateStatistics(filtered);
    updateCharts(filtered);
    updateReportTable(filtered);
    updateDepartmentBreakdown(filtered);
}

// Update summary statistics
function updateStatistics(requests) {
    const total = requests.length;
    const completed = requests.filter(r => r.request_status === 'Completed').length;
    const inProgress = requests.filter(r =>
        r.request_status === 'Development' || r.request_status === 'IT Review'
    ).length;
    const pending = requests.filter(r => r.request_status === 'Pending HOD approval').length;

    document.getElementById('reportTotal').textContent = total;
    document.getElementById('reportCompleted').textContent = completed;
    document.getElementById('reportProgress').textContent = inProgress;
    document.getElementById('reportPending').textContent = pending;
}

// Initialize empty charts
function initializeCharts() {
    // Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Submitted',
                data: [],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366F1',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }, {
                label: 'Completed',
                data: [],
                borderColor: '#22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#22C55E',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        font: { family: 'Inter', size: 12 },
                        color: '#64748B',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: '#0F172A',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: { family: 'Inter', size: 13, weight: '600' },
                    bodyFont: { family: 'Inter', size: 12 },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#E2E8F0', borderDash: [5, 5] },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B', precision: 0 }
                }
            }
        }
    });

    // Status Pill Chart
    const statusCtx = document.getElementById('statusChartPill').getContext('2d');
    statusChartPill = new Chart(statusCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Requests',
                data: [],
                backgroundColor: [],
                borderRadius: 20,
                borderSkipped: false,
                barPercentage: 0.5,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0F172A',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: { family: 'Inter', size: 13, weight: '600' },
                    bodyFont: { family: 'Inter', size: 12 },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#E2E8F0', borderDash: [5, 5] },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B', precision: 0 }
                }
            }
        }
    });

    // Main Status Chart
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    statusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Requests',
                data: [],
                backgroundColor: [],
                borderRadius: 20,
                borderSkipped: false,
                barPercentage: 0.5,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0F172A',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: { family: 'Inter', size: 13, weight: '600' },
                    bodyFont: { family: 'Inter', size: 12 },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#E2E8F0', borderDash: [5, 5] },
                    ticks: { font: { family: 'Inter', size: 12 }, color: '#64748B', precision: 0 }
                }
            }
        }
    });
}

// Update all charts with filtered data
function updateCharts(requests) {
    updateTrendChart(requests);
    updateStatusPillChart(requests);
    updateMainChart(requests);
}

// Update trend chart
function updateTrendChart(requests) {
    const last6Months = getLast6Months();

    const submitted = last6Months.values.map(month =>
        requests.filter(r => r.createdAt?.startsWith(month)).length
    );

    const completed = last6Months.values.map(month =>
        requests.filter(r =>
            r.request_status === 'Completed' &&
            r.updatedAt?.startsWith(month)
        ).length
    );

    trendChart.data.labels = last6Months.labels;
    trendChart.data.datasets[0].data = submitted;
    trendChart.data.datasets[1].data = completed;
    trendChart.update();
}

// Get last 6 months labels and values
function getLast6Months() {
    const months = [];
    const values = [];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        values.push(`${year}-${month}`);
        months.push(labels[date.getMonth()]);
    }

    return { labels: months, values };
}

// Update status pill chart
function updateStatusPillChart(requests) {
    const statusData = {
        'Pending HOD approval': { color: '#f59e0b', label: 'Pending' },
        'IT Review': { color: '#6366F1', label: 'IT Review' },
        'Development': { color: '#8b5cf6', label: 'Development' },
        'Completed': { color: '#22C55E', label: 'Completed' },
        'Rejected': { color: '#ef4444', label: 'Rejected' }
    };

    const counts = Object.keys(statusData).map(status =>
        requests.filter(r => r.request_status === status).length
    );

    statusChartPill.data.labels = Object.values(statusData).map(s => s.label);
    statusChartPill.data.datasets[0].data = counts;
    statusChartPill.data.datasets[0].backgroundColor = Object.values(statusData).map(s => s.color);
    statusChartPill.update();
}

// Update main status chart
function updateMainChart(requests) {
    const statusCounts = {
        'Pending HOD approval': 0,
        'IT Review': 0,
        'Development': 0,
        'Completed': 0,
        'Rejected': 0
    };

    requests.forEach(r => {
        if (Object.prototype.hasOwnProperty.call(statusCounts, r.request_status)) {
            statusCounts[r.request_status]++;
        }
    });

    const colors = ['#f59e0b', '#6366F1', '#8b5cf6', '#22C55E', '#ef4444'];

    statusChart.data.labels = Object.keys(statusCounts);
    statusChart.data.datasets[0].data = Object.values(statusCounts);
    statusChart.data.datasets[0].backgroundColor = colors;
    statusChart.update();
}

// Update report table
function updateReportTable(requests) {
    const tbody = document.getElementById('reportTableBody');

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-400">No data available for selected filters</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(request => {
        const departmentName = request.department?.department_name || 'N/A';
        const formattedDate = new Date(request.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const priorityClass = request.priority === 'High' ? 'bg-red-100 text-red-700' :
            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700';

        const statusClass = request.request_status === 'Completed' ? 'bg-green-100 text-green-700' :
            request.request_status === 'Rejected' ? 'bg-red-100 text-red-700' :
            request.request_status === 'Development' ? 'bg-purple-100 text-purple-700' :
            request.request_status === 'IT Review' ? 'bg-blue-100 text-blue-700' :
            'bg-orange-100 text-orange-700';

        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4"><strong class="text-gray-800">${request.id}</strong></td>
                <td class="px-6 py-4 font-medium text-gray-800">${request.title}</td>
                <td class="px-6 py-4 text-gray-700">${departmentName}</td>
                <td class="px-6 py-4 text-gray-600 text-sm">${request.change_type}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityClass}">
                        ${request.priority}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">
                        ${request.request_status}
                    </span>
                </td>
                <td class="px-6 py-4 text-gray-600 text-sm">${formattedDate}</td>
            </tr>
        `;
    }).join('');
}

// Update department breakdown
function updateDepartmentBreakdown(requests) {
    const container = document.getElementById('departmentBreakdown');

    const deptCounts = {};
    requests.forEach(r => {
        const deptName = r.department?.department_name || 'N/A';
        deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
    });

    const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

    if (sortedDepts.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No data available</p>';
        return;
    }

    container.innerHTML = `
        <div class="space-y-4">
            ${sortedDepts.map(([dept, count]) => {
                const percentage = ((count / requests.length) * 100).toFixed(1);
                return `
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium text-gray-800">${dept}</span>
                            <span class="text-sm text-gray-600">
                                <strong>${count}</strong> requests (${percentage}%)
                            </span>
                        </div>
                        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-visionRed rounded-full transition-all duration-500"
                                style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Export report as CSV
function exportReport() {
    if (allRequests.length === 0) {
        alert('No data to export');
        return;
    }

    const exportData = allRequests.map(r => ({
        'Request ID': r.id,
        'Title': r.title,
        'Department': r.department?.department_name || 'N/A',
        'Section': r.change_ms_section?.section_name || 'N/A',
        'Type': r.change_type,
        'Priority': r.priority,
        'Status': r.request_status,
        'Requestor': r.staff?.staff_name || 'N/A',
        'Date Submitted': new Date(r.createdAt).toLocaleDateString('en-US')
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvRows = [
        headers.join(','),
        ...exportData.map(row =>
            headers.map(header => `"${row[header]}"`).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CMS-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}