using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Product
{
    public class inventory_movement_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("product_variant_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProductVariantId { get; set; } = string.Empty;

        [BsonElement("change_quantity")]
        public int ChangeQuantity { get; set; } // âm/dương

        [BsonElement("reason")]
        public string Reason { get; set; } = string.Empty; // order_created, order_cancelled, manual_adjust, ...

        [BsonElement("reference_type")]
        public string ReferenceType { get; set; } = string.Empty; // order, import, ...

        [BsonElement("reference_id")]
        public string? ReferenceId { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

