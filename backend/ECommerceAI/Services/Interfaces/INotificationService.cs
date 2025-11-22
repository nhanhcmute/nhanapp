using ECommerceAI.Models.Notification;

namespace ECommerceAI.Services.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(string userId, string title, string message, string type, string link);
        Task<IEnumerable<notification_model>> GetUserNotificationsAsync(string userId, int page, int pageSize);
        Task<long> GetUnreadCountAsync(string userId);
        Task MarkAsReadAsync(string id);
        Task MarkAllAsReadAsync(string userId);
    }
}
