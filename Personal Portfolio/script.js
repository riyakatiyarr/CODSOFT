// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 0, 51, 0.95)';
    } else {
        header.style.background = 'linear-gradient(135deg, #2A0D45, #1A0033)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const originalText = tagline.textContent;
        typeWriter(tagline, originalText, 80);
    }
});

// Mobile menu toggle (for responsive design)
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    `;
    
    navbar.appendChild(mobileMenuBtn);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Add mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(26, 0, 51, 0.95);
                flex-direction: column;
                padding: 1rem 0;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav-links.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav-links li {
                margin: 0.5rem 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);

// Skill progress animation
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        const progressBar = document.createElement('div');
        progressBar.classList.add('skill-progress');
        progressBar.style.cssText = `
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            margin-top: 1rem;
            overflow: hidden;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(135deg, var(--violet-primary), var(--pink-accent));
            width: 0%;
            transition: width 2s ease;
            border-radius: 2px;
        `;
        
        progressBar.appendChild(progressFill);
        item.appendChild(progressBar);
        
        // Animate progress bar when element is in view
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const randomWidth = Math.floor(Math.random() * 30) + 70; // 70-100%
                    setTimeout(() => {
                        progressFill.style.width = randomWidth + '%';
                    }, index * 200);
                }
            });
        });
        
        skillObserver.observe(item);
    });
}

// Initialize skill bars animation
document.addEventListener('DOMContentLoaded', animateSkillBars);