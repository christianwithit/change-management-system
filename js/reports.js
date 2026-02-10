/* global checkAuth, API, utils, Chart */

let statusChart = null;
// trendChart and statusChartPill are used in initializeAdditionalCharts
// eslint-disable-next-line no-unused-vars
let trendChart = null;
// eslint-disable-next-line no-unused-vars
let statusChartPill = null;

document.addEventListener('DOMContentLoaded', function () {
    const user = checkAuth();
    if (!user) return;

    // Check if user has access to reports (HOD, IT, or Admin only)
    if (user.role !== 'hod' && user.role !== 'it' && user.role !== 'admin') {
        alert('Access denied. This page is only for HODs, IT personnel, and Administrators.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Show navigation links based on role
    if (user.role === 'hod') {
        document.getElementById('hodReviewLink').style.display = 'flex';
    }
    if (user.role === 'it' || user.role === 'admin') {
        document.getElementById('itReviewLink').style.display = 'flex';
    }

    populateDepartmentFilter();

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    document.getElementById('dateTo').valueAsDate = today;
    document.getElementById('dateFrom').valueAsDate = thirtyDaysAgo;

    initializeAdditionalCharts();
    generateReport();
});

// Event delegation for filter changes
document.addEventListener('change', handleFilterChange);

function handleFilterChange(e) {
    const target = e.target;
    if (target.id === 'reportType' || target.id === 'dateFrom' || 
        target.id === 'dateTo' || target.id === 'departmentFilter') {
        generateReport();
    }
}

// Event delegation for click events
document.addEventListener('click', handleDocumentClick);

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
    }
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

function populateDepartmentFilter() {
    const select = document.getElementById('departmentFilter');
    const departments = API.getDepartments();

    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });
}

function generateReport() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const department = document.getElementById('departmentFilter').value;

    let requests = API.getRequests();

    if (department) {
        requests = requests.filter(r => r.department === department);
    }

    if (dateFrom) {
        requests = requests.filter(r => r.dateSubmitted >= dateFrom);
    }

    if (dateTo) {
        requests = requests.filter(r => r.dateSubmitted <= dateTo);
    }

    updateStatistics(requests);
    drawChart(requests);
    updateReportTable(requests);
    updateDepartmentBreakdown(requests);
}

function updateStatistics(requests) {
    const total = requests.length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const inProgress = requests.filter(r => r.itStatus === 'In Progress').length;
    const pending = requests.filter(r => r.status === 'Pending HOD Approval').length;

    document.getElementById('reportTotal').textContent = total;
    document.getElementById('reportCompleted').textContent = completed;
    document.getElementById('reportProgress').textContent = inProgress;
    document.getElementById('reportPending').textContent = pending;
}

function initializeAdditionalCharts() {
    const allRequests = API.getRequests();

    // Calculate monthly trends for the last 6 months
    const monthlyData = calculateMonthlyTrends(allRequests);

    // Calculate status distribution
    const statusData = calculateStatusDistribution(allRequests);

    // Trend Chart - Curved Line Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Submitted',
                data: monthlyData.submitted,
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
                data: monthlyData.completed,
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
                        font: {
                            family: 'Inter',
                            size: 12
                        },
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
                    titleFont: {
                        family: 'Inter',
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E2E8F0',
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B',
                        precision: 0
                    }
                }
            }
        }
    });

    // Status Pill Chart
    const statusCtx = document.getElementById('statusChartPill').getContext('2d');

    statusChartPill = new Chart(statusCtx, {
        type: 'bar',
        data: {
            labels: statusData.labels,
            datasets: [{
                label: 'Requests',
                data: statusData.counts,
                backgroundColor: statusData.colors,
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
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#0F172A',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: {
                        family: 'Inter',
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E2E8F0',
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B',
                        precision: 0
                    }
                }
            }
        }
    });
}

