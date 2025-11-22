using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(INotificationService notificationService, ILogger<NotificationController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] string userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { status = 400, message = "userId is required" });
                }

                var notifications = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
                return Ok(new { status = 200, message = "Success", data = notifications });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notifications");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount([FromQuery] string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { status = 400, message = "userId is required" });
                }

                var count = await _notificationService.GetUnreadCountAsync(userId);
                return Ok(new { status = 200, message = "Success", data = new { count } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unread count");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        [HttpPost("{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            try
            {
                await _notificationService.MarkAsReadAsync(id);
                return Ok(new { status = 200, message = "Marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking as read");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead([FromBody] string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(new { status = 400, message = "userId is required" });
                }

                await _notificationService.MarkAllAsReadAsync(userId);
                return Ok(new { status = 200, message = "All marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all as read");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }
    }
}
