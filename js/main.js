// ======================
// LANGUAGE MANAGEMENT SYSTEM
// ======================

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.marqueeContent = {
      en: [
        "Excel Education & Training Center | Japanese Language N5 & N4 Courses | Japan Student Visa Guidance",
        "Offline Classroom Training Only | 3 Hours Daily | 6 Days a Week",
        "Batch Enrollment Open | Book Your Free Consultation Today",
        "Kajla, Jatrabari, Dhaka | Sat–Thu, 10:00 AM–6:00 PM"
      ],
      ja: [
        "エクセル教育トレーニングセンター | 日本語N5・N4コース | 日本学生ビザサポート",
        "対面教室研修のみ | 1日3時間 | 週6日",
        "バッチ募集開始 | 無料相談を今すぐ予約",
        "カジュラ、ジャトラバリ、ダッカ | 土〜木、午前10時〜午後6時"
      ]
    };
  }

  init() {
    this.loadLanguage();
    this.setupEventListeners();
    this.updateMarquee();
  }

  loadLanguage() {
    // Set HTML lang attribute
    document.documentElement.lang = this.currentLang;
    
    // Update language toggle buttons
    this.updateToggleButtons();
    
    // Update all text content
    this.updateAllText();
  }

  updateToggleButtons() {
    const toggleText = this.currentLang === 'en' ? 'EN' : 'JP';
    const toggleMobile = document.getElementById('langToggleMobile');
    const toggleDesktop = document.getElementById('langToggleDesktop');
    
    if (toggleMobile) toggleMobile.textContent = toggleText;
    if (toggleDesktop) toggleDesktop.textContent = toggleText;
  }

  updateAllText() {
    // Update all elements with data-en and data-ja attributes
    document.querySelectorAll('[data-en], [data-ja]').forEach(element => {
      const text = element.dataset[this.currentLang];
      if (text) {
        // Handle HTML content (for headings with spans)
        if (text.includes('<span') || text.includes('<br')) {
          element.innerHTML = text;
        } else {
          element.textContent = text;
        }
      }
    });

    // Update title tag
    if (this.currentLang === 'ja') {
      document.title = 'エクセル教育 | 日本語研修と日本ビザサポート';
    } else {
      document.title = 'Excel Education | Japanese Language Training & Japan Visa Guidance';
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (this.currentLang === 'ja') {
        metaDesc.content = 'エクセル教育トレーニングセンター - ダッカの主要な日本語学校。集中的なN5/N4コースと日本学生ビザガイダンスを提供。対面教室研修のみ。';
      } else {
        metaDesc.content = 'Excel Education & Training Center - Premier Japanese language institute in Dhaka offering intensive N5/N4 courses with Japan student visa guidance. Offline classroom training only.';
      }
    }
  }

  updateMarquee() {
    const marqueeTrack = document.querySelector('.marquee-track');
    if (!marqueeTrack) return;

    const content = this.marqueeContent[this.currentLang];
    
    // Clear existing content
    marqueeTrack.innerHTML = '';
    
    // Create duplicate content for seamless loop (2 sets)
    const items = [...content, ...content].map(item => {
      const div = document.createElement('div');
      div.className = 'marquee-item';
      div.innerHTML = `
        <span class="marquee-dot"></span>
        ${item}
      `;
      return div;
    });
    
    // Append all items
    items.forEach(item => marqueeTrack.appendChild(item));
    
    // Restart animation
    marqueeTrack.style.animation = 'none';
    setTimeout(() => {
      marqueeTrack.style.animation = 'marqueeMove 25s linear infinite';
    }, 10);
  }

  switchLanguage() {
    const newLang = this.currentLang === 'en' ? 'ja' : 'en';
    this.currentLang = newLang;
    localStorage.setItem('language', newLang);
    this.loadLanguage();
    this.updateMarquee();
  }

  setupEventListeners() {
    // Language toggle buttons
    const langToggleMobile = document.getElementById('langToggleMobile');
    const langToggleDesktop = document.getElementById('langToggleDesktop');
    
    if (langToggleMobile) {
      langToggleMobile.addEventListener('click', () => this.switchLanguage());
    }
    
    if (langToggleDesktop) {
      langToggleDesktop.addEventListener('click', () => this.switchLanguage());
    }
  }
}

