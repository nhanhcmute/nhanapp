namespace ECommerceAI.DTOs.Cart
{
    public class AddCartItemRequest
    {
        public string ProductId { get; set; } = string.Empty;
        public string? ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }

    public class CartResponse
    {
        public string Id { get; set; } = string.Empty;
        public string? CustomerId { get; set; }
        public string? SessionId { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<CartItemResponse> Items { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CartItemResponse
    {
        public string Id { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string? ProductVariantId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? VariantName { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}

