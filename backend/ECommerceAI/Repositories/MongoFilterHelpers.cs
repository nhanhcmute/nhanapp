using MongoDB.Bson;
using MongoDB.Driver;

namespace ECommerceAI.Repositories
{
    // Dùng chung cho các repo cần filter theo "_id", vốn có thể là ObjectId (24 ký tự hex)
    // hoặc string thường (ví dụ id được generate thủ công) tùy vào dữ liệu đã lưu.
    public static class MongoFilterHelpers
    {
        public static FilterDefinition<T> ById<T>(string id)
        {
            return ObjectId.TryParse(id, out var parsedObjectId)
                ? Builders<T>.Filter.Eq("_id", parsedObjectId)
                : Builders<T>.Filter.Eq("_id", id);
        }
    }
}
