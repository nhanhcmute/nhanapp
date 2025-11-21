using System.Text.Json.Serialization;

namespace ECommerceAI.DTOs.Address
{
    public class get_all_by_user_request
    {
        public string? user_id { get; set; }
    }

    public class get_by_id_request
    {
        public string? id { get; set; }
    }

    public class delete_request
    {
        public string? id { get; set; }
    }

    public class set_default_request
    {
        public string? user_id { get; set; }
        public string? id { get; set; }
    }

    public class address_create_request
    {
        public string? user_id { get; set; }
        public string? fullName { get; set; }
        public string? phone { get; set; }
        public string? province { get; set; }
        public string? provinceName { get; set; }
        public string? district { get; set; }
        public string? districtName { get; set; }
        public string? ward { get; set; }
        public string? wardName { get; set; }
        public string? street { get; set; }
        public string? details { get; set; }
        public string? addressType { get; set; }
        public bool isDefault { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
    }

    public class address_update_request
    {
        public string? id { get; set; }                 // bắt buộc
        public string? fullName { get; set; }
        public string? phone { get; set; }
        public string? province { get; set; }
        public string? provinceName { get; set; }
        public string? district { get; set; }
        public string? districtName { get; set; }
        public string? ward { get; set; }
        public string? wardName { get; set; }
        public string? street { get; set; }
        public string? details { get; set; }
        public string? addressType { get; set; }
        public bool? isDefault { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
    }
}
