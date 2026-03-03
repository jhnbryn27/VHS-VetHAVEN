// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    // Natural loading based on actual page load
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 300);
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMenu() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  mobileOverlay.classList.toggle('active');
  document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

// Close menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// ===== ACTIVE NAV ON SCROLL =====
let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = 100;

// Set active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Hide/Show navbar based on scroll direction
  if (scrollTop > scrollThreshold) {
    if (scrollTop > lastScrollTop) {
      // Scrolling down - hide navbar
      header.classList.add('nav-hidden');
      header.classList.remove('nav-visible');
    } else {
      // Scrolling up - show navbar
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  } else {
    // At top of page - always show
    header.classList.remove('nav-hidden');
    header.classList.remove('nav-visible');
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== HERO PET CAROUSEL =====
let heroPetIndex = 0;
const heroPets = document.querySelectorAll('.hero-pet');

function showHeroPet(index) {
  heroPets.forEach(pet => pet.classList.remove('active'));
  heroPets[index].classList.add('active');
}

function nextHeroPet() {
  heroPetIndex = (heroPetIndex + 1) % heroPets.length;
  showHeroPet(heroPetIndex);
}

// Auto-advance every 5 seconds
setInterval(nextHeroPet, 5000);

// Hero Book Button
document.getElementById('heroBookBtn')?.addEventListener('click', () => {
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
  resetModal();
});

// ===== ABOUT BACKGROUND SLIDESHOW =====
let bgIndex = 0;
const bgSlides = document.querySelectorAll('.bg-slide');

function nextBgSlide() {
  if (bgSlides.length === 0) return;
  bgSlides[bgIndex].classList.remove('active');
  bgIndex = (bgIndex + 1) % bgSlides.length;
  bgSlides[bgIndex].classList.add('active');
}

setInterval(nextBgSlide, 5000);

// ===== SCROLL BUTTONS =====
document.querySelectorAll('.scroll-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const container = document.getElementById(`${target}-scroll`);
    const direction = btn.classList.contains('scroll-prev') ? -1 : 1;
    
    if (container) {
      container.scrollBy({
        left: direction * container.clientWidth * 0.8,
        behavior: 'smooth'
      });
    }
  });
});

// ===== TEAM CAROUSEL NAVIGATION =====
document.querySelectorAll('.carousel-nav').forEach(btn => {
  btn.addEventListener('click', () => {
    const carouselType = btn.getAttribute('data-carousel');
    const direction = btn.classList.contains('prev') ? -1 : 1;
    const container = document.getElementById(`${carouselType}-carousel`);
    
    if (container) {
      const cardWidth = container.querySelector('.team-card').offsetWidth;
      const gap = 24; // 1.5rem gap
      container.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
  });
});

// ===== MODAL =====
const modal = document.getElementById('modal');
const openBtns = [
  document.getElementById('openBookingModal'),
  document.getElementById('openBookingModalAlt'),
  document.getElementById('heroBookBtn'),
  document.getElementById('openBookingModalServices')
].filter(btn => btn !== null);
const closeBtn = document.getElementById('closeModal');

// Modal screens and forms
const modalOptions = document.getElementById('modalOptions');
const guestForm = document.getElementById('guestForm');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Option buttons
const guestBtn = document.getElementById('guestBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  resetModal();
  
  // Set minimum date to today for all date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.setAttribute('min', today);
  });
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function resetModal() {
  // Show options screen, hide all forms
  if (modalOptions) modalOptions.classList.remove('hidden');
  if (guestForm) guestForm.classList.add('hidden');
  if (loginForm) loginForm.classList.add('hidden');
  if (signupForm) signupForm.classList.add('hidden');
  
  // Reset all forms
  [guestForm, loginForm, signupForm].forEach(form => {
    if (form) form.reset();
  });
}

function showForm(formElement) {
  if (modalOptions) modalOptions.classList.add('hidden');
  if (guestForm) guestForm.classList.add('hidden');
  if (loginForm) loginForm.classList.add('hidden');
  if (signupForm) signupForm.classList.add('hidden');
  
  if (formElement) formElement.classList.remove('hidden');
}

