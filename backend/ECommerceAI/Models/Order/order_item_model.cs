using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace ECommerceAI.Models.Order

{

    public class order_item_model

    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id { get; set; } = string.Empty;



        [BsonElement("order_id")]

        public string OrderId { get; set; } = string.Empty;



        [BsonElement("product_id")]

        [BsonRepresentation(BsonType.String)]

        public string ProductId { get; set; } = string.Empty;



        [BsonElement("product_variant_id")]

        [BsonRepresentation(BsonType.String)]

        public string? ProductVariantId { get; set; }



        [BsonElement("product_name")]

        public string ProductName { get; set; } = string.Empty; // snapshot



        [BsonElement("sku")]

        public string Sku { get; set; } = string.Empty; // snapshot



        [BsonElement("quantity")]

        public int Quantity { get; set; }



        [BsonElement("unit_price")]

        public decimal UnitPrice { get; set; }



        [BsonElement("total_price")]

        public decimal TotalPrice { get; set; }

    }

}



