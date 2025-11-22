using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;



namespace ECommerceAI.Models.Pet

{

    public class dog_model

    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }



        [BsonElement("dogId")]

        public int DogId { get; set; }



        [BsonElement("weight")]

        public dog_weight? Weight { get; set; }



        [BsonElement("height")]

        public dog_height? Height { get; set; }



        [BsonElement("name")]

        public string Name { get; set; } = string.Empty;



        [BsonElement("bred_for")]

        public string? BredFor { get; set; }



        [BsonElement("breed_group")]

        public string? BreedGroup { get; set; }



        [BsonElement("life_span")]

        public string? LifeSpan { get; set; }



        [BsonElement("temperament")]

        public string? Temperament { get; set; }



        [BsonElement("origin")]

        public string? Origin { get; set; }



        [BsonElement("reference_image_id")]

        public string? ReferenceImageId { get; set; }



        [BsonElement("image")]

        public string? Image { get; set; }



        [BsonElement("createdAt")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        [BsonElement("updatedAt")]

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }



    public class dog_weight

    {

        [BsonElement("imperial")]

        public string? Imperial { get; set; }



        [BsonElement("metric")]

        public string? Metric { get; set; }

    }



    public class dog_height

    {

        [BsonElement("imperial")]

        public string? Imperial { get; set; }



        [BsonElement("metric")]

        public string? Metric { get; set; }

    }

}

