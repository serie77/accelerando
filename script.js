// ============================================
// ACCELERANDO - Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initStarField();
    initCopyButtons();
    initScrollEffects();
    initHoverEffects();
    initLightbox();
});

// ============================================
// Animated Star Field
// ============================================

function initStarField() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createStars = () => {
        stars = [];
        const starCount = Math.floor((canvas.width * canvas.height) / 8000);

        for (let i = 0; i < Math.min(starCount, 200); i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.05,
                direction: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    };

    createStars();
    window.addEventListener('resize', createStars);

    let time = 0;

    const animateStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.016;

        stars.forEach(star => {
            star.x += Math.cos(star.direction) * star.speed;
            star.y += Math.sin(star.direction) * star.speed;

            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;

            const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
            const currentOpacity = star.opacity * (0.6 + twinkle * 0.4);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            ctx.fill();

            if (star.radius > 1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${currentOpacity * 0.15})`;
                ctx.fill();
            }
        });

        requestAnimationFrame(animateStars);
    };

    animateStars();
}

// ============================================
// Copy Button Functionality
// ============================================

function initCopyButtons() {
    // Hero CA copy button
    const copyBtn = document.getElementById('copyBtn');
    const caText = document.getElementById('caText');

    if (copyBtn && caText) {
        copyBtn.addEventListener('click', async () => {
            await copyToClipboard(caText.textContent, copyBtn);
        });
    }

    // Footer CA copy button
    const footerCopyBtn = document.getElementById('footerCopyBtn');
    const footerCa = document.getElementById('footerCa');

    if (footerCopyBtn && footerCa) {
        footerCopyBtn.addEventListener('click', async () => {
            await copyToClipboard(footerCa.textContent, footerCopyBtn);
        });
    }
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        button.classList.add('copied');

        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="${button.classList.contains('footer-copy-btn') ? 14 : 18}" height="${button.classList.contains('footer-copy-btn') ? 14 : 18}" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

// ============================================
// Scroll Effects
// ============================================

function initScrollEffects() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.origins-container, .relevance-container').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ============================================
// Hover Effects
// ============================================

function initHoverEffects() {
    // Image parallax effects
    const frames = document.querySelectorAll('.book-frame, .art-frame');

    frames.forEach(frame => {
        const img = frame.querySelector('img');
        if (!img) return;

        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            img.style.transform = `scale(1.03) translate(${x * 10}px, ${y * 10}px)`;
        });

        frame.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1) translate(0, 0)';
        });
    });

    // Button ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out forwards;
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// Lightbox for Tweet Images
// ============================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const tweetFrames = document.querySelectorAll('.tweet-frame');

    if (!lightbox || !lightboxImage) return;

    // Open lightbox when clicking tweet
    tweetFrames.forEach(frame => {
        frame.addEventListener('click', () => {
            const src = frame.dataset.src;
            if (src) {
                lightboxImage.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);

    // Prevent image click from closing
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(style);
