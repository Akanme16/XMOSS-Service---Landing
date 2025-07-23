<?php

// Establece el tipo de respuesta a JSON
header('Content-Type: application/json');

// Importación de las librerías necesarias
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Carga de dependencias
require __DIR__ . '/../vendor/autoload.php';

// Carga de variables de entorno desde la ruta especificada
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Validación del método de la solicitud
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    throw new Exception("Método no permitido.");
}
// Recopilación y limpieza de los datos del formulario
$name = trim(htmlspecialchars($_POST['name'] ?? ''));
$email = trim(htmlspecialchars($_POST['email'] ?? ''));
$phone = trim(htmlspecialchars($_POST['phone'] ?? ''));
$package = trim(htmlspecialchars($_POST['paquete'] ?? ''));
$term = trim(htmlspecialchars($_POST['plazo'] ?? ''));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

// Validación de los datos recibidos
if (empty($name) || empty($package) || empty($term) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    throw new Exception("Por favor, completa todos los campos requeridos.");
}

// Creación y configuración del objeto de correo
$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host       = $_ENV['SMTP_HOST'];
$mail->SMTPAuth   = true;
$mail->CharSet = 'UTF-8';
$mail->Username   = $_ENV['SMTP_USER'];
$mail->Password   = $_ENV['SMTP_PASS'];
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port       = $_ENV['SMTP_PORT'];

// Configuración del remitente y destinatarios
$mail->setFrom('contact@xmoss-service.com', 'XMOSS Landing');
$mail->addAddress('contact@xmoss-service.com');
$mail->addReplyTo($email, $name);
// Construcción del cuerpo del correo en HTML
$email_body = "<html><body style='font-family: Arial, sans-serif;'>" .
            "<h2 style='color: #C59527;'>Nueva Solicitud de Información</h2>" .
            "<p><strong>Nombre:</strong><br>" . $name . "</p>" .
            "<p><strong>Email:</strong><br>" . $email . "</p>" .
            "<p><strong>Teléfono:</strong><br>" . $phone . "</p>" .
            "<hr>" .
            "<p><strong>Paquete de Interés:</strong><br>" . $package . "</p>" .
            "<p><strong>Plazo del Contrato:</strong><br>" . $term . "</p>" .
            (!empty($message) ? "<p><strong>Mensaje Adicional:</strong><br>" . nl2br($message) . "</p>" : "") .
            "</body></html>";
// Asignación del contenido al correo
$mail->isHTML(true);
$mail->Subject = 'Nueva Solicitud desde la Landing: ' . $name;
$mail->Body    = $email_body;
// Envío del correo
$mail->send();
echo json_encode(["status" => "success", "message" => "¡Gracias! Tu solicitud ha sido enviada con éxito."]);

?>