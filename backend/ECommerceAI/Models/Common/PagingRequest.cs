namespace ECommerceAI.Models.Common
{
    public class PagingRequest
    {
        public int page { get; set; } = 1;
        public int page_size { get; set; } = 9;
        public string? pet_type { get; set; } // Lọc theo loài: "Mèo", "Chó" (bỏ trống = không lọc)
        public string? category { get; set; } // Lọc theo loại sản phẩm: "Thức ăn", "Đồ chơi"... (bỏ trống = không lọc)
    }
}