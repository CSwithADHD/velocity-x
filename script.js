// Optimized JavaScript for VelocityX Website
(function() {
    'use strict';
    
    // Cache DOM elements
    const video = document.querySelector('video');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const trainTexts = document.querySelectorAll('.train-text');
    
    // Video error handling
    if (video) {
        video.addEventListener('error', () => {
            console.log('Video failed to load');
            const heroVideo = document.querySelector('.hero-video');
            if (heroVideo) heroVideo.style.display = 'none';
        });
        
        // Optimize video playback for mobile
        if (window.innerWidth <= 768) {
            video.addEventListener('loadedmetadata', () => {
                video.playbackRate = 1;
            });
        }
        
        // Intersection Observer for video performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video play failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });
        
        videoObserver.observe(video);
    }
    
    // Throttle function for scroll events
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function(...args) {
            const currentTime = Date.now();
            const timeSinceLastExec = currentTime - lastExecTime;
            
            clearTimeout(timeoutId);
            
            if (timeSinceLastExec > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - timeSinceLastExec);
            }
        };
    }
    
    // Navbar scroll effect with throttling
    const handleScroll = throttle(() => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Parallax effect for train text (only on desktop)
        if (trainTexts.length > 0 && window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            trainTexts.forEach((text, index) => {
                const speed = 0.1 + index * 0.05;
                text.style.transform = `translateX(${-100 + (scrolled * speed)}%)`;
            });
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Lazy load images for performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Performance optimization: Reduce animations on low-end devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.style.setProperty('--animation-duration', '0.01ms');
    }
    
})();
