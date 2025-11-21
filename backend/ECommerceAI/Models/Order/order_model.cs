using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Order
{
    public enum OrderStatus
    {
        PENDING_PAYMENT,
        PENDING_CONFIRM,
        PAID,
        PROCESSING,
        SHIPPING,
        COMPLETED,
        CANCELLED,
        PAYMENT_FAILED
    }

    public enum PaymentStatus
    {
        NONE,
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    public class order_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("order_code")]
        public string OrderCode { get; set; } = string.Empty; // VD: DH20251115-0001

        [BsonElement("customer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CustomerId { get; set; }

        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public OrderStatus Status { get; set; } = OrderStatus.PENDING_PAYMENT;

        [BsonElement("payment_method")]
        public string PaymentMethod { get; set; } = string.Empty; // COD, VNPAY, MOMO, PAYPAL, ...

        [BsonElement("payment_status")]
        [BsonRepresentation(BsonType.String)]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.NONE;

        [BsonElement("shipping_method_id")]
        [BsonRepresentation(BsonType.String)]
        public string? ShippingMethodId { get; set; }

        [BsonElement("shipping_full_name")]
        public string ShippingFullName { get; set; } = string.Empty;

        [BsonElement("shipping_phone")]
        public string ShippingPhone { get; set; } = string.Empty;

        [BsonElement("shipping_address_line")]
        public string ShippingAddressLine { get; set; } = string.Empty;

        [BsonElement("shipping_ward")]
        public string ShippingWard { get; set; } = string.Empty;

        [BsonElement("shipping_district")]
        public string ShippingDistrict { get; set; } = string.Empty;

        [BsonElement("shipping_city")]
        public string ShippingCity { get; set; } = string.Empty;

        [BsonElement("shipping_country")]
        public string ShippingCountry { get; set; } = "Vietnam";

        [BsonElement("subtotal_amount")]
        public decimal SubtotalAmount { get; set; }

        [BsonElement("shipping_fee")]
        public decimal ShippingFee { get; set; }

        [BsonElement("discount_amount")]
        public decimal DiscountAmount { get; set; }

        [BsonElement("total_amount")]
        public decimal TotalAmount { get; set; }

        [BsonElement("note")]
        public string? Note { get; set; }

        [BsonElement("admin_note")]
        public string? AdminNote { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

