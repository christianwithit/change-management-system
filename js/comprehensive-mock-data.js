// Comprehensive Mock Data for Vision Group CMS - Complete Testing Dataset
// Generated: 2026-02-24
// This file provides complete mock data for testing all features

const COMPREHENSIVE_MOCK_DATA = {
    // ============ HANDOVER DOCUMENTS ============
    handovers: [
        // Completed Handover #1
        {
            id: 'HO-2026-001',
            projectId: 'CR-2026-001',
            projectTitle: 'HR Management System',
            projectDepartment: 'Human Resources',
            initiatedBy: 'Felix Ssembajjwe Bashabe',
            initiatedDate: '2026-02-15',
            status: 'completed',
            attempt: 1,
            completedDate: '2026-02-20',
            systemSpecs: {
                overview: 'The HR Management System is a comprehensive web-based platform designed to automate and streamline all human resource operations at Vision Group. The system provides end-to-end management of employee lifecycle, from recruitment to retirement, including payroll processing, leave management, performance reviews, and employee self-service capabilities.',
                purpose: [
                    'Automate payroll processing and reduce calculation errors by 95%',
                    'Provide employee self-service portal for leave requests and payslip access',
                    'Centralize employee records and eliminate paper-based filing',
                    'Enable real-time HR analytics and reporting for management decisions'
                ],
                serverEnvironment: 'VPS - Vision Group Infrastructure (Ubuntu 22.04 LTS, 8GB RAM)',
                publicURL: 'https://hr.visiongroup.co.ug',
                intranetAccess: 'Accessible from internal network with SSO authentication',
                sslStatus: 'Enabled',
                databaseLocation: 'PostgreSQL 14 on same VPS instance',
                backupStrategy: 'Automated daily backups at 2:00 AM, retained for 90 days',
                systemUsers: [
                    { role: 'Employee', description: 'All Vision Group employees', accessLevel: 'View personal info, download payslips, submit leave' },
                    { role: 'HR Officer', description: 'HR department staff', accessLevel: 'Manage employee records, process requests, generate reports' },
                    { role: 'System Administrator', description: 'IT support team', accessLevel: 'System configuration, user management, monitoring' }
                ],
                currentStatus: [
                    { component: 'Core System', status: 'Functional', remarks: 'All modules tested and operational' },
                    { component: 'Mobile App', status: 'Completed', remarks: 'iOS and Android apps published' },
                    { component: 'Documentation', status: 'Completed', remarks: 'User manuals delivered' }
                ]
            },
            signatures: [
                { sequence: 1, role: 'Project Developer', assignedTo: 'Felix Ssembajjwe Bashabe', status: 'approved', stage: 'completed', signedDate: '2026-02-15T10:30:00', signedBy: 'Felix Ssembajjwe Bashabe', comments: 'System fully developed and tested' },
                { sequence: 2, role: 'Project Manager', assignedTo: 'Felix Ssembajjwe Bashabe', status: 'approved', stage: 'completed', signedDate: '2026-02-16T09:15:00', signedBy: 'Felix Ssembajjwe Bashabe', comments: 'Project delivered on time' },
                { sequence: 3, role: 'Information Security', assignedTo: 'Emmanuel Cliff Mughanwa', status: 'approved', stage: 'completed', signedDate: '2026-02-17T14:20:00', signedBy: 'Emmanuel Cliff Mughanwa', comments: 'Security audit passed' },
                { sequence: 4, role: 'Head of Technology', assignedTo: 'Paul Ikanza', status: 'approved', stage: 'completed', signedDate: '2026-02-18T11:00:00', signedBy: 'Paul Ikanza', comments: 'Approved for production' },
                { sequence: 5, role: 'End User (HR)', assignedTo: 'Agatha Joyday Gloria', status: 'approved', stage: 'completed', signedDate: '2026-02-19T10:30:00', signedBy: 'Agatha Joyday Gloria', comments: 'HR team ready to use' },
                { sequence: 6, role: 'End User (HOD)', assignedTo: 'Marjorie Nalubowa', status: 'approved', stage: 'completed', signedDate: '2026-02-20T09:00:00', signedBy: 'Marjorie Nalubowa', comments: 'System exceeds expectations' }
            ]
        },
        // In-Progress Handover #2
        {
            id: 'HO-2026-002',
            projectId: 'CR-2026-002',
            projectTitle: 'Inventory Management System',
            projectDepartment: 'Operations',
            initiatedBy: 'Emmanuel Cliff Mughanwa',
            initiatedDate: '2026-02-18',
            status: 'in-progress',
            attempt: 1,
            systemSpecs: {
                overview: 'Real-time inventory tracking solution with barcode scanning, automated reorder alerts, and comprehensive reporting.',
                purpose: [
                    'Provide real-time visibility of stock levels',
                    'Automate reorder processes',
                    'Reduce inventory discrepancies through barcode scanning'
                ],
                serverEnvironment: 'VPS - Vision Group Infrastructure (Ubuntu 22.04, 16GB RAM)',
                publicURL: null,
                intranetAccess: 'Internal network only, VPN for remote warehouses',
                sslStatus: 'Enabled',
                databaseLocation: 'MySQL 8.0 with master-slave replication',
                backupStrategy: 'Hourly snapshots, daily full backups',
                systemUsers: [
                    { role: 'Warehouse Staff', description: 'Warehouse operators', accessLevel: 'Scan items, record movements' },
                    { role: 'System Administrator', description: 'IT support', accessLevel: 'System configuration, hardware integration' }
                ],
                currentStatus: [
                    { component: 'Core System', status: 'Functional', remarks: 'Stock management working' },
                    { component: 'Barcode Integration', status: 'Functional', remarks: 'Scanners configured' }
                ]
            },
            signatures: [
                { sequence: 1, role: 'Project Developer', assignedTo: 'Emmanuel Cliff Mughanwa', status: 'approved', stage: 'completed', signedDate: '2026-02-18T11:00:00', signedBy: 'Emmanuel Cliff Mughanwa', comments: 'System completed' },
                { sequence: 2, role: 'Project Manager', assignedTo: 'Felix Ssembajjwe Bashabe', status: 'pending', stage: 'active', signedDate: null, signedBy: null, comments: null },
                { sequence: 3, role: 'Information Security', assignedTo: 'Emmanuel Cliff Mughanwa', status: 'pending', stage: 'active', signedDate: null, signedBy: null, comments: null },
                { sequence: 4, role: 'Head of Technology', assignedTo: 'Paul Ikanza', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null },
                { sequence: 5, role: 'End User (HR)', assignedTo: 'Agatha Joyday Gloria', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null },
                { sequence: 6, role: 'End User (HOD)', assignedTo: 'Marjorie Nalubowa', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null }
            ]
        },
        // In-Progress Handover #3
        {
            id: 'HO-2026-003',
            projectId: 'CR-2026-003',
            projectTitle: 'Customer Portal',
            projectDepartment: 'Customer Service',
            initiatedBy: 'Felix Ssembajjwe Bashabe',
            initiatedDate: '2026-02-20',
            status: 'in-progress',
            attempt: 1,
            systemSpecs: {
                overview: 'Self-service customer portal with account management, support tickets, payments, and knowledge base.',
                purpose: [
                    'Enable 24/7 customer self-service',
                    'Reduce call center volume by 60%',
                    'Facilitate online payments'
                ],
                serverEnvironment: 'AWS EC2 with auto-scaling',
                publicURL: 'https://portal.visiongroup.co.ug',
                intranetAccess: 'Public access with secure authentication',
                sslStatus: 'Enabled',
                databaseLocation: 'AWS RDS PostgreSQL Multi-AZ',
                backupStrategy: 'Automated snapshots, 30-day retention',
                systemUsers: [
                    { role: 'Customer', description: 'Vision Group customers', accessLevel: 'Manage profile, make payments, submit tickets' },
                    { role: 'Support Agent', description: 'Customer service reps', accessLevel: 'View accounts, respond to tickets' }
                ],
                currentStatus: [
                    { component: 'Core Portal', status: 'Functional', remarks: 'Account management working' },
                    { component: 'Payment Gateway', status: 'Functional', remarks: 'Flutterwave integrated' }
                ]
            },
            signatures: [
                { sequence: 1, role: 'Project Developer', assignedTo: 'Felix Ssembajjwe Bashabe', status: 'approved', stage: 'completed', signedDate: '2026-02-20T15:30:00', signedBy: 'Felix Ssembajjwe Bashabe', comments: 'Portal fully functional' },
                { sequence: 2, role: 'Project Manager', assignedTo: 'Felix Ssembajjwe Bashabe', status: 'approved', stage: 'completed', signedDate: '2026-02-21T10:00:00', signedBy: 'Felix Ssembajjwe Bashabe', comments: 'Project on schedule' },
                { sequence: 3, role: 'Information Security', assignedTo: 'Emmanuel Cliff Mughanwa', status: 'pending', stage: 'active', signedDate: null, signedBy: null, comments: null },
                { sequence: 4, role: 'Head of Technology', assignedTo: 'Paul Ikanza', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null },
                { sequence: 5, role: 'End User (HR)', assignedTo: 'Agatha Joyday Gloria', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null },
                { sequence: 6, role: 'End User (HOD)', assignedTo: 'Marjorie Nalubowa', status: 'pending', stage: 'locked', signedDate: null, signedBy: null, comments: null }
            ]
        }
    ],

    // ============ PROJECTS AT VARIOUS STAGES ============
    projects: [
        // Completed projects with handovers
        { id: 'CR-2026-001', title: 'HR Management System', department: 'Human Resources', status: 'Deployed', workflowStage: 'Completed', developmentStatus: 'Completed', handoverInitiated: true, handoverId: 'HO-2026-001', priority: 'High', assignedDeveloper: 'Felix Ssembajjwe Bashabe' },
        { id: 'CR-2026-002', title: 'Inventory Management System', department: 'Operations', status: 'Development', workflowStage: 'Development', developmentStatus: 'Completed', handoverInitiated: true, handoverId: 'HO-2026-002', priority: 'High', assignedDeveloper: 'Emmanuel Cliff Mughanwa' },
        { id: 'CR-2026-003', title: 'Customer Portal', department: 'Customer Service', status: 'Development', workflowStage: 'Development', developmentStatus: 'Completed', handoverInitiated: true, handoverId: 'HO-2026-003', priority: 'High', assignedDeveloper: 'Felix Ssembajjwe Bashabe' },
        
        // Ready for handover (completed but not initiated)
        { id: 'CR-2026-004', title: 'Document Management System', department: 'Administration', status: 'Development', workflowStage: 'Development', developmentStatus: 'Completed', handoverInitiated: false, priority: 'High', assignedDeveloper: 'Emmanuel Cliff Mughanwa', description: 'Digital document storage with OCR' },
        { id: 'CR-2026-005', title: 'Fleet Management System', department: 'Operations', status: 'Development', workflowStage: 'Development', developmentStatus: 'Completed', handoverInitiated: false, priority: 'Medium', assignedDeveloper: 'Felix Ssembajjwe Bashabe', description: 'Vehicle tracking with GPS' },
        
        // In development
        { id: 'CR-2026-006', title: 'Asset Management System', department: 'Finance', status: 'Development', workflowStage: 'Development', developmentStatus: 'Development', priority: 'Medium', assignedDeveloper: 'Emmanuel Cliff Mughanwa' },
        { id: 'CR-2026-007', title: 'Training Portal', department: 'Human Resources', status: 'Development', workflowStage: 'Development', developmentStatus: 'Development', priority: 'Low', assignedDeveloper: 'Felix Ssembajjwe Bashabe' },
        
        // Pending allocation
        { id: 'CR-2026-008', title: 'Visitor Management System', department: 'Administration', status: 'Head of Tech Review', workflowStage: 'Head of Tech Review', priority: 'Medium', hodApproval: 'Approved' },
        { id: 'CR-2026-009', title: 'Event Management System', department: 'Marketing', status: 'Head of Tech Review', workflowStage: 'Head of Tech Review', priority: 'Low', hodApproval: 'Approved' },
        
        // Pending HOD review
        { id: 'CR-2026-010', title: 'Procurement System', department: 'Procurement', status: 'Pending HOD Approval', workflowStage: 'HOD Review', priority: 'High', hodApproval: 'Pending' }
    ],

    // ============ SAMPLE USERS ============
    users: [
        { username: 'felix', password: 'password', fullName: 'Felix Ssembajjwe Bashabe', role: 'it', department: 'IT Department', email: 'felix@visiongroup.co.ug' },
        { username: 'emmanuel', password: 'password', fullName: 'Emmanuel Cliff Mughanwa', role: 'it', department: 'IT Department', email: 'emmanuel@visiongroup.co.ug' },
        { username: 'paul', password: 'password', fullName: 'Paul Ikanza', role: 'admin', department: 'IT Department', email: 'paul@visiongroup.co.ug' },
        { username: 'agatha', password: 'password', fullName: 'Agatha Joyday Gloria', role: 'hod', department: 'Human Resources', email: 'agatha@visiongroup.co.ug' },
        { username: 'marjorie', password: 'password', fullName: 'Marjorie Nalubowa', role: 'hod', department: 'Operations', email: 'marjorie@visiongroup.co.ug' },
        { username: 'staff', password: 'password', fullName: 'John Okello', role: 'staff', department: 'Administration', email: 'john@visiongroup.co.ug' }
    ]
};

// Initialize data in localStorage and API
(function initializeMockData() {
    if (typeof window === 'undefined') return;

    console.log('🚀 Loading comprehensive mock data...');

    // Load handovers
    localStorage.setItem('handovers', JSON.stringify(COMPREHENSIVE_MOCK_DATA.handovers));
    if (window.API) {
        window.API.handovers = COMPREHENSIVE_MOCK_DATA.handovers;
    }

    // Update projects in API
    if (window.API && window.API.requests) {
        COMPREHENSIVE_MOCK_DATA.projects.forEach(project => {
            const existing = window.API.requests.find(r => r.id === project.id);
            if (existing) {
                Object.assign(existing, project);
            } else {
                window.API.requests.push(project);
            }
        });
    }

    // Save users
    localStorage.setItem('sampleUsers', JSON.stringify(COMPREHENSIVE_MOCK_DATA.users));

    console.log('✅ Mock data loaded successfully!');
    console.log('📊 Summary:');
    console.log('  - Handovers:', COMPREHENSIVE_MOCK_DATA.handovers.length);
    console.log('  - Projects:', COMPREHENSIVE_MOCK_DATA.projects.length);
    console.log('  - Users:', COMPREHENSIVE_MOCK_DATA.users.length);
    console.log('\n🔐 Test Credentials:');
    COMPREHENSIVE_MOCK_DATA.users.forEach(u => {
        console.log(`  ${u.fullName} (${u.role}): ${u.username} / ${u.password}`);
    });
})();

window.COMPREHENSIVE_MOCK_DATA = COMPREHENSIVE_MOCK_DATA;
