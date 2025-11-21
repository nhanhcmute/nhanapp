using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Coupon
{
    public class order_coupon_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("order_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderId { get; set; } = string.Empty;

        [BsonElement("coupon_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CouponId { get; set; } = string.Empty;

        [BsonElement("discount_amount")]
        public decimal DiscountAmount { get; set; }
    }
}

