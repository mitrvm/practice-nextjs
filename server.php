<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Add these debug lines
error_log('SMTP Host: ' . $_ENV['SMTP_HOST']);
error_log('SMTP Port: ' . $_ENV['SMTP_PORT']);
error_log('SMTP Username: ' . $_ENV['SMTP_USERNAME']);

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $rawInput = file_get_contents('php://input');
    if (!$rawInput) {
        throw new Exception('No input data received');
    }

    $data = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }

    error_log('Received data: ' . print_r($data, true));

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->Debugoutput = function($str, $level) {
        error_log("PHPMailer Debug: $str");
    };

    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME'];
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $_ENV['SMTP_PORT'];
    $mail->CharSet = 'UTF-8';
    
    $mail->XMailer = 'TLC Transcontinental Website';
    $mail->addCustomHeader('X-Entity-Ref-ID', uniqid());
    
    $mail->setFrom($_ENV['SMTP_USERNAME'], 'TLC Transcontinental');
    $mail->addAddress($_ENV['RECIPIENT_EMAIL']);
    $mail->addReplyTo($data['email'], $data['name']);

    $mail->isHTML(true);
    $mail->Subject = 'Новая заявка с сайта';
    
    // Prepare email content with better formatting
    $htmlBody = '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Новая заявка с сайта</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p style="margin: 10px 0;"><strong>Имя:</strong> ' . htmlspecialchars($data['name']) . '</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ' . htmlspecialchars($data['email']) . '</p>';

    // Add additional fields if they exist
    $additionalFields = [
        'phone' => 'Телефон',
        'locationFrom' => 'Местонахождение груза',
        'locationTo' => 'Место доставки груза',
        'cargoDesc' => 'Описание груза',
        'cargoWeight' => 'Вес груза',
        'cargoVolume' => 'Объём груза',
        'incoterms' => 'Инкотермс',
        'transportType' => 'Вид перевозки'
    ];

    foreach ($additionalFields as $field => $label) {
        if (!empty($data[$field])) {
            $htmlBody .= '<p style="margin: 10px 0;"><strong>' . $label . ':</strong> ' . htmlspecialchars($data[$field]) . '</p>';
        }
    }
    
    $htmlBody .= '
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Это письмо отправлено с сайта TLC Transcontinental
        </p>
    </div>';
    
    $mail->Body = $htmlBody;
    
    // Create plain text version
    $textBody = "Новая заявка с сайта TLC Transcontinental\n\n" .
                "Имя: {$data['name']}\n" .
                "Email: {$data['email']}\n";
    
    foreach ($additionalFields as $field => $label) {
        if (!empty($data[$field])) {
            $textBody .= "{$label}: {$data[$field]}\n";
        }
    }
    
    $mail->AltBody = $textBody;

    $mail->send();
    
    echo json_encode([
        'message' => 'Заявка успешно отправлена',
        'received' => $data
    ]);

} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 