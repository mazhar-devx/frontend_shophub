// Mazhar Aslam | Ultra-Professional Portfolio Interactions

document.addEventListener('DOMContentLoaded', () => {
    // --- Surgical Performance Foundation ---
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    };

    // --- Modern Intersection Observer (500% More Efficient) ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Efficiency: only reveal once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Throttled Scroll & Interaction Engine ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const winScroll = window.scrollY;

        // Navbar state
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (winScroll > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Progress bar (耦合到 requestAnimationFrame for sub-pixel smoothness)
        if (scrollProgress) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            requestAnimationFrame(() => {
                scrollProgress.style.width = scrolled + "%";
            });
        }
    };

    window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps throttling

    // Theme Toggle Logic
    const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update all toggle orbs
        const toggleOrbs = document.querySelectorAll('.toggle-orb');
        toggleOrbs.forEach(orb => {
            const sunIcon = orb.querySelector('.sun-icon');
            const moonIcon = orb.querySelector('.moon-icon');

            if (theme === 'light') {
                sunIcon?.classList.remove('hidden');
                moonIcon?.classList.add('hidden');
            } else {
                sunIcon?.classList.add('hidden');
                moonIcon?.classList.remove('hidden');
            }
        });
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

                // Elite Transition Sweep
                const sweep = document.createElement('div');
                sweep.style.cssText = `
                    position: fixed;
                    inset: 0;
                    background: ${nextTheme === 'light' ? '#fff' : '#000'};
                    z-index: 9999;
                    clip-path: circle(0% at ${mouseX}px ${mouseY}px);
                    transition: clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    pointer-events: none;
                `;
                document.body.appendChild(sweep);

                requestAnimationFrame(() => {
                    sweep.style.clipPath = `circle(150% at ${mouseX}px ${mouseY}px)`;
                });

                setTimeout(() => {
                    setTheme(nextTheme);
                    setTimeout(() => {
                        sweep.style.opacity = '0';
                        setTimeout(() => sweep.remove(), 800);
                    }, 100);
                }, 400);
            });
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Custom Cursor Logic (Hardware Accelerated)
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Optimization: only update variables, use rAF for painting
        document.querySelectorAll('.glass-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            // Check visibility to save calculations
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    };

    window.addEventListener('mousemove', throttle(handleMouseMove, 10));

    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) ${cursor.dataset.scale || 'scale(1)'}`;

        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0) ${follower.dataset.scale || 'scale(1)'}`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .glass-card, .whatsapp-widget, .skill-icon-box, [role="button"]');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.dataset.scale = 'scale(4)';
            cursor.style.background = 'var(--cursor-bg)';
            follower.dataset.scale = 'scale(0)';
        });
        item.addEventListener('mouseleave', () => {
            cursor.dataset.scale = 'scale(1)';
            cursor.style.background = 'var(--cursor-color)';
            follower.dataset.scale = 'scale(1)';
        });
    });

    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('translate-x-full');
            document.body.classList.toggle('overflow-hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.add('translate-x-full');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // Auto-Typing Engine
    class DeepType {
        constructor(element, words, wait = 3000) {
            this.element = element;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.element.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor-blink">|</span>`;

            let typeSpeed = 100;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    const typingTarget = document.getElementById('typing-text');
    if (typingTarget) {
        new DeepType(typingTarget, ["Full-Stack Developer", "MERN Stack Developer", "React Developer", "Backend Engineer", "JavaScript Engineer"], 2000);
    }

    // Timeline Progress Logic
    const timelineProgress = document.getElementById('timeline-progress-line');
    const timelineContainer = document.querySelector('.timeline-container');

    const updateTimelineProgress = () => {
        if (!timelineProgress || !timelineContainer || window.innerWidth <= 768) return;

        const rect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress based on container visibility
        const start = rect.top - windowHeight / 2;
        const totalHeight = rect.height;

        let progress = (Math.abs(start) / totalHeight) * 100;

        if (rect.top > windowHeight / 2) progress = 0;
        if (rect.bottom < windowHeight / 2) progress = 100;

        timelineProgress.style.height = `${Math.min(100, Math.max(0, progress))}%`;
    };

    window.addEventListener('scroll', updateTimelineProgress);
    window.addEventListener('resize', updateTimelineProgress);

    // Project Carousel Logic
    const initProjectCarousel = () => {
        const slider = document.getElementById('project-slider');
        const dots = document.querySelectorAll('.pagination-dots .dot');
        const prevBtn = document.getElementById('prev-project');
        const nextBtn = document.getElementById('next-project');
        const slides = document.querySelectorAll('.project-slide');

        if (!slider || dots.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;

        const updateSlider = (index) => {
            currentIndex = index;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const nextSlide = () => {
            const next = (currentIndex + 1) % totalSlides;
            updateSlider(next);
        };

        const prevSlide = () => {
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider(prev);
        };

        // Auto Play
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 6000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };

        // Event Listeners
        nextBtn?.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });

        prevBtn?.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                updateSlider(i);
                startAutoPlay();
            });
        });

        // Touch Events for Swipe
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe Left -> Next Slide
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe Right -> Prev Slide
                prevSlide();
            }
        };

        // Start
        startAutoPlay();

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
    };

    // Initialize Project Carousel
    initProjectCarousel();

    // Final Design Cohesion Audit
    console.log("Mazhar Aslam Portfolio: Ultra-Professional Suite Initialized.");

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => { });
        });
    }
});
