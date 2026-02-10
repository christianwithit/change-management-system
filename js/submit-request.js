/* global checkAuth, getCurrentUser, API, showToast */

let currentStep = 1;

document.addEventListener('DOMContentLoaded', function () {
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
    populateDepartments();

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
    }
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

function populateChangeTypes() {
    const select = document.getElementById('type');
    const types = API.getChangeTypes();

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
}

function populateDepartments() {
    const select = document.getElementById('department');
    const departments = API.getDepartments();

    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
    });
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

function handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalContent = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i> Processing...';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    // Simulate async operation
    setTimeout(() => {
        const user = getCurrentUser();
        const formData = new FormData(e.target);

        const requestData = {
            title: formData.get('title'),
            type: formData.get('type'),
            department: formData.get('department'),
            section: formData.get('section'),
            description: formData.get('description'),
            justification: formData.get('justification'),
            expectedBenefits: formData.get('benefits'),
            priority: formData.get('priority'),
            requestor: user.fullName
        };

        // Create request
        const newRequest = API.createRequest(requestData);

        if (newRequest) {
            showToast('Request Submitted Successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast('Failed to submit request. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }, 1500);
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        document.getElementById('submitRequestForm').reset();
        document.getElementById('fileList').innerHTML = '';
        currentStep = 1;
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('formStep1').classList.add('active');
        updateStepper(1);
    }
}

// File upload handler (called from onchange attribute on file input)
function handleFileUpload(input) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    if (input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2';
            fileItem.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="ph ph-file text-xl text-slate-600"></i>
                    <span class="text-sm font-medium text-slate-700">${file.name}</span>
                    <span class="text-xs text-slate-500">(${(file.size / 1024).toFixed(1)} KB)</span>
                </div>
            `;
            fileList.appendChild(fileItem);
        });
    }
}

// Make handleFileUpload globally accessible for the onchange attribute
window.handleFileUpload = handleFileUpload;
