// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const appBody = document.getElementById('app-body');
const app = document.getElementById('app');
const navbar = document.getElementById('navbar');

let darkMode = localStorage.getItem('darkMode') === 'true';

function applyTheme() {
  if (darkMode) {
    appBody.classList.add('dark-mode');
    appBody.classList.remove('light-mode');
    if (app) {
      app.classList.add('dark-mode');
      app.classList.remove('light-mode');
    }
    document.querySelector('.icon-sun').style.display = 'block';
    document.querySelector('.icon-moon').style.display = 'none';
  } else {
    appBody.classList.remove('dark-mode');
    appBody.classList.add('light-mode');
    if (app) {
      app.classList.remove('dark-mode');
      app.classList.add('light-mode');
    }
    document.querySelector('.icon-sun').style.display = 'none';
    document.querySelector('.icon-moon').style.display = 'block';
  }
}

applyTheme();

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  applyTheme();
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

let isMenuOpen = false;

mobileMenuToggle.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  mobileMenu.classList.toggle('open', isMenuOpen);
  hamburger.classList.toggle('open', isMenuOpen);
  mobileOverlay.style.display = isMenuOpen ? 'block' : 'none';
});

function closeMobileMenu() {
  isMenuOpen = false;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  mobileOverlay.style.display = 'none';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
