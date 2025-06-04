// Global variables
let currentLang = 'en';
let isMobileMenuOpen = false;
let isMobile = false;
let resizeTimeout;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile device
    checkMobileDevice();
    
    // Create particles for hero section (reduced on mobile)
    createParticles();
    
    // Add scroll event listeners
    handleScrollEvents();
    
    // Add click handlers for navigation
    setupNavigation();
    
    // Initialize language settings
    updateLanguageUI();
    
    // Handle smooth scrolling for all navigation links
    setupSmoothScrolling();
    
    // Add touch event listeners for mobile
    setupTouchEvents();
    
    // Handle window resize
    setupResizeHandler();
    
    // Optimize for mobile performance
    optimizeForMobile();
});

/**
 * Checks if the device is mobile and sets appropriate flags
 */
function checkMobileDevice() {
    isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.toggle('mobile-device', isMobile);
}

/**
 * Sets up window resize handler with debouncing
 */
function setupResizeHandler() {
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const wasMobile = isMobile;
            checkMobileDevice();
            
            // If switching between mobile/desktop, reset menu state
            if (wasMobile !== isMobile && isMobileMenuOpen) {
                closeMobileMenu();
            }
            
            // Recreate particles if switching to/from mobile
            if (wasMobile !== isMobile) {
                recreateParticles();
            }
        }, 250);
    });
}

/**
 * Optimizes performance for mobile devices
 */
