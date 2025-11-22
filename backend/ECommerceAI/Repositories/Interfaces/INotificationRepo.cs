using ECommerceAI.Models.Notification;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface INotificationRepo
    {
        Task<notification_model> CreateAsync(notification_model notification);
        Task<IEnumerable<notification_model>> GetByUserIdAsync(string userId, int page, int pageSize);
        Task<long> GetUnreadCountAsync(string userId);
        Task MarkAsReadAsync(string id);
        Task MarkAllAsReadAsync(string userId);
        Task<notification_model> GetByIdAsync(string id);
    }
}
