/* ========================
   CUSTOM CURSOR
======================== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0,
    mouseY = 0;
let followerX = 0,
    followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

/* ========================
   WELCOME PROMPT
======================== */
window.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const userName = prompt("👋 Hey! What's your name?");
        if (userName && userName.trim()) {
            const titleLine = document.querySelector('.hero-title .title-line');
            if (titleLine) {
                titleLine.textContent = `Hi ${userName.trim()},`;
            }
            document.getElementById('welcomeText').textContent = `Hi ${userName.trim()}, Welcome To Website`;
        }
    }, 600);
});

/* ========================
   NAVBAR SCROLL EFFECT
======================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ========================
   MOBILE MENU TOGGLE
======================== */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    });
});

/* ========================
   SMOOTH SCROLLING
======================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ========================
   SCROLL REVEAL ANIMATION
======================== */
const revealElements = document.querySelectorAll(
    '.hq-card, .profile-block, .result-field, .section-header, .contact-header, .profile-left, .profile-right, .form-wrap, .result-wrap'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 0);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Staggered reveal for cards in the same parent
const staggerGroups = ['.hq-grid', '.profile-right'];
staggerGroups.forEach(selector => {
    const group = document.querySelector(selector);
    if (!group) return;
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
    });
});

/* ========================
   LIVE CLOCK in Result Panel
======================== */
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID');
    const existingTime = document.getElementById('resultTime').textContent;
    if (existingTime !== '—') {
        // Only update if there's already a result showing
        const dateStr = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('resultTime').textContent = `${dateStr}, ${timeStr}`;
    }
}
setInterval(updateClock, 1000);

/* ========================
   FORM VALIDATION & SUBMIT
======================== */
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = msg || el.textContent;
        el.classList.add('visible');
    }
}

function submitForm(event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    // Name
    const name = document.getElementById('name').value.trim();
    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Birthdate
    const birthdate = document.getElementById('birthdate').value;
    if (!birthdate) {
        showError('birthdateError', 'Please select your birthdate');
        isValid = false;
    } else {
        // Extra: check if date is not in the future
        const bd = new Date(birthdate);
        const today = new Date();
        if (bd > today) {
            showError('birthdateError', 'Birthdate cannot be in the future');
            isValid = false;
        }
    }

    // Gender
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        showError('genderError', 'Please select your gender');
        isValid = false;
    }

    // Message
    const message = document.getElementById('message').value.trim();
    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    if (!isValid) {
        // Shake the form on error
        const form = document.getElementById('contactForm');
        form.style.animation = 'none';
        form.offsetHeight; // trigger reflow
        form.style.animation = 'shake 0.4s ease';
        return;
    }

    // All valid — display result
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID');

    document.getElementById('resultTime').textContent = `${dateStr}, ${timeStr}`;
    document.getElementById('resultName').textContent = name;
    document.getElementById('resultBirthdate').textContent = new Date(birthdate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('resultGender').textContent = gender.value;
    document.getElementById('resultMessage').textContent = message;

    // Activate result panel
    const resultPanel = document.getElementById('resultPanel');
    resultPanel.classList.add('active');
    document.getElementById('successMsg').classList.add('show');

    // Scroll to result panel on mobile
    if (window.innerWidth < 1024) {
        setTimeout(() => {
            resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

// Add shake animation via JS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ========================
   PARALLAX ON BANNER
======================== */
window.addEventListener('scroll', () => {
    const banner = document.querySelector('.banner-image');
    if (!banner) return;
    const rect = document.querySelector('.banner-strip').getBoundingClientRect();
    const scrolled = -rect.top * 0.2;
    banner.style.transform = `scale(1.05) translateY(${scrolled}px)`;
});