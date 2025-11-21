using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Coupon
{
    public enum DiscountType
    {
        PERCENT,
        FIXED
    }

    public class coupon_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("code")]
        public string Code { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("discount_type")]
        [BsonRepresentation(BsonType.String)]
        public DiscountType DiscountType { get; set; } = DiscountType.PERCENT;

        [BsonElement("discount_value")]
        public decimal DiscountValue { get; set; }

        [BsonElement("min_order_amount")]
        public decimal MinOrderAmount { get; set; }

        [BsonElement("max_discount_amount")]
        public decimal? MaxDiscountAmount { get; set; }

        [BsonElement("start_date")]
        public DateTime StartDate { get; set; }

        [BsonElement("end_date")]
        public DateTime EndDate { get; set; }

        [BsonElement("usage_limit")]
        public int? UsageLimit { get; set; }

        [BsonElement("used_count")]
        public int UsedCount { get; set; } = 0;

        [BsonElement("status")]
        public string Status { get; set; } = "active"; // active, inactive, expired

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

