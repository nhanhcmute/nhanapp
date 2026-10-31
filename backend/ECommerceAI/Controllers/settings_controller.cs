using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Settings;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("settings.ctr")]
    public class settings_controller : ControllerBase
    {
        private readonly ISettingsRepo _settingsRepo;
        private readonly ILogger<settings_controller> _logger;

        public settings_controller(ISettingsRepo settingsRepo, ILogger<settings_controller> logger)
        {
            _settingsRepo = settingsRepo;
            _logger = logger;
        }

        /// <summary>
        /// Lấy cấu hình cửa hàng hiện tại
        /// POST /settings.ctr/get
        /// </summary>
        [HttpPost("get")]
        public async Task<IActionResult> get()
        {
            try
            {
                var settings = await _settingsRepo.GetAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = settings
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting store settings");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy cấu hình cửa hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Cập nhật cấu hình cửa hàng
        /// POST /settings.ctr/update
        /// </summary>
        [HttpPost("update")]
        public async Task<IActionResult> update([FromBody] store_settings_model settings)
        {
            try
            {
                var updated = await _settingsRepo.UpdateAsync(settings);
                return Ok(new
                {
                    status = 200,
                    message = "Lưu cài đặt thành công",
                    data = updated
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating store settings");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lưu cài đặt",
                    data = (object?)null
                });
            }
        }
    }
}
