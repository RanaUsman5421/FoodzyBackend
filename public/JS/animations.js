/**
 * Centralized Animations JavaScript
 * Simple, reliable animations that don't hide content
 */

(function() {
    'use strict';

    /**
     * Initialize animations when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize hover effects
        initHoverEffects();
        
        // Initialize counter animations
        initCounterAnimations();
        
        // Add subtle entrance animations with delays
        addEntranceAnimations();
    });

    /**
     * Initialize hover effects
     */
    function initHoverEffects() {
        // Add hover classes to interactive elements
        const hoverElements = document.querySelectorAll('.product-container, .dish-container, .deal-container, .single-category-container, .about-box, .rating, .blog-card, .label');
        hoverElements.forEach(function(el) {
            el.classList.add('hover-lift');
        });

        // Add glow effect to certain elements
        const glowElements = document.querySelectorAll('.about-box, .card-animate');
        glowElements.forEach(function(el) {
            el.classList.add('hover-glow');
        });

        // Icon hover animations
        const icons = document.querySelectorAll('.about-box i, .hero-icons-container i, .footer-4-icons i');
        icons.forEach(function(icon) {
            icon.classList.add('icon-animate');
        });

        // Button hover effects
        const buttons = document.querySelectorAll('button, .btn, .cart-button button');
        buttons.forEach(function(btn) {
            btn.classList.add('btn-animate');
        });
    }

    /**
     * Initialize counter animations
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) return;

        // Simple counter animation using CSS animation
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            
            animateCounter(counter, target, duration);
        });
    }

    /**
     * Animate counter from 0 to target
     */
    function animateCounter(element, target, duration) {
        let startTime = null;
        
        function updateCounter(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }
            
            const progress = currentTime - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (ease-out-quart)
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current;
            
            if (percentage < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    /**
     * Add entrance animations with staggered delays
     */
    function addEntranceAnimations() {
        const path = window.location.pathname;
        
        if (path.includes('about')) {
            staggerElements('.about-detail p', 0.1);
            staggerElements('.rating', 0.1);
            staggerElements('.about-box', 0.1);
        } else if (path.includes('shop')) {
            staggerElements('.shop-product', 0.05);
        } else if (path.includes('blog')) {
            staggerElements('.blog-card', 0.1);
        } else if (path.includes('faq')) {
            staggerElements('.faq-item', 0.1);
        }
    }

    /**
     * Add animation delay stagger to elements
     */
    function staggerElements(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(function(el, index) {
            el.style.animationDelay = (index * delay) + 's';
        });
    }

    /**
     * Public method to trigger animations on dynamically loaded content
     */
    window.Animations = {
        addHoverEffect: function(element, effectType) {
            if (element) {
                element.classList.add('hover-' + effectType);
            }
        },

        addEntranceAnimation: function(element, animationType) {
            if (element) {
                element.classList.add('animate-' + animationType);
            }
        },

        refresh: function() {
            initHoverEffects();
            initCounterAnimations();
            addEntranceAnimations();
        }
    };

})();
