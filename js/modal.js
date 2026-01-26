/**
 * Booking Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    injectModalHTML();
    initModalEvents();
});

function injectModalHTML() {
    const modalHTML = `
    <div id="bookingModal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Book Your Service</h2>
            <form id="bookingForm">
                <div class="form-group">
                    <label for="serviceName">Service</label>
                    <input type="text" id="serviceName" name="service" readonly>
                </div>
                <div class="form-group">
                    <label for="bookingDate">Date</label>
                    <input type="date" id="bookingDate" name="date" required>
                </div>
                <div class="form-group">
                    <label for="bookingTime">Time</label>
                    <input type="time" id="bookingTime" name="time" required>
                </div>
                <div class="form-group">
                    <label for="clientName">Your Name</label>
                    <input type="text" id="clientName" name="name" required>
                </div>
                 <div class="form-group">
                    <label for="clientPhone">Phone Number</label>
                    <input type="tel" id="clientPhone" name="phone" required>
                </div>
                <button type="submit" class="btn btn-primary">Confirm Booking</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function initModalEvents() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('bookingForm');
    const serviceInput = document.getElementById('serviceName');

    // Open modal on "Book Now" clicks
    // Using delegation for dynamic elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn-book') || (e.target.tagName === 'BUTTON' && e.target.textContent.trim() === 'Book Now')) {
            e.preventDefault();
            const card = e.target.closest('.service-card') || e.target.closest('.service-box');
            let serviceName = "General Consultation";
            // Get service title
            if (card) {
                const titleEl = card.querySelector('h3');
                if (titleEl) serviceName = titleEl.textContent;
            }

            serviceInput.value = serviceName;
            modal.style.display = 'block';
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Booking request for ${serviceInput.value} sent! We will contact you shortly.`);
        modal.style.display = 'none';
        form.reset();
    });
}
