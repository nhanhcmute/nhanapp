using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Notification
{
    public class notification_model
    {
        [BsonId]
        public string Id { get; set; }

        [BsonElement("user_id")]
        public string UserId { get; set; }

        [BsonElement("title")]
        public string Title { get; set; }

        [BsonElement("message")]
        public string Message { get; set; }

        [BsonElement("type")]
        public string Type { get; set; } // ORDER_STATUS, PROMOTION, SYSTEM, etc.

        [BsonElement("link")]
        public string Link { get; set; } // /orders/123

        [BsonElement("is_read")]
        public bool IsRead { get; set; } = false;

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("read_at")]
        public DateTime? ReadAt { get; set; }
    }
}