function optimizeForMobile() {
    if (isMobile) {
        // Reduce animations on mobile
        document.body.classList.add('reduce-motion');
        
        // Add touch-action CSS for better scrolling
        document.body.style.touchAction = 'pan-y';
        
        // Optimize scroll performance
        document.addEventListener('scroll', throttle(handleMobileScroll, 16), { passive: true });
    }
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Mobile-optimized scroll handler
 */
function handleMobileScroll() {
    if (isMobile) {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

/**
 * Sets up touch events for better mobile interaction
 */
function setupTouchEvents() {
    // Prevent zoom on double tap for better UX
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Handle touch events for mobile menu
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        let startY = 0;
        
        mobileNav.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        mobileNav.addEventListener('touchmove', function(e) {
            const currentY = e.touches[0].clientY;
            const diffY = startY - currentY;
            
            // Prevent overscroll
            if (mobileNav.scrollTop === 0 && diffY < 0) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

/**
 * Creates animated particles in the hero section background
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Reduce particles on mobile for performance
    const numberOfParticles = isMobile ? 15 : 30;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        
        // Random size (smaller on mobile)
        const baseSize = isMobile ? 3 : 6;
        const size = Math.floor(Math.random() * baseSize) + 2;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        // Random opacity (more subtle on mobile)
        const opacity = isMobile ? 
            Math.random() * 0.3 + 0.05 : 
            Math.random() * 0.5 + 0.1;
        
        // Apply styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = opacity;
        
        // Slower animation on mobile for performance
        const duration = isMobile ? 
            Math.random() * 30 + 20 : 
            Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Recreates particles when switching between mobile/desktop
 */
function recreateParticles() {
    createParticles();
}

/**
 * Sets up event listeners for scroll events
 */
function handleScrollEvents() {
    // Use throttled scroll handler for better performance
    const scrollHandler = throttle(function() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Only highlight active section on desktop or when not in mobile menu
        if (!isMobile || !isMobileMenuOpen) {
            highlightActiveSection();
        }
    }, 16);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
}

/**
 * Highlights the active section in the navigation based on scroll position
 */
function highlightActiveSection() {
    const sections = [
        'vision', 
        'architecture', 
        'features', 
        'roadmap', 
        'budget', 
        'tech'
    ];
    
    const suffix = currentLang === 'de' ? '-de' : '';
    const scrollPosition = window.scrollY + (isMobile ? 150 : 200);
    
    // Find the current section
    let currentSection = null;
    
    sections.forEach(section => {
        const element = document.getElementById(section + suffix);
        
        if (element) {
            const rect = element.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionHeight = rect.height;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        }
    });
    
    // Update navigation highlighting
    if (currentSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll(`.nav-link[href="#${currentSection}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
}

/**
 * Sets up navigation functionality
 */
function setupNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Add touch event for better mobile response
        mobileToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileNav && mobileToggle && isMobileMenuOpen && 
            !mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Language switcher buttons
    document.querySelectorAll('.navbar-lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.textContent.trim().includes('EN') ? 'en' : 
                         this.textContent.trim().includes('DE') ? 'de' : currentLang;
            switchLanguage(lang);
        });
    });
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            let targetElement;
            
            if (targetId === '') {
                // Handle scrolling to top when href="#"
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Handle language-specific section IDs
            if (currentLang === 'de' && !targetId.endsWith('-de')) {
                targetElement = document.getElementById(targetId + '-de');
            } else {
                targetElement = document.getElementById(targetId);
            }
            
            if (targetElement) {
                // Different header offset for mobile
                const headerOffset = isMobile ? 80 : 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    setTimeout(() => closeMobileMenu(), 300);
                }
            }
        });
    });
}

/**
 * Toggles the mobile menu open/closed state
 */
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && mobileToggle) {
        const isOpening = !isMobileMenuOpen;
        
        mobileNav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        isMobileMenuOpen = !isMobileMenuOpen;
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        document.documentElement.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        
        // Set focus management for accessibility
        if (isOpening) {
            // Focus first link in mobile menu
            setTimeout(() => {
                const firstLink = mobileNav.querySelector('.nav-link');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            // Return focus to toggle button
            mobileToggle.focus();
        }
        
        // Add aria attributes for accessibility
        mobileToggle.setAttribute('aria-expanded', isMobileMenuOpen.toString());
        mobileNav.setAttribute('aria-hidden', (!isMobileMenuOpen).toString());
    }
}

/**
 * Closes the mobile menu
 */
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && mobileToggle && isMobileMenuOpen) {
        mobileNav.classList.remove('active');
        mobileToggle.classList.remove('active');
        isMobileMenuOpen = false;
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Update aria attributes
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Scrolls to the top of the page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
        closeMobileMenu();
    }
}

/**
 * Switches the language of the interface
 * @param {string} lang - The language code ('en' or 'de')
 */
function switchLanguage(lang) {
    if (lang !== 'en' && lang !== 'de') return;
    
    const previousLang = currentLang;
    currentLang = lang;
    
    // Hide all content sections
    document.querySelectorAll('.language-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show the selected language content
    const contentElement = document.getElementById(lang + '-content');
    if (contentElement) {
        contentElement.classList.add('active');
    }
    
    // Update language buttons
    updateLanguageUI();
    
    // Update text for elements with data-en/data-de attributes
    updateTranslatableElements();
    
    // Update document language attribute
    document.documentElement.lang = lang;
    
    // Close mobile menu after language switch
    if (isMobileMenuOpen) {
        setTimeout(() => closeMobileMenu(), 100);
    }
    
    // Re-highlight active section after language switch
    setTimeout(() => highlightActiveSection(), 100);
    
    // Store language preference
    try {
        sessionStorage.setItem('medixtrack-lang', lang);
    } catch (e) {
        // Ignore storage errors
        console.log('Language preference could not be stored');
    }
    
    // Log the language change (for debugging)
    console.log('Language switched from', previousLang, 'to', lang);
}

/**
 * Updates the UI elements related to language selection
 */
function updateLanguageUI() {
    // Update button states in navbar and mobile menu
    document.querySelectorAll('.navbar-lang-btn').forEach(btn => {
        btn.classList.remove('active');
        
        const btnText = btn.textContent.trim();
        if ((currentLang === 'en' && btnText.includes('EN')) || 
            (currentLang === 'de' && btnText.includes('DE'))) {
            btn.classList.add('active');
        }
    });
}

/**
 * Updates text content for elements that have language-specific data attributes
 */
function updateTranslatableElements() {
    document.querySelectorAll('[data-' + currentLang + ']').forEach(element => {
        const translatedText = element.getAttribute('data-' + currentLang);
        if (translatedText) {
            element.textContent = translatedText;
        }
    });
}

/**
 * Initialize language from storage or browser settings
 */
function initializeLanguage() {
    try {
        const storedLang = sessionStorage.getItem('medixtrack-lang');
        if (storedLang && (storedLang === 'en' || storedLang === 'de')) {
            switchLanguage(storedLang);
            return;
        }
    } catch (e) {
        // Ignore storage errors
    }
    
    // Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.toLowerCase().startsWith('de') ? 'de' : 'en';
    switchLanguage(langCode);
}

/**
 * Handle visibility change for performance optimization
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is hidden
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab is visible
        document.body.classList.remove('paused');
    }
});

// Initialize language on load
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});

// Expose functions to global scope for inline event handlers
window.scrollToTop = scrollToTop;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.switchLanguage = switchLanguage;

// Add CSS for performance optimizations
const mobileOptimizationCSS = `
    @media (max-width: 768px) {
        .mobile-device * {
            -webkit-transform: translate3d(0,0,0);
            transform: translate3d(0,0,0);
        }
        
        .mobile-device .particle {
            will-change: transform;
        }
        
        .reduce-motion * {
            animation-duration: 0.3s !important;
            animation-delay: 0s !important;
            transition-duration: 0.3s !important;
        }
        
        .paused .particle {
            animation-play-state: paused;
        }
        
        .mobile-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh; /* Use dynamic viewport height on mobile */
            z-index: 999;
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 6rem 1rem 2rem;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .mobile-nav.active {
            transform: translateY(0);
        }
        
        .mobile-nav .nav-link {
            display: block;
            margin: 0.8rem 0;
            padding: 1.2rem;
            text-align: center;
            font-size: 1.1rem;
            border-radius: 8px;
            background: rgba(67, 97, 238, 0.05);
            border: 1px solid rgba(67, 97, 238, 0.1);
            color: #2b2d42;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .mobile-nav .nav-link:hover,
        .mobile-nav .nav-link:focus {
            background: rgba(67, 97, 238, 0.1);
            transform: translateY(-2px);
        }
        
        .mobile-lang-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .mobile-lang-buttons .navbar-lang-btn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            min-width: 80px;
        }
    }
`;

// Inject mobile optimization CSS
const style = document.createElement('style');
style.textContent = mobileOptimizationCSS;
document.head.appendChild(style);
