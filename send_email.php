<?php
// send_email.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get form data
$name = filter_input(INPUT_POST, 'fullName', FILTER_SANITIZE_SPECIAL_CHARS);
$phone = filter_input(INPUT_POST, 'phoneNumber', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'emailAddress', FILTER_SANITIZE_EMAIL);
$course = filter_input(INPUT_POST, 'interestedCourse', FILTER_SANITIZE_SPECIAL_CHARS);
$subject = filter_input(INPUT_POST, 'messageSubject', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'messageContent', FILTER_SANITIZE_SPECIAL_CHARS);
$consent = isset($_POST['privacyConsent']) ? true : false;

// Validate required fields
if (empty($name) || empty($phone) || empty($email) || empty($subject) || empty($message) || !$consent) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Course options mapping
$courseOptions = [
    '' => 'Not specified',
    'n5' => 'Japanese N5 (Beginner)',
    'n4' => 'Japanese N4 (Intermediate)',
    'both' => 'Both N5 & N4',
    'jft' => 'JFT Basic Test'
];

$courseText = isset($courseOptions[$course]) ? $courseOptions[$course] : 'Not specified';

try {
    $mail = new PHPMailer(true);
    
    // Server settings - USING YOUR CUSTOM SERVER
    $mail->isSMTP();
    $mail->Host = 'mail.exceleducationcenter.com';  // Your SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'info@exceleducationcenter.com';  // Your email
    $mail->Password = 'Pele@246';     // Your password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Use SSL/TLS
    $mail->Port = 465;  // Your SMTP port
    
    // Enable debugging (0 = off, 1 = client messages, 2 = client and server messages)
    $mail->SMTPDebug = 0;
    
    // Set charset
    $mail->CharSet = 'UTF-8';
    
    // Recipients
    $mail->setFrom('info@exceleducationcenter.com', 'Excel Education Website');  // Send from your server email
    $mail->addAddress('info@exceleducationcenter.com', 'Excel Education');  // Primary recipient
    $mail->addAddress('admissions@exceleducationcenter.com', 'Excel Education Admissions');  // Secondary recipient
    $mail->addReplyTo($email, $name);  // Allow reply to user's email
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission: ' . $subject;
    
    // Email body
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=\"UTF-8\">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 25px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .field:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #166534; display: inline-block; width: 150px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
            .important { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📧 New Contact Form Submission</h2>
                <p>Excel Education & Training Center</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>👤 Name:</span> {$name}
                </div>
                <div class='field'>
                    <span class='label'>📞 Phone:</span> {$phone}
                </div>
                <div class='field'>
                    <span class='label'>✉️ Email:</span> {$email}
                </div>
                <div class='field'>
                    <span class='label'>📚 Interested Course:</span> {$courseText}
                </div>
                <div class='field'>
                    <span class='label'>📋 Subject:</span> {$subject}
                </div>
                <div class='field'>
                    <span class='label'>💬 Message:</span><br>
                    <div style=\"margin-top: 10px; padding: 10px; background-color: white; border: 1px solid #e0e0e0; border-radius: 5px;\">
                        " . nl2br(htmlspecialchars($message)) . "
                    </div>
                </div>
                <div class='field'>
                    <span class='label'>⏰ Submission Time:</span> " . date('F j, Y, g:i a') . "
                </div>
                <div class='field'>
                    <span class='label'>🌐 Source:</span> Website Contact Form
                </div>
                
                <div class='important'>
                    <strong>⚠️ Action Required:</strong> Please respond to this inquiry within 24 hours as per service commitment.
                </div>
            </div>
            <div class='footer'>
                <p>📱 <strong>Hotline:</strong> +880 1974-142455 | +880 1745-715127</p>
                <p>🏢 <strong>Offices:</strong> Kajla, Jatrabari & Panthapath, Dhaka</p>
                <p>⏰ <strong>Hours:</strong> Saturday-Thursday, 10:00 AM – 6:00 PM</p>
                <p>This email was automatically generated from the contact form on exceleducationcenter.com</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Plain text version
    $mail->AltBody = "NEW CONTACT FORM SUBMISSION
=======================

Excel Education & Training Center
---------------------------------

Name: {$name}
Phone: {$phone}
Email: {$email}
Interested Course: {$courseText}
Subject: {$subject}

Message:
{$message}

Submission Time: " . date('F j, Y, g:i a') . "
Source: Website Contact Form

ACTION REQUIRED: Please respond within 24 hours.

--
Hotline: +880 1974-142455 | +880 1745-715127
Offices: Kajla, Jatrabari & Panthapath, Dhaka
Hours: Saturday-Thursday, 10:00 AM – 6:00 PM
Website: exceleducationcenter.com
";
    
    // Send the email
    if($mail->send()) {
        // Send confirmation email to user
        $confirmationMail = new PHPMailer(true);
        $confirmationMail->isSMTP();
        $confirmationMail->Host = 'mail.exceleducationcenter.com';
        $confirmationMail->SMTPAuth = true;
        $confirmationMail->Username = 'info@exceleducationcenter.com';
        $confirmationMail->Password = 'Pele@246';
        $confirmationMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $confirmationMail->Port = 465;
        $confirmationMail->CharSet = 'UTF-8';
        
        $confirmationMail->setFrom('info@exceleducationcenter.com', 'Excel Education & Training Center');
        $confirmationMail->addAddress($email, $name);
        $confirmationMail->addBCC('info@exceleducationcenter.com'); // Keep a copy
        
        $confirmationMail->isHTML(true);
        $confirmationMail->Subject = 'Thank You for Contacting Excel Education & Training Center';
        
        $confirmationMail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #166534, #22c55e); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
                .footer { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center; font-size: 12px; color: #666; }
                .contact-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .btn-primary { background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
                .social-links { margin-top: 20px; }
                .social-links a { display: inline-block; margin: 0 10px; color: #166534; font-size: 18px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 style='margin: 0;'>🎌 Thank You for Contacting Excel Education!</h1>
                    <p style='margin: 10px 0 0; opacity: 0.9;'>Your Japanese Language Journey Starts Here</p>
                </div>
                
                <div class='content'>
                    <p>Dear <strong>{$name}</strong>,</p>
                    
                    <p>Thank you for reaching out to <strong>Excel Education & Training Center</strong>. We have successfully received your inquiry and our dedicated team will review it shortly.</p>
                    
                    <div class='contact-box'>
                        <h3 style='color: #166534; margin-top: 0;'>📋 Your Inquiry Details:</h3>
                        <p><strong>Subject:</strong> {$subject}</p>
                        <p><strong>Interested Course:</strong> {$courseText}</p>
                        <p><strong>Submission Time:</strong> " . date('F j, Y, g:i a') . "</p>
                    </div>
                    
                    <h3>⏰ What Happens Next?</h3>
                    <ol>
                        <li>Our admissions team will contact you within <strong>24 hours</strong> (excluding weekends and holidays)</li>
                        <li>We'll discuss your Japanese language learning goals and visa requirements</li>
                        <li>Schedule a free consultation at our office (or online)</li>
                        <li>Guide you through the enrollment process</li>
                    </ol>
                    
                    <h3>📞 Need Immediate Assistance?</h3>
                    <p>For urgent inquiries, please contact us directly:</p>
                    
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                        <p><strong>📞 Hotline:</strong> +880 1974-142455 | +880 1745-715127</p>
                        <p><strong>✉️ Email:</strong> info@exceleducationcenter.com | admissions@exceleducationcenter.com</p>
                        <p><strong>🏢 Office Hours:</strong> Saturday – Thursday, 10:00 AM – 6:00 PM</p>
                    </div>
                    
                    <div style='text-align: center; margin: 25px 0;'>
                        <a href='tel:+8801974142455' class='btn-primary'>📞 Call Now</a>
                        <a href='https://exceleducationcenter.com' class='btn-primary' style='margin-left: 10px;'>🌐 Visit Website</a>
                    </div>
                    
                    <p>We look forward to helping you achieve your Japanese language goals!</p>
                    
                    <p>Best regards,<br>
                    <strong>The Excel Education Team</strong><br>
                    <em>Your Partner in Japanese Language Excellence</em></p>
                </div>
                
                <div class='footer'>
                    <p><strong>Excel Education & Training Center</strong></p>
                    <p>🏢 <strong>Main Office:</strong> Kajla, Jatrabari, Dhaka</p>
                    <p>🏢 <strong>Branch Office:</strong> Indira Road, Tejgaon, Dhaka 1215</p>
                    
                    <div class='social-links'>
                        <a href='#'>📘 Facebook</a>
                        <a href='#'>📸 Instagram</a>
                        <a href='#'>▶️ YouTube</a>
                        <a href='#'>💼 LinkedIn</a>
                    </div>
                    
                    <p style='margin-top: 15px; font-size: 11px; color: #999;'>
                        This is an automated confirmation email. Please do not reply to this message.<br>
                        © " . date('Y') . " Excel Education & Training Center. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $confirmationMail->AltBody = "THANK YOU FOR CONTACTING EXCEL EDUCATION & TRAINING CENTER

Dear {$name},

Thank you for reaching out to Excel Education & Training Center. We have successfully received your inquiry and our team will contact you within 24 hours.

YOUR INQUIRY DETAILS:
- Subject: {$subject}
- Interested Course: {$courseText}
- Submission Time: " . date('F j, Y, g:i a') . "

URGENT CONTACT:
- Hotline: +880 1974-142455 | +880 1745-715127
- Email: info@exceleducationcenter.com
- Office Hours: Saturday-Thursday, 10:00 AM – 6:00 PM

We look forward to helping you with your Japanese language journey!

Best regards,
The Excel Education Team

--
Excel Education & Training Center
Kajla, Jatrabari, Dhaka | Indira Road, Tejgaon, Dhaka 1215
www.exceleducationcenter.com
";
        
        $confirmationMail->send();
        
        // Success response
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.'
        ]);
        
    } else {
        throw new Exception('Mailer failed to send');
    }
    
} catch (Exception $e) {
    // Log error
    error_log("PHPMailer Error: " . $e->getMessage());
    error_log("PHPMailer Debug: " . $mail->ErrorInfo);
    
    // User-friendly error message
    echo json_encode([
        'success' => false, 
        'message' => 'Message could not be sent. Please try again or call us directly. Error: Server configuration issue'
    ]);
}