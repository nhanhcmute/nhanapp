using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace ECommerceAI.Models.Address
{
    public class address_model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string user_id { get; set; }

        // Thông tin người nhận
        public string full_name { get; set; }
        public string phone { get; set; }

        // Tỉnh/Quận/Phường: code + name (khớp FE)
        public string province { get; set; }
        public string province_name { get; set; }
        public string district { get; set; }        // code
        public string district_name { get; set; }
        public string ward { get; set; }            // code
        public string ward_name { get; set; }

        // Địa chỉ chi tiết
        public string street { get; set; }          // Tên đường/Số nhà
        public string? details { get; set; }        // Ghi chú thêm (nếu có)
        public string address_type { get; set; }    // home | office

        // Mặc định
        public bool is_default { get; set; } = false;

        // Tuỳ chọn vị trí (nếu có)
        public GeoJsonPoint<GeoJson2DGeographicCoordinates>? location { get; set; }

        // Trạng thái & audit
        public bool is_active { get; set; } = true;
        public DateTime created_at { get; set; } = DateTime.UtcNow;
        public DateTime updated_at { get; set; } = DateTime.UtcNow;

        // NOTE: GeoJSON yêu cầu (lon, lat)
        public static GeoJsonPoint<GeoJson2DGeographicCoordinates> make_point(double lat, double lon) =>
            new(new GeoJson2DGeographicCoordinates(lon, lat));
    }
}
