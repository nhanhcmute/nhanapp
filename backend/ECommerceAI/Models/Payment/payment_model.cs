using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Payment
{
    public enum PaymentTransactionStatus
    {
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }

    public class payment_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("order_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderId { get; set; } = string.Empty;

        [BsonElement("provider")]
        public string Provider { get; set; } = string.Empty; // VNPAY, MOMO, PAYPAL, INTERNAL_COD

        [BsonElement("provider_transaction_id")]
        public string? ProviderTransactionId { get; set; }

        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public PaymentTransactionStatus Status { get; set; } = PaymentTransactionStatus.PENDING;

        [BsonElement("amount")]
        public decimal Amount { get; set; }

        [BsonElement("currency")]
        public string Currency { get; set; } = "VND";

        [BsonElement("payment_url")]
        public string? PaymentUrl { get; set; }

        [BsonElement("raw_request")]
        public string? RawRequest { get; set; } // JSON text

        [BsonElement("raw_response")]
        public string? RawResponse { get; set; } // JSON text

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

