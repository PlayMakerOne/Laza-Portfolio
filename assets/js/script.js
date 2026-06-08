document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.navbar-fixed');
    const overlay = document.querySelector('.nav-overlay');

    // === Hamburger Menu ===
    if (navToggle && navMenu) {
        function closeMenu() {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            if (overlay) overlay.classList.remove('visible');
        }

        function openMenu() {
            navMenu.classList.add('open');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            if (overlay) overlay.classList.add('visible');
        }

        navToggle.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }
    }

    // === Active Nav Link on Scroll ===
    function updateActiveLink() {
        let current = '';
        sections.forEach(function (section) {
            const top = section.offsetTop - 200;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // === Scroll Reveal Animations ===
    function setupRevealAnimations() {
        const revealElements = document.querySelectorAll(
            '.section-content > h2, .about-container, .competences-liste, .projets-grille, .contact-container'
        );

        revealElements.forEach(function (el, index) {
            el.classList.add('reveal');
            el.style.transitionDelay = (index * 0.1) + 's';
        });

        document.querySelectorAll('.competence-item').forEach(function (el, i) {
            el.classList.add('reveal-scale');
            el.style.transitionDelay = (i * 0.05) + 's';
        });

        document.querySelectorAll('.projet-card').forEach(function (el, i) {
            el.classList.add('reveal');
            el.style.transitionDelay = (i * 0.1) + 's';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
            observer.observe(el);
        });
    }

    // === Handle Scroll Events with throttling ===
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateActiveLink();
    setupRevealAnimations();

    // === Contact Form ===
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Données envoyées :', data);
            afficherMessage('success', 'Message envoyé avec succès !');
            contactForm.reset();
        });
    }

    function afficherMessage(type, texte) {
        const ancienMessage = document.querySelector('.form-status');
        if (ancienMessage) ancienMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-status ' + type;
        messageDiv.textContent = texte;

        const submitBtn = document.querySelector('.contact-form button[type="submit"]');
        submitBtn.insertAdjacentElement('afterend', messageDiv);

        setTimeout(function () {
            messageDiv.remove();
        }, 5000);
    }
});
