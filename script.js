// TipplersCocktailMap JavaScript - Interactive Functionality
// Vogue Editorial × Godfather Elegance

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeCards();
    initializeSmoothScrolling();
    initializeMapInteraction();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-open');
            navToggle.classList.toggle('nav-toggle-active');
        });
    }

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('nav-menu-open');
            navToggle.classList.remove('nav-toggle-active');
        });
    });

    // Add scroll effect to navigation
    let lastScrollTop = 0;
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput && searchButton) {
        // Handle search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterBarsBySearch(searchTerm);
        });

        // Handle search button click
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filterBarsBySearch(searchTerm);
        });

        // Handle Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                filterBarsBySearch(searchTerm);
            }
        });
    }
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const barsGrid = document.getElementById('barsGrid');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Filter bars
            filterBars(filterValue);
        });
    });
}

// Filter bars by category
function filterBars(category) {
    const barCards = document.querySelectorAll('.bar-card');

    barCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            // Add animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Update results count
    setTimeout(() => {
        updateResultsCount();
    }, 350);
}

// Filter bars by search term
function filterBarsBySearch(searchTerm) {
    const barCards = document.querySelectorAll('.bar-card');

    barCards.forEach(card => {
        const barName = card.querySelector('.bar-name').textContent.toLowerCase();
        const barDescription = card.querySelector('.bar-description').textContent.toLowerCase();
        const barType = card.querySelector('.bar-type').textContent.toLowerCase();
        const barLocation = card.querySelector('.bar-location').textContent.toLowerCase();

        const matchesSearch = searchTerm === '' ||
                            barName.includes(searchTerm) ||
                            barDescription.includes(searchTerm) ||
                            barType.includes(searchTerm) ||
                            barLocation.includes(searchTerm);

        if (matchesSearch) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Update results count
    setTimeout(() => {
        updateResultsCount();
    }, 350);
}

// Update results count
function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.bar-card[style*="display: block"], .bar-card:not([style*="display: none"])');
    const sectionSubtitle = document.querySelector('.recommendations .section-subtitle');

    if (sectionSubtitle) {
        const count = visibleCards.length;
        if (count === 0) {
            sectionSubtitle.textContent = 'No establishments match your criteria. Try adjusting your search or filters.';
        } else if (count === 1) {
            sectionSubtitle.textContent = 'Showing 1 exceptional establishment';
        } else {
            sectionSubtitle.textContent = `Showing ${count} exceptional establishments`;
        }
    }
}

// Card interactions
function initializeCards() {
    const barCards = document.querySelectorAll('.bar-card');

    barCards.forEach(card => {
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Handle card click
        card.addEventListener('click', function() {
            const barName = this.querySelector('.bar-name').textContent;
            showBarDetails(barName, this);
        });

        // Handle CTA button click
        const ctaButton = card.querySelector('.bar-cta');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click event
                const barName = card.querySelector('.bar-name').textContent;
                showBarDetails(barName, card);
            });
        }
    });
}

// Show bar details (placeholder for modal or page navigation)
function showBarDetails(barName, cardElement) {
    // Add a subtle animation to indicate interaction
    cardElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
        cardElement.style.transform = '';
    }, 150);

    // Create a simple modal or redirect to details page
    // For now, we'll show an alert (replace with actual modal/navigation)
    const modal = createBarModal(barName, cardElement);
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);
}

