using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Cart
{
    public class cart_item_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("cart_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CartId { get; set; } = string.Empty;

        [BsonElement("product_id")]
        [BsonRepresentation(BsonType.String)]
        public string ProductId { get; set; } = string.Empty;

        [BsonElement("product_variant_id")]
        [BsonRepresentation(BsonType.String)]
        public string? ProductVariantId { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("unit_price")]
        public decimal UnitPrice { get; set; } // snapshot giá tại thời điểm add

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