function calculateMonthlyTrends(requests) {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const monthValues = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

    const submitted = monthValues.map(month => {
        return requests.filter(r => r.dateSubmitted.startsWith(month)).length;
    });

    const completed = monthValues.map(month => {
        return requests.filter(r =>
            r.status === 'Completed' &&
            r.acknowledgmentDate &&
            r.acknowledgmentDate.startsWith(month)
        ).length;
    });

    return { labels: months, submitted, completed };
}

function calculateStatusDistribution(requests) {
    const statusMap = {
        'Pending HOD Approval': { count: 0, color: '#f59e0b', label: 'Pending' },
        'Clarification Needed': { count: 0, color: '#f59e0b', label: 'Pending' },
        'Technical Review': { count: 0, color: '#6366F1', label: 'In Review' },
        'Development': { count: 0, color: '#8b5cf6', label: 'In Progress' },
        'Completed': { count: 0, color: '#22C55E', label: 'Completed' },
        'Rejected': { count: 0, color: '#ef4444', label: 'Rejected' }
    };

    requests.forEach(r => {
        if (statusMap[r.status]) {
            statusMap[r.status].count++;
        }
    });

    // Aggregate similar statuses
    const aggregated = {
        'Pending': statusMap['Pending HOD Approval'].count + statusMap['Clarification Needed'].count,
        'In Review': statusMap['Technical Review'].count,
        'In Progress': statusMap['Development'].count,
        'Completed': statusMap['Completed'].count,
        'Rejected': statusMap['Rejected'].count
    };

    const colors = ['#f59e0b', '#6366F1', '#8b5cf6', '#22C55E', '#ef4444'];

    return {
        labels: Object.keys(aggregated),
        counts: Object.values(aggregated),
        colors: colors
    };
}

function drawChart(requests) {
    const statusCounts = {
        'Pending HOD Approval': 0,
        'Approved': 0,
        'IT Review': 0,
        'In Progress': 0,
        'Completed': 0,
        'Rejected': 0
    };

    requests.forEach(r => {
        if (Object.prototype.hasOwnProperty.call(statusCounts, r.status)) {
            statusCounts[r.status]++;
        }
    });

    const ctx = document.getElementById('chartCanvas').getContext('2d');

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Requests',
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#f59e0b',
                    '#22C55E',
                    '#6366F1',
                    '#8b5cf6',
                    '#22C55E',
                    '#ef4444'
                ],
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
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#0F172A',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: {
                        family: 'Inter',
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E2E8F0',
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#64748B',
                        precision: 0
                    }
                }
            }
        }
    });
}

function updateReportTable(requests) {
    const tbody = document.getElementById('reportTableBody');

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-400">No data available for selected filters</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(request => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4"><strong class="text-gray-800">${request.id}</strong></td>
            <td class="px-6 py-4 font-medium text-gray-800">${request.title}</td>
            <td class="px-6 py-4 text-gray-700">${request.department}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">${request.type}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${request.priority === 'High' ? 'bg-red-100 text-red-700' :
            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
        }">
                    ${request.priority}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${request.status === 'Completed' ? 'bg-green-100 text-green-700' :
            request.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                request.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
        }">
                    ${request.status}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">${utils.formatDate(request.dateSubmitted)}</td>
        </tr>
    `).join('');
}

function updateDepartmentBreakdown(requests) {
    const container = document.getElementById('departmentBreakdown');

    const deptCounts = {};
    requests.forEach(r => {
        deptCounts[r.department] = (deptCounts[r.department] || 0) + 1;
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
                            <span class="text-sm text-gray-600"><strong>${count}</strong> requests (${percentage}%)</span>
                        </div>
                        <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-visionRed rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function exportReport() {
    const requests = API.getRequests();
    const exportData = requests.map(r => ({
        'Request ID': r.id,
        'Title': r.title,
        'Department': r.department,
        'Section': r.section,
        'Type': r.type,
        'Priority': r.priority,
        'Status': r.status,
        'Requestor': r.requestor,
        'Date Submitted': r.dateSubmitted,
        'HOD Approval': r.hodApproval,
        'IT Status': r.itStatus
    }));

    utils.exportToCSV(exportData, `CMS-Report-${new Date().toISOString().split('T')[0]}.csv`);
}
