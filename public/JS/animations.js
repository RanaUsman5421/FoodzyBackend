/**
 * Centralized Animations JavaScript
 * Handles all animation triggers across all pages
 */

(function() {
    'use strict';

    // Animation Configuration
    const animationConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    /**
     * Initialize animations when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initHoverAnimations();
        initButtonAnimations();
        initFormAnimations();
        initCounterAnimations();
        initPageSpecificAnimations();
    });

    /**
     * Initialize scroll-based animations using Intersection Observer
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // For staggered animations, add delay to children
                    const staggerDelay = entry.target.dataset.staggerDelay;
                    if (staggerDelay) {
                        animateStaggeredChildren(entry.target, parseInt(staggerDelay));
                    }
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, animationConfig);

        // Observe all elements with scroll-animate class
        const animatedElements = document.querySelectorAll('.scroll-animate, .card-animate, .shop-product, .faq-item, .blog-card, .checkout-section, .about-section, .product-detail-section');
        
        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    /**
     * Animate children with staggered delay
     */
    function animateStaggeredChildren(parent, baseDelay) {
        const children = parent.querySelectorAll(':scope > *');
        children.forEach(function(child, index) {
            child.style.transitionDelay = (index * baseDelay / 1000) + 's';
            child.classList.add('animate-in');
        });
    }

    /**
     * Initialize hover animations
     */
    function initHoverAnimations() {
        // Add hover classes to interactive elements
        const scaleElements = document.querySelectorAll('.product-container, .dish-container, .deal-container, .single-category-container');
        scaleElements.forEach(function(el) {
            el.classList.add('hover-lift');
        });

        // Icon hover animations
        const icons = document.querySelectorAll('.hero-icons-container i, .footer-4-icons i, .icon-div');
        icons.forEach(function(icon) {
            icon.classList.add('icon-animate');
        });
    }

    /**
     * Initialize button animations
     */
    function initButtonAnimations() {
        const buttons = document.querySelectorAll('button, .btn, .cart-button button, .deals-cart-button, .hero-button-container button');
        
        buttons.forEach(function(btn) {
            if (!btn.classList.contains('btn-animate')) {
                btn.classList.add('btn-animate');
            }
        });
    }

    /**
     * Initialize form animations
     */
    function initFormAnimations() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(function(input) {
            input.classList.add('input-animate');
        });

        // Animate form groups with delay
        const formGroups = document.querySelectorAll('.form-input, .return-input, .single-input');
        formGroups.forEach(function(group, index) {
            group.classList.add('form-group-animate');
            group.style.transitionDelay = (index * 0.1) + 's';
        });
    }

    /**
     * Initialize counter animations
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                    
                    animateCounter(counter, target, duration);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    /**
     * Animate counter from 0 to target
     */
    function animateCounter(element, target, duration) {
        let start = 0;
        const startTime = null;
        
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
                element.classList.add('counter-animated');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    /**
     * Initialize page-specific animations
     */
    function initPageSpecificAnimations() {
        const path = window.location.pathname;
        
        if (path.includes('shop')) {
            initShopPageAnimations();
        } else if (path.includes('product')) {
            initProductPageAnimations();
        } else if (path.includes('checkout')) {
            initCheckoutPageAnimations();
        } else if (path.includes('login') || path.includes('signup')) {
            initAuthPageAnimations();
        } else if (path.includes('order-success')) {
            initOrderSuccessAnimations();
        } else if (path.includes('faq')) {
            initFaqPageAnimations();
        } else if (path.includes('about')) {
            initAboutPageAnimations();
        } else if (path.includes('blog')) {
            initBlogPageAnimations();
        } else if (path.includes('index') || path === '/' || path === '') {
            initHomePageAnimations();
        }
    }

    /**
     * Home Page Animations
     */
    function initHomePageAnimations() {
        // Add animation classes to sections
        const sections = document.querySelectorAll('.categories, .bestSales, .special-dishes, .deals, .choose-us, .news-letter, .labels');
        
        sections.forEach(function(section, index) {
            section.classList.add('scroll-animate');
            section.style.transitionDelay = (index * 0.1) + 's';
        });

        // Animate labels with staggered delay
        const labels = document.querySelectorAll('.label');
        labels.forEach(function(label, index) {
            label.classList.add('card-animate');
            label.style.transitionDelay = (index * 0.1) + 's';
        });
    }

    /**
     * Shop Page Animations
     */
    function initShopPageAnimations() {
        // Filter bar animation
        const filterBar = document.querySelector('.filter-bar');
        if (filterBar) {
            filterBar.classList.add('animate-fade-in-down');
            setTimeout(function() {
                filterBar.classList.add('animate-active');
            }, 100);
        }

        // Products container animation
        const productsContainer = document.querySelector('.products-container');
        if (productsContainer) {
            productsContainer.classList.add('scroll-animate');
        }

        // Pagination animation
        const pagination = document.querySelector('.pages');
        if (pagination) {
            pagination.classList.add('animate-fade-in-up');
            setTimeout(function() {
                pagination.classList.add('animate-active');
            }, 300);
        }
    }

    /**
     * Product Page Animations
     */
    function initProductPageAnimations() {
        // Red line animation
        const redLine = document.querySelector('.red-line');
        if (redLine) {
            redLine.classList.add('red-line-animate');
        }

        // Product image section
        const imgSection = document.querySelector('.product-img-section');
        if (imgSection) {
            imgSection.classList.add('animate-fade-in-left');
            setTimeout(function() {
                imgSection.classList.add('animate-active');
            }, 100);
        }

        // Product details
        const details = document.querySelector('.product-details');
        if (details) {
            details.classList.add('product-detail-section');
            setTimeout(function() {
                details.classList.add('animate-in');
            }, 200);
        }

        // Tabs animation
        const tabs = document.querySelector('.text-box');
        if (tabs) {
            tabs.classList.add('scroll-animate');
        }
    }

    /**
     * Checkout Page Animations
     */
    function initCheckoutPageAnimations() {
        const sections = document.querySelectorAll('.checkout-left, .checkout-right');
        
        sections.forEach(function(section, index) {
            section.classList.add('checkout-section');
            section.style.transitionDelay = (index * 0.2) + 's';
        });

        // Animate individual form elements
        const products = document.querySelectorAll('.products .product');
        products.forEach(function(product, index) {
            product.classList.add('scroll-animate');
            product.style.transitionDelay = (index * 0.1) + 's';
        });
    }

    /**
     * Auth Page Animations (Login/Signup)
     */
    function initAuthPageAnimations() {
        const container = document.querySelector('.login-container, .signup-container, .login-page, .signup-page, form');
        
        if (container) {
            container.classList.add('login-container');
            setTimeout(function() {
                container.classList.add('animate-in');
            }, 100);
        }

        // Animate input fields
        const inputs = document.querySelectorAll('input');
        inputs.forEach(function(input, index) {
            input.classList.add('form-group-animate');
            input.style.transitionDelay = (index * 0.1) + 's';
            
            // Add animate-active after a small delay
            setTimeout(function() {
                input.classList.add('animate-active');
            }, 200 + (index * 100));
        });

        // Submit button animation
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('btn-animate');
        }
    }

    /**
     * Order Success Page Animations
     */
    function initOrderSuccessAnimations() {
        const container = document.querySelector('.success-container, .success-content');
        
        if (container) {
            container.classList.add('success-content');
            setTimeout(function() {
                container.classList.add('animate-in');
            }, 100);
        }

        // Icon bounce animation
        const icon = document.querySelector('.success-icon');
        if (icon) {
            icon.style.animation = 'bounceIn 0.6s ease-out';
        }

        // Order details animation
        const orderDetails = document.querySelector('.order-details');
        if (orderDetails) {
            orderDetails.classList.add('animate-fade-in-up');
            setTimeout(function() {
                orderDetails.classList.add('animate-active');
            }, 400);
        }

        // Button animation
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(function(btn, index) {
            btn.classList.add('btn-animate');
            btn.style.transitionDelay = (index * 0.15) + 's';
        });
    }

    /**
     * FAQ Page Animations
     */
    function initFaqPageAnimations() {
        // FAQ image animation
        const faqImg = document.querySelector('.faq-img');
        if (faqImg) {
            faqImg.classList.add('animate-fade-in-left');
            setTimeout(function() {
                faqImg.classList.add('animate-active');
            }, 100);
        }

        // FAQ questions animation
        const faqQuestions = document.querySelector('.faq-questions');
        if (faqQuestions) {
            faqQuestions.classList.add('animate-fade-in-right');
            setTimeout(function() {
                faqQuestions.classList.add('animate-active');
            }, 300);
        }
    }

    /**
     * About Page Animations
     */
    function initAboutPageAnimations() {
        const sections = document.querySelectorAll('.about-section, .about-content, .about-image');
        
        sections.forEach(function(section, index) {
            section.classList.add('about-section');
            section.style.transitionDelay = (index * 0.2) + 's';
        });
    }

    /**
     * Blog Page Animations
     */
    function initBlogPageAnimations() {
        const cards = document.querySelectorAll('.blog-card, .blog-item');
        
        cards.forEach(function(card, index) {
            card.classList.add('blog-card');
            card.style.transitionDelay = (index * 0.1) + 's';
        });
    }

    /**
     * Public method to trigger animations on dynamically loaded content
     */
    window.Animations = {
        /**
         * Animate a single element
         */
        animateElement: function(element, animationClass) {
            if (element) {
                element.classList.add(animationClass);
                setTimeout(function() {
                    element.classList.add('animate-active');
                }, 100);
            }
        },

        /**
         * Animate an array of elements with stagger
         */
        animateStagger: function(elements, animationClass, staggerDelay) {
            if (elements && elements.length) {
                Array.from(elements).forEach(function(el, index) {
                    el.classList.add(animationClass);
                    el.style.transitionDelay = (index * staggerDelay / 1000) + 's';
                    
                    setTimeout(function() {
                        el.classList.add('animate-active');
                    }, 100);
                });
            }
        },

        /**
         * Refresh animations (for dynamically loaded content)
         */
        refresh: function() {
            initScrollAnimations();
            initHoverAnimations();
            initButtonAnimations();
            initFormAnimations();
            initCounterAnimations();
        },

        /**
         * Show success message with animation
         */
        showSuccess: function(element) {
            if (element) {
                element.classList.add('success-popup');
            }
        },

        /**
         * Show error with shake animation
         */
        showError: function(element) {
            if (element) {
                element.classList.add('error-shake');
                setTimeout(function() {
                    element.classList.remove('error-shake');
                }, 500);
            }
        }
    };

})();
