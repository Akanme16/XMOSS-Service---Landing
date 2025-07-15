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


    // --- CONSERVADO: Actualizar año en el Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- MANTENIDO COMO REFERENCIA: Formulario de Contacto ---
    // Este código sigue siendo válido si quieres añadir validaciones JS personalizadas en el futuro.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Actualmente, el envío lo gestiona Formspree a través del action del formulario.
            // Aquí se podría añadir lógica extra si fuera necesario.
        });
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