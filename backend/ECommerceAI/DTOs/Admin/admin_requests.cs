namespace ECommerceAI.DTOs.Admin
{
    public class OrderQueryRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Keyword { get; set; }
    }

    public class UpdateOrderRequest
    {
        public string? Status { get; set; }
        public string? AdminNote { get; set; }
    }
}

