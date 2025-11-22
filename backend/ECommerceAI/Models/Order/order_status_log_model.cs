using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace ECommerceAI.Models.Order

{

    public class order_status_log_model

    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string Id { get; set; } = string.Empty;



        [BsonElement("order_id")]

        public string OrderId { get; set; } = string.Empty;



        [BsonElement("old_status")]

        [BsonRepresentation(BsonType.String)]

        public OrderStatus? OldStatus { get; set; }



        [BsonElement("new_status")]

        [BsonRepresentation(BsonType.String)]

        public OrderStatus NewStatus { get; set; }



        [BsonElement("changed_by_user_id")]

        public string? ChangedByUserId { get; set; }



        [BsonElement("note")]

        public string? Note { get; set; }



        [BsonElement("created_at")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }

}



