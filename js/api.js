// Mock API for demonstration purposes
// In production, replace with actual API calls

const API = {
    // Initialize with mock data (will be loaded from mock-data.js if available)
    requests: window.MOCK_DATA ? [...window.MOCK_DATA.requests] : [
        {
            id: 'CR-2026-001',
            title: 'Implement Automated Payroll System',
            description: 'Need to automate the current manual payroll process to reduce errors and save time',
            type: 'New System Proposal',
            department: 'Human Resources',
            section: 'Payroll',
            requestor: 'Sarah Nakato',
            dateSubmitted: '2026-01-15',
            
            // Workflow Status (matches diagram)
            status: 'Development', // Current stage
            workflowStage: 'Development', // Requestor, HOD Review, Technical Review, Development, Completed, Rejected
            
            // HOD Review
            hodApproval: 'Approved',
            hodComments: 'Approved - critical for HR efficiency',
            hodApprovedDate: '2026-01-16',
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Accepted',
            itDecision: 'Accepted', // Accepted, Rejected, Deferred
            itReviewDate: '2026-01-17',
            feasibilityNotes: 'Feasible with existing infrastructure',
            
            // Methodology & Development
            methodology: 'Implement using existing HR system API, develop custom payroll module',
            deliverables: 'Payroll automation module, user documentation, training materials',
            estimatedTime: '6 weeks',
            estimatedCost: '5,000,000 UGX',
            risks: 'Data migration complexity - mitigated by phased rollout',
            
            // Development Progress
            developmentStatus: 'In Progress', // Not Started, In Progress, Testing, Completed
            documentationUploaded: false,
            trainingConducted: false,
            completionReportGenerated: false,
            
            // Timeline Data (NEW - for warning system)
            timelineStartDate: '2026-02-01',
            timelineDuration: 12,
            timelineDeadline: '2026-02-12', // Due in 2 days - should show warning
            
            // Solution Review & Acknowledgment
            solutionDelivered: false,
            acknowledgmentStatus: 'Pending', // Pending, Acknowledged
            acknowledgmentDate: null,
            acknowledgmentNotes: null,
            
            priority: 'High',
            justification: 'Current manual process takes 5 days per month and has 15% error rate',
            expectedBenefits: 'Reduce processing time to 1 day, eliminate errors, save 20 hours/month'
        },
        {
            id: 'CR-2026-002',
            title: 'Upgrade Document Management System',
            description: 'Current DMS is slow and lacks search functionality',
            type: 'Enhancement to Existing System',
            department: 'Administration',
            section: 'Records',
            requestor: 'John Okello',
            dateSubmitted: '2026-01-20',
            
            // Workflow Status
            status: 'Clarification Needed',
            workflowStage: 'HOD Review',
            
            // HOD Review
            hodApproval: 'Clarification Needed',
            hodComments: 'Please provide more details on expected search improvements',
            hodApprovedDate: null,
            clarificationNeeded: true,
            clarificationNotes: 'Need specific requirements for search functionality',
            
            // Technical Review
            itStatus: 'Not Started',
            itDecision: null,
            itReviewDate: null,
            feasibilityNotes: null,
            
            // Methodology & Development
            methodology: null,
            deliverables: null,
            estimatedTime: null,
            estimatedCost: null,
            risks: null,
            
            // Development Progress
            developmentStatus: 'Not Started',
            documentationUploaded: false,
            trainingConducted: false,
            completionReportGenerated: false,
            
            // Solution Review & Acknowledgment
            solutionDelivered: false,
            acknowledgmentStatus: 'Pending',
            acknowledgmentDate: null,
            acknowledgmentNotes: null,
            
            priority: 'Medium',
            justification: 'Staff spend 2 hours daily searching for documents',
            expectedBenefits: 'Improve search speed by 80%, better organization'
        },
        {
            id: 'CR-2026-003',
            title: 'Automate Inventory Tracking',
            description: 'Implement barcode scanning for warehouse inventory',
            type: 'Process Automation',
            department: 'Operations',
            section: 'Warehouse',
            requestor: 'Mary Achieng',
            dateSubmitted: '2026-01-25',
            
            // Workflow Status
            status: 'Development',
            workflowStage: 'Development',
            
            // HOD Review
            hodApproval: 'Approved',
            hodComments: 'Approved - will improve warehouse efficiency',
            hodApprovedDate: '2026-01-26',
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Accepted',
            itDecision: 'Accepted',
            itReviewDate: '2026-01-27',
            feasibilityNotes: 'Feasible - barcode scanner integration approved',
            
            // Methodology & Development
            methodology: 'Integrate barcode scanners with inventory system',
            deliverables: 'Scanner integration, mobile app, training',
            estimatedTime: '3 weeks',
            estimatedCost: '3,000,000 UGX',
            risks: 'Hardware compatibility - mitigated by testing',
            
            // Development Progress
            developmentStatus: 'Development',
            documentationUploaded: false,
            trainingConducted: false,
            completionReportGenerated: false,
            
            // Timeline Data (NEW - OVERDUE)
            timelineStartDate: '2026-02-01',
            timelineDuration: 7,
            timelineDeadline: '2026-02-07', // 3 days overdue - should show critical warning
            
            // Solution Review & Acknowledgment
            solutionDelivered: false,
            acknowledgmentStatus: 'Pending',
            acknowledgmentDate: null,
            acknowledgmentNotes: null,
            
            priority: 'High',
            justification: 'Manual counting leads to stock discrepancies',
            expectedBenefits: 'Real-time inventory visibility, reduce stock-outs by 50%'
        },
        {
            id: 'CR-2026-004',
            title: 'Mobile App for Field Sales Team',
            description: 'Develop mobile application for sales team to submit orders on the go',
            type: 'New System Proposal',
            department: 'Sales',
            section: 'Field Sales',
            requestor: 'David Musoke',
            dateSubmitted: '2026-01-28',
            
            // Workflow Status
            status: 'Completed',
            workflowStage: 'Completed',
            
            // HOD Review
            hodApproval: 'Approved',
            hodComments: 'Critical for sales team productivity',
            hodApprovedDate: '2026-01-29',
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Accepted',
            itDecision: 'Accepted',
            itReviewDate: '2026-01-30',
            feasibilityNotes: 'Feasible - will use React Native for cross-platform development',
            
            // Methodology & Development
            methodology: 'React Native mobile app with REST API integration to existing sales system',
            deliverables: 'iOS and Android apps, API documentation, user training materials',
            estimatedTime: '8 weeks',
            estimatedCost: '8,000,000 UGX',
            risks: 'App store approval delays - mitigated by early submission',
            
            // Development Progress
            developmentStatus: 'Completed',
            documentationUploaded: true,
            trainingConducted: true,
            completionReportGenerated: true,
            
            // Solution Review & Acknowledgment
            solutionDelivered: true,
            acknowledgmentStatus: 'Acknowledged',
            acknowledgmentDate: '2026-02-02',
            acknowledgmentNotes: 'Solution delivered successfully. Sales team trained and using the app.',
            
            priority: 'High',
            justification: 'Sales team loses 3 hours daily traveling to office to submit orders',
            expectedBenefits: 'Increase sales productivity by 30%, faster order processing'
        },
        {
            id: 'CR-2026-005',
            title: 'Customer Portal Enhancement',
            description: 'Add payment gateway integration to customer portal',
            type: 'Enhancement to Existing System',
            department: 'Customer Service',
            section: 'Support',
            requestor: 'Grace Nambi',
            dateSubmitted: '2026-02-01',
            
            // Workflow Status
            status: 'Rejected',
            workflowStage: 'Rejected',
            
            // HOD Review
            hodApproval: 'Rejected',
            hodComments: 'Budget constraints - defer to next fiscal year',
            hodApprovedDate: '2026-02-02',
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Not Started',
            itDecision: null,
            itReviewDate: null,
            feasibilityNotes: null,
            
            // Methodology & Development
            methodology: null,
            deliverables: null,
            estimatedTime: null,
            estimatedCost: null,
            risks: null,
            
            // Development Progress
            developmentStatus: 'Not Started',
            documentationUploaded: false,
            trainingConducted: false,
            completionReportGenerated: false,
            
            // Solution Review & Acknowledgment
            solutionDelivered: false,
            acknowledgmentStatus: 'N/A',
            acknowledgmentDate: null,
            acknowledgmentNotes: null,
            
            priority: 'Low',
            justification: 'Customers requesting online payment option',
            expectedBenefits: 'Improve customer satisfaction, reduce payment delays'
        }
    ],
    
    // Get all requests
    getRequests: function(filters = {}) {
        let filtered = [...this.requests];
        
        if (filters.status) {
            filtered = filtered.filter(r => r.status === filters.status);
        }
        if (filters.department) {
            filtered = filtered.filter(r => r.department === filters.department);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(r => 
                r.title.toLowerCase().includes(search) ||
                r.description.toLowerCase().includes(search) ||
                r.id.toLowerCase().includes(search)
            );
        }
        
        return filtered;
    },
    
    // Get single request
    getRequest: function(id) {
        return this.requests.find(r => r.id === id);
    },
    
    // Create new request
    createRequest: function(data) {
        const newRequest = {
            id: `CR-2026-${String(this.requests.length + 1).padStart(3, '0')}`,
            ...data,
            dateSubmitted: new Date().toISOString().split('T')[0],
            
            // Initial Workflow Status
            status: 'Pending HOD Approval',
            workflowStage: 'HOD Review',
            
            // HOD Review
            hodApproval: 'Pending',
            hodComments: null,
            hodApprovedDate: null,
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Not Started',
            itDecision: null,
            itReviewDate: null,
            feasibilityNotes: null,
            
            // Methodology & Development
            methodology: null,
            deliverables: null,
            estimatedTime: null,
            estimatedCost: null,
            risks: null,
            
            // Development Progress
            developmentStatus: 'Not Started',
            documentationUploaded: false,
            trainingConducted: false,
            completionReportGenerated: false,
            
            // Solution Review & Acknowledgment
            solutionDelivered: false,
            acknowledgmentStatus: 'Pending',
            acknowledgmentDate: null,
            acknowledgmentNotes: null
        };
        this.requests.unshift(newRequest);
        return newRequest;
    },
    
    // Update request
    updateRequest: function(id, updates) {
        const index = this.requests.findIndex(r => r.id === id);
        if (index !== -1) {
            this.requests[index] = { ...this.requests[index], ...updates };
            return this.requests[index];
        }
        return null;
    },
    
    // Get statistics
    getStats: function() {
        const stats = {
            total: this.requests.length,
            pending: this.requests.filter(r => r.workflowStage === 'HOD Review' && r.hodApproval === 'Pending').length,
            clarificationNeeded: this.requests.filter(r => r.clarificationNeeded === true).length,
            approved: this.requests.filter(r => r.hodApproval === 'Approved').length,
            technicalReview: this.requests.filter(r => r.workflowStage === 'Technical Review').length,
            inDevelopment: this.requests.filter(r => r.workflowStage === 'Development').length,
            completed: this.requests.filter(r => r.workflowStage === 'Completed').length,
            rejected: this.requests.filter(r => r.workflowStage === 'Rejected').length
        };
        
        return stats;
    },
    
    // Get departments
    getDepartments: function() {
        if (window.MOCK_DATA) {
            return window.MOCK_DATA.departments;
        }
        return [
            'Human Resources',
            'Administration',
            'Operations',
            'Sales',
            'Customer Service',
            'Finance',
            'IT Department',
            'Marketing',
            'Procurement'
        ];
    },
    
    // Get sections for a department
    getSections: function(department) {
        if (window.MOCK_DATA && window.MOCK_DATA.sections[department]) {
            return window.MOCK_DATA.sections[department];
        }
        return [];
    },
    
    // Get change types
    getChangeTypes: function() {
        if (window.MOCK_DATA) {
            return window.MOCK_DATA.changeTypes;
        }
        return [
            'Enhancement to Existing System',
            'New System Proposal',
            'Process Automation',
            'Performance Improvement',
            'Security Enhancement',
            'Integration Request'
        ];
    },
    
    // Get random requestor name
    getRandomRequestor: function() {
        if (window.MOCK_DATA) {
            const requestors = window.MOCK_DATA.requestors;
            return requestors[Math.floor(Math.random() * requestors.length)];
        }
        return 'User Name';
    },

    // Development Projects
    getDevelopmentProjects: function() {
        return this.requests.filter(r => 
            r.itDecision === 'Accepted' || r.developmentStatus
        );
    },

    // Development Logs (Phase 3)
    developmentLogs: [],

    // Add development log (Phase 3)
    addDevelopmentLog: function(requestId, logData) {
        const project = this.getRequest(requestId);
        if (!project) return null;
        
        const log = {
            id: `LOG-${String(this.developmentLogs.length + 1).padStart(3, '0')}`,
            requestId,
            changeDate: new Date().toISOString().split('T')[0],
            loggedBy: 'IT Team',
            ...logData
        };
        this.developmentLogs.push(log);
        
        // Also store in localStorage for persistence
        localStorage.setItem('developmentLogs', JSON.stringify(this.developmentLogs));
        
        return log;
    },

    // Get logs for a request (Phase 3)
    getDevelopmentLogs: function(requestId) {
        // Load from localStorage if available
        const stored = localStorage.getItem('developmentLogs');
        if (stored) {
            try {
                this.developmentLogs = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading logs:', e);
            }
        }
        return this.developmentLogs.filter(log => log.requestId === requestId);
    },

    // ============ HANDOVER METHODS (Phase 1) ============
    
    handovers: [],

    // Create handover document
    createHandover: function(projectId, handoverData) {
        const project = this.getRequest(projectId);
        if (!project) return null;

        const handover = {
            id: `HO-${new Date().getFullYear()}-${String(this.handovers.length + 1).padStart(3, '0')}`,
            projectId: projectId,
            projectTitle: project.title,
            projectDepartment: project.department,
            initiatedBy: handoverData.initiatedBy,
            initiatedDate: new Date().toISOString().split('T')[0],
            status: 'in-progress', // in-progress, completed, rejected
            attempt: 1,
            
            // System specifications (enhanced with memo digital format)
            systemSpecs: {
                // Overview
                overview: handoverData.systemSpecs?.overview || project.description || `The ${project.title} was developed to ${project.expectedBenefits}. This system provides a centralized platform for ${project.department} to improve operational efficiency and streamline workflows.`,
                
                // Purpose
                purpose: handoverData.systemSpecs?.purpose || [
                    `Provide a centralized system for ${project.department}`,
                    'Improve operational efficiency and reduce manual processes',
                    'Enable better data management and reporting capabilities',
                    'Facilitate collaboration and workflow automation',
                    'Reduce processing time and eliminate errors'
                ],
                
                // Hosting Details
                serverEnvironment: handoverData.systemSpecs?.serverEnvironment || 'VPS at Vision Group Infrastructure (Shared environment)',
                publicURL: handoverData.systemSpecs?.publicURL || null,
                intranetAccess: handoverData.systemSpecs?.intranetAccess || 'Restricted access for authorized users with authentication',
                sslStatus: handoverData.systemSpecs?.sslStatus || 'Enabled',
                databaseLocation: handoverData.systemSpecs?.databaseLocation || 'Hosted on the same VPS instance',
                backupStrategy: handoverData.systemSpecs?.backupStrategy || 'Managed by IT; scheduled incremental backups recommended',
                
                // System Users
                systemUsers: handoverData.systemSpecs?.systemUsers || [
                    {
                        role: 'End User',
                        description: `${project.department} staff members`,
                        accessLevel: 'View and submit data, generate reports'
                    },
                    {
                        role: 'Department Admin',
                        description: `${project.department} administrators`,
                        accessLevel: 'Manage users, configure settings, full access to department data'
                    },
                    {
                        role: 'IT Support (Admin)',
                        description: 'Internal IT team managing backend operations',
                        accessLevel: 'User management, system maintenance, monitoring, and technical support'
                    }
                ],
                
                // Current Status
                currentStatus: handoverData.systemSpecs?.currentStatus || [
                    { component: 'System Core', status: 'Functional', remarks: 'All core features operational and tested' },
                    { component: 'User Interface', status: 'Functional', remarks: 'Responsive design, accessible to all users' },
                    { component: 'Documentation', status: 'Completed', remarks: 'User guides and technical documentation provided' },
                    { component: 'Training', status: 'Completed', remarks: 'End user training conducted successfully' },
                    { component: 'Testing', status: 'Completed', remarks: 'UAT completed and signed off' },
                    { component: 'Deployment', status: 'Ready', remarks: 'System ready for production use' }
                ]
            },
            
            // Signatures (6 roles for IT system implementation)
            signatures: [
                {
                    sequence: 1,
                    role: 'Project Developer',
                    assignedTo: handoverData.initiatedBy,
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'approved', // Auto-approved
                    stage: 'completed',
                    signedDate: new Date().toISOString(),
                    signedBy: handoverData.initiatedBy,
                    ipAddress: '127.0.0.1',
                    checklistResponses: {
                        system_functional: true,
                        documentation_received: true,
                        roadmap_confirmed: true
                    },
                    comments: 'Project completed and ready for handover',
                    conditions: []
                },
                {
                    sequence: 2,
                    role: 'Project Manager',
                    assignedTo: 'Felix Ssembajjwe Bashabe',
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    stage: 'active', // Can sign now
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
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    stage: 'active', // Can sign now (parallel with PM)
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
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    stage: 'locked', // Unlocks after PM + Security
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
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    stage: 'locked', // Unlocks after Head of Tech
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
                    assignedDate: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    stage: 'locked', // Unlocks after Head of Tech
                    signedDate: null,
                    signedBy: null,
                    ipAddress: null,
                    checklistResponses: {},
                    comments: null,
                    conditions: []
                }
            ]
        };

        this.handovers.push(handover);
        
        // Update project
        this.updateRequest(projectId, {
            handoverInitiated: true,
            handoverId: handover.id
        });
        
        // Save to localStorage
        localStorage.setItem('handovers', JSON.stringify(this.handovers));
        
        return handover;
    },

    // Get all handovers
    getAllHandovers: function() {
        // Load from localStorage if available
        const stored = localStorage.getItem('handovers');
        if (stored) {
            try {
                this.handovers = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading handovers:', e);
            }
        }
        return this.handovers;
    },

    // Get single handover
    getHandover: function(handoverId) {
        this.getAllHandovers(); // Load from storage
        return this.handovers.find(h => h.id === handoverId);
    },

    // Get handover by project ID
    getHandoverByProject: function(projectId) {
        this.getAllHandovers(); // Load from storage
        return this.handovers.find(h => h.projectId === projectId);
    },

    // Get handovers pending user's signature
    getMyPendingHandovers: function(userName) {
        this.getAllHandovers(); // Load from storage
        return this.handovers.filter(handover => {
            return handover.signatures.some(sig => 
                sig.assignedTo === userName && 
                sig.status === 'pending' && 
                sig.stage === 'active'
            );
        });
    },

    // Update handover signature
    updateHandoverSignature: function(handoverId, signatureSequence, signatureData) {
        const handover = this.getHandover(handoverId);
        if (!handover) return null;

        const sigIndex = handover.signatures.findIndex(s => s.sequence === signatureSequence);
        if (sigIndex === -1) return null;

        // Update signature
        handover.signatures[sigIndex] = {
            ...handover.signatures[sigIndex],
            ...signatureData,
            signedDate: new Date().toISOString(),
            ipAddress: '127.0.0.1' // In production, get real IP
        };

        // Check if this was a rejection
        if (signatureData.status === 'rejected') {
            handover.status = 'rejected';
            
            // Update project status back to development
            this.updateRequest(handover.projectId, {
                status: 'Revision Required',
                developmentStatus: 'In Progress',
                handoverInitiated: false
            });
        } else {
            // Check if we need to unlock next stages
            this.updateHandoverStages(handover);
            
            // Check if handover is complete
            const allApproved = handover.signatures.every(sig => 
                sig.status === 'approved' || sig.status === 'approved-with-conditions'
            );
            
            if (allApproved) {
                handover.status = 'completed';
                handover.completedDate = new Date().toISOString().split('T')[0];
                
                // Update project to deployed
                this.updateRequest(handover.projectId, {
                    status: 'Deployed',
                    deploymentDate: new Date().toISOString().split('T')[0]
                });
            }
        }

        // Save to localStorage
        localStorage.setItem('handovers', JSON.stringify(this.handovers));
        
        return handover;
    },

    // Update handover stages (unlock next signatures)
    updateHandoverStages: function(handover) {
        // Check if PM (seq 2) and Security (seq 3) both approved
        const pmSig = handover.signatures.find(s => s.sequence === 2);
        const secSig = handover.signatures.find(s => s.sequence === 3);
        
        if (pmSig.status === 'approved' && secSig.status === 'approved') {
            // Unlock Head of Tech (seq 4)
            const headTechSig = handover.signatures.find(s => s.sequence === 4);
            if (headTechSig.stage === 'locked') {
                headTechSig.stage = 'active';
            }
        }

        // Check if Head of Tech (seq 4) approved
        const headTechSig = handover.signatures.find(s => s.sequence === 4);
        if (headTechSig.status === 'approved') {
            // Unlock End Users (seq 5 and 6)
            const hrSig = handover.signatures.find(s => s.sequence === 5);
            const hodSig = handover.signatures.find(s => s.sequence === 6);
            
            if (hrSig.stage === 'locked') hrSig.stage = 'active';
            if (hodSig.stage === 'locked') hodSig.stage = 'active';
        }
    }
};

// Export for use in other files
window.API = API;