// ======================
// THEME MANAGEMENT
// ======================

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.setToggleIcon(theme);
  }

  setToggleIcon(theme) {
    const icon = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelectorAll('.theme-toggle i').forEach(el => {
      el.className = icon;
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.currentTheme = newTheme;
    this.applyTheme(newTheme);
  }

  setupEventListeners() {
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
  }
}

// ======================
// GALLERY SLIDER
// ======================

class GallerySlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000; // 5 seconds
    this.isAutoPlaying = true;
  }

  init() {
    this.getSlides();
    this.setupEventListeners();
    this.updateSliderPosition();
    this.startAutoSlide();
  }

  getSlides() {
    this.slides = document.querySelectorAll('.gallery-slide');
    return this.slides.length;
  }

  goToSlide(index) {
    const totalSlides = this.getSlides();
    if (index >= totalSlides) {
      this.currentSlide = 0;
    } else if (index < 0) {
      this.currentSlide = totalSlides - 1;
    } else {
      this.currentSlide = index;
    }
    
    this.updateSliderPosition();
    this.updateActiveDot();
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }

  updateSliderPosition() {
    const track = document.querySelector('.gallery-slider-track');
    if (track) {
      const slideWidth = 100; // 100% per slide
      track.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
    }
  }

  updateActiveDot() {
    const dots = document.querySelectorAll('.gallery-slider-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  startAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    
    this.autoSlideInterval = setInterval(() => {
      if (this.isAutoPlaying) {
        this.nextSlide();
      }
    }, this.autoSlideDelay);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  setupEventListeners() {
    // Previous button
    const prevBtn = document.getElementById('gallerySliderPrev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.restartAutoSlide();
      });
    }

    // Next button
    const nextBtn = document.getElementById('gallerySliderNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.restartAutoSlide();
      });
    }

    // Dot navigation
    const dotsContainer = document.getElementById('gallerySliderDots');
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-slider-dot')) {
          const slideIndex = parseInt(e.target.getAttribute('data-slide'));
          this.goToSlide(slideIndex);
          this.restartAutoSlide();
        }
      });
    }

    // Pause auto-slide on hover
    const sliderWrapper = document.querySelector('.gallery-slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => {
        this.isAutoPlaying = false;
      });
      
      sliderWrapper.addEventListener('mouseleave', () => {
        this.isAutoPlaying = true;
        this.startAutoSlide();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const gallerySection = document.getElementById('gallery');
      if (!gallerySection) return;
      
      const rect = gallerySection.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      if (isInView) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevSlide();
          this.restartAutoSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
          this.restartAutoSlide();
        }
      }
    });
  }

  restartAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}

// ======================
// MAIN APPLICATION
// ======================

class App {
  constructor() {
    this.languageManager = new LanguageManager();
    this.themeManager = new ThemeManager();
    this.gallerySlider = new GallerySlider();
    this.init();
  }

  init() {
    // Initialize managers
    this.languageManager.init();
    this.themeManager.init();
    
    // Initialize gallery slider
    this.gallerySlider.init();

    // Initialize other components
    this.initScrollAnimations();
    this.initNavbarScroll();
    this.initCounters();
    this.initBackToTop();
    this.initEventListeners();
    this.initCurrentYear();
    this.initMarqueePause();
    this.initMobileMenu();
    this.initPlayButton();
    this.initFAQAccordion();
  }

