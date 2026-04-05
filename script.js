// Constants
const TARGET_DATE = new Date("April 7, 2026 17:00:00").getTime();
let currentLang = localStorage.getItem("lang") || "ar";
let currentTheme = localStorage.getItem("theme") || "dark-mode";

// DOM Elements
const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Localization Strings (Loaded from JSON)
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

function applyTranslations() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });

    // Update body direction and class
    if (currentLang === "ar") {
        body.classList.add("rtl");
        body.classList.remove("ltr");
        document.documentElement.lang = "ar";
        langToggle.textContent = "EN";
    } else {
        body.classList.add("ltr");
        body.classList.remove("rtl");
        document.documentElement.lang = "en";
        langToggle.textContent = "AR";
    }
}

// Language Toggle
langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", currentLang);
    loadTranslations(currentLang);
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
    currentTheme = body.classList.contains("dark-mode") ? "light-mode" : "dark-mode";
    applyTheme(currentTheme);
});

function applyTheme(theme) {
    body.classList.remove("dark-mode", "light-mode");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark-mode" ? "☀️" : "🌙";
}

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance < 0) {
        document.getElementById("timer").style.display = "none";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, observerOptions);

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Load saved settings
    applyTheme(currentTheme);
    loadTranslations(currentLang);

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Observe animations
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
});
