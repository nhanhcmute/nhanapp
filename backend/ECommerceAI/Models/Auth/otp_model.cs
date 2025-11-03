using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.Auth
{
    public class otp_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("otpCode")]
        public string OtpCode { get; set; } = string.Empty;

        [BsonElement("type")]
        public string Type { get; set; } = string.Empty; // "signup" or "forgot_password"

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("isUsed")]
        public bool IsUsed { get; set; } = false;
    }

    public class send_otp_request
    {
        public string email { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty; // "signup" or "forgot_password"
        public string? username { get; set; } // Required for forgot_password
    }

    public class verify_otp_request
    {
        public string email { get; set; } = string.Empty;
        public string otpCode { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty; // "signup" or "forgot_password"
    }

    public class verify_otp_response
    {
        public bool isValid { get; set; }
        public string message { get; set; } = string.Empty;
    }
}

