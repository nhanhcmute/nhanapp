using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Customer
{
    public class customer_profile_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("full_name")]
        public string FullName { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("default_shipping_address_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? DefaultShippingAddressId { get; set; }

        [BsonElement("default_billing_address_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? DefaultBillingAddressId { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