// Create a simple modal for bar details
function createBarModal(barName, cardElement) {
    const modal = document.createElement('div');
    modal.className = 'bar-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${barName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Detailed information about ${barName} would be displayed here.</p>
                <p>Features include:</p>
                <ul>
                    <li>Location and contact details</li>
                    <li>Opening hours and availability</li>
                    <li>Menu highlights and signature cocktails</li>
                    <li>Photos and atmosphere details</li>
                    <li>Reviews and ratings</li>
                    <li>Reservation options</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button class="modal-btn-secondary">View Menu</button>
                <button class="modal-btn-primary">Make Reservation</button>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        .bar-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease-out;
        }

        .bar-modal.modal-active {
            opacity: 1;
            visibility: visible;
        }

        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--pure-white);
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transition: transform 0.3s ease-out;
        }

        .modal-active .modal-content {
            transform: translate(-50%, -50%) scale(1);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-xl);
            border-bottom: 1px solid var(--light-gray);
        }

        .modal-header h2 {
            margin: 0;
            font-family: var(--font-editorial);
            color: var(--deep-black);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--charcoal);
            transition: color 0.2s ease;
        }

        .modal-close:hover {
            color: var(--deep-black);
        }

        .modal-body {
            padding: var(--space-xl);
            color: var(--charcoal);
            line-height: 1.6;
        }

        .modal-footer {
            padding: var(--space-xl);
            border-top: 1px solid var(--light-gray);
            display: flex;
            gap: var(--space-md);
            justify-content: flex-end;
        }

        .modal-btn-primary,
        .modal-btn-secondary {
            padding: var(--space-sm) var(--space-lg);
            border-radius: 4px;
            font-family: var(--font-modern);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .modal-btn-primary {
            background: var(--gold);
            color: var(--deep-black);
        }

        .modal-btn-primary:hover {
            background: #B8941F;
        }

        .modal-btn-secondary {
            background: transparent;
            color: var(--deep-black);
            border: 1px solid var(--deep-black);
        }

        .modal-btn-secondary:hover {
            background: var(--deep-black);
            color: var(--pure-white);
        }
    `;

    // Add styles to document if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    closeBtn.addEventListener('click', () => closeModal(modal));
    backdrop.addEventListener('click', () => closeModal(modal));

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });

    return modal;
}

// Close modal
function closeModal(modal) {
    modal.classList.remove('modal-active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.bar-card, .section-header, .hero-text');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Map interaction
function initializeMapInteraction() {
    const mapCta = document.querySelector('.map-cta');

    if (mapCta) {
        mapCta.addEventListener('click', function() {
            // Request geolocation
            if ('geolocation' in navigator) {
                this.textContent = 'Getting Location...';
                this.disabled = true;

                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // Success - would integrate with actual map service
                        mapCta.textContent = 'Location Enabled';
                        mapCta.style.background = 'var(--success-green)';

                        // Simulate map loading
                        setTimeout(() => {
                            showMapWithLocation(position);
                        }, 1000);
                    },
                    function(error) {
                        // Error handling
                        mapCta.textContent = 'Location Access Denied';
                        mapCta.style.background = 'var(--warning-amber)';
                        mapCta.disabled = false;

                        setTimeout(() => {
                            mapCta.textContent = 'Enable Location';
                            mapCta.style.background = 'var(--gold)';
                        }, 3000);
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        });
    }
}

// Show map with user location (placeholder)
function showMapWithLocation(position) {
    const mapPlaceholder = document.querySelector('.map-placeholder');

    if (mapPlaceholder) {
        mapPlaceholder.innerHTML = `
            <div class="map-overlay">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3>Map Loading...</h3>
                <p>Latitude: ${position.coords.latitude.toFixed(4)}</p>
                <p>Longitude: ${position.coords.longitude.toFixed(4)}</p>
                <p>Finding cocktail bars near you...</p>
            </div>
        `;

        // Here you would integrate with Google Maps, Mapbox, or another mapping service
        // For demonstration, we'll show a success message
        setTimeout(() => {
            mapPlaceholder.innerHTML = `
                <div class="map-overlay">
                    <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3>Interactive Map Ready</h3>
                    <p>Found 12 cocktail bars within 2 miles of your location.</p>
                    <p style="font-size: 0.875rem; margin-top: var(--space-md);">
                        In a real implementation, this would show an interactive map with bar locations,
                        ratings, and real-time availability.
                    </p>
                </div>
            `;
        }, 2000);
    }
}

// Hero CTA interaction
document.addEventListener('DOMContentLoaded', function() {
    const heroCtaButton = document.querySelector('.cta-button');

    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', function() {
            // Smooth scroll to recommendations section
            const recommendationsSection = document.getElementById('discover');
            if (recommendationsSection) {
                const offsetTop = recommendationsSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Add some CSS for animations
const animationStyles = `
    .bar-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .bar-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .section-header {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease-out;
    }

    .section-header.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .hero-text {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 1s ease-out;
    }

    .hero-text.animate-in {
        opacity: 1;
        transform: translateX(0);
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: var(--space-xl);
            transition: left 0.3s ease-out;
        }

        .nav-menu.nav-menu-open {
            left: 0;
        }

        .nav-toggle.nav-toggle-active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .nav-toggle.nav-toggle-active span:nth-child(2) {
            opacity: 0;
        }

        .nav-toggle.nav-toggle-active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add animation styles to document
if (!document.querySelector('#animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}