using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace ECommerceAI.Models.Product

{

    public class product_model

    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id { get; set; } = string.Empty;



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("sku")]

        public string Sku { get; set; } = string.Empty;



        [BsonElement("description")]

        public string Description { get; set; } = string.Empty;



        [BsonElement("base_price")]

        public decimal BasePrice { get; set; }



        [BsonElement("price")]

        public string  Price { get; set; }



        [BsonElement("quantity")]

        public int Quantity { get; set; }



        [BsonElement("image")]

        public string? Image { get; set; } // Base64 image data (bản gốc, dùng cho trang chi tiết)



        [BsonElement("thumbnail_image")]

        public string? ThumbnailImage { get; set; } // Base64 image đã resize/nén, dùng cho các API trả danh sách



        [BsonElement("status")]

        public string Status { get; set; } = "Còn hàng"; // "Còn hàng", "Hết hàng", "Ngừng kinh doanh"



        [BsonElement("pet_type")]

        public string PetType { get; set; } = "Cả hai"; // "Mèo", "Chó", "Cả hai"



        [BsonElement("category")]

        public string Category { get; set; } = "Khác"; // "Thức ăn", "Đồ chơi", "Phụ kiện", "Vệ sinh", "Y tế", "Khác"



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        [BsonElement("updatedAt")]

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }



    // Request models để tránh lỗi 415 Unsupported Media Type

    public class GetProductByIdRequest

    {

        public string id { get; set; } = string.Empty;

    }



    public class SearchRequest

    {

        public string query { get; set; } = string.Empty;

        public int? page { get; set; }

        public int? page_size { get; set; }

    }



    public class SortRequest

    {

        public string sort_by { get; set; } = string.Empty;

        public int? page { get; set; }

        public int? page_size { get; set; }

    }



    public class DeleteProductRequest

    {

        public string id { get; set; } = string.Empty;

    }

}



