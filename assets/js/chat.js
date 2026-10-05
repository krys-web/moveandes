document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectar HTML del Chat en el DOM
    const chatWidgetHTML = `
        <button class="chat-widget-btn" id="chatToggleBtn" aria-label="Abrir asistente virtual">
            🤖
        </button>
        <div class="chat-box-container" id="chatBox">
            <div class="chat-header">
                <h4>Asistente MoveAndes 🚚</h4>
                <button class="chat-close-btn" id="chatCloseBtn">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <!-- Se llenará con el menú de bienvenida al abrir -->
            </div>
            <form class="chat-input-area" id="chatForm">
                <input type="text" id="chatInput" placeholder="Escribe tu consulta o usa los botones..." required autocomplete="off">
                <button type="submit">Enviar</button>
            </form>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = chatWidgetHTML;
    document.body.appendChild(div);

    // Referencias
    const toggleBtn = document.getElementById('chatToggleBtn');
    const chatBox = document.getElementById('chatBox');
    const closeBtn = document.getElementById('chatCloseBtn');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    let cotizacionActiva = false;
    let pasoCotizacion = 0;
    let datosCotizacion = { nombre: '', telefono: '', email: '', origen: '', destino: '' };
    let mensajeBienvenidaMostrado = false;

    toggleBtn.addEventListener('click', () => {
        chatBox.classList.toggle('active');
        if (chatBox.classList.contains('active')) {
            chatInput.focus();
            if (!mensajeBienvenidaMostrado) {
                mostrarMenuPrincipal();
                mensajeBienvenidaMostrado = true;
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });

    // Función para mostrar el menú principal con botones interactivos
    function mostrarMenuPrincipal() {
        cotizacionActiva = false;
        pasoCotizacion = 0;
        
        appendMessage('¡Hola! 👋 Soy el asistente virtual de MoveAndes. ¿En qué podemos ayudarte hoy? Selecciona una opción:', 'bot');
        
        const opcionesHTML = `
            <div class="chat-options-container">
                <button class="chat-option-btn" data-accion="cotizar">📦 Solicitar Cotización de Mudanza</button>
                <button class="chat-option-btn" data-accion="servicios">🚚 Conocer nuestros servicios</button>
                <button class="chat-option-btn" data-accion="cobertura">📍 Cobertura en Quito y Ecuador</button>
                <button class="chat-option-btn" data-accion="contacto">📞 Contacto y WhatsApp</button>
            </div>
        `;
        appendCustomHTML(opcionesHTML, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Escuchar clics en los botones interactivos
    chatMessages.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-option-btn')) {
            const accion = e.target.getAttribute('data-accion');
            procesarAccionMenu(accion);
        }
    });

    function procesarAccionMenu(accion) {
        if (accion === 'cotizar') {
            appendMessage('Quiero solicitar una cotización', 'user');
            cotizacionActiva = true;
            pasoCotizacion = 1;
            setTimeout(() => {
                appendMessage('¡Perfecto! Vamos a registrar tus datos. ¿Cuál es tu nombre completo?', 'bot');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        } else if (accion === 'menu_principal') {
            appendMessage('Volver al menú principal', 'user');
            setTimeout(() => {
                mostrarMenuPrincipal();
            }, 400);
        } else {
            // Enviar texto simulado al backend para las demás opciones
            let textoConsulta = '';
            if (accion === 'servicios') textoConsulta = '¿Qué servicios ofrecen?';
            if (accion === 'cobertura') textoConsulta = '¿Cuál es su cobertura?';
            if (accion === 'contacto') textoConsulta = '¿Cómo los contacto?';
            
            appendMessage(textoConsulta, 'user');
            enviarMensajeBackend(textoConsulta);
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage(userText, 'user');
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const lowerText = userText.toLowerCase();

        // Si el usuario escribe para volver al menú
        if (lowerText.includes('menu') || lowerText.includes('menú') || lowerText.includes('inicio')) {
            mostrarMenuPrincipal();
            return;
        }

        if (cotizacionActiva) {
            manejarFlujoCotizacion(userText);
        } else {
            enviarMensajeBackend(userText);
        }
    });

    async function enviarMensajeBackend(texto) {
        const loadingId = appendMessage('Pensando...', 'bot loading');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('backend/procesar_chat.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: texto })
            });
            const data = await response.json();
            document.getElementById(loadingId).remove();
            appendMessage(data.respuesta, 'bot');
            
            // Agregar botón de retorno al menú después de cada respuesta del bot
            mostrarBotonRegresar();
        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage('Comunícate por nuestro WhatsApp directo para ayudarte de inmediato.', 'bot');
            mostrarBotonRegresar();
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function mostrarBotonRegresar() {
        const regresarHTML = `
            <div class="chat-options-container">
                <button class="chat-option-btn" data-accion="menu_principal">🔙 Volver al menú principal</button>
            </div>
        `;
        appendCustomHTML(regresarHTML, 'bot');
    }

    function manejarFlujoCotizacion(texto) {
        setTimeout(async () => {
            switch (pasoCotizacion) {
                case 1:
                    datosCotizacion.nombre = texto;
                    pasoCotizacion = 2;
                    appendMessage(`Mucho gusto, ${datosCotizacion.nombre}. ¿Cuál es tu número de teléfono o WhatsApp de contacto?`, 'bot');
                    break;
                case 2:
                    datosCotizacion.telefono = texto;
                    pasoCotizacion = 3;
                    appendMessage('¿Cuál es tu correo electrónico?', 'bot');
                    break;
                case 3:
                    datosCotizacion.email = texto;
                    pasoCotizacion = 4;
                    appendMessage('¿Desde qué dirección o ciudad realizamos la partida (origen)?', 'bot');
                    break;
                case 4:
                    datosCotizacion.origen = texto;
                    pasoCotizacion = 5;
                    appendMessage('¿Cuál es la dirección o ciudad de llegada (destino)?', 'bot');
                    break;
                case 5:
                    datosCotizacion.destino = texto;
                    appendMessage('Enviando tu solicitud a la empresa... ⏳', 'bot');
                    
                    try {
                        const res = await fetch('backend/procesar_chat.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ accion: 'enviar_cotizacion', datos: datosCotizacion })
                        });
                        const resultado = await res.json();
                        
                        if (resultado.status === 'success') {
                            appendMessage('¡Listo! 🚀 Tus datos han sido enviados con éxito a nuestro equipo. Nos pondremos en contacto contigo muy pronto.', 'bot');
                        } else {
                            appendMessage('Tus datos se registraron, pero hubo un detalle con el correo. Escríbenos por WhatsApp para confirmar.', 'bot');
                        }
                    } catch (err) {
                        appendMessage('Hubo un error de red al enviar los datos. Por favor escríbenos directamente a WhatsApp.', 'bot');
                    }

                    cotizacionActiva = false;
                    pasoCotizacion = 0;
                    mostrarBotonRegresar();
                    break;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        const msgId = 'msg-' + Date.now() + Math.random();
        msgDiv.id = msgId;
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        return msgId;
    }

    function appendCustomHTML(html, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = html;
        chatMessages.appendChild(msgDiv);
    }
});