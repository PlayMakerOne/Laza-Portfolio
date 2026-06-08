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

    // === Particles System ===
    function setupParticles() {
        var canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouseX = -1000;
        var mouseY = -1000;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        var particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 70);

        for (var i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        canvas.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        canvas.addEventListener('mouseleave', function () {
            mouseX = -1000;
            mouseY = -1000;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                var dx = mouseX - (canvas.getBoundingClientRect().left + p.x);
                var dy = mouseY - (canvas.getBoundingClientRect().top + p.y);
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    var force = (150 - dist) / 150 * 0.02;
                    p.x -= dx * force;
                    p.y -= dy * force;
                }

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
                ctx.fill();
            }

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // === Handle Scroll ===
    var ticking = false;
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
    setupParticles();

    // === Contact Form ===
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var formGroup = contactForm.querySelector('.form-alt');

            if (contactForm.getAttribute('action') && contactForm.getAttribute('action').startsWith('https://formspree.io')) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';

                setTimeout(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer';
                }, 3000);
            } else {
                e.preventDefault();
                var formData = new FormData(contactForm);
                var data = Object.fromEntries(formData.entries());
                console.log('Données du formulaire :', data);
                afficherMessage('success', 'Message prêt à être envoyé ! Utilisez le lien email ci-dessous.');
                contactForm.reset();
            }
        });
    }

    function afficherMessage(type, texte) {
        var ancienMessage = document.querySelector('.form-status');
        if (ancienMessage) ancienMessage.remove();

        var messageDiv = document.createElement('div');
        messageDiv.className = 'form-status ' + type;
        messageDiv.textContent = texte;

        var submitBtn = document.querySelector('.contact-form button[type="submit"]');
        submitBtn.insertAdjacentElement('afterend', messageDiv);

        setTimeout(function () {
            messageDiv.remove();
        }, 5000);
    }
});
