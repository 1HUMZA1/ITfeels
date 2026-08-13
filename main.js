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
        const tiltCards = document.querySelectorAll('.tilt-card, .download-card, .testimonial-card');
        
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

    // --- Generic Typewriter Effect for Elements ---
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    if (typewriterElements.length > 0) {
        const typeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.dataset.typed === "true") return;
                    el.dataset.typed = "true";
                    
                    const text = el.getAttribute('data-text');
                    const speed = el.getAttribute('data-speed') ? parseFloat(el.getAttribute('data-speed')) : 13; // 13ms = ~4.5x normal 60ms speed
                    
                    el.textContent = '';
                    let i = 0;
                    function typeWriter() {
                        if (i < text.length) {
                            el.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeWriter, speed);
                        }
                    }
                    setTimeout(typeWriter, 300); // small delay after revealing
                    observer.unobserve(el);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        typewriterElements.forEach(el => {
            if (!el.hasAttribute('data-text')) {
                el.setAttribute('data-text', el.textContent.trim());
            }
            // Preserve height to avoid layout shift when cleared
            const rect = el.getBoundingClientRect();
            if (rect.height > 0) el.style.minHeight = rect.height + 'px';
            el.textContent = ''; // clear initial text
            typeObserver.observe(el);
        });
    }

    // --- 7. Hero Typing Animation ---
    const typingTitle = document.getElementById('typing-title');
    if (typingTitle) {
        const textToType = "FEEL THE MUSIC.";
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

    // --- 8. Hero Parallax Zoom ---
    const heroMockupInner = document.getElementById('hero-mockup-inner');
    if (heroMockupInner) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Scale increases as you scroll down, maxes out at 1.15
            const scale = 1 + Math.min(scrollY * 0.0005, 0.15);
            heroMockupInner.style.transform = `scale(${scale})`;
        });
    }

    // --- 9. Feature Section Interactions ---
    
    // Lossless Format Toggle
    const formatBtn = document.getElementById('formatToggleBtn');
    if (formatBtn) {
        const formats = ['320 kbps • Lossless', 'FLAC • 1411 kbps', 'Hi-Res • 24-bit/96kHz'];
        let currentFormat = 0;
        formatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentFormat = (currentFormat + 1) % formats.length;
            formatBtn.textContent = formats[currentFormat];
        });
    }

    // Lyrics Highlight Toggle
    const lyricsBtn = document.getElementById('lyricsToggleBtn');
    const lyricsMockup = document.getElementById('lyricsMockup');
    if (lyricsBtn && lyricsMockup) {
        let lyricsOn = true;
        lyricsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            lyricsOn = !lyricsOn;
            if (lyricsOn) {
                lyricsBtn.textContent = 'Lyrics ON';
                lyricsMockup.style.opacity = '1';
                lyricsMockup.style.filter = 'blur(0)';
            } else {
                lyricsBtn.textContent = 'Lyrics OFF';
                lyricsMockup.style.opacity = '0.3';
                lyricsMockup.style.filter = 'blur(5px)';
            }
        });
    }

    // Social Room Join
    const joinBtn = document.getElementById('joinRoomBtn');
    const avatarsContainer = document.getElementById('avatarsMock');
    if (joinBtn && avatarsContainer) {
        joinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (joinBtn.textContent === 'JOIN ROOM') {
                const newAvatar = document.createElement('div');
                newAvatar.className = 'avatar new-join';
                newAvatar.innerHTML = '<i class="fa-solid fa-user-astronaut"></i>';
                avatarsContainer.appendChild(newAvatar);
                joinBtn.textContent = 'LEAVE ROOM';
                joinBtn.style.background = 'var(--accent-color, #fff)';
                joinBtn.style.color = '#000';
            } else {
                const lastAvatar = avatarsContainer.lastElementChild;
                if (lastAvatar.classList.contains('new-join')) {
                    lastAvatar.remove();
                }
                joinBtn.textContent = 'JOIN ROOM';
                joinBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                joinBtn.style.color = 'var(--text-primary)';
            }
        });
    }

    // Offline Download Mock
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadFill = document.getElementById('downloadFill');
    const downloadStatus = document.getElementById('downloadStatus');
    if (downloadBtn && downloadFill && downloadStatus) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (downloadBtn.textContent === 'Download') {
                downloadBtn.textContent = 'Downloading...';
                downloadFill.style.width = '100%';
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    if (progress <= 100) {
                        downloadStatus.textContent = progress + '%';
                    } else {
                        clearInterval(interval);
                        downloadStatus.innerHTML = '<i class="fa-solid fa-check"></i> Available Offline';
                        downloadStatus.style.color = '#4ade80';
                        downloadBtn.textContent = 'Remove Download';
                    }
                }, 200); // Takes 2 seconds (width transition is 2s)
            } else {
                downloadFill.style.width = '0%';
                downloadStatus.textContent = '0%';
                downloadStatus.style.color = 'var(--text-secondary)';
                downloadBtn.textContent = 'Download';
            }
        });
    }

});
