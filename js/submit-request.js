/* global checkAuth, getCurrentUser, apiClient, showToast */

let currentStep = 1;
let uploadedFiles = [];
let allSections = []; // Store all sections for lookup

document.addEventListener('DOMContentLoaded', async function () {
    const user = checkAuth();
    if (!user) return;

    // Show navigation based on role
    if (user.role === 'hod') {
        document.getElementById('hodReviewLink').style.display = 'flex';
    }
    if (user.role === 'it' || user.role === 'admin') {
        document.getElementById('itReviewLink').style.display = 'flex';
    }
    if (user.role === 'hod' || user.role === 'it' || user.role === 'admin') {
        document.getElementById('reportsLink').style.display = 'flex';
    }

    // Populate dropdowns
    populateChangeTypes();
    await populateDepartments();
    
    // Set up department change listener to filter sections
    const departmentSelect = document.getElementById('department');
    departmentSelect.addEventListener('change', async function() {
        await loadSectionsForDepartment(this.value);
    });

    // Handle form submission
    document.getElementById('submitRequestForm').addEventListener('submit', handleSubmit);
});

// Event delegation for all click events
document.addEventListener('click', handleDocumentClick);

function handleDocumentClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const step = target.dataset.step;

    switch (action) {
        case 'logout':
            handleLogout();
            break;
        case 'next-step':
            nextStep(parseInt(step));
            break;
        case 'previous-step':
            previousStep(parseInt(step));
            break;
        case 'reset-form':
            resetForm();
            break;
        case 'upload-file':
            document.getElementById('fileInput').click();
            break;
        case 'navigate':
            const page = target.dataset.page;
            if (page) window.location.href = page;
            break;
        case 'toggle-sidebar':
            toggleSidebar();
            break;
    }
}

// Sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

// Populate change types from enum (hardcoded)
function populateChangeTypes() {
    const select = document.getElementById('type');
    const changeTypes = [
        'Enhancement to Existing System',
        'New System Proposal',
        'Process Automation',
        'Performance Improvement',
        'Security Enhancement',
        'Integration Request',
        'Infrastructure Upgrade',
        'Data Migration',
        'System Replacement',
        'Mobile Application'
    ];
    
    changeTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
}

async function populateDepartments() {
    const select = document.getElementById('department');
    
    try {
        const response = await apiClient.getDepartments();
        
        // Handle Strapi's response format
        const departments = response.data || response;
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.attributes?.department_name || dept.department_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load departments:', error);
        showToast('Failed to load departments', 'error');
    }
}

// Load sections for selected department (for validation/lookup)
async function loadSectionsForDepartment(departmentId) {
    const sectionInput = document.getElementById('section');
    
    if (!departmentId) {
        sectionInput.placeholder = "Select department first";
        sectionInput.disabled = true;
        allSections = [];
        return;
    }
    
    sectionInput.disabled = false;
    sectionInput.placeholder = "Enter your section name";
    
    try {
        const response = await apiClient.getSectionsByDepartment(departmentId);
        allSections = response.data || response;
        
        if (allSections.length === 0) {
            console.log('No sections found for this department');
        } else {
            console.log('Available sections:', allSections.map(s => s.attributes?.section_name || s.section_name));
        }
    } catch (error) {
        console.error('Failed to load sections:', error);
        allSections = [];
    }
}

// Find section ID by name
function findSectionIdByName(sectionName) {
    if (!sectionName) return null;
    
    const normalizedInput = sectionName.trim().toLowerCase();
    
    // Try exact match first
    let section = allSections.find(s => {
        const name = s.attributes?.section_name || s.section_name;
        return name.toLowerCase() === normalizedInput;
    });
    
    // Try partial match if no exact match
    if (!section) {
        section = allSections.find(s => {
            const name = s.attributes?.section_name || s.section_name;
            return name.toLowerCase().includes(normalizedInput) || normalizedInput.includes(name.toLowerCase());
        });
    }
    
    return section ? section.id : null;
}

