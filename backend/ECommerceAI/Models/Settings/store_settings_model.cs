using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Settings
{
    // Chỉ có duy nhất 1 document cấu hình cửa hàng trong collection này (Id cố định "store")
    public class store_settings_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = "store";

        [BsonElement("store_name")]
        public string StoreName { get; set; } = string.Empty;

        [BsonElement("store_logo")]
        public string? StoreLogo { get; set; } // base64 hoặc URL

        [BsonElement("contact_info")]
        public string ContactInfo { get; set; } = string.Empty;

        [BsonElement("payment_method")]
        public string PaymentMethod { get; set; } = string.Empty;

        [BsonElement("shipping_fee")]
        public decimal ShippingFee { get; set; }

        [BsonElement("shipping_partner")]
        public string ShippingPartner { get; set; } = string.Empty;

        [BsonElement("api_key")]
        public string ApiKey { get; set; } = string.Empty;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
