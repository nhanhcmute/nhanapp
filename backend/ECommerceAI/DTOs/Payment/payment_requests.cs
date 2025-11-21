namespace ECommerceAI.DTOs.Payment
{
    public class InitPaymentRequest
    {
        public string OrderId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty; // VNPAY, MOMO, PAYPAL
    }

    public class PaymentResponse
    {
        public string PaymentId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class PaymentStatusResponse
    {
        public string PaymentId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}

