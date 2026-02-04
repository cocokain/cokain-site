// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Smooth scroll for nav links (internal only) and close mobile menu for any link
const navLinks = document.querySelector('.nav-links');
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        }
        if (navLinks) {
            navLinks.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
        // Toggle visual state and ARIA
        menuToggle.classList.toggle('active');
        const expanded = menuToggle.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded);
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .feature-card').forEach(el => {
    observer.observe(el);
});

// Copy Discord ID to clipboard and show toast
const discordLink = document.getElementById('discord-link');
const toast = document.getElementById('toast');

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timeout);
    showToast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

if (discordLink) {
    discordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const id = discordLink.getAttribute('data-discord') || '';
        if (!id) {
            showToast('コピーするIDがありません');
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(id).then(() => {
                showToast('コピーしました: ' + id);
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = id;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showToast('コピーしました: ' + id);
                } catch (err) {
                    showToast('コピーに失敗しました');
                }
                document.body.removeChild(textarea);
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = id;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('コピーしました: ' + id);
            } catch (err) {
                showToast('コピーに失敗しました');
            }
            document.body.removeChild(textarea);
        }

        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}
