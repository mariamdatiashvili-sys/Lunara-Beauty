/**
 * FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a page where we want FAQs (Services Page)
    if (window.location.pathname.includes('services.html') || document.querySelector('.services-section')) {
        initFAQ();
    }
});

function initFAQ() {
    const faqData = [
        {
            question: "Do I need to book an appointment in advance?",
            answer: "Yes, we recommend booking at least 24 hours in advance to ensure availability."
        },
        {
            question: "What products do you use?",
            answer: "We use only premium, dermatologically tested products including organic and vegan options."
        },
        {
            question: "Can I cancel or reschedule?",
            answer: "You can cancel or reschedule up to 12 hours before your appointment without any fee."
        }
    ];

    const faqSection = document.createElement('section');
    faqSection.className = 'faq-section container';
    faqSection.innerHTML = `<h2>Frequently Asked Questions</h2><div class="faq-container"></div>`;

    // Insert after services section or before footer
    const servicesSection = document.querySelector('.services-section') || document.querySelector('.booking-section');
    if (servicesSection) {
        servicesSection.parentNode.insertBefore(faqSection, servicesSection.nextSibling);
    } else {
        const footer = document.querySelector('footer');
        document.body.insertBefore(faqSection, footer);
    }

    const container = faqSection.querySelector('.faq-container');

    faqData.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <div class="faq-question">
                <h3>${item.question}</h3>
                <span class="toggle-icon">+</span>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;
        container.appendChild(faqItem);

        // Toggle Event
        faqItem.querySelector('.faq-question').addEventListener('click', () => {
            // Close others
            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== faqItem) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current
            faqItem.classList.toggle('active');
            const answer = faqItem.querySelector('.faq-answer');
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}
