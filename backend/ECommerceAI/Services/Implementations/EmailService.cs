using System.Net;
using System.Net.Mail;
using ECommerceAI.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerceAI.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendOTPEmailAsync(string email, string otpCode, string type)
        {
            try
            {
                // Lấy thông tin SMTP từ appsettings.json
                var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["EmailSettings:SmtpUsername"];
                var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
                var fromEmail = _configuration["EmailSettings:FromEmail"] ?? smtpUsername;
                var fromName = _configuration["EmailSettings:FromName"] ?? "Nhân's Pet Haven";

                // Luôn log OTP ra console để dễ test (đặc biệt trong development)
                _logger.LogInformation("=== OTP CODE ===");
                _logger.LogInformation("Email: {Email}", email);
                _logger.LogInformation("OTP: {OTP}", otpCode);
                _logger.LogInformation("Type: {Type}", type);
                _logger.LogInformation("==================");
                Console.WriteLine($"\n=== OTP CODE ===");
                Console.WriteLine($"Email: {email}");
                Console.WriteLine($"OTP: {otpCode}");
                Console.WriteLine($"Type: {type}");
                Console.WriteLine($"==================\n");

                if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogWarning("Email settings not configured. OTP will not be sent via email.");
                    _logger.LogWarning("Please check console/logs above for the OTP code.");
                    return true; // Return true để tiếp tục development
                }

                var subject = type == "signup" 
                    ? "Xác thực đăng ký tài khoản - Nhân's Pet Haven" 
                    : "Xác thực đặt lại mật khẩu - Nhân's Pet Haven";

                var body = type == "signup"
                    ? $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <h2>Chào mừng đến với Nhân's Pet Haven!</h2>
                            <p>Mã OTP xác thực đăng ký tài khoản của bạn là:</p>
                            <h1 style='color: #ff5f6d; font-size: 32px; letter-spacing: 5px;'>{otpCode}</h1>
                            <p>Mã này sẽ hết hạn sau <strong>1 phút</strong>.</p>
                            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                            <hr>
                            <p style='color: #666; font-size: 12px;'>Trân trọng,<br>Đội ngũ Nhân's Pet Haven</p>
                        </body>
                        </html>"
                    : $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <h2>Đặt lại mật khẩu</h2>
                            <p>Mã OTP để đặt lại mật khẩu của bạn là:</p>
                            <h1 style='color: #ff5f6d; font-size: 32px; letter-spacing: 5px;'>{otpCode}</h1>
                            <p>Mã này sẽ hết hạn sau <strong>1 phút</strong>.</p>
                            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                            <hr>
                            <p style='color: #666; font-size: 12px;'>Trân trọng,<br>Đội ngũ Nhân's Pet Haven</p>
                        </body>
                        </html>";

                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);

                    using (var message = new MailMessage())
                    {
                        message.From = new MailAddress(fromEmail, fromName);
                        message.To.Add(email);
                        message.Subject = subject;
                        message.Body = body;
                        message.IsBodyHtml = true;

                        await client.SendMailAsync(message);
                    }
                }

                _logger.LogInformation("OTP email sent successfully to {Email}", email);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP email to {Email}", email);
                // Trong môi trường development, log OTP ra console
                _logger.LogInformation("OTP for {Email}: {OTP} (Type: {Type})", email, otpCode, type);
                return false;
            }
        }
    }
}

