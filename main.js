/**
 * IT Feels Music - Premium Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header ---
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // --- 2. Active Navigation Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const highlightNav = () => {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- 3. Scroll Reveal Animations ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-up');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for reduced motion
        document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('active'));
    }

    // --- 4. 3D Tilt Effect for Bento Cards ---
    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Track mouse position for the CSS radial glow effect
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // Calculate tilt
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -3; // Max 3deg
                const rotateY = ((x - centerX) / centerX) * 3;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // --- 4.5. Mouse Tracking for Glow Cards (no tilt) ---
    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        const glowCards = document.querySelectorAll('.download-card');
        
        glowCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // --- 5. Magnetic CTA Buttons ---
    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }

    // --- 6. "How it works" Line Progress ---
    const stepsSection = document.getElementById('how-it-works');
    const lineProgress = document.querySelector('.line-progress');
    
    if (stepsSection && lineProgress && !prefersReducedMotion) {
        const stepsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        lineProgress.style.width = '100%';
                    }, 500); // Delay slightly after the reveal-up animation
                }
            });
        }, { threshold: 0.5 });
        
        stepsObserver.observe(stepsSection);
    } else if (lineProgress) {
        lineProgress.style.width = '100%';
    }

    // --- 7. Hero Typing Animation ---
    const typingTitle = document.getElementById('typing-title');
    if (typingTitle) {
        const textToType = "Turn Your Ideas Into Something Real.";
        let i = 0;
        
        // Wait for reveal-up animation to settle
        setTimeout(() => {
            function typeWriter() {
                if (i < textToType.length) {
                    typingTitle.textContent += textToType.charAt(i);
                    i++;
                    setTimeout(typeWriter, 60); // 60ms per character
                }
            }
            typeWriter();
        }, 800);
    }
});
