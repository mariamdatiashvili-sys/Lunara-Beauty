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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const bookingData = {
            service: serviceInput.value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            clientName: document.getElementById('clientName').value,
            clientPhone: document.getElementById('clientPhone').value,
            createdAt: new Date().toISOString()
        };

        try {
            // Assuming 'bookings' resource exists in MockAPI
            await api.post('bookings', bookingData);
            alert(`Booking confirmed for ${bookingData.service}! We will see you on ${bookingData.date} at ${bookingData.time}.`);
            modal.style.display = 'none';
            form.reset();
        } catch (error) {
            console.error(error);
            alert('Failed to save booking. Please try again or contact us directly.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}
