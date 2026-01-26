/**
 * Testimonial Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run on about page or if .review-container exists
    const container = document.querySelector('.review-container');
    if (!container) return;

    // Wrap reviews in a slider logic if not already suitable
    // The current HTML has .review-card inside .review-container
    // We will apply classes to show/hide them

    initCarousel(container);
});

function initCarousel(container) {
    const cards = container.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    // Create controls
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
        <button id="prevBtn">&lt;</button>
        <button id="nextBtn">&gt;</button>
    `;
    container.appendChild(controls);

    let currentIndex = 0;
    let interval;

    // Style container for relative positioning if needed, 
    // but we'll manage visibility via classes for simplicity

    function showSlide(index) {
        cards.forEach((card, i) => {
            card.style.display = (i === index) ? 'block' : 'none';
            // Optional: Add animation class
            if (i === index) card.classList.add('fade-in');
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(currentIndex);
    }

    // Init
    showSlide(currentIndex);
    startAutoSlide();

    // Event Listeners
    document.getElementById('nextBtn').addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    function startAutoSlide() {
        interval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }
}
