// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const sideNav = document.getElementById('sideNav');
    const body = document.body;
    
    function toggleMenu() {
        const isOpen = body.classList.contains('menu-open');
        
        // Toggle classes
        body.classList.toggle('menu-open');
        sideNav.classList.toggle('menu-open');
        menuOverlay.classList.toggle('active');
        
        // Update aria-expanded attribute
        mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
        
        // Prevent body scroll when menu is open
        if (!isOpen) {
            document.documentElement.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            body.style.overflow = '';
        }
    }
    
    function closeMenuOnly() {
        body.classList.remove('menu-open');
        sideNav.classList.remove('menu-open');
        menuOverlay.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflow = '';
        body.style.overflow = '';
    }
    
    // Event Listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMenu);
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuOnly);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenuOnly);
    }
    
    // Close menu when clicking on navigation links
    if (sideNav) {
        const navLinks = sideNav.querySelectorAll('a:not(.gh-head-logo)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1023) {
                    closeMenuOnly();
                }
            });
        });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMenuOnly();
        }
    });
    
    // Close menu on window resize to desktop
    function handleResize() {
        if (window.innerWidth > 1023 && body.classList.contains('menu-open')) {
            closeMenuOnly();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Close menu when page loads on desktop
    if (window.innerWidth > 1023) {
        closeMenuOnly();
    }
});

// ================================
// GHOST MEMBERS FORM ENHANCEMENT
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const membersForms = document.querySelectorAll('[data-members-form]');
    
    membersForms.forEach(function(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const successEl = form.querySelector('[data-members-success]');
        const errorEl = form.querySelector('[data-members-error]');
        
        // Handle form submission - add loading state
        form.addEventListener('submit', function() {
            form.classList.remove('success', 'error');
            form.classList.add('loading');
            
            if (submitButton) {
                submitButton.disabled = true;
            }
        });
        
        // Use MutationObserver to detect Ghost's state changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    // Check for success state
                    if (successEl && (successEl.style.display !== 'none' || successEl.textContent.trim())) {
                        form.classList.remove('loading', 'error');
                        form.classList.add('success');
                    }
                    
                    // Check for error state
                    if (errorEl && errorEl.textContent.trim()) {
                        form.classList.remove('loading', 'success');
                        form.classList.add('error');
                        if (submitButton) {
                            submitButton.disabled = false;
                        }
                    }
                }
            });
        });
        
        // Observe changes in success/error elements
        if (successEl) {
            observer.observe(successEl, { 
                attributes: true, 
                childList: true, 
                characterData: true,
                subtree: true 
            });
        }
        
        if (errorEl) {
            observer.observe(errorEl, { 
                attributes: true, 
                childList: true, 
                characterData: true,
                subtree: true 
            });
        }
        
        // Fallback: Remove loading state after timeout if no response
        form.addEventListener('submit', function() {
            setTimeout(function() {
                if (form.classList.contains('loading') && 
                    !form.classList.contains('success') && 
                    !form.classList.contains('error')) {
                    // Still loading after 10s - likely an error
                    form.classList.remove('loading');
                    form.classList.add('error');
                    if (errorEl) {
                        errorEl.textContent = 'Request timed out. Please try again.';
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }, 10000);
        });
    });
});