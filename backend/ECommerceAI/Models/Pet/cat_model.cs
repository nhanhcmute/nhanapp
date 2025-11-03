using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Pet
{
    public class cat_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("catId")]
        public string CatId { get; set; } = string.Empty; 

        [BsonElement("weight")]
        public cat_weight? Weight { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("image_data")]
        public string? ImageData { get; set; } 

        [BsonElement("cfa_url")]
        public string? CfaUrl { get; set; }

        [BsonElement("vetstreet_url")]
        public string? VetstreetUrl { get; set; }

        [BsonElement("vcahospitals_url")]
        public string? VcahospitalsUrl { get; set; }

        [BsonElement("temperament")]
        public string? Temperament { get; set; }

        [BsonElement("origin")]
        public string? Origin { get; set; }

        [BsonElement("country_codes")]
        public string? CountryCodes { get; set; }

        [BsonElement("country_code")]
        public string? CountryCode { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("life_span")]
        public string? LifeSpan { get; set; }

        [BsonElement("indoor")]
        public int Indoor { get; set; }

        [BsonElement("lap")]
        public int Lap { get; set; }

        [BsonElement("alt_names")]
        public string? AltNames { get; set; }

        // Ratings (1-5)
        [BsonElement("adaptability")]
        public int Adaptability { get; set; }

        [BsonElement("affection_level")]
        public int AffectionLevel { get; set; }

        [BsonElement("child_friendly")]
        public int ChildFriendly { get; set; }

        [BsonElement("dog_friendly")]
        public int DogFriendly { get; set; }

        [BsonElement("energy_level")]
        public int EnergyLevel { get; set; }

        [BsonElement("grooming")]
        public int Grooming { get; set; }

        [BsonElement("health_issues")]
        public int HealthIssues { get; set; }

        [BsonElement("intelligence")]
        public int Intelligence { get; set; }

        [BsonElement("shedding_level")]
        public int SheddingLevel { get; set; }

        [BsonElement("social_needs")]
        public int SocialNeeds { get; set; }

        [BsonElement("stranger_friendly")]
        public int StrangerFriendly { get; set; }

        [BsonElement("vocalisation")]
        public int Vocalisation { get; set; }

        // Flags
        [BsonElement("experimental")]
        public int Experimental { get; set; }

        [BsonElement("hairless")]
        public int Hairless { get; set; }

        [BsonElement("natural")]
        public int Natural { get; set; }

        [BsonElement("rare")]
        public int Rare { get; set; }

        [BsonElement("rex")]
        public int Rex { get; set; }

        [BsonElement("suppressed_tail")]
        public int SuppressedTail { get; set; }

        [BsonElement("short_legs")]
        public int ShortLegs { get; set; }

        [BsonElement("wikipedia_url")]
        public string? WikipediaUrl { get; set; }

        [BsonElement("hypoallergenic")]
        public int Hypoallergenic { get; set; }

        [BsonElement("reference_image_id")]
        public string? ReferenceImageId { get; set; }

        // Price được thêm khi import hoặc cập nhật
        [BsonElement("price")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal? Price { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class cat_weight
    {
        [BsonElement("imperial")]
        public string? Imperial { get; set; }

        [BsonElement("metric")]
        public string? Metric { get; set; }
    }
}

