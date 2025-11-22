using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace ECommerceAI.Models.Payment

{

    public class payment_method_model

    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id { get; set; } = string.Empty;



        [BsonElement("code")]

        public string Code { get; set; } = string.Empty; // COD, VNPAY, MOMO, ...



        [BsonElement("display_name")]

        public string DisplayName { get; set; } = string.Empty;



        [BsonElement("is_active")]

        public bool IsActive { get; set; } = true;



        [BsonElement("config_json")]

        public string? ConfigJson { get; set; } // key, secret, callback url, ...



        [BsonElement("created_at")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        [BsonElement("updated_at")]

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }

}



