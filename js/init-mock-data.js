// Mock Data Initialization Script
// This script loads comprehensive mock data for testing all features

(function() {
    'use strict';

    console.log('🚀 Initializing mock data...');

    // Load handovers from mock data
    if (window.MOCK_DATA_COMPLETE && window.MOCK_DATA_COMPLETE.handovers) {
        localStorage.setItem('handovers', JSON.stringify(MOCK_DATA_COMPLETE.handovers));
        console.log('✅ Loaded', MOCK_DATA_COMPLETE.handovers.length, 'handover documents');
    }

    // Update API handovers array
    if (window.API) {
        API.handovers = MOCK_DATA_COMPLETE.handovers || [];
        console.log('✅ API handovers initialized');
    }

    // Add projects ready for handover to the main requests array
    if (window.API && MOCK_DATA_COMPLETE.projectsReadyForHandover) {
        MOCK_DATA_COMPLETE.projectsReadyForHandover.forEach(project => {
            const exists = API.requests.find(r => r.id === project.id);
            if (!exists) {
                API.requests.push(project);
            }
        });
        console.log('✅ Added projects ready for handover');
    }

    // Update existing projects with handover references
    if (window.API) {
        // Link handovers to their projects
        MOCK_DATA_COMPLETE.handovers.forEach(handover => {
            const project = API.requests.find(r => r.id === handover.projectId);
            if (project) {
                project.handoverInitiated = true;
                project.handoverId = handover.id;
                project.developmentStatus = 'Completed';
                if (handover.status === 'completed') {
                    project.status = 'Deployed';
                    project.workflowStage = 'Completed';
                }
            }
        });
        console.log('✅ Linked handovers to projects');
    }

    // Create sample users for testing
    const sampleUsers = [
        {
            username: 'felix',
            password: 'password',
            fullName: 'Felix Ssembajjwe Bashabe',
            role: 'it',
            department: 'IT Department',
            email: 'felix@visiongroup.co.ug'
        },
        {
            username: 'emmanuel',
            password: 'password',
            fullName: 'Emmanuel Cliff Mughanwa',
            role: 'it',
            department: 'IT Department',
            email: 'emmanuel@visiongroup.co.ug'
        },
        {
            username: 'paul',
            password: 'password',
            fullName: 'Paul Ikanza',
            role: 'admin',
            department: 'IT Department',
            email: 'paul@visiongroup.co.ug'
        },
        {
            username: 'agatha',
            password: 'password',
            fullName: 'Agatha Joyday Gloria',
            role: 'hod',
            department: 'Human Resources',
            email: 'agatha@visiongroup.co.ug'
        },
        {
            username: 'marjorie',
            password: 'password',
            fullName: 'Marjorie Nalubowa',
            role: 'hod',
            department: 'Operations',
            email: 'marjorie@visiongroup.co.ug'
        }
    ];

    localStorage.setItem('sampleUsers', JSON.stringify(sampleUsers));
    console.log('✅ Created', sampleUsers.length, 'sample users');

    // Display summary
    console.log('\n📊 Mock Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Handovers:', MOCK_DATA_COMPLETE.handovers.length);
    console.log('  - Completed:', MOCK_DATA_COMPLETE.handovers.filter(h => h.status === 'completed').length);
    console.log('  - In Progress:', MOCK_DATA_COMPLETE.handovers.filter(h => h.status === 'in-progress').length);
    console.log('Projects Ready for Handover:', MOCK_DATA_COMPLETE.projectsReadyForHandover.length);
    console.log('Sample Users:', sampleUsers.length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🔐 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    sampleUsers.forEach(user => {
        console.log(`${user.fullName} (${user.role})`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Password: ${user.password}`);
        console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✨ Mock data initialization complete!');
    console.log('You can now test:');
    console.log('  ✓ View handover documents');
    console.log('  ✓ Sign handover documents');
    console.log('  ✓ Initiate new handovers');
    console.log('  ✓ Complete handover workflow');
    console.log('  ✓ Test with different user roles\n');

})();
