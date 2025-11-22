using ECommerceAI.DataAccess;
using ECommerceAI.Models.Notification;
using ECommerceAI.Repositories.Interfaces;
using MongoDB.Driver;

namespace ECommerceAI.Repositories.Implementations
{
    public class NotificationRepo : INotificationRepo
    {
        private readonly IMongoCollection<notification_model> _context;

        public NotificationRepo(MongoContext context)
        {
            _context = context.Database.GetCollection<notification_model>("notifications");
        }

        public async Task<notification_model> CreateAsync(notification_model notification)
        {
            await _context.InsertOneAsync(notification);
            return notification;
        }

        public async Task<IEnumerable<notification_model>> GetByUserIdAsync(string userId, int page, int pageSize)
        {
            return await _context.Find(n => n.UserId == userId)
                                 .SortByDescending(n => n.CreatedAt)
                                 .Skip((page - 1) * pageSize)
                                 .Limit(pageSize)
                                 .ToListAsync();
        }

        public async Task<long> GetUnreadCountAsync(string userId)
        {
            return await _context.CountDocumentsAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<notification_model> GetByIdAsync(string id)
        {
            return await _context.Find(n => n.Id == id).FirstOrDefaultAsync();
        }

        public async Task MarkAsReadAsync(string id)
        {
            var update = Builders<notification_model>.Update
                .Set(n => n.IsRead, true)
                .Set(n => n.ReadAt, DateTime.UtcNow);

            await _context.UpdateOneAsync(n => n.Id == id, update);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            var update = Builders<notification_model>.Update
                .Set(n => n.IsRead, true)
                .Set(n => n.ReadAt, DateTime.UtcNow);

            await _context.UpdateManyAsync(n => n.UserId == userId && !n.IsRead, update);
        }
    }
}
