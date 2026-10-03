<?php
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $tipo_servicio = $_POST['tipo_servicio'];
    $origen = $_POST['origen'];
    $destino = $_POST['destino'];
    $fecha_mudanza = $_POST['fecha_mudanza'];
    $hora_mudanza = $_POST['hora_mudanza'];
    $detalles = $_POST['detalles'];

    try {
        $sql = "INSERT INTO cotizaciones (nombre, telefono, email, tipo_servicio, origen, destino, fecha_mudanza, hora_mudanza, detalles, fecha_solicitud) 
                VALUES (:nombre, :telefono, :email, :tipo_servicio, :origen, :destino, :fecha_mudanza, :hora_mudanza, :detalles, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':telefono' => $telefono,
            ':email' => $email,
            ':tipo_servicio' => $tipo_servicio,
            ':origen' => $origen,
            ':destino' => $destino,
            ':fecha_mudanza' => $fecha_mudanza,
            ':hora_mudanza' => $hora_mudanza,
            ':detalles' => $detalles
        ]);

        // Redireccionar con éxito (puedes crear una vista de agradecimiento)
        echo "<script>alert('¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.'); window.location.href='../index.html';</script>";

    } catch (PDOException $e) {
        echo "Error al procesar la solicitud: " . $e->getMessage();
    }
}
?>