  initScrollAnimations() {
    const observerOptions = { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animateEls = document.querySelectorAll('.animate-on-scroll');
    animateEls.forEach(el => observer.observe(el));

    // Make hero section visible immediately
    window.addEventListener('load', () => {
      const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
      heroElements.forEach(el => {
        el.classList.add('visible');
      });
      
      // Trigger other animations
      animateEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 20) {
          el.classList.add('visible');
        }
      });
    });
  }

  initNavbarScroll() {
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counterStarted = false;

    const animateCounter = () => {
      const speed = 200;

      counters.forEach(counter => {
        const target = Number(counter.getAttribute('data-count') || 0);
        const suffix = counter.getAttribute('data-suffix') || '';
        const currentText = counter.innerText;
        const current = Number(currentText.replace(/[^0-9]/g, '') || 0);
        const increment = target / speed;

        if (current < target) {
          const newValue = Math.ceil(current + increment);
          counter.innerText = newValue + suffix;
        } else {
          counter.innerText = target + suffix;
        }
      });

      const stillCounting = [...counters].some(c => {
        const t = Number(c.getAttribute('data-count') || 0);
        const v = Number(c.innerText.replace(/[^0-9]/g, '') || 0);
        return v < t;
      });

      if (stillCounting) {
        requestAnimationFrame(animateCounter);
      }
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
          counterStarted = true;
          animateCounter();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
  }

  initBackToTop() {
    const backTopBtn = document.getElementById('backTop');
    if (backTopBtn) {
      const updateBackTopVisibility = () => {
        if (window.scrollY > 300) {
          backTopBtn.classList.add('show');
        } else {
          backTopBtn.classList.remove('show');
        }
      };

      // Initial check
      updateBackTopVisibility();

      // Throttled scroll listener
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateBackTopVisibility();
            ticking = false;
          });
          ticking = true;
        }
      });

      // Click handler
      backTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  initEventListeners() {
    // Top marquee pause on hover
    const marquee = document.querySelector('.top-marquee');
    if (marquee) {
      marquee.addEventListener('mouseenter', () => {
        const track = marquee.querySelector('.marquee-track');
        if (track) track.style.animationPlayState = 'paused';
      });
      
      marquee.addEventListener('mouseleave', () => {
        const track = marquee.querySelector('.marquee-track');
        if (track) track.style.animationPlayState = 'running';
      });
    }

    // Testimonial marquee pause on hover
    const testimonialTrack = document.querySelector('.testimonial-marquee-track');
    const testimonialPause = document.querySelector('.testimonial-pause');
    
    if (testimonialTrack && testimonialPause) {
      testimonialPause.addEventListener('mouseenter', () => {
        testimonialTrack.style.animationPlayState = 'paused';
      });
      
      testimonialPause.addEventListener('mouseleave', () => {
        testimonialTrack.style.animationPlayState = 'running';
      });
    }
  }

  initCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  initMarqueePause() {
    // Already handled in initEventListeners
  }

  initMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navLinks && navbarCollapse) {
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        });
      });
    }
  }

  initPlayButton() {
    const playButton = document.querySelector('.play-button');
    if (playButton) {
      playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Facility tour video would play here.');
      });
    }
  }

  initFAQAccordion() {
    // Initialize Bootstrap accordion behavior
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Add smooth transition for the accordion body
        const collapseElement = button.nextElementSibling;
        if (collapseElement.classList.contains('show')) {
          collapseElement.style.maxHeight = collapseElement.scrollHeight + 'px';
          setTimeout(() => {
            collapseElement.style.maxHeight = '0';
          }, 10);
        } else {
          collapseElement.style.maxHeight = collapseElement.scrollHeight + 'px';
          setTimeout(() => {
            collapseElement.style.maxHeight = 'none';
          }, 300);
        }
      });
    });

    // Handle FAQ language switching
    this.languageManager.updateAllText();
  }
}

// ======================
// INITIALIZE APP
// ======================

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  
  // Initialize Bootstrap tooltips if any
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// ======================
// SWIPE SUPPORT FOR MOBILE
// ======================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const gallerySection = document.getElementById('gallery');
  if (!gallerySection) return;
  
  const rect = gallerySection.getBoundingClientRect();
  const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
  if (isInView) {
    const swipeThreshold = 50; // Minimum swipe distance
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      if (window.app && window.app.gallerySlider) {
        window.app.gallerySlider.nextSlide();
        window.app.gallerySlider.restartAutoSlide();
      }
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      if (window.app && window.app.gallerySlider) {
        window.app.gallerySlider.prevSlide();
        window.app.gallerySlider.restartAutoSlide();
      }
    }
  }
}

// Make app globally accessible for swipe functionality
window.app = new App();

