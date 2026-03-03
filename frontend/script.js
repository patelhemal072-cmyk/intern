
// Main Initialization Function
const initApp = () => {
    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const packageButtons = document.querySelectorAll('.package-button');

    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && menuToggle) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Package Selection Functionality
    packageButtons.forEach(button => {
        button.addEventListener('click', function () {
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('h3').textContent;
            const packageType = packageName.toLowerCase().includes('basic') ? 'basic' :
                packageName.toLowerCase().includes('pro') ? 'pro' : 'enterprise';

            const packageSelect = document.getElementById('package');
            const experienceSelect = document.getElementById('experience');

            if (packageSelect) {
                packageSelect.value = packageType;

                // Auto-select duration based on package
                if (experienceSelect) {
                    if (packageType === 'basic') experienceSelect.value = '1.5';
                    else if (packageType === 'pro') experienceSelect.value = '3';
                    else if (packageType === 'enterprise') experienceSelect.value = '6';
                }

                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
                packageSelect.focus();
                // Trigger validation
                const event = new Event('change', { bubbles: true });
                packageSelect.dispatchEvent(event);
                if (experienceSelect) experienceSelect.dispatchEvent(event);
            }
        });
    });

    // Handle package dropdown changes to auto-select duration
    const globalPackageSelect = document.getElementById('package');
    const globalExperienceSelect = document.getElementById('experience');

    if (globalPackageSelect && globalExperienceSelect) {
        globalPackageSelect.addEventListener('change', function () {
            const packageType = this.value.toLowerCase();
            if (packageType === 'basic') globalExperienceSelect.value = '1.5';
            else if (packageType === 'pro') globalExperienceSelect.value = '3';
            else if (packageType === 'enterprise') globalExperienceSelect.value = '6';

            // Trigger validation for experience dropdown
            const event = new Event('change', { bubbles: true });
            globalExperienceSelect.dispatchEvent(event);
        });
    }

    // --- NEW: Universal Click Handler for All Boxes ---
    document.addEventListener('click', (e) => {
        // 1. Logo Click -> Go to Home
        if (e.target.closest('.logo')) {
            window.location.href = 'index.html';
            return;
        }

        // 2. Package Card Click -> Scroll to Form & Trigger Button Click
        const packageCard = e.target.closest('.package-card');
        if (packageCard && !e.target.closest('.package-button')) {
            const btn = packageCard.querySelector('.package-button');
            if (btn) btn.click();
            return;
        }

        // 3. Floating Hero Cards -> Scroll to matching Operation Section
        const floatingCard = e.target.closest('.floating-card');
        if (floatingCard) {
            const cardText = floatingCard.textContent.trim().toLowerCase();
            let targetId = 'operations'; // Default

            if (cardText.includes('strategy')) targetId = 'strategy-planning';
            else if (cardText.includes('branding')) targetId = 'branding-positioning';
            else if (cardText.includes('lead')) targetId = 'lead-generation';
            else if (cardText.includes('sales')) targetId = 'sales-conversion';
            else if (cardText.includes('hr') || cardText.includes('team')) targetId = 'hr-team';
            else if (cardText.includes('finance')) targetId = 'finance-accounts';

            const target = document.getElementById(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
            return;
        }

        // 4. Highlight Cards -> Simple feedback or scroll to About (Company)
        if (e.target.closest('.highlight-card')) {
            const companySection = document.getElementById('company');
            if (companySection) {
                companySection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
};

// Comprehensive Real-time Form Validation
const initValidation = () => {
    const form = document.getElementById('internshipForm');
    if (!form) return;

    const fields = {
        fullName: {
            el: document.getElementById('fullName'),
            requiredMsg: "Full Name is required.",
            invalidMsg: "Please enter valid full name (Surname Name Fathername).",
            validate: (val) => {
                const parts = val.trim().split(/\s+/);
                return parts.length >= 3 && parts.every(part => part.length >= 2);
            }
        },
        email: {
            el: document.getElementById('email'),
            requiredMsg: "Email Address is required.",
            invalidMsg: "Please enter a valid email address.",
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        },
        phone: {
            el: document.getElementById('phone'),
            requiredMsg: "Phone number is required.",
            invalidMsg: "Phone number must be 10 digits after +91-.",
            validate: (val) => {
                const digits = val.replace('+91-', '').replace(/\D/g, '');
                return val.startsWith('+91-') && digits.length === 10;
            }
        },
        program: {
            el: document.getElementById('program'),
            requiredMsg: "Please select an internship program.",
            invalidMsg: "Please select your internship program.",
            validate: (val) => val !== "" && !val.includes('Select')
        },
        package: {
            el: document.getElementById('package'),
            requiredMsg: "Please select a package.",
            invalidMsg: "Please select your package.",
            validate: (val) => val !== "" && !val.includes('Select')
        },
        experience: {
            el: document.getElementById('experience'),
            requiredMsg: "Please select internship duration.",
            invalidMsg: "Please select internship duration.",
            validate: (val) => val !== "" && !val.includes('Select')
        },
        readyToCommit: {
            el: document.getElementById('readyToCommit'),
            requiredMsg: "Please select an answer.",
            invalidMsg: "Please select your commitment.",
            validate: (val) => val !== "" && (val === 'Yes' || val === 'No')
        }
    };

    const termsCheckbox = document.getElementById('terms');
    const termsLabel = form.querySelector('.checkbox-label');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Setup each field
    Object.values(fields).forEach(field => {
        if (!field.el) return;

        // Create error message box if not exists
        let errorBox = document.getElementById(`${field.el.id}-error`);
        if (!errorBox) {
            errorBox = document.createElement('div');
            errorBox.className = 'error-message-box';
            errorBox.id = `${field.el.id}-error`;
            errorBox.textContent = field.requiredMsg;
            const formGroup = field.el.closest('.form-group');
            if (formGroup) {
                formGroup.appendChild(errorBox);
            } else {
                field.el.parentNode.appendChild(errorBox);
            }
        }

        // Real-time validation
        field.el.addEventListener('input', () => validateField(field));
        field.el.addEventListener('blur', () => validateField(field, true));
        field.el.addEventListener('change', () => validateField(field));
    });

    // Terms checkbox listener
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', checkFormValidity);
    }

    if (termsLabel) {
        termsLabel.addEventListener('click', () => {
            if (termsCheckbox && termsCheckbox.disabled) {
                Object.values(fields).forEach(field => validateField(field, true));
            }
        });
    }

    function validateField(field, isBlur = false) {
        if (!field.el) return;
        const val = field.el.value.trim();
        // More robust empty check
        const isEmpty = val === "" || (field.el.id === 'phone' && (val === '+91-' || val === '+91'));
        const isValid = field.validate(val);
        const errorBox = document.getElementById(`${field.el.id}-error`);

        if (isValid) {
            field.el.classList.add('input-valid');
            field.el.classList.remove('input-invalid');
            if (errorBox) errorBox.classList.remove('show');
        } else {
            // Update error text based on empty vs invalid
            if (errorBox) {
                errorBox.textContent = isEmpty ? field.requiredMsg : field.invalidMsg;
            }

            // SHOW ERROR:
            // 1. If user blurred the field (moved away)
            // 2. If user is typing AND it's not empty (but still invalid)
            // 3. If field is explicitly empty AND we want to show required status (on blur)
            const shouldShowError = isBlur || (!isEmpty);

            if (shouldShowError) {
                field.el.classList.add('input-invalid');
                field.el.classList.remove('input-valid');
                if (errorBox) errorBox.classList.add('show');
            } else {
                field.el.classList.remove('input-valid', 'input-invalid');
                if (errorBox) errorBox.classList.remove('show');
            }
        }
        checkFormValidity();
    }

    checkFormValidityGlobal = checkFormValidity;

    function checkFormValidity() {
        const allFieldsValid = Object.values(fields).every(field => {
            if (!field.el) return true;
            return field.validate(field.el.value);
        });

        if (termsCheckbox && termsLabel) {
            termsCheckbox.disabled = !allFieldsValid;
            if (!allFieldsValid) {
                termsCheckbox.checked = false;
                termsLabel.classList.add('disabled');
            } else {
                termsLabel.classList.remove('disabled');
            }
        }

        if (submitBtn) {
            submitBtn.disabled = !allFieldsValid || (termsCheckbox && !termsCheckbox.checked);
        }
    }

    // Phone Auto-formatting and Prefix Lock
    const phoneInput = fields.phone.el;
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value;
            if (!val.startsWith('+91-')) {
                e.target.value = '+91-' + val.replace(/^\+91-/, '').replace(/\D/g, '');
            }

            let digits = e.target.value.replace('+91-', '').replace(/\D/g, '');
            if (digits.length > 10) digits = digits.substring(0, 10);
            e.target.value = '+91-' + digits;

            validateField(fields.phone);
        });

        phoneInput.addEventListener('focus', (e) => {
            if (e.target.value === '') {
                e.target.value = '+91-';
            }
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Prevent deleting +91-
            if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart <= 4) {
                e.preventDefault();
            }
        });
    }

    // Initial check
};

