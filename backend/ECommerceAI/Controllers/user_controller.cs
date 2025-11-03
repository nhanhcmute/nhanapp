using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.User;
using ECommerceAI.Models.Auth;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("user.ctr")]
    public class user_controller : ControllerBase
    {
        private readonly IUserRepo _userRepo;
        private readonly IOTPCacheService _otpCache;
        private readonly IEmailService _emailService;
        private readonly ILogger<user_controller> _logger;
        private readonly IConfiguration _configuration;

        public user_controller(
            IUserRepo userRepo, 
            IOTPCacheService otpCache,
            IEmailService emailService,
            ILogger<user_controller> logger, 
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _otpCache = otpCache;
            _emailService = emailService;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Đăng nhập
        /// POST /user.ctr/login
        /// Body: { "username": "...", "password": "..." }
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> login([FromBody] login_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.username) || string.IsNullOrWhiteSpace(request.password))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng nhập tên đăng nhập và mật khẩu!",
                        data = (object?)null
                    });
                }

                var user = await _userRepo.LoginAsync(request.username, request.password);

                if (user == null)
                {
                    return Unauthorized(new
                    {
                        status = 401,
                        message = "Sai tên đăng nhập hoặc mật khẩu!",
                        data = (object?)null
                    });
                }

                // Update last login
                await _userRepo.UpdateLastLoginAsync(user.Id!);

                // Return user info (không trả password)
                var response = new login_response
                {
                    id = user.Id!,
                    name = user.Name,
                    email = user.Email,
                    username = user.Username,
                    role = user.Role,
                    lastLogin = DateTime.UtcNow
                };

                return Ok(new
                {
                    status = 200,
                    message = "Đăng nhập thành công!",
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for username: {Username}", request.username);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi đăng nhập!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Đăng ký tài khoản mới (yêu cầu đã verify OTP)
        /// POST /user.ctr/signup
        /// Body: { "name": "...", "email": "...", "username": "...", "password": "..." }
        /// </summary>
        [HttpPost("signup")]
        public async Task<IActionResult> signup([FromBody] signup_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.name) ||
                    string.IsNullOrWhiteSpace(request.email) ||
                    string.IsNullOrWhiteSpace(request.username) ||
                    string.IsNullOrWhiteSpace(request.password))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng điền đầy đủ thông tin!",
                        data = (object?)null
                    });
                }

                // Kiểm tra username đã tồn tại
                if (await _userRepo.IsUsernameExistsAsync(request.username))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Tên đăng nhập đã tồn tại!",
                        data = (object?)null
                    });
                }

                // Kiểm tra email đã tồn tại
                if (await _userRepo.IsEmailExistsAsync(request.email))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Email này đã được sử dụng!",
                        data = (object?)null
                    });
                }

                // Tạo user mới
                var newUser = new user_model
                {
                    Name = request.name,
                    Email = request.email,
                    Username = request.username,
                    Password = request.password, // TODO: Hash password
                    Role = 2// Default role
                };

                var createdUser = await _userRepo.CreateAsync(newUser);

                // Xóa OTP khỏi cache sau khi signup thành công
                _otpCache.RemoveOTP(request.email, "signup");

                var response = new login_response
                {
                    id = createdUser.Id!,
                    name = createdUser.Name,
                    email = createdUser.Email,
                    username = createdUser.Username,
                    role = createdUser.Role,
                    lastLogin = null
                };

                return Ok(new
                {
                    status = 200,
                    message = "Đăng ký thành công!",
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during signup for username: {Username}", request.username);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi đăng ký!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Quên mật khẩu - Bước 1: Kiểm tra thông tin và gửi OTP
        /// POST /user.ctr/forgot_password
        /// Body: { "username": "...", "email": "..." }
        /// </summary>
        [HttpPost("forgot_password")]
        public async Task<IActionResult> forgot_password([FromBody] forgot_password_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.username) || string.IsNullOrWhiteSpace(request.email))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng nhập tên đăng nhập và email!",
                        data = (object?)null
                    });
                }

                var user = await _userRepo.GetByUsernameAsync(request.username);

                if (user == null || user.Email != request.email)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Thông tin tài khoản hoặc email không đúng!",
                        data = (object?)null
                    });
                }

                // Tạo OTP mới
                var random = new Random();
                var otpCode = random.Next(100000, 999999).ToString(); // 6 chữ số

                // Lưu OTP vào Memory Cache (tự động xóa sau 1 phút)
                _otpCache.SetOTP(request.email, otpCode, "forgot_password", TimeSpan.FromMinutes(1));

                // Gửi email OTP
                await _emailService.SendOTPEmailAsync(request.email, otpCode, "forgot_password");

                return Ok(new
                {
                    status = 200,
                    message = "Mã OTP đã được gửi đến email của bạn!",
                    data = new { email = user.Email }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot_password for username: {Username}", request.username);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xử lý yêu cầu!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Đặt lại mật khẩu - Bước 3 (sau khi verify OTP)
        /// POST /user.ctr/reset_password
        /// Body: { "username": "...", "new_password": "..." }
        /// </summary>
        [HttpPost("reset_password")]
        public async Task<IActionResult> reset_password([FromBody] reset_password_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.username) || string.IsNullOrWhiteSpace(request.new_password))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng nhập tên đăng nhập và mật khẩu mới!",
                        data = (object?)null
                    });
                }

                var user = await _userRepo.GetByUsernameAsync(request.username);

                if (user == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Người dùng không tồn tại!",
                        data = (object?)null
                    });
                }

                // Update password
                // TODO: Hash password
                var success = await _userRepo.UpdatePasswordAsync(request.username, request.new_password);

                if (!success)
                {
                    return StatusCode(500, new
                    {
                        status = 500,
                        message = "Đã xảy ra lỗi khi cập nhật mật khẩu!",
                        data = (object?)null
                    });
                }

                // Xóa OTP khỏi cache sau khi reset thành công
                _otpCache.RemoveOTP(user.Email, "forgot_password");

                return Ok(new
                {
                    status = 200,
                    message = "Mật khẩu của bạn đã được thay đổi thành công!",
                    data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during reset_password for username: {Username}", request.username);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi cập nhật mật khẩu!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Kiểm tra username có tồn tại không
        /// POST /user.ctr/check_username
        /// Body: { "username": "..." }
        /// </summary>
        [HttpPost("check_username")]
        public async Task<IActionResult> check_username([FromForm] string username)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Username không được để trống!",
                        data = (object?)null
                    });
                }

                var exists = await _userRepo.IsUsernameExistsAsync(username);

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new { exists }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking username: {Username}", username);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Kiểm tra email có tồn tại không
        /// POST /user.ctr/check_email
        /// Body: { "email": "..." }
        /// </summary>
        [HttpPost("check_email")]
        public async Task<IActionResult> check_email([FromForm] string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Email không được để trống!",
                        data = (object?)null
                    });
                }

                var exists = await _userRepo.IsEmailExistsAsync(email);

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new { exists }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking email: {Email}", email);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Gửi OTP qua email
        /// POST /user.ctr/send_otp
        /// Body: { "email": "...", "type": "signup" | "forgot_password", "username": "..." (optional, cho forgot_password) }
        /// </summary>
        [HttpPost("send_otp")]
        public async Task<IActionResult> send_otp([FromBody] send_otp_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.type))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng nhập email và loại xác thực!",
                        data = (object?)null
                    });
                }

                if (request.type != "signup" && request.type != "forgot_password")
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Loại xác thực không hợp lệ!",
                        data = (object?)null
                    });
                }

                // Kiểm tra cho signup
                if (request.type == "signup")
                {
                    if (await _userRepo.IsEmailExistsAsync(request.email))
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = "Email này đã được sử dụng!",
                            data = (object?)null
                        });
                    }
                }
                // Kiểm tra cho forgot_password
                else if (request.type == "forgot_password")
                {
                    if (string.IsNullOrWhiteSpace(request.username))
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = "Vui lòng nhập tên đăng nhập!",
                            data = (object?)null
                        });
                    }

                    var user = await _userRepo.GetByUsernameAsync(request.username);
                    if (user == null || user.Email != request.email)
                    {
                        return NotFound(new
                        {
                            status = 404,
                            message = "Thông tin tài khoản hoặc email không đúng!",
                            data = (object?)null
                        });
                    }
                }

                // Tạo OTP mới (6 chữ số)
                var random = new Random();
                var otpCode = random.Next(100000, 999999).ToString();

                // Lưu OTP vào Memory Cache (tự động xóa sau 1 phút)
                _otpCache.SetOTP(request.email, otpCode, request.type, TimeSpan.FromMinutes(1));

                // Gửi email OTP
                var emailSent = await _emailService.SendOTPEmailAsync(request.email, otpCode, request.type);

                if (!emailSent)
                {
                    _logger.LogWarning("Failed to send OTP email to {Email}, but OTP created: {OTP}", request.email, otpCode);
                }

                return Ok(new
                {
                    status = 200,
                    message = "Mã OTP đã được gửi đến email của bạn!",
                    data = new { email = request.email }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP to {Email}", request.email);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi gửi OTP!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Xác thực OTP
        /// POST /user.ctr/verify_otp
        /// Body: { "email": "...", "otpCode": "...", "type": "signup" | "forgot_password" }
        /// </summary>
        [HttpPost("verify_otp")]
        public async Task<IActionResult> verify_otp([FromBody] verify_otp_request request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.email) || 
                    string.IsNullOrWhiteSpace(request.otpCode) || 
                    string.IsNullOrWhiteSpace(request.type))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Vui lòng điền đầy đủ thông tin!",
                        data = (object?)null
                    });
                }

                if (request.type != "signup" && request.type != "forgot_password")
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Loại xác thực không hợp lệ!",
                        data = (object?)null
                    });
                }

                // Verify và xóa OTP từ cache
                var isValid = _otpCache.VerifyAndRemoveOTP(request.email, request.otpCode, request.type);

                if (!isValid)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Mã OTP không đúng hoặc đã hết hạn!",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Xác thực OTP thành công!",
                    data = new { email = request.email, verified = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP for {Email}", request.email);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xác thực OTP!",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// [TEST ONLY] Tạo tài khoản admin - XÓA SAU KHI DEPLOY
        /// POST /user.ctr/create_admin_test
        /// </summary>
        [HttpPost("create_admin_test")]
        public async Task<IActionResult> create_admin_test()
        {
            try
            {
                // Kiểm tra xem admin đã tồn tại chưa
                var existingAdmin = await _userRepo.GetByUsernameAsync("admin");
                if (existingAdmin != null)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Admin đã tồn tại!",
                        data = (object?)null
                    });
                }

                var admin = new user_model
                {
                    Name = "Administrator",
                    Email = "admin@nhanpet.com",
                    Username = "admin",
                    Password = "Xenlulozo1@",
                    Role = 1 // Admin role
                };
                
                var created = await _userRepo.CreateAsync(admin);
                
                return Ok(new
                {
                    status = 200,
                    message = "Admin created successfully!",
                    data = new { 
                        id = created.Id,
                        username = created.Username,
                        role = created.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi tạo admin!",
                    data = (object?)null
                });
            }
        }
    }
}

