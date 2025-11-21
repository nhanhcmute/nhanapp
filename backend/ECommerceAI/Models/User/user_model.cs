using System;
using System.Collections.Generic;
using ECommerceAI.Models.Address;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ECommerceAI.Models.User
{
    public class user_model
    {

        public user_model()
        {
            address = new List<address_model>();
        }

        public  List<address_model> address { get; set; }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("username")]
        public string Username { get; set; } = string.Empty;

        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("birthday")]
        public DateTime Birthday { get; set; } = DateTime.UtcNow;

        // 1 = Admin, 2 = User
        [BsonElement("role")]
        public int Role { get; set; } = 2;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("lastLogin")]
        public DateTime? LastLogin { get; set; }
    }

    public class login_request
    {
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }

    public class login_response
    {
        public string id { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string username { get; set; } = string.Empty;

        // đổi từ string -> int
        public int role { get; set; } = 2;

        public DateTime? lastLogin { get; set; }
    }

    public class signup_request
    {
        public string name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;

        // nếu bạn cho phép admin tạo user kèm role
        public int role { get; set; } = 2;
    }

    public class forgot_password_request
    {
        public string username { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
    }

    public class reset_password_request
    {
        public string username { get; set; } = string.Empty;
        public string new_password { get; set; } = string.Empty;
    }
}
