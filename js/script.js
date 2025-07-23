document.addEventListener('DOMContentLoaded', function() {

    // Cierra el menú de navegación al hacer clic en un enlace en móviles.
    const navLinks = document.querySelectorAll('#nav-content .nav-link');
    const navCollapse = document.getElementById('nav-content');
    if (navCollapse) {
        const bsCollapse = new bootstrap.Collapse(navCollapse, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Resalta el enlace activo en la barra de navegación.
    const navLinksForHighlight = document.querySelectorAll('.navbar-nav .nav-link');
    navLinksForHighlight.forEach(link => {
        link.addEventListener('click', function() {
            navLinksForHighlight.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Función para actualizar los precios dinámicos.
    function updatePrices(duration) {
        const pricingData = { '1': { basico: '30', profesional: '50', premium: '75' }, '3': { basico: '25', profesional: '40', premium: '60' }, '6': { basico: '20', profesional: '35', premium: '50' } };
        const durationTextData = { '1': 'USD', '3': 'USD', '6': 'USD' };
        const extraUpdatePricingData = { '1': { basico: '5', profesional: '4', premium: '3' }, '3': { basico: '4', profesional: '3', premium: '2' }, '6': { basico: '3', profesional: '2', premium: '1' } };
        const priceAmountElements = document.querySelectorAll('.price-amount');
        const priceDurationElements = document.querySelectorAll('.price-duration');
        const extraUpdatePriceElements = document.querySelectorAll('[data-plan-extra-update-price]');
        
        const pricesForDuration = pricingData[duration];
        const textForDuration = durationTextData[duration];
        const extraPricesForDuration = extraUpdatePricingData[duration];
        
        priceAmountElements.forEach(el => { const plan = el.getAttribute('data-plan-price'); el.textContent = `$${pricesForDuration[plan]}`; });
        priceDurationElements.forEach(el => { el.textContent = textForDuration; });
        extraUpdatePriceElements.forEach(el => { const plan = el.getAttribute('data-plan-extra-update-price'); el.textContent = extraPricesForDuration[plan]; });
    }

    // Event listeners para los precios dinámicos.
    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        const toggleLinks = pricingToggle.querySelectorAll('.nav-link');
        toggleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const selectedDuration = this.getAttribute('data-duration');
                updatePrices(selectedDuration);
            });
        });
    }

    // Inicializa el campo de teléfono.
    const phoneInputField = document.querySelector("#phone");
    if (phoneInputField) {
        window.intlTelInput(phoneInputField, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            separateDialCode: true
        });
    }

    // Gestiona el envío del formulario.
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formStatus.innerHTML = '';

            const formData = new FormData(contactForm);
            
            const prefixElement = document.querySelector('.iti__selected-dial-code');
            const prefix = prefixElement ? prefixElement.textContent : '';
            const userNumber = phoneInputField ? phoneInputField.value : '';
            const fullPhoneNumber = `${prefix} ${userNumber}`.trim();
            
            formData.set('phone', fullPhoneNumber);

            fetch('php/send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    formStatus.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                    contactForm.reset();
                } else {
                    formStatus.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.innerHTML = `<div class="alert alert-danger">Ocurrió un error inesperado.</div>`;
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }

    // Actualiza el año en el pie de página.
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});