// Open modal buttons
openBtns.forEach(btn => {
  if (btn) btn.addEventListener('click', openModal);
});

// Close modal
if (closeBtn) closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Option buttons - show respective forms
if (guestBtn) {
  guestBtn.addEventListener('click', () => showForm(guestForm));
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => showForm(loginForm));
}

if (signupBtn) {
  signupBtn.addEventListener('click', () => showForm(signupForm));
}

// Back buttons - return to options screen
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', resetModal);
});

// Switch form links (e.g., "Don't have an account? Sign up")
document.querySelectorAll('.switch-form').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetBtn = link.getAttribute('data-target');
    if (targetBtn === 'loginBtn') {
      showForm(loginForm);
    } else if (targetBtn === 'signupBtn') {
      showForm(signupForm);
    }
  });
});

// ===== FORM VALIDATIONS =====

// Guest Form Submission
if (guestForm) {
  guestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('guestPhone')?.value;
    const agreeTerms = document.getElementById('guestAgreeTerms')?.checked;
    
    // Phone validation
    if (phone && !/^[0-9]{11}$/.test(phone)) {
      alert('Please enter a valid 11-digit phone number (e.g., 09XXXXXXXXX)');
      return;
    }
    
    // Terms agreement
    if (!agreeTerms) {
      alert('You must agree to the Terms and Conditions and Privacy Policy');
      return;
    }
    
    alert('Appointment booked successfully! We will send you a confirmation email shortly.');
    closeModal();
    guestForm.reset();
  });
}

