// Global variables
let currentLang = 'en';
let isMobileMenuOpen = false;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create particles for hero section
    createParticles();
    
    // Add scroll event listeners
    handleScrollEvents();
    
    // Add click handlers for navigation
    setupNavigation();
    
    // Initialize language settings
    updateLanguageUI();
    
    // Handle smooth scrolling for all navigation links
    setupSmoothScrolling();
});

/**
 * Creates animated particles in the hero section background
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const numberOfParticles = 30;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        
        // Random size
        const size = Math.floor(Math.random() * 6) + 3;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Apply styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Sets up event listeners for scroll events
 */
function handleScrollEvents() {
    // Navbar shrinking on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active navigation section
        highlightActiveSection();
    });
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
    const scrollPosition = window.scrollY + 200; // Offset to trigger earlier
    
    // Find the current section
    let currentSection = null;
    
    sections.forEach(section => {
        const element = document.getElementById(section + suffix);
        
        if (element) {
            const sectionTop = element.offsetTop;
            const sectionHeight = element.offsetHeight;
            
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
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileNav && mobileToggle && isMobileMenuOpen && !mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Language switcher buttons
    document.querySelectorAll('.navbar-lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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
                const headerOffset = 100; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    closeMobileMenu();
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
        mobileNav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        isMobileMenuOpen = !isMobileMenuOpen;
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    }
}

/**
 * Closes the mobile menu
 */
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileNav && mobileToggle) {
        mobileNav.classList.remove('active');
        mobileToggle.classList.remove('active');
        isMobileMenuOpen = false;
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
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
}

/**
 * Switches the language of the interface
 * @param {string} lang - The language code ('en' or 'de')
 */
function switchLanguage(lang) {
    if (lang !== 'en' && lang !== 'de') return;
    
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
    
    // Re-highlight active section after language switch
    highlightActiveSection();
    
    // Log the language change (for debugging)
    console.log('Language switched to:', lang);
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

// Expose functions to global scope for inline event handlers
window.scrollToTop = scrollToTop;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.switchLanguage = switchLanguage;
