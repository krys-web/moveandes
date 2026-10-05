<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// ==========================================
// CASO 1: Recibir y enviar la cotización por correo
// ==========================================
if (isset($input['accion']) && $input['accion'] === 'enviar_cotizacion') {
    $datos = $input['datos'] ?? [];
    
    $nombre = $datos['nombre'] ?? 'No especificado';
    $telefono = $datos['telefono'] ?? 'No especificado';
    $email = $datos['email'] ?? 'No especificado';
    $origen = $datos['origen'] ?? 'No especificado';
    $destino = $datos['destino'] ?? 'No especificado';

    $destinatario = "paginasweb.uio@gmail.com"; 
    $asunto = "Nueva cotización recibida desde el Chatbot Web";

    $cuerpoMensaje = "Se ha recibido una nueva solicitud de cotización a través del asistente virtual:\n\n";
    $cuerpoMensaje .= "• Nombre: " . $nombre . "\n";
    $cuerpoMensaje .= "• Teléfono / WhatsApp: " . $telefono . "\n";
    $cuerpoMensaje .= "• Correo Electrónico: " . $email . "\n";
    $cuerpoMensaje .= "• Dirección de Partida (Origen): " . $origen . "\n";
    $cuerpoMensaje .= "• Dirección de Llegada (Destino): " . $destino . "\n\n";
    $cuerpoMensaje .= "Por favor, contactar al cliente a la brevedad posible.";

    $headers = "From: noreply@moveandes.com\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    @mail($destinatario, $asunto, $cuerpoMensaje, $headers);
    
    echo json_encode([
        'status' => 'success',
        'mensaje' => 'Datos procesados correctamente.'
    ]);
    exit;
}

// ==========================================
// CASO 2: Preguntas de texto con motor robusto
// ==========================================
$mensajeUsuario = isset($input['mensaje']) ? trim($input['mensaje']) : '';

if (empty($mensajeUsuario)) {
    echo json_encode(['status' => 'error', 'respuesta' => 'Mensaje vacío.']);
    exit;
}

$mensajeLower = mb_strtolower($mensajeUsuario);

// 1. Detección de saludos
if (preg_match('/\b(hola|buenos días|buenas tardes|buenas noches|saludos|hey)\b/ui', $mensajeLower)) {
    $respuestaBot = "¡Hola! Qué gusto saludarte. Soy el asistente virtual de MoveAndes. ¿En qué puedo ayudarte hoy con tu mudanza? Si deseas iniciar una cotización rápida, escribe <b>'cotizar'</b> o selecciona una opción del menú.";
} 
// 2. Servicios de la empresa
elseif (preg_match('/\b(servicios|servicio|que ofrecen|qué ofrecen|ofrecen)\b/ui', $mensajeLower)) {
    $respuestaBot = "En MoveAndes ofrecemos:<br>"
                  . "• Mudanzas residenciales (casas y departamentos).<br>"
                  . "• Mudanzas corporativas (oficinas y negocios).<br>"
                  . "• Servicio profesional de empaque y embalaje.<br>"
                  . "• Transporte de carga general local y nacional.";
} 
// 3. Precios, costos y cotizaciones
elseif (preg_match('/\b(precio|precios|costo|costos|valor|valores|cotiz|presupuesto|tarifa|tarifas)\b/ui', $mensajeLower)) {
    $respuestaBot = "Nuestros costos varían según el volumen de tus pertenencias y la distancia entre el origen y el destino. Para darte un valor exacto, puedes escribir la palabra <b>'cotizar'</b> aquí mismo y te guiaré paso a paso.";
} 
// 4. Cobertura en Quito y valles
elseif (preg_match('/\b(quito|norte|sur|valle|valles|cumbay[aá]|tumbaco|chillos|rumipamba|carapungo|cobertura)\b/ui', $mensajeLower)) {
    $respuestaBot = "¡Sí! Realizamos mudanzas y transporte en todo el Distrito Metropolitano de Quito (norte, centro, sur y valles como Cumbayá, Tumbaco y Los Chillos), además de coberturas a nivel nacional.";
} 
// 5. Cobertura a nivel nacional
elseif (preg_match('/\b(nacional|provincias|provincia|guayaquil|cuenca|ambato|manta|loja|sierra|costa|amazonia)\b/ui', $mensajeLower)) {
    $respuestaBot = "¡Claro que sí! Realizamos traslados a nivel nacional hacia cualquier provincia del Ecuador con unidades seguras y monitoreadas. Escribe <b>'cotizar'</b> para registrar tu ruta.";
} 
// 6. Empaque y embalaje
elseif (preg_match('/\b(empaque|emparcar|embalaje|cajas|burbuja|proteger|fragil|frágiles)\b/ui', $mensajeLower)) {
    $respuestaBot = "Ofrecemos servicio profesional de empaque y embalaje utilizando materiales de alta calidad (cartón reforzado, plástico burbuja y mantas protectoras) para cuidar tus bienes más valiosos.";
} 
// 7. Horarios y atención
elseif (preg_match('/\b(horario|horarios|hora|horas|atienden|atencion|atención|cuando|dias|días)\b/ui', $mensajeLower)) {
    $respuestaBot = "Este asistente virtual está disponible las 24 horas del día. Nuestro equipo de operaciones atiende traslados previa agenda coordinada. Escribe <b>'cotizar'</b> para agendar tu solicitud.";
} 
// 8. Contacto o WhatsApp
elseif (preg_match('/\b(contacto|telefono|teléfono|whatsapp|hablar|asesor|persona)\b/ui', $mensajeLower)) {
    $respuestaBot = "Puedes comunicarte directamente con nuestro equipo de atención mediante el botón flotante de WhatsApp o escribiendo a nuestro correo paginasweb.uio@gmail.com.";
} 
// ==========================================
// RED DE SEGURIDAD (Cuando el bot no entiende la pregunta)
// ==========================================
else {
    $respuestaBot = "Mmm... no estoy completamente seguro de haber entendido tu consulta sobre ese tema en específico. 🤔<br><br>"
                  . "Para ayudarte mejor, puedes elegir una opción del menú o pulsar el botón de <b>WhatsApp</b> para hablar directamente con un asesor humano.";
}

echo json_encode([
    'status' => 'success', 
    'respuesta' => $respuestaBot
]);
exit;
?>