// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Close mobile menu
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (navToggle) {
            navToggle.classList.remove('active');
        }
        
        // Handle smooth scrolling
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle the Get Started button in hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroCtaButton = document.querySelector('.hero__cta');
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Header scroll effects
let ticking = false;
let lastSection = '';

function updateOnScroll() {
    const scrollTop = window.pageYOffset;
    
    // Add scrolled class to header
    if (header) {
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Add parallax effect to hero background
    const heroBackground = document.querySelector('.hero__background');
    if (heroBackground && scrollTop < window.innerHeight) {
        const parallaxSpeed = scrollTop * 0.5;
        heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const scrollTop = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 80;
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
            currentSection = sectionId;
            
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section's nav link
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
    
    // Clear form validation states when leaving contact section
    if (lastSection === 'contact' && currentSection !== 'contact') {
        clearFormValidationStates();
    }
    
    lastSection = currentSection;
}

// Clear form validation states
function clearFormValidationStates() {
    if (contactForm) {
        const formControls = contactForm.querySelectorAll('.form-control');
        const errorMessages = contactForm.querySelectorAll('.error-message');
        const successMessages = contactForm.querySelectorAll('.success-message');
        
        formControls.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        errorMessages.forEach(msg => msg.remove());
        successMessages.forEach(msg => msg.remove());
    }
}

// Form validation and submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formFields = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        const isValid = validateForm(formFields);
        
        if (isValid) {
            // Simulate form submission
            submitForm(formFields);
        }
    });
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateSingleField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear error state while typing
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

// Validate single field
function validateSingleField(field) {
    const fieldName = field.getAttribute('name');
    const value = field.value.trim();
    
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showError(fieldName, 'Name must be at least 2 characters long');
                return false;
            } else {
                showSuccess(fieldName);
                return true;
            }
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                showError(fieldName, 'Please enter a valid email address');
                return false;
            } else {
                showSuccess(fieldName);
                return true;
            }
            
        case 'subject':
            if (!value || value.length < 3) {
                showError(fieldName, 'Subject must be at least 3 characters long');
                return false;
            } else {
                showSuccess(fieldName);
                return true;
            }
            
        case 'message':
            if (!value || value.length < 10) {
                showError(fieldName, 'Message must be at least 10 characters long');
                return false;
            } else {
                showSuccess(fieldName);
                return true;
            }
            
        default:
            return true;
    }
}

// Form validation function
function validateForm(fields) {
    let isValid = true;
    
    // Clear previous error messages
    clearErrorMessages();
    
    // Validate name
    if (!fields.name || fields.name.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    } else {
        showSuccess('name');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email || !emailRegex.test(fields.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('email');
    }
    
    // Validate subject
    if (!fields.subject || fields.subject.trim().length < 3) {
        showError('subject', 'Subject must be at least 3 characters long');
        isValid = false;
    } else {
        showSuccess('subject');
    }
    
    // Validate message
    if (!fields.message || fields.message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        showSuccess('message');
    }
    
    return isValid;
}

// Show error message for form field
function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const fieldGroup = field.parentElement;
    
    field.classList.add('error');
    field.classList.remove('success');
    
    // Remove existing error message
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = '0.5rem';
    errorElement.style.display = 'block';
    fieldGroup.appendChild(errorElement);
}

// Show success state for form field
function showSuccess(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const fieldGroup = field.parentElement;
    
    field.classList.add('success');
    field.classList.remove('error');
    
    // Remove error message if exists
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Clear all error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const successMessages = document.querySelectorAll('.success-message');
    const formControls = document.querySelectorAll('.form-control');
    
    errorMessages.forEach(msg => msg.remove());
    successMessages.forEach(msg => msg.remove());
    formControls.forEach(field => {
        field.classList.remove('error', 'success');
    });
}

// Simulate form submission
function submitForm(formData) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showFormSuccess();
        
        // Reset form
        contactForm.reset();
        clearErrorMessages();
        
        console.log('Form submitted:', formData);
    }, 2000);
}

// Show form submission success message
function showFormSuccess() {
    const formContainer = contactForm.parentElement;
    
    // Remove existing success message
    const existingSuccess = formContainer.querySelector('.form-success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message
    const successElement = document.createElement('div');
    successElement.className = 'form-success-message';
    successElement.innerHTML = `
        <div style="background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.25); 
             color: #ff6b35; padding: 1rem; border-radius: var(--radius-base); 
             margin-bottom: 1rem; text-align: center;">
            <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
        </div>
    `;
    
    formContainer.insertBefore(successElement, contactForm);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successElement) {
            successElement.remove();
        }
    }, 5000);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    }
});

// Add click handler for logo to scroll to top
const logo = document.querySelector('.nav__logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service__card, .portfolio__item, .stat, .about__text, .about__image');
    animatedElements.forEach(el => observer.observe(el));
});

// Image loading optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading attribute for better performance
        img.setAttribute('loading', 'lazy');
        
        // Add load handler for smooth appearance
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Service card hover effects
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service__card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Portfolio item hover effects
function initPortfolioEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio__overlay');
        
        item.addEventListener('mouseenter', () => {
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Initialize image optimization
    optimizeImages();
    
    // Initialize hover effects
    initServiceCardEffects();
    initPortfolioEffects();
    
    // Set initial active nav link
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);
    
    console.log('XYZ landing page initialized successfully!');
});

// Add smooth scroll behavior for better UX
window.addEventListener('load', () => {
    // Ensure all images are loaded before scroll calculations
    setTimeout(() => {
        updateActiveNavLink();
    }, 500);
});

// Handle touch events for mobile devices
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
    
    // Add touch-friendly hover effects
    const hoverElements = document.querySelectorAll('.service__card, .portfolio__item');
    
    hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-hover');
            }, 300);
        });
    });
}

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(updateOnScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);