// Login Form Submission
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const errorDiv = document.getElementById('loginError');
    
    // Clear previous error
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
    
    // Admin credentials
    if (email === 'admin@vhs.com' && password === 'admin123') {
      // Show loading
      const loader = document.createElement('div');
      loader.className = 'page-loader';
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <div class="loader-text">Logging in...</div>
        </div>
      `;
      document.body.appendChild(loader);
      
      setTimeout(() => {
        window.location.href = '../admin/index.html';
      }, 1000);
      return;
    }
    
    // Show error message for incorrect credentials
    if (errorDiv) {
      errorDiv.textContent = '❌ Invalid email or password. Please try again.';
      errorDiv.style.display = 'block';
      
      // Shake animation
      loginForm.classList.add('shake');
      setTimeout(() => {
        loginForm.classList.remove('shake');
      }, 500);
    }
  });
}

// Sign Up Form Submission
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    const phone = document.getElementById('signupPhone')?.value;
    const agreeTerms = document.getElementById('signupAgreeTerms')?.checked;
    
    // Phone validation
    if (phone && !/^[0-9]{11}$/.test(phone)) {
      alert('Please enter a valid 11-digit phone number (e.g., 09XXXXXXXXX)');
      return;
    }
    
    // Password validation
    if (password) {
      if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }
      
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasNumber || !hasSpecial) {
        alert('Password must include at least 1 number and 1 special character');
        return;
      }
      
      // Confirm password match
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }
    
    // Terms agreement
    if (!agreeTerms) {
      alert('You must agree to the Terms and Conditions and Privacy Policy');
      return;
    }
    
    alert('Account created successfully! You can now book appointments.');
    closeModal();
    signupForm.reset();
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

// Observe cards
document.querySelectorAll('.card').forEach(el => observer.observe(el));

// ===== ENHANCED SCROLL ANIMATIONS =====
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px'
});

// Observe all animatable elements
document.addEventListener('DOMContentLoaded', () => {
  // Service cards
  document.querySelectorAll('.service-card, .service-card-detailed').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
  });
  
  // Team cards
  document.querySelectorAll('.team-card').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
  });
  
  // About cards
  document.querySelectorAll('.about-cards .card').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
  });
  
  // Stats
  document.querySelectorAll('.stat').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
  });
  
  // Hero stats
  document.querySelectorAll('.hero-stats .stat').forEach(el => {
    el.classList.add('scroll-animate-delay');
    scrollObserver.observe(el);
  });
  
  // Section titles
  document.querySelectorAll('.section h2, .page-hero h1').forEach(el => {
    el.classList.add('scroll-animate-title');
    scrollObserver.observe(el);
  });
  
  // Subtitles
  document.querySelectorAll('.subtitle, .page-hero p').forEach(el => {
    el.classList.add('scroll-animate-subtitle');
    scrollObserver.observe(el);
  });
  
  // Contact items
  document.querySelectorAll('.contact-item').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
  });
  
  // Location details
  const locationDetails = document.querySelector('.location-details');
  if (locationDetails) {
    locationDetails.classList.add('scroll-animate');
    scrollObserver.observe(locationDetails);
  }
  
  // Story content
  const storyText = document.querySelector('.story-text');
  const storyImage = document.querySelector('.story-image');
  if (storyText) {
    storyText.classList.add('scroll-animate-left');
    scrollObserver.observe(storyText);
  }
  if (storyImage) {
    storyImage.classList.add('scroll-animate-right');
    scrollObserver.observe(storyImage);
  }
});

console.log('🐾 VHS Animal Wellness Center - Ready!');


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

// ===== REGISTRATION FORM VALIDATION =====
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('regConfirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    // Password validation
    if (password && password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasNumber || !hasSymbol) {
      alert('Password must include at least one number and one symbol');
      return;
    }
    
    // Confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Terms agreement
    if (!agreeTerms) {
      alert('You must agree to the Terms and Conditions and Data Privacy Policy');
      return;
    }
    
    alert('Account created successfully!');
    closeModal();
    registerForm.reset();
  });
}


// ===== AI CHATBOT FUNCTIONALITY =====
// This is a placeholder structure for future AI integration
const chatbotBubble = document.getElementById('chatbotBubble');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chatbot window
function toggleChatbot() {
  chatbotBubble.classList.toggle('active');
  chatbotWindow.classList.toggle('active');
}

if (chatbotBubble) {
  chatbotBubble.addEventListener('click', toggleChatbot);
}

if (chatbotClose) {
  chatbotClose.addEventListener('click', toggleChatbot);
}

// Send message function (placeholder for AI integration)
function sendMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, 'user');
  chatbotInput.value = '';

  // Simulate bot response (replace with actual AI integration)
  setTimeout(() => {
    addTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addMessage('Thank you for your message! This is a placeholder response. AI integration coming soon.', 'bot');
    }, 1500);
  }, 500);
}

// Add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${sender}-message`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>`;
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `<p>${text}</p>`;
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  chatbotMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot-message typing-indicator-message';
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="message-content typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = chatbotMessages.querySelector('.typing-indicator-message');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Send button click
if (chatbotSend) {
  chatbotSend.addEventListener('click', sendMessage);
}

// Enter key to send
if (chatbotInput) {
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// ===== INTERACTIVE BUBBLE POP EFFECT =====
const floatingBadges = document.querySelectorAll('.floating-badge');

floatingBadges.forEach(badge => {
  let isPopped = false;
  let reappearTimeout = null;

  badge.addEventListener('click', function() {
    // Prevent multiple clicks while animating
    if (isPopped) return;
    
    isPopped = true;
    
    // Add popping animation
    badge.classList.add('popping');
    
    // After pop animation completes, hide the badge
    setTimeout(() => {
      badge.classList.remove('popping');
      badge.classList.add('hidden');
      
      // Reappear after 10 seconds
      reappearTimeout = setTimeout(() => {
        badge.classList.remove('hidden');
        badge.classList.add('reappearing');
        
        // Remove reappearing class after animation
        setTimeout(() => {
          badge.classList.remove('reappearing');
          isPopped = false;
        }, 800);
      }, 10000); // 10 seconds
    }, 600); // Duration of pop animation
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (reappearTimeout) {
      clearTimeout(reappearTimeout);
    }
  });
});
