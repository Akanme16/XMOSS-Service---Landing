<?php

// --- IMPORTAR CLASES DE PHPMailer ---
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- INCLUIR EL AUTOLOAD DE COMPOSER ---
// Esto carga PHPMailer y sus dependencias.
require '../vendor/autoload.php';

// Establecer la cabecera para asegurar que la respuesta siempre sea JSON.
header('Content-Type: application/json');

// --- VALIDACIÓN DE SEGURIDAD ---
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;
}

// --- RECOPILACIÓN Y LIMPIEZA DE DATOS ---
$name = trim(htmlspecialchars($_POST['name'] ?? ''));
$email = trim(htmlspecialchars($_POST['email'] ?? ''));
$phone = trim(htmlspecialchars($_POST['phone'] ?? ''));
$package = trim(htmlspecialchars($_POST['paquete'] ?? ''));
$term = trim(htmlspecialchars($_POST['plazo'] ?? ''));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

// --- VALIDACIÓN DE DATOS ---
if (empty($name) || empty($package) || empty($term) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos requeridos correctamente."]);
    exit;
}

// --- INSTANCIA DE PHPMailer ---
$mail = new PHPMailer(true); // El 'true' activa las excepciones para el manejo de errores

try {
    // --- CONFIGURACIÓN DEL SERVIDOR SMTP ---
    // $mail->SMTPDebug = 2; // Descomenta esta línea para ver un log detallado del envío
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // O 'smtp.gmail.com' si usas Gmail
    $mail->SMTPAuth   = true;
    $mail->Username   = 'alskap020@gmail.com'; // TU USUARIO SMTP (tu correo)
    $mail->Password   = 'pzyu rqyx fipq clzf'; // TU CONTRASEÑA SMTP (o la contraseña de aplicación de Gmail)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // O 'tls' si el puerto es 587
    $mail->Port       = 465; // Puerto 465 para SMTPS/SSL, o 587 para TLS

    // --- REMITENTE Y DESTINATARIOS ---
    $mail->setFrom('tu_correo@tudominio.com', 'XMOSS Service Landing'); // Quién envía el correo
    $mail->addAddress('tu_correo_empresarial@tudominio.com'); // A quién le llega la notificación
    $mail->addReplyTo($email, $name); // Al responder, se responde al cliente

    // --- CONSTRUCCIÓN DEL CUERPO DEL CORREO (HTML) ---
    $email_body = "<html><body style='font-family: Arial, sans-serif;'>";
    $email_body .= "<h2 style='color: #C59527;'>Nueva Solicitud de Información</h2>";
    $email_body .= "<p><strong>Nombre:</strong><br>" . $name . "</p>";
    $email_body .= "<p><strong>Email:</strong><br>" . $email . "</p>";
    $email_body .= "<p><strong>Teléfono:</strong><br>" . $phone . "</p>";
    $email_body .= "<hr>";
    $email_body .= "<p><strong>Paquete de Interés:</strong><br>" . $package . "</p>";
    $email_body .= "<p><strong>Plazo del Contrato:</strong><br>" . $term . "</p>";
    if (!empty($message)) {
        $email_body .= "<p><strong>Mensaje Adicional:</strong><br>" . nl2br($message) . "</p>";
    }
    $email_body .= "</body></html>";

    // --- CONTENIDO DEL CORREO ---
    $mail->isHTML(true);
    $mail->Subject = 'Nueva Solicitud desde la Landing: ' . $name;
    $mail->Body    = $email_body;

    // --- ENVÍO ---
    $mail->send();
    echo json_encode(["status" => "success", "message" => "¡Gracias! Tu solicitud ha sido enviada con éxito."]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    // Devolvemos un error detallado para que sepas qué falló
    echo json_encode(["status" => "error", "message" => "El mensaje no pudo ser enviado. Error: " . $mail->ErrorInfo]);
}


// --- CONFIGURACIÓN ---
/*
$recipient_email = "alskap020@gmail.com; // CAMBIA ESTO por tu correo.
$subject = "Nueva Solicitud de Menú Digital desde la Landing";

// --- VALIDACIÓN DE SEGURIDAD ---
// Solo procesar si la solicitud es de tipo POST.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- RECOPILACIÓN Y LIMPIEZA DE DATOS ---
    // La función trim() elimina espacios en blanco al inicio y al final.
    // La función htmlspecialchars() previene ataques XSS.
    $name = trim(htmlspecialchars($_POST['name']));
    $email = trim(htmlspecialchars($_POST['email']));
    $phone = trim(htmlspecialchars($_POST['phone']));
    $package = trim(htmlspecialchars($_POST['paquete']));
    $term = trim(htmlspecialchars($_POST['plazo']));
    $message = trim(htmlspecialchars($_POST['message']));

    // --- VALIDACIÓN ADICIONAL ---
    // Verificar que los campos requeridos no estén vacíos y que el email sea válido.
    if (empty($name) || empty($package) || empty($term) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Si hay un error, enviar una respuesta de error al JavaScript.
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos requeridos."]);
        exit;
    }

    // --- CONSTRUCCIÓN DEL CUERPO DEL CORREO (HTML para mejor formato) ---
    $email_body = "<html><body style='font-family: Arial, sans-serif;'>";
    $email_body .= "<h2 style='color: #C59527;'>Nueva Solicitud de Información</h2>";
    $email_body .= "<p><strong>Nombre:</strong><br>" . $name . "</p>";
    $email_body .= "<p><strong>Email:</strong><br>" . $email . "</p>";
    $email_body .= "<p><strong>Teléfono:</strong><br>" . $phone . "</p>";
    $email_body .= "<hr>";
    $email_body .= "<p><strong>Paquete de Interés:</strong><br>" . $package . "</p>";
    $email_body .= "<p><strong>Plazo del Contrato:</strong><br>" . $term . "</p>";
    if (!empty($message)) {
        $email_body .= "<p><strong>Mensaje Adicional:</strong><br>" . nl2br($message) . "</p>"; // nl2br convierte saltos de línea a <br>
    }
    $email_body .= "</body></html>";

    // --- CONSTRUCCIÓN DE LAS CABECERAS DEL CORREO ---
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    // De: El nombre que quieras que aparezca. Usa un correo de tu propio dominio para mejorar la entrega.
    $headers .= 'From: XMOSS Service <no-reply@tudominio.com>' . "\r\n"; 
    // Al responder, la respuesta irá al cliente, no a tu correo "no-reply".
    $headers .= 'Reply-To: ' . $email . "\r\n";

    // --- ENVÍO DEL CORREO ---
    if (mail($recipient_email, $subject, $email_body, $headers)) {
        // Si el correo se envía con éxito, responde al JavaScript.
        echo json_encode(["status" => "success", "message" => "¡Gracias! Tu solicitud ha sido enviada con éxito."]);
    } else {
        // Si hay un fallo en la función mail(), responde con un error.
        http_response_code(500); // Internal Server Error
        echo json_encode(["status" => "error", "message" => "Hubo un problema en el servidor. Inténtalo más tarde."]);
    }

} else {
    // Si alguien intenta acceder al script directamente por el navegador.
    http_response_code(403); // Forbidden
    echo "Acceso denegado.";
}*/
?>
