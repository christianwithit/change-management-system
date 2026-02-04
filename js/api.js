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
            status: 'Technical Review',
            workflowStage: 'Technical Review',
            
            // HOD Review
            hodApproval: 'Approved',
            hodComments: 'Approved - will improve warehouse efficiency',
            hodApprovedDate: '2026-01-26',
            clarificationNeeded: false,
            clarificationNotes: null,
            
            // Technical Review
            itStatus: 'Under Review',
            itDecision: null,
            itReviewDate: null,
            feasibilityNotes: 'Evaluating barcode scanner options and integration requirements',
            
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
    getStats: function(userRole) {
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
    }
};

// Export for use in other files
window.API = API;
