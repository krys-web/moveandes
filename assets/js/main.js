document.addEventListener('DOMContentLoaded', () => {
    console.log("MoveAndes JS Cargado Correctamente");

// ==========================================
        // 1. Menú Responsive (Hamburguesa para Móviles)
        // ==========================================
        const header = document.querySelector('header');
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');

        if (header && navContainer && navMenu) {
            // Crear el botón de hamburguesa con estructura para animación (span interno)
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.innerHTML = '<span></span>'; // ESTO ES CLAVE: La barra central
            hamburgerBtn.className = 'mobile-menu-btn';
            hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
            hamburgerBtn.style.display = 'none'; // Oculto por defecto para JS
            hamburgerBtn.style.marginLeft = 'auto';

            // Insertar el botón al lado del logo dentro del nav-container
            navContainer.appendChild(hamburgerBtn);

            const checkScreenSize = () => {
                if (window.innerWidth <= 768) {
                    hamburgerBtn.style.display = 'flex'; // Mostrar como flexbox para centrar las líneas
                    if (!navMenu.classList.contains('active')) {
                        navMenu.style.display = 'none';
                    }
                } else {
                    hamburgerBtn.style.display = 'none';
                    navMenu.style.display = 'flex';
                    navMenu.classList.remove('active');
                    hamburgerBtn.classList.remove('is-active'); // Resetear el estado de la X
                }
            };

            window.addEventListener('resize', checkScreenSize);
            checkScreenSize();

            // Evento al hacer clic en la hamburguesa
            hamburgerBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburgerBtn.classList.toggle('is-active'); // Activa/Desactiva la animación de la X
                
                if (navMenu.classList.contains('active')) {
                    navMenu.style.display = 'flex';
                } else {
                    if (window.innerWidth <= 768) {
                        navMenu.style.display = 'none';
                    }
                }
            });
        }

    // ==========================================
    // 2. Validación de Formularios y Efectos
    // ==========================================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e63946';
                } else {
                    input.style.borderColor = '#ccc';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, completa todos los campos obligatorios marcados.');
            }
        });
    });
});