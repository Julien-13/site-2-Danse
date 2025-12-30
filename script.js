document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BARRE DE PROGRESSION DE LECTURE ---
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
    });

    // --- 2. MENU MOBILE (HAMBURGER) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinks.classList.toggle('active');
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navLinks) {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- 3. ANIMATIONS REVEAL (Apparition au scroll) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Lancer une fois au chargement

    // --- 4. COMPTEUR DE STATISTIQUES ---
    const stats = document.querySelectorAll('.stat-number');
    let started = false;

    const startCount = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const speed = 200;
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => startCount(el), 1);
        } else {
            el.innerText = target;
        }
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        window.addEventListener('scroll', () => {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;
            if (sectionPos < screenPos && !started) {
                stats.forEach(stat => startCount(stat));
                started = true;
            }
        });
    }

    // --- 5. GESTION DU PLANNING (Mise en avant du jour actuel) ---
    const highlightCurrentDay = () => {
        const planningTable = document.querySelector('.planning-table');
        if (!planningTable) return;

        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const today = days[new Date().getDay()];
        const rows = planningTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const dayCell = row.querySelector('.day-cell');
            if (dayCell && dayCell.innerText.trim() === today) {
                row.style.backgroundColor = 'rgba(212, 175, 55, 0.15)'; // Teinte var(--accent)
                row.style.borderLeft = "4px solid #d4af37";
            }
        });
    };
    highlightCurrentDay();

    // --- 6. ACCORDÉON FAQ (CONTACT) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- 7. GESTION DES MODALS (CONNEXION) ---
    const loginBtn = document.querySelector('.login-nav-btn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 8. BOUTON RETOUR EN HAUT ---
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            if (backToTop) backToTop.style.display = "block";
        } else {
            if (backToTop) backToTop.style.display = "none";
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 9. FORMULAIRE DE CONTACT & TOAST ---
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Merci ! Votre message a été envoyé.");
            contactForm.reset();
        });
    }

    function showToast(message) {
        if (toast) {
            toast.innerText = message;
            toast.classList.add('show');
            setTimeout(() => { 
                toast.classList.remove('show'); 
            }, 3000);
        }
    }
});