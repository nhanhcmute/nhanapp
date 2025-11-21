using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Cart
{
    public class cart_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("customer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CustomerId { get; set; }

        [BsonElement("session_id")]
        public string? SessionId { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "active"; // active, converted_to_order, abandoned

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