let checkFormValidityGlobal = () => { };

const initFormSubmission = () => {
    const forms = [
        { id: 'internshipForm', endpoint: '/api/forms/submit' },
        { id: 'quickContactForm', endpoint: '/api/forms/submit' } // Reusing same for simplicity or redirect to message
    ];

    forms.forEach(formConfig => {
        const form = document.getElementById(formConfig.id);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerHTML;

            // Clear any existing messages in this form
            form.querySelectorAll('.success-message-box, .submit-error-message-box').forEach(el => el.remove());

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Special handling for quickContactForm to map names if they don't match Form model
            if (formConfig.id === 'quickContactForm') {
                data.fullName = data.name || data.fullName;
                data.phone = 'N/A';
                data.program = 'Quick Contact Message';
                data.package = 'N/A';
                data.experience = 'N/A';
                data.readyToCommit = 'N/A';
            }

            const showMessage = (type, text) => {
                const msgBox = document.createElement('div');
                msgBox.className = type === 'success' ? 'success-message-box' : 'submit-error-message-box';
                msgBox.style.display = 'flex';
                const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
                msgBox.innerHTML = `<i class="fas ${icon}"></i> <span>${text}</span>`;
                form.appendChild(msgBox);

                if (type === 'success') {
                    msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };

            fetch(`http://localhost:5002${formConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(result => {
                    if (result.success) {
                        // Use result.message if available, else fallback
                        showMessage('success', 'Submitted Successfully!');
                        form.reset();
                        if (formConfig.id === 'internshipForm') {
                            document.querySelectorAll('.input-valid, .input-invalid').forEach(el => {
                                el.classList.remove('input-valid', 'input-invalid');
                            });
                            document.querySelectorAll('.error-message-box').forEach(el => el.classList.remove('show'));
                            if (typeof checkFormValidityGlobal === 'function') checkFormValidityGlobal();
                        }
                    } else {
                        showMessage('error', result.message || 'Submission failed. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Detailed Submission Error:', error);
                    // Only show error message if no success message is already present
                    if (!form.querySelector('.success-message-box')) {
                        showMessage('error', 'Could not connect to the server.');
                    }
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    if (formConfig.id === 'internshipForm') {
                        submitBtn.disabled = true;
                    } else {
                        submitBtn.disabled = false;
                    }
                });
        });
    });
};

// Scroll animations
const initAnimations = () => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.js-scroll, .section-header, .packages-grid, .company-content, .contact-container, .stage-section').forEach(el => {
        el.classList.add('js-scroll');
        observer.observe(el);
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initValidation();
    initFormSubmission();
    initAnimations();

    console.log('%c🚀 Error Infotech - Form Validation Activated', 'color: #2563eb; font-size: 16px; font-weight: bold;');
});