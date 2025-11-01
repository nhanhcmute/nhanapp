using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Security.Authentication;

namespace ECommerceAI.DataAccess
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDb");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException(
                    "MongoDB connection string is not configured. " +
                    "Please add 'ConnectionStrings:MongoDb' to appsettings.json. " +
                    "Example: \"ConnectionStrings\": { \"MongoDb\": \"mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&tls=true\" }");
            }

            // Parse MongoDB connection
            // Note: mongodb+srv:// automatically enables TLS, so we let driver handle it
            var mongoUrl = new MongoUrl(connectionString);
            
            // ✅ Đơn giản hóa: Để MongoDB driver tự xử lý SSL/TLS
            // mongodb+srv:// tự động enable TLS, không cần config thủ công
            var settings = MongoClientSettings.FromUrl(mongoUrl);
            
            // ✅ Chỉ tăng timeout nếu cần
            settings.ConnectTimeout = TimeSpan.FromSeconds(30);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(30);
            
            // ✅ Tạo client MongoDB
            var client = new MongoClient(settings);

            // ✅ Lấy tên database (tự fallback nếu thiếu)
            var databaseName = mongoUrl.DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
    }
}
