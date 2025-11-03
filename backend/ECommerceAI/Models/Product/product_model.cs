using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Product
{
    public class product_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("price")]
        public string  Price { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("image")]
        public string? Image { get; set; } // Base64 image data

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("status")]
        public string Status { get; set; } = "Còn hàng"; // "Còn hàng", "Hết hàng", "Ngừng kinh doanh"

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