// Form Stepper Functions
function nextStep(step) {
    // Validate current step fields
    const currentStepEl = document.getElementById(`formStep${currentStep}`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#CF2E2E';
            isValid = false;
        } else {
            field.style.borderColor = '#D1D5DB';
        }
    });

    if (!isValid) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Hide current step
    document.getElementById(`formStep${currentStep}`).classList.remove('active');

    // Show next step
    document.getElementById(`formStep${step}`).classList.add('active');

    // Update stepper UI
    updateStepper(step);

    currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previousStep(step) {
    // Hide current step
    document.getElementById(`formStep${currentStep}`).classList.remove('active');

    // Show previous step
    document.getElementById(`formStep${step}`).classList.add('active');

    // Update stepper UI
    updateStepper(step);

    currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(activeStep) {
    // Reset all steps
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const connector = document.getElementById(`connector${i}`);

        if (i < activeStep) {
            // Completed step
            circle.className = 'w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl mb-2 transition-all';
            circle.innerHTML = '<i class="ph ph-check text-2xl"></i>';
            if (connector) connector.classList.add('completed');
        } else if (i === activeStep) {
            // Active step
            circle.className = 'w-14 h-14 rounded-full bg-visionRed text-white ring-4 ring-red-100 flex items-center justify-center font-bold text-xl mb-2 transition-all';
            circle.textContent = i;
        } else {
            // Inactive step
            circle.className = 'w-14 h-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xl mb-2 transition-all';
            circle.textContent = i;
            if (connector) connector.classList.remove('completed');
        }
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalContent = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin text-xl"></i> Submitting...';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        const user = getCurrentUser();
        const form = e.target;
        const sectionName = form.section.value;

        // Convert section name to section ID
        const sectionId = findSectionIdByName(sectionName);
        
        if (!sectionId) {
            showToast(`Section "${sectionName}" not found. Please check the section name.`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            return;
        }

        // Check if there are files to upload
        const hasFiles = uploadedFiles && uploadedFiles.length > 0;

        if (hasFiles) {
            // USE FORMDATA for file uploads
            const formData = new FormData();
            
            // Add request data as JSON string
            const requestData = {
                title: form.title.value,
                justification: form.justification.value,
                description: form.description.value,
                priority: form.priority.value,
                expected_benefits: form.benefits.value,
                change_type: form.type.value,
                change_ms_section: sectionId,
                department: parseInt(form.department.value),
                staff: user.staffId,
                request_status: 'Pending HOD approval'
            };
            
            formData.append('data', JSON.stringify(requestData));

            // Add files
            uploadedFiles.forEach(file => {
                formData.append('files.supporting_documents', file);
            });

            console.log('Submitting with files. File count:', uploadedFiles.length);

            // Send with files
            const response = await apiClient.createChangeRequestWithFiles(formData);
            console.log('Response:', response);

        } else {
            // NO FILES - use regular JSON request
            const requestData = {
                title: form.title.value,
                justification: form.justification.value,
                description: form.description.value,
                priority: form.priority.value,
                expected_benefits: form.benefits.value,
                change_type: form.type.value,
                change_ms_section: sectionId,
                department: parseInt(form.department.value),
                staff: user.staffId
            };

            console.log('Submitting without files');
            const response = await apiClient.createChangeRequest(requestData);
            console.log('Response:', response);
        }

        // Show success message
        showToast('Request Submitted Successfully!', 'success');
        
        // Redirect to my requests page
        setTimeout(() => {
            window.location.href = 'my-requests.html';
        }, 1500);

    } catch (error) {
        console.error('Submit error:', error);
        showToast(error.message || 'Failed to submit request. Please try again.', 'error');
        
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        document.getElementById('submitRequestForm').reset();
        document.getElementById('fileList').innerHTML = '';
        uploadedFiles = [];
        allSections = [];
        currentStep = 1;
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('formStep1').classList.add('active');
        updateStepper(1);
        
        // Reset all field borders
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.style.borderColor = '#D1D5DB';
        });
    }
}

// File upload handler (called from onchange attribute on file input)
function handleFileUpload(input) {
    const fileList = document.getElementById('fileList');
    
    if (input.files.length > 0) {
        uploadedFiles = Array.from(input.files);
        displayUploadedFiles();
    }
}

function displayUploadedFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2';
        fileItem.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="ph ph-file text-2xl text-slate-600"></i>
                <div>
                    <p class="font-semibold text-sm text-slate-700">${file.name}</p>
                    <p class="text-xs text-slate-500">${(file.size / 1024).toFixed(2)} KB</p>
                </div>
            </div>
            <button type="button" onclick="removeFile(${index})" class="text-red-600 hover:text-red-800 p-2">
                <i class="ph ph-x text-xl"></i>
            </button>
        `;
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    displayUploadedFiles();
}

// Make functions globally accessible
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;