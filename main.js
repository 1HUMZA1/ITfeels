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
            card.style.transformStyle = "preserve-3d";
            
            card.addEventListener('mouseenter', () => {
                // Quick transition when entering
                card.style.transition = 'transform 0.1s ease-out';
                setTimeout(() => {
                    // Disable transition for instantaneous 1:1 mouse tracking
                    card.style.transition = 'none';
                }, 100);
            });

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
                
                // Slightly more exaggerated tilt for smaller cards
                const maxTilt = rect.width < 500 ? 5 : 3;
                
                const rotateX = ((y - centerY) / centerY) * -maxTilt; 
                const rotateY = ((x - centerX) / centerX) * maxTilt;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                // Restore transition for smooth reset
                card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
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

    // ==========================================
    // INTERACTIVE DESKTOP APP LOGIC
    // ==========================================
    const appScreens = document.querySelectorAll('.app-screen');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const playTriggers = document.querySelectorAll('.play-trigger, .player-play-btn, .list-item.play-trigger');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const appWrapper = document.getElementById('desktop-app-wrapper');
    const btnShowLyrics = document.getElementById('btn-show-lyrics');
    const btnCloseLyrics = document.querySelector('.btn-close-lyrics');
    
    // Navigation Routing
    function navigateToAppScreen(targetId) {
        // Handle Lyrics Overlay vs Standard Screens
        if(targetId === 'lyrics') {
            document.getElementById('phone-screen-lyrics').classList.add('active');
            return;
        } else if (targetId === 'home' || targetId === 'search' || targetId === 'library' || targetId === 'social' || targetId === 'downloads' || targetId === 'playlists' || targetId === 'favorites') {
            // Close lyrics if open
            let lyricsScreen = document.getElementById('phone-screen-lyrics'); if(lyricsScreen) lyricsScreen.classList.remove('active');
            
            // Map sub-library items for demo
            let actualTarget = targetId;
            if(targetId === 'playlists' || targetId === 'favorites') actualTarget = 'library';
            
            appScreens.forEach(screen => {
                if(screen.id === 'screen-' + actualTarget) {
                    screen.classList.add('active');
                } else {
                    if(screen.id !== 'screen-lyrics') screen.classList.remove('active'); // Lyrics handled separately
                }
            });
            
            sidebarLinks.forEach(link => {
                if(link.getAttribute('data-target') === targetId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigateToAppScreen(link.getAttribute('data-target'));
        });
    });

    if(btnShowLyrics) {
        btnShowLyrics.addEventListener('click', () => navigateToAppScreen('lyrics'));
    }
    if(btnCloseLyrics) {
        btnCloseLyrics.addEventListener('click', () => {
            let lyricsScreen = document.getElementById('phone-screen-lyrics'); if(lyricsScreen) lyricsScreen.classList.remove('active');
        });
    }

    // Playback Simulation
    let isPlaying = false;
    let progressInterval;
    const playBtnIcon = document.querySelector('.player-play-btn i');
    const progressFill = document.querySelector('.progress-fill');
    const timeCurrent = document.querySelector('.time-current');
    
    const lyricLines = document.querySelectorAll('.lyric-line');
    let lyricIdx = 2;

    function toggleAppPlayback() {
        isPlaying = !isPlaying;
        if(isPlaying) {
            playBtnIcon.classList.remove('fa-play');
            playBtnIcon.classList.add('fa-pause');
            
            let progress = parseFloat(progressFill.style.width) || 0;
            progressInterval = setInterval(() => {
                progress += 0.5;
                if(progress > 100) progress = 0;
                progressFill.style.width = progress + '%';
                
                // Format time (simulating 4:03 track)
                let totalSecs = Math.floor((progress / 100) * 243);
                let m = Math.floor(totalSecs / 60);
                let s = totalSecs % 60;
                timeCurrent.textContent = m + ':' + (s < 10 ? '0' : '') + s;
                
                // Lyrics
                if(Math.random() > 0.95 && lyricIdx < lyricLines.length - 1) {
                    lyricLines[lyricIdx].classList.remove('active');
                    lyricLines[lyricIdx].classList.add('past');
                    lyricIdx++;
                    lyricLines[lyricIdx].classList.add('active');
                    lyricLines[lyricIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        } else {
            playBtnIcon.classList.remove('fa-pause');
            playBtnIcon.classList.add('fa-play');
            clearInterval(progressInterval);
        }
    }

    playTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if(!trigger.classList.contains('player-play-btn')) {
                // If clicked a card
                if(!isPlaying) toggleAppPlayback();
            } else {
                toggleAppPlayback();
            }
        });
    });

    // Social Join
    const joinBtns = document.querySelectorAll('.btn-join-room');
    joinBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.textContent === 'Join') {
                btn.textContent = 'Leave';
                btn.style.background = '#fff';
                btn.style.color = '#000';
            } else {
                btn.textContent = 'Join';
                btn.style.background = 'transparent';
                btn.style.color = '#fff';
            }
        });
    });

    // Fullscreen Toggle
    if(btnFullscreen && appWrapper) {
        btnFullscreen.addEventListener('click', () => {
            appWrapper.classList.toggle('fullscreen-mode');
            if(appWrapper.classList.contains('fullscreen-mode')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }


    // ==========================================
    // INTERACTIVE PHONE SHOWCASE LOGIC
    // ==========================================
    const phoneScreens = document.querySelectorAll('.phone-mockup .app-screen');
    const phoneBottomNavItems = document.querySelectorAll('.phone-mockup .bottom-nav-item');
    const phoneFeatureNavCards = document.querySelectorAll('.feature-nav-card');
    const phoneNavBackBtns = document.querySelectorAll('.phone-mockup .nav-back');
    const phonePlayTriggers = document.querySelectorAll('.phone-mockup .play-trigger, .phone-mockup .app-btn-play');
    
    // Navigation Function
    function navigateToPhoneScreen(targetId) {
        // Update Screens
        phoneScreens.forEach(screen => {
            if(screen.id === 'phone-screen-' + targetId) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
        
        // Update Bottom Nav
        phoneBottomNavItems.forEach(item => {
            if(item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update External Feature Cards (only for major views)
        phoneFeatureNavCards.forEach(card => {
            if(card.getAttribute('data-target') === targetId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // Attach listeners to bottom nav
    phoneBottomNavItems.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateToPhoneScreen(btn.getAttribute('data-target'));
        });
    });

    // Attach listeners to external feature cards
    phoneFeatureNavCards.forEach(card => {
        card.addEventListener('click', () => {
            navigateToPhoneScreen(card.getAttribute('data-target'));
        });
    });

    // Attach listeners to back buttons (like chevron down from player/lyrics)
    phoneNavBackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateToPhoneScreen(btn.getAttribute('data-target'));
        });
    });

    // Simulated Playback Logic
    let isPhonePlaying = false;
    let phoneProgressInterval;
    const phonePlayBtnIcon = document.querySelector('.phone-mockup .app-btn-play i');
    const phoneProgressBarFill = document.querySelector('.phone-mockup .progress-bar-fill');
    const phonePulseArt = document.querySelector('.phone-mockup .player-art');
    
    // Lyrics Simulation
    const phoneLyricLines = document.querySelectorAll('.phone-mockup .lyric-line');
    let phoneCurrentLyricIndex = 2; // Starts at 3rd line active

    function togglePhonePlayback() {
        isPhonePlaying = !isPhonePlaying;
        
        if (isPhonePlaying) {
            if(phonePlayBtnIcon) {
                phonePlayBtnIcon.classList.remove('fa-play');
                phonePlayBtnIcon.classList.add('fa-pause');
            }
            if(phonePulseArt) phonePulseArt.classList.add('pulse-anim');
            
            // Simulate progress bar moving
            let progress = parseInt(phoneProgressBarFill?.style.width || 0) || 30;
            phoneProgressInterval = setInterval(() => {
                progress += 0.5;
                if(progress > 100) progress = 0;
                if(phoneProgressBarFill) phoneProgressBarFill.style.width = progress + '%';
                
                // Simulate lyrics advancing every few seconds randomly
                if(Math.random() > 0.95 && phoneCurrentLyricIndex < phoneLyricLines.length - 1) {
                    phoneLyricLines[phoneCurrentLyricIndex].classList.remove('active');
                    phoneLyricLines[phoneCurrentLyricIndex].classList.add('past');
                    phoneCurrentLyricIndex++;
                    phoneLyricLines[phoneCurrentLyricIndex].classList.add('active');
                    // Scroll into view
                    phoneLyricLines[phoneCurrentLyricIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            
        } else {
            if(phonePlayBtnIcon) {
                phonePlayBtnIcon.classList.remove('fa-pause');
                phonePlayBtnIcon.classList.add('fa-play');
            }
            if(phonePulseArt) phonePulseArt.classList.remove('pulse-anim');
            clearInterval(phoneProgressInterval);
        }
    }

    // Attach play toggle to list items and main play button
    phonePlayTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            if(!btn.classList.contains('app-btn-play')) {
                // If it was a list item, auto-navigate to player and start playing
                navigateToPhoneScreen('player');
                if(!isPhonePlaying) togglePhonePlayback();
            } else {
                // Main play button toggle
                togglePhonePlayback();
            }
        });
    });

    // Social Rooms Join Toggle
    const phoneJoinRoomBtns = document.querySelectorAll('.phone-mockup .join-room-btn');
    phoneJoinRoomBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(btn.textContent === 'Join') {
                btn.textContent = 'Leave';
                btn.style.background = 'var(--text-primary)';
                btn.style.color = '#000';
            } else {
                btn.textContent = 'Join';
                btn.style.background = 'rgba(255,255,255,0.1)';
                btn.style.color = 'var(--text-primary)';
            }
        });
    });

    // Offline Download Demo
    const phoneDownloadTrigger = document.querySelector('.phone-mockup .download-trigger');
    const phoneDownloadedList = document.querySelector('.phone-mockup .downloaded-list');
    
    if(phoneDownloadTrigger && phoneDownloadedList) {
        phoneDownloadTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = phoneDownloadTrigger.querySelector('i');
            
            // Simulate download process
            icon.className = 'fa-solid fa-spinner fa-spin';
            
            setTimeout(() => {
                icon.className = 'fa-solid fa-circle-check text-accent';
                phoneDownloadTrigger.style.pointerEvents = 'none';
                
                // Add to downloaded list visually
                const newItem = document.createElement('div');
                newItem.className = 'app-list-item reveal';
                newItem.innerHTML = `
                    <div class="app-list-art">DV</div>
                    <div class="app-list-details">
                        <div class="app-list-title">Discovery</div>
                        <div class="app-list-subtitle">Album • Daft Punk</div>
                    </div>
                    <i class="fa-solid fa-circle-check text-accent" style="font-size: 0.8rem;"></i>
                `;
                phoneDownloadedList.insertBefore(newItem, phoneDownloadedList.firstChild);
            }, 1500);
        });
    }


    // ==========================================
    // PLATFORM TOGGLE LOGIC
    // ==========================================
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const desktopView = document.getElementById('desktop-app-wrapper');
    const phoneView = document.querySelector('.interactive-showcase-wrapper');
    
    // Hide phone by default
    if(phoneView) phoneView.classList.add('platform-hidden');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if(btn.getAttribute('data-platform') === 'desktop') {
                phoneView.classList.add('platform-hidden');
                setTimeout(() => desktopView.classList.remove('platform-hidden'), 100);
            } else {
                desktopView.classList.add('platform-hidden');
                setTimeout(() => phoneView.classList.remove('platform-hidden'), 100);
            }
        });
    });

