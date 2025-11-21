namespace ECommerceAI.DTOs.Checkout
{
    public class CheckoutPreviewRequest
    {
        public string? ShippingMethodId { get; set; }
        public string? CouponCode { get; set; }
        public ShippingAddressRequest ShippingAddress { get; set; } = new();
    }

    public class ShippingAddressRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string AddressLine { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = "Vietnam";
    }

    public class CheckoutPreviewResponse
    {
        public decimal SubtotalAmount { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string? CouponCode { get; set; }
        public string? ShippingMethodId { get; set; }
    }

    public class CreateOrderRequest
    {
        public string PaymentMethod { get; set; } = string.Empty; // COD, VNPAY, MOMO, ...
        public string? ShippingMethodId { get; set; }
        public string? CouponCode { get; set; }
        public ShippingAddressRequest ShippingAddress { get; set; } = new();
        public string? Note { get; set; }
    }
}

