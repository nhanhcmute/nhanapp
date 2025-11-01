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
            var mongoUrl = new MongoUrl(connectionString);
            var settings = MongoClientSettings.FromUrl(mongoUrl);

            // ✅ BẮT BUỘC: Fix lỗi TLS handshake trên Render
            settings.UseTls = true;
            settings.SslSettings = new SslSettings
            {
                EnabledSslProtocols = SslProtocols.Tls12,
                CheckCertificateRevocation = false
            };

            // ✅ Giảm timeout để tránh đơ khi mạng chậm
            settings.ConnectTimeout = TimeSpan.FromSeconds(20);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(20);
            settings.SocketTimeout = TimeSpan.FromSeconds(30);

            // ✅ Tạo client MongoDB
            var client = new MongoClient(settings);

            // ✅ Lấy tên database (tự fallback nếu thiếu)
            var databaseName = mongoUrl.DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
    }
}
