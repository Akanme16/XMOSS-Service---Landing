// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- NUEVO: Cerrar el menú de navegación móvil al hacer clic en un enlace ---
    // Seleccionamos todos los enlaces dentro del menú colapsable
    const navLinks = document.querySelectorAll('#nav-content .nav-link');
    // Seleccionamos el contenedor del menú que se colapsa
    const navCollapse = document.getElementById('nav-content');

    // Verificamos que el menú exista para evitar errores
    if (navCollapse) {
        // Creamos una instancia del componente Collapse de Bootstrap.
        // Esto nos da acceso a métodos como .hide()
        const bsCollapse = new bootstrap.Collapse(navCollapse, {
            toggle: false // Importante: no queremos que se abra/cierre al crear la instancia
        });

        // Añadimos un event listener a cada enlace del menú
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Si el menú está visible (Bootstrap le añade la clase 'show'), lo ocultamos.
                if (navCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

     //  Lógica para el resaltado manual de enlaces ====
    const navLinksForHighlight = document.querySelectorAll('.navbar-nav .nav-link');

    navLinksForHighlight.forEach(link => {
        link.addEventListener('click', function() {
            // Primero, eliminamos la clase 'active' de TODOS los enlaces
            navLinksForHighlight.forEach(navLink => navLink.classList.remove('active'));

            // Luego, añadimos la clase 'active' solo al enlace que se hizo clic
            this.classList.add('active');
        });
    });

    // ====  Lógica para precios dinámicos ====
    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        // 1. Definir todos los precios en objetos
        const pricingData = {
            '1': { basico: '30', profesional: '50', premium: '75' },
            '3': { basico: '25', profesional: '40', premium: '60' },
            '6': { basico: '20', profesional: '35', premium: '50' }
        };
        const durationTextData = {
            '1': 'USD',
            '3': 'USD',
            '6': 'USD'
        };
        // ==== CAMBIO AQUÍ: Nuevo objeto para precios de actualizaciones extra ====
        const extraUpdatePricingData = {
            '1': { basico: '5', profesional: '4', premium: '3' },
            '3': { basico: '4', profesional: '3', premium: '2' },
            '6': { basico: '3', profesional: '2', premium: '1' }
        };

        // 2. Seleccionar todos los elementos del DOM que se van a actualizar
        const priceAmountElements = document.querySelectorAll('.price-amount');
        const priceDurationElements = document.querySelectorAll('.price-duration');
        const toggleLinks = pricingToggle.querySelectorAll('.nav-link');
        // ==== CAMBIO AQUÍ: Seleccionar los nuevos spans de precio ====
        const extraUpdatePriceElements = document.querySelectorAll('[data-plan-extra-update-price]');

        // 3. Función para actualizar todos los precios
        function updatePrices(duration) {
            const pricesForDuration = pricingData[duration];
            const textForDuration = durationTextData[duration];
            const extraPricesForDuration = extraUpdatePricingData[duration];
            
            // Actualizar precios principales
            priceAmountElements.forEach(el => {
                const plan = el.getAttribute('data-plan-price');
                el.textContent = `$${pricesForDuration[plan]}`;
            });

            // Actualizar texto de duración
            priceDurationElements.forEach(el => {
                el.textContent = textForDuration;
            });

            // ==== CAMBIO AQUÍ: Actualizar precios de actualizaciones extra ====
            extraUpdatePriceElements.forEach(el => {
                const plan = el.getAttribute('data-plan-extra-update-price');
                el.textContent = extraPricesForDuration[plan];
            });
        }

        // 4. Añadir evento de clic
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

    // --- Lógica para el Formulario de Contacto con AJAX ---
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir el envío tradicional del formulario

            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formStatus.innerHTML = ''; // Limpiar mensajes anteriores

            // Recopilar datos del formulario
            const formData = new FormData(contactForm);

            // Enviar los datos al script PHP
            fetch('php/send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    formStatus.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                    contactForm.reset(); // Limpiar el formulario
                } else {
                    formStatus.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                }
            })
            .catch(error => {
                // Capturar errores de red o si el JSON es inválido
                console.error('Error:', error);
                formStatus.innerHTML = `<div class="alert alert-danger">Ocurrió un error inesperado. Por favor, intenta de nuevo.</div>`;
            })
            .finally(() => {
                // Esto se ejecuta siempre, al final
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }

    // --- NUEVO: Inicializar el selector de país para el teléfono ---
    const phoneInputField = document.querySelector("#phone");
    if (phoneInputField) {
        window.intlTelInput(phoneInputField, {
            /*initialCountry: "auto",
            geoIpLookup: function(callback) {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("us"));
            },*/
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
        });
    }

    // --- Actualizar año en el Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // Fin de DOMContentLoaded


/*
    QUÉ SE ELIMINÓ Y POR QUÉ:

    - Lógica del Menú Hamburguesa: Eliminada. El componente Navbar de Bootstrap
    (con data-bs-toggle="collapse") lo gestiona de forma nativa.

    - Lógica de Scroll para Resaltar Enlace Activo: Eliminada. El componente
    ScrollSpy de Bootstrap (con data-bs-spy="scroll") lo hace automáticamente.
    Es más eficiente y robusto.
*/