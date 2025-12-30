const CREDENTIALS = { username: "2danse", password: "0523" };

// CONFIGURATION SUPABASE
const SUPABASE_URL = "https://fdjgleaayjnodnucipyb.supabase.co";
const SUPABASE_KEY = "sb_publishable_p9Xo3hdIvsgOruZUr6MaLw_GdzrM3J-";

// Menu Burger
const mobileMenu = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('#nav-list');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
}

// GESTION DU SCROLL
function handleScroll() {
    const scrollPx = window.pageYOffset;
    const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    const scrolled = (scrollPx / winHeight) * 100;
    const bar = document.getElementById("progress-bar");
    if(bar) bar.style.width = scrolled + "%";

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) el.classList.add("active");
    });

    const btnTop = document.getElementById("back-to-top");
    if(btnTop) btnTop.style.display = (scrollPx > 300) ? "block" : "none";
}
window.addEventListener("scroll", handleScroll);

function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

// Navigation
function showPage(pageId) {
    const pages = ['page-home', 'page-cours', 'page-photos', 'page-spectacles', 'page-contact', 'page-privee', 'page-livredor'];
    pages.forEach(p => {
        const el = document.getElementById(p);
        if(el) el.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    const targetPage = document.getElementById('page-' + pageId);
    if(targetPage) targetPage.style.display = 'block';
    
    const link = document.getElementById('link-' + pageId);
    if(link) link.classList.add('active');

    if (navLinks) {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
    }
    window.scrollTo(0, 0);
    if(pageId === 'livredor') fetchMessages();
    setTimeout(handleScroll, 100);
}

// Authentification
let isLoggedIn = false;
function handleAuthClick() { isLoggedIn ? logout() : toggleLoginModal(); }

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
            isLoggedIn = true;
            document.getElementById('nav-privee').style.display = 'block';
            document.getElementById('auth-btn').innerHTML = '<i class="fas fa-sign-out-alt"></i><span class="login-text"> Déconnexion</span>';
            toggleLoginModal();
            showPage('privee');
            showToast("Vous êtes bien connectés");
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });
}

function logout() {
    isLoggedIn = false;
    document.getElementById('nav-privee').style.display = 'none';
    document.getElementById('auth-btn').innerHTML = '<i class="fas fa-user"></i><span class="login-text"> Connexion</span>';
    showPage('home');
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if(toast) {
        toast.innerText = message;
        toast.className = "toast show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }
}

function toggleModal() {
    const m = document.getElementById('legal-modal');
    if(m) m.style.display = (m.style.display === "block") ? "none" : "block";
}
function toggleLoginModal() {
    const m = document.getElementById('login-modal');
    if(m) m.style.display = (m.style.display === "block") ? "none" : "block";
}

document.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('active'));
});

// LOGIQUE COMPTE À REBOURS
function updateCountdown() {
    const galaDate = new Date("May 17, 2026 20:00:00").getTime();
    const now = new Date().getTime();
    const gap = galaDate - now;
    if (gap > 0) {
        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((gap % (1000 * 60)) / 1000);
        document.getElementById("days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }
}
setInterval(updateCountdown, 1000);

// --- LOGIQUE LIVRE D'OR (SUPABASE) ---

// 1. Lire les messages
async function fetchMessages() {
    const container = document.getElementById('guestbook-messages');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/guestbook?select=*&order=created_at.desc`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const messages = await response.json();
        
        container.innerHTML = messages.map(msg => `
            <div class="message-card reveal active">
                ${isLoggedIn ? `<button class="delete-btn" onclick="deleteMessage(${msg.id})"><i class="fas fa-trash"></i></button>` : ''}
                <p>"${msg.message}"</p>
                <span class="message-author">${msg.name}</span>
                <span class="message-date">${new Date(msg.created_at).toLocaleDateString()}</span>
            </div>
        `).join('') || '<p>Soyez le premier à laisser un message !</p>';
    } catch (err) {
        container.innerHTML = "<p>Erreur lors du chargement des messages.</p>";
    }
}

// 2. Envoyer un message
const gbForm = document.getElementById('guestbook-form');
if(gbForm) {
    gbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('gb-name').value;
        const message = document.getElementById('gb-message').value;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
                method: 'POST',
                headers: { 
                    "apikey": SUPABASE_KEY, 
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({ name, message })
            });

            if(response.ok) {
                showToast("Message publié !");
                gbForm.reset();
                fetchMessages();
            }
        } catch (err) {
            showToast("Erreur d'envoi.");
        }
    });
}

// 3. Supprimer un message (Méthode a posteriori - Réservé au président/admin connecté)
async function deleteMessage(id) {
    if(!confirm("Supprimer ce message ?")) return;
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/guestbook?id=eq.${id}`, {
            method: 'DELETE',
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        showToast("Message supprimé");
        fetchMessages();
    } catch (err) {
        showToast("Erreur de suppression");
    }
}

updateCountdown();
handleScroll();