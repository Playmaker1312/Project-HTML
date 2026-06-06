document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('#navMenu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });

        // Close menu when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    }

    // 2. Smooth Scrolling for Navigation Links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetPosition = targetElement.offsetTop - 80; // Account for navbar height

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Spy (Highlight active navbar link on scroll)
    const sections = document.querySelectorAll('section');
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 150; // offset for highlighting early

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    // Trigger scroll spy on page load to set initial state
    scrollSpy();

    // 4. Contact Form Validation & Submission
    const contactForm = document.getElementById('contactForm');
    const inputs = {
        name: {
            el: document.getElementById('name'),
            err: document.getElementById('nameError'),
            validate: (val) => val.trim().length > 0
        },
        email: {
            el: document.getElementById('email'),
            err: document.getElementById('emailError'),
            validate: (val) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(val.trim());
            }
        },
        subject: {
            el: document.getElementById('subject'),
            err: document.getElementById('subjectError'),
            validate: (val) => val.trim().length > 0
        },
        message: {
            el: document.getElementById('message'),
            err: document.getElementById('messageError'),
            validate: (val) => val.trim().length > 0
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            // Validate each field
            for (const key in inputs) {
                const field = inputs[key];
                const value = field.el.value;

                if (!field.validate(value)) {
                    field.el.classList.add('invalid');
                    field.err.classList.add('visible');
                    isFormValid = false;
                } else {
                    field.el.classList.remove('invalid');
                    field.err.classList.remove('visible');
                }
            }

            if (isFormValid) {
                // Form is valid: Simulate sending message
                showToast('Pesan Anda berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
                contactForm.reset();
                
                // Clear any input status states
                for (const key in inputs) {
                    inputs[key].el.classList.remove('invalid');
                }
            } else {
                showToast('Gagal mengirim pesan. Mohon periksa kembali inputan Anda.', 'error');
            }
        });

        // Add real-time input event listeners to clear error states when user types
        Object.keys(inputs).forEach(key => {
            const field = inputs[key];
            field.el.addEventListener('input', () => {
                if (field.validate(field.el.value)) {
                    field.el.classList.remove('invalid');
                    field.err.classList.remove('visible');
                }
            });
        });
    }

    // 5. Toast Notification System
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add dynamic icons to Toast based on type
        const iconSvg = type === 'success' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: #10b981;"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: #ef4444;"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

        toast.innerHTML = `${iconSvg}<span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Auto remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }
});
