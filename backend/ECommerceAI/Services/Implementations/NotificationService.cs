using ECommerceAI.Models.Notification;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepo _notificationRepo;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(INotificationRepo notificationRepo, ILogger<NotificationService> logger)
        {
            _notificationRepo = notificationRepo;
            _logger = logger;
        }

        public async Task CreateNotificationAsync(string userId, string title, string message, string type, string link)
        {
            try
            {
                var notification = new notification_model
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = type,
                    Link = link
                };

                await _notificationRepo.CreateAsync(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification");
                // Don't throw exception to avoid breaking the main flow (e.g. order creation)
            }
        }

        public async Task<IEnumerable<notification_model>> GetUserNotificationsAsync(string userId, int page, int pageSize)
        {
            return await _notificationRepo.GetByUserIdAsync(userId, page, pageSize);
        }

        public async Task<long> GetUnreadCountAsync(string userId)
        {
            return await _notificationRepo.GetUnreadCountAsync(userId);
        }

        public async Task MarkAsReadAsync(string id)
        {
            await _notificationRepo.MarkAsReadAsync(id);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            await _notificationRepo.MarkAllAsReadAsync(userId);
        }
    }
}
