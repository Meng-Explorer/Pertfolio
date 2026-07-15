/* ==========================================
   Modern Portfolio Interactive Javascript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initTypewriter();
  initScrollReveal();
  initProjectFilter();
  initContactForm();
  initCursorGlow();
});


/* ==========================================
   1. Theme Switcher (Dark/Light)
   ========================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved preference or default to dark theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  });
}

/* ==========================================
   2. Header Scroll Effect
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top-btn');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      if (backToTop) backToTop.style.transform = 'translateY(0) scale(1)';
    } else {
      if (backToTop) backToTop.style.transform = 'translateY(50px) scale(0)';
    }
  }

  // Set initial state
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/* ==========================================
   3. Mobile Navigation Drawer
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
    
    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile drawer when a link is clicked
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================
   4. Hero Typewriter Effect
   ========================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = JSON.parse(element.getAttribute('data-words'));
  let wordIndex = 0;
  let txt = '';
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex % words.length];
    
    if (isDeleting) {
      // Remove character
      txt = currentWord.substring(0, txt.length - 1);
    } else {
      // Add character
      txt = currentWord.substring(0, txt.length + 1);
    }

    element.textContent = txt;

    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2; // Deleting is faster
    }

    // If word is complete
    if (!isDeleting && txt === currentWord) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex++;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing
  setTimeout(type, 500);
}

/* ==========================================
   5. Intersection Observer for Scroll Reveals
   ========================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Specially animate skill bars when the Skills section is revealed
        if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
          const progressBars = entry.target.querySelectorAll('.skill-progress');
          progressBars.forEach(bar => {
            // Retrieve computed style width or manual inline styles
            const finalWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
            bar.style.width = finalWidth;
          });
        }
        
        // Once revealed, we can unobserve
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });

  // Track scroll position to update active navigation item
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px' // Trigger active state when section takes up the middle of viewport
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });
}

/* ==========================================
   6. Project Filtering Logic
   ========================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from other buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          // Force a reflow to restart transition
          card.offsetHeight;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          // Hide after transition ends
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   7. Contact Form Handling (Mock Submit)
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  if (!form || !statusMsg || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable button during submitting state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    fetch("https://formsubmit.co/ajax/langmeng514@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
        _subject: `New Portfolio Message: ${subject}`
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(data => {
      // Clear inputs
      form.reset();
      
      // Update UI feedback
      statusMsg.className = 'form-status-msg success';
      statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Oops! There was a problem sending your message. Please try again.';
    })
    .finally(() => {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Clear success or error message after 6 seconds
      setTimeout(() => {
        statusMsg.classList.remove('success', 'error');
        statusMsg.textContent = '';
      }, 6000);
    });
  });
}

/* ==========================================
   8. Interactive Cursor Glow Blob
   ========================================== */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow) return;

  window.addEventListener('mousemove', (e) => {
    // Make visible on first move
    cursorGlow.style.opacity = '1';
    
    // Smooth frame render
    requestAnimationFrame(() => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}
