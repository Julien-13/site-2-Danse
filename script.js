const CREDENTIALS = { username: "2danse", password: "0523" };

// --- MENU BURGER ---
const mobileMenu = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('#nav-list');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });
}

// --- GESTION DU SCROLL ---
function handleScroll() {
    const scrollPx = window.pageYOffset;
    const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    const scrolled = (scrollPx / winHeight) * 100;
    const bar = document.getElementById("progress-bar");
    if(bar) bar.style.width = scrolled + "%";

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });

    const btnTop = document.getElementById("back-to-top");
    if(btnTop) btnTop.style.display = (scrollPx > 300) ? "block" : "none";
}

window.addEventListener("scroll", handleScroll);

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- NAVIGATION ---
function showPage(pageId) {
    const pages = ['page-home', 'page-cours', 'page-photos', 'page-spectacles', 'page-contact', 'page-privee'];
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
}

// --- AUTHENTIFICATION ---
let isLoggedIn = false;

function toggleLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function handleAuthClick() {
    if (isLoggedIn) {
        isLoggedIn = false;
        document.getElementById('nav-privee').style.display = 'none';
        document.getElementById('auth-btn').innerHTML = '<i class="fas fa-user"></i><span class="login-text"> Connexion</span>';
        showPage('home');
    } else {
        toggleLoginModal();
    }
}

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
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });
}

// --- MENTIONS LÉGALES ---
function toggleModal() {
    const modal = document.getElementById('legal-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

// --- SYSTÈME DE DÉTECTION 5 CLICS (QUIZ) ---
let clickCount = 0;
let clickTimer;
const logoSecret = document.getElementById('logo-secret');

if(logoSecret) {
    logoSecret.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        if (clickCount === 5) {
            document.getElementById('quiz-modal').style.display = 'block';
            clickCount = 0;
        }
        clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
    });
}

// --- LOGIQUE DU QUIZ ---
const quizData = [
    { q: "Où se trouvent les cours de 2'Danse ?", a: ["Marseille", "Port de Bouc", "Martigues"], correct: 1 },
    { q: "En quelle année l'association a-t-elle ouvert ?", a: ["Il y a 1 an", "Il y a 3 ans", "Il y a 10 ans"], correct: 1 },
    { q: "Qui sont les deux chorégraphes ?", a: ["Maria et Assia", "Maria et Yousra", "Yousra et Kiki"], correct: 1 },
    { q: "Comment s'appelle le groupe des 4-6 ans ?", a: ["Bambino", "Junior", "Baby"], correct: 2 },
    { q: "Quel est le nom du Gala 2025 ?", a: ["2'Direction", "2'United", "2'Queen"], correct: 0 }
];

let currentQuestionIdx = 0;
let quizScore = 0;

function startQuiz() {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-game').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const currentQ = quizData[currentQuestionIdx];
    document.getElementById('quiz-progress').innerText = `Question ${currentQuestionIdx + 1} / ${quizData.length}`;
    document.getElementById('question-text').innerText = currentQ.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    currentQ.a.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => selectOption(index);
        container.appendChild(btn);
    });
}

function selectOption(index) {
    if (index === quizData[currentQuestionIdx].correct) quizScore++;
    currentQuestionIdx++;
    if (currentQuestionIdx < quizData.length) loadQuestion();
    else showQuizResults();
}

function showQuizResults() {
    document.getElementById('quiz-game').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').innerText = quizScore;
    let msg = quizScore === 5 ? "Incroyable ! Tu es une légende ! 👑" : (quizScore >= 3 ? "Bravo ! ✨" : "Pas mal ! 💪");
    document.getElementById('result-comment').innerText = msg;
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
    setTimeout(() => {
        document.getElementById('quiz-intro').style.display = 'block';
        document.getElementById('quiz-game').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'none';
        currentQuestionIdx = 0; quizScore = 0;
    }, 500);
}

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}