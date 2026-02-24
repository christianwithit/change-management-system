// Comprehensive Mock Data with Handovers for Vision Group CMS
// Generated: 2026-02-24
// Includes: Projects, Handovers, Development Logs, and Complete Workflow Data

const MOCK_DATA_COMPLETE = {
    // Sample handover documents with fully populated editable fields
    handovers: [
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
                overview: 'The HR Management System is a comprehensive web-based platform designed to automate and streamline all human resource operations at Vision Group. The system provides end-to-end management of employee lifecycle, from recruitment to retirement, including payroll processing, leave management, performance reviews, and employee self-service capabilities. Built with modern web technologies, the system offers a responsive interface accessible from any device, ensuring HR staff and employees can access critical information anytime, anywhere.',
                
                purpose: [
                    'Automate payroll processing and reduce calculation errors by 95%',
                    'Provide employee self-service portal for leave requests and payslip access',
                    'Centralize employee records and eliminate paper-based filing',
                    'Enable real-time HR analytics and reporting for management decisions',
                    'Streamline recruitment workflow and candidate tracking',
                    'Facilitate performance review cycles and goal tracking',
                    'Ensure compliance with labor laws and company policies'
                ],
                
                serverEnvironment: 'VPS - Vision Group Infrastructure (Ubuntu 22.04 LTS, 8GB RAM, 4 vCPU)',
                publicURL: 'https://hr.visiongroup.co.ug',
                intranetAccess: 'Accessible from internal network with SSO authentication via Active Directory',
                sslStatus: 'Enabled',
                databaseLocation: 'PostgreSQL 14 on same VPS instance with daily replication',
                backupStrategy: 'Automated daily backups at 2:00 AM EAT, retained for 90 days, with weekly offsite backups',
                
                systemUsers: [
                    {
                        role: 'Employee',
                        description: 'All Vision Group employees',
                        accessLevel: 'View personal information, download payslips, submit leave requests, update emergency contacts'
                    },
                    {
                        role: 'HR Officer',
                        description: 'HR department staff members',
                        accessLevel: 'Manage employee records, process leave requests, generate reports, handle recruitment'
                    },
                    {
                        role: 'HR Manager',
                        description: 'HR department head and managers',
                        accessLevel: 'Full access to all HR data, approve policies, configure workflows, access analytics dashboard'
                    },
                    {
                        role: 'Payroll Administrator',
                        description: 'Finance team members handling payroll',
                        accessLevel: 'Process payroll, manage deductions, generate payment files, tax reporting'
                    },
                    {
                        role: 'Department Manager',
                        description: 'Heads of departments across the organization',
                        accessLevel: 'View team information, approve leave requests, conduct performance reviews'
                    },
                    {
                        role: 'System Administrator',
                        description: 'IT support team',
                        accessLevel: 'System configuration, user management, backup management, technical support, monitoring'
                    }
                ],
                
                currentStatus: [
                    { component: 'Core System', status: 'Functional', remarks: 'All modules tested and operational - payroll, leave, recruitment, performance' },
                    { component: 'User Interface', status: 'Functional', remarks: 'Responsive design tested on desktop, tablet, and mobile devices' },
                    { component: 'Employee Portal', status: 'Functional', remarks: 'Self-service features fully operational with SSO integration' },
                    { component: 'Payroll Module', status: 'Functional', remarks: 'Automated calculations, tax deductions, and payment file generation working' },
                    { component: 'Reporting Engine', status: 'Functional', remarks: 'Real-time dashboards and 25+ standard reports available' },
                    { component: 'Mobile App', status: 'Completed', remarks: 'iOS and Android apps published to stores and available for download' },
                    { component: 'API Integration', status: 'Functional', remarks: 'Connected to Active Directory, email system, and finance system' },
                    { component: 'Documentation', status: 'Completed', remarks: 'User manuals, admin guides, and API documentation delivered' },
                    { component: 'Training', status: 'Completed', remarks: 'HR staff trained (Feb 10-12), employee orientation videos created' },
                    { component: 'Testing', status: 'Completed', remarks: 'UAT completed with HR team, all critical issues resolved' },
                    { component: 'Security Audit', status: 'Completed', remarks: 'Penetration testing passed, security recommendations implemented' },
                    { component: 'Deployment', status: 'Ready', remarks: 'Production environment configured and ready for go-live' }
                ]
            },
            
            signatures: [
                {
                    sequence: 1,
                    role: 'Project Developer',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-15T10:30:00',
                    signedBy: 'Felix Ssembajjwe Bashabe',
                    ipAddress: '192.168.1.45',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'System fully developed and tested. All deliverables completed including mobile apps and API integrations.',
                    conditions: []
                },
                {
                    sequence: 2,
                    role: 'Project Manager',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-16T09:15:00',
                    signedBy: 'Felix Ssembajjwe Bashabe',
                    ipAddress: '192.168.1.45',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'Project delivered on time and within budget. All stakeholder requirements met.',
                    conditions: []
                },
                {
                    sequence: 3,
                    role: 'Information Security',
                    assignedTo: 'Emmanuel Cliff Mughanwa',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-17T14:20:00',
                    signedBy: 'Emmanuel Cliff Mughanwa',
                    ipAddress: '192.168.1.52',
                    checklistResponses: {
                        security_audit_passed: true,
                        access_control_approved: true,
                        backup_confirmed: true
                    },
                    comments: 'Security audit passed. SSL configured correctly. Recommend quarterly security reviews.',
                    conditions: ['Implement quarterly security audits', 'Enable two-factor authentication for admin users']
                },
                {
                    sequence: 4,
                    role: 'Head of Technology',
                    assignedTo: 'Paul Ikanza',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-18T11:00:00',
                    signedBy: 'Paul Ikanza',
                    ipAddress: '192.168.1.30',
                    checklistResponses: {
                        infrastructure_acknowledged: true,
                        maintenance_accepted: true,
                        it_support_confirmed: true
                    },
                    comments: 'System architecture is solid. IT team briefed on maintenance procedures. Approved for production deployment.',
                    conditions: []
                },
                {
                    sequence: 5,
                    role: 'End User (HR)',
                    assignedTo: 'Agatha Joyday Gloria',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-19T10:30:00',
                    signedBy: 'Agatha Joyday Gloria',
                    ipAddress: '192.168.1.78',
                    checklistResponses: {
                        training_confirmed: true,
                        workflow_understood: true,
                        operational_responsibility: true
                    },
                    comments: 'HR team is well-trained and ready to use the system. The interface is intuitive and meets our needs.',
                    conditions: []
                },
                {
                    sequence: 6,
                    role: 'End User (HOD)',
                    assignedTo: 'Marjorie Nalubowa',
                    assignedDate: '2026-02-15',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-20T09:00:00',
                    signedBy: 'Marjorie Nalubowa',
                    ipAddress: '192.168.1.65',
                    checklistResponses: {
                        training_confirmed: true,
                        requirements_met: true,
                        operational_responsibility: true
                    },
                    comments: 'System exceeds expectations. Will significantly improve HR operations. Ready for organization-wide rollout.',
                    conditions: []
                }
            ]
        },
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
                overview: 'The Inventory Management System is a real-time tracking solution designed to manage Vision Group\'s warehouse operations, stock levels, and supply chain logistics. The system features barcode scanning capabilities, automated reorder alerts, supplier management, and comprehensive reporting. It integrates with the procurement system for seamless purchase order processing and with the finance system for inventory valuation and cost tracking.',
                
                purpose: [
                    'Provide real-time visibility of stock levels across all warehouses',
                    'Automate reorder processes and prevent stock-outs',
                    'Reduce inventory discrepancies through barcode scanning',
                    'Track item movement from receipt to dispatch',
                    'Generate accurate inventory valuation reports',
                    'Optimize warehouse space utilization',
                    'Improve supplier performance tracking'
                ],
                
                serverEnvironment: 'VPS - Vision Group Infrastructure (Ubuntu 22.04 LTS, 16GB RAM, 8 vCPU)',
                publicURL: null,
                intranetAccess: 'Internal network only, accessible via VPN for remote warehouse locations',
                sslStatus: 'Enabled',
                databaseLocation: 'MySQL 8.0 on dedicated database server with master-slave replication',
                backupStrategy: 'Real-time replication to backup server, hourly snapshots, daily full backups retained for 60 days',
                
                systemUsers: [
                    {
                        role: 'Warehouse Staff',
                        description: 'Warehouse operators and stock clerks',
                        accessLevel: 'Scan items, record receipts and dispatches, view stock levels, print labels'
                    },
                    {
                        role: 'Warehouse Supervisor',
                        description: 'Warehouse managers and supervisors',
                        accessLevel: 'Approve stock adjustments, manage locations, generate reports, oversee operations'
                    },
                    {
                        role: 'Procurement Officer',
                        description: 'Procurement team members',
                        accessLevel: 'View stock levels, create purchase requisitions, track orders, manage suppliers'
                    },
                    {
                        role: 'Finance Officer',
                        description: 'Finance team for inventory valuation',
                        accessLevel: 'View inventory values, generate financial reports, audit stock movements'
                    },
                    {
                        role: 'System Administrator',
                        description: 'IT support team',
                        accessLevel: 'System configuration, user management, backup management, hardware integration'
                    }
                ],
                
                currentStatus: [
                    { component: 'Core System', status: 'Functional', remarks: 'Stock management, receipts, dispatches, and transfers working' },
                    { component: 'Barcode Integration', status: 'Functional', remarks: 'Zebra scanners configured and tested with all item types' },
                    { component: 'Mobile App', status: 'Functional', remarks: 'Android app for warehouse staff deployed on handheld devices' },
                    { component: 'Reporting Module', status: 'Functional', remarks: 'Stock reports, movement reports, and valuation reports available' },
                    { component: 'API Integration', status: 'Functional', remarks: 'Connected to procurement and finance systems' },
                    { component: 'Documentation', status: 'Completed', remarks: 'User manuals and SOPs for warehouse operations' },
                    { component: 'Training', status: 'Completed', remarks: 'Warehouse staff trained on system and barcode scanners' },
                    { component: 'Testing', status: 'Completed', remarks: 'UAT completed with warehouse team, pilot run successful' },
                    { component: 'Deployment', status: 'Ready', remarks: 'Ready for production rollout across all warehouses' }
                ]
            },
            
            signatures: [
                {
                    sequence: 1,
                    role: 'Project Developer',
                    assignedTo: 'Emmanuel Cliff Mughanwa',
                    assignedDate: '2026-02-18',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-18T11:00:00',
                    signedBy: 'Emmanuel Cliff Mughanwa',
                    ipAddress: '192.168.1.52',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'System completed with barcode integration. Mobile app tested on warehouse devices.',
                    conditions: []
                },
                {
                    sequence: 2,
                    role: 'Project Manager',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: '2026-02-18',
                    status: 'pending',
                    stage: 'active',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 3,
                    role: 'Information Security',
                    assignedTo: 'Emmanuel Cliff Mughanwa',
                    assignedDate: '2026-02-18',
                    status: 'pending',
                    stage: 'active',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 4,
                    role: 'Head of Technology',
                    assignedTo: 'Paul Ikanza',
                    assignedDate: '2026-02-18',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 5,
                    role: 'End User (HR)',
                    assignedTo: 'Agatha Joyday Gloria',
                    assignedDate: '2026-02-18',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 6,
                    role: 'End User (HOD)',
                    assignedTo: 'Marjorie Nalubowa',
                    assignedDate: '2026-02-18',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                }
            ]
        },
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
                overview: 'The Customer Portal is a self-service web platform that enables Vision Group customers to manage their accounts, submit support tickets, track orders, make payments, and access resources online. The portal features a modern, user-friendly interface with mobile responsiveness, integrated payment gateway, real-time chat support, and a comprehensive knowledge base. It aims to reduce call center volume by 60% while improving customer satisfaction.',
                
                purpose: [
                    'Enable customers to manage accounts and services online 24/7',
                    'Reduce call center volume through self-service capabilities',
                    'Provide real-time order tracking and status updates',
                    'Facilitate online payments with multiple payment methods',
                    'Offer instant support through chatbot and live chat',
                    'Build customer knowledge base with FAQs and tutorials',
                    'Collect customer feedback and satisfaction ratings'
                ],
                
                serverEnvironment: 'AWS EC2 (t3.large instances) with auto-scaling and load balancing',
                publicURL: 'https://portal.visiongroup.co.ug',
                intranetAccess: 'Public access with secure customer authentication',
                sslStatus: 'Enabled',
                databaseLocation: 'AWS RDS PostgreSQL with Multi-AZ deployment for high availability',
                backupStrategy: 'Automated daily snapshots, point-in-time recovery enabled, 30-day retention',
                
                systemUsers: [
                    {
                        role: 'Customer',
                        description: 'Vision Group customers and clients',
                        accessLevel: 'Manage profile, view orders, make payments, submit tickets, access resources'
                    },
                    {
                        role: 'Support Agent',
                        description: 'Customer service representatives',
                        accessLevel: 'View customer accounts, respond to tickets, access chat system, view analytics'
                    },
                    {
                        role: 'Support Manager',
                        description: 'Customer service managers',
                        accessLevel: 'Full support access, manage agents, configure workflows, access reports'
                    },
                    {
                        role: 'Content Manager',
                        description: 'Marketing team managing portal content',
                        accessLevel: 'Update knowledge base, manage FAQs, publish announcements'
                    },
                    {
                        role: 'System Administrator',
                        description: 'IT support team',
                        accessLevel: 'System configuration, user management, integration management, monitoring'
                    }
                ],
                
                currentStatus: [
                    { component: 'Core Portal', status: 'Functional', remarks: 'Account management, profile updates, and dashboard working' },
                    { component: 'Payment Gateway', status: 'Functional', remarks: 'Integrated with Flutterwave - card and mobile money payments tested' },
                    { component: 'Ticketing System', status: 'Functional', remarks: 'Support ticket creation, tracking, and resolution workflow operational' },
                    { component: 'Live Chat', status: 'Functional', remarks: 'Real-time chat with agents and AI chatbot for common queries' },
                    { component: 'Knowledge Base', status: 'Completed', remarks: '50+ articles published covering common customer questions' },
                    { component: 'Mobile Interface', status: 'Functional', remarks: 'Responsive design tested on iOS and Android devices' },
                    { component: 'Email Notifications', status: 'Functional', remarks: 'Automated emails for account activities and ticket updates' },
                    { component: 'Documentation', status: 'Completed', remarks: 'Customer user guide and support team manual' },
                    { component: 'Testing', status: 'Completed', remarks: 'Beta testing with 50 customers completed successfully' },
                    { component: 'Deployment', status: 'Ready', remarks: 'Production environment on AWS ready for launch' }
                ]
            },
            
            signatures: [
                {
                    sequence: 1,
                    role: 'Project Developer',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: '2026-02-20',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-20T15:30:00',
                    signedBy: 'Felix Ssembajjwe Bashabe',
                    ipAddress: '192.168.1.45',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'Portal fully functional with payment gateway integration. Beta testing successful.',
                    conditions: []
                },
                {
                    sequence: 2,
                    role: 'Project Manager',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: '2026-02-20',
                    status: 'approved',
                    stage: 'completed',
                    signedDate: '2026-02-21T10:00:00',
                    signedBy: 'Felix Ssembajjwe Bashabe',
                    ipAddress: '192.168.1.45',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'Project completed on schedule. Customer feedback from beta testing is very positive.',
                    conditions: []
                },
                {
                    sequence: 3,
                    role: 'Information Security',
                    assignedTo: 'Emmanuel Cliff Mughanwa',
                    assignedDate: '2026-02-20',
                    status: 'pending',
                    stage: 'active',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 4,
                    role: 'Head of Technology',
                    assignedTo: 'Paul Ikanza',
                    assignedDate: '2026-02-20',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 5,
                    role: 'End User (HR)',
                    assignedTo: 'Agatha Joyday Gloria',
                    assignedDate: '2026-02-20',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                },
                {
                    sequence: 6,
                    role: 'End User (HOD)',
                    assignedTo: 'Marjorie Nalubowa',
                    assignedDate: '2026-02-20',
                    status: 'pending',
                    stage: 'locked',
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                }
            ]
        }
    ],

    // Projects that can have handovers initiated
    projectsReadyForHandover: [
        {
            id: 'CR-2026-004',
            title: 'Document Management System',
            description: 'Digital document storage and retrieval system with OCR capabilities',
            type: 'New System Proposal',
            department: 'Administration',
            section: 'Records',
            requestor: 'John Okello',
            dateSubmitted: '2026-01-10',
            status: 'Development',
            workflowStage: 'Development',
            developmentStatus: 'Completed',
            priority: 'High',
            assignedDeveloper: 'Emmanuel Cliff Mughanwa',
            estimatedTime: '8 weeks',
            estimatedCost: '12,000,000 UGX',
            handoverInitiated: false
        },
        {
            id: 'CR-2026-005',
            title: 'Fleet Management System',
            description: 'Vehicle tracking and maintenance management system with GPS integration',
            type: 'New System Proposal',
            department: 'Operations',
            section: 'Transport',
            requestor: 'Mary Achieng',
            dateSubmitted: '2026-01-12',
            status: 'Development',
            workflowStage: 'Development',
            developmentStatus: 'Completed',
            priority: 'Medium',
            assignedDeveloper: 'Felix Ssembajjwe Bashabe',
            estimatedTime: '10 weeks',
            estimatedCost: '15,000,000 UGX',
            handoverInitiated: false
        }
    ]
};

// Initialize handovers in localStorage
if (typeof window !== 'undefined') {
    localStorage.setItem('handovers', JSON.stringify(MOCK_DATA_COMPLETE.handovers));
    console.log('✅ Mock handover data loaded:', MOCK_DATA_COMPLETE.handovers.length, 'handovers');
}

// Export for use in other files
window.MOCK_DATA_COMPLETE = MOCK_DATA_COMPLETE;
