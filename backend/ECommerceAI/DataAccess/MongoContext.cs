using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

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
                    "Example: \"ConnectionStrings\": { \"MongoDb\": \"mongodb+srv://ssnn01:xenlulozo1@nhanapp-cluster.yfdohhl.mongodb.net/pet_shop?retryWrites=true&w=majority\" }");
            }
            
            // Configure MongoDB client with SSL settings
            var mongoUrl = new MongoUrl(connectionString);
            var clientSettings = MongoClientSettings.FromUrl(mongoUrl);
            
            // Ensure SSL/TLS is enabled (MongoDB Atlas requires SSL)
            // mongodb+srv:// automatically enables TLS, but we'll set it explicitly
            clientSettings.UseTls = true;
            
            // Configure SSL settings if needed
            if (clientSettings.SslSettings == null)
            {
                clientSettings.SslSettings = new SslSettings();
            }
            clientSettings.SslSettings.CheckCertificateRevocation = false; // Disable certificate revocation check
            clientSettings.SslSettings.EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
            
            // Increase connection timeout
            clientSettings.ConnectTimeout = TimeSpan.FromSeconds(30);
            clientSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(30);
            clientSettings.SocketTimeout = TimeSpan.FromSeconds(30);
            
            var client = new MongoClient(clientSettings);
            var databaseName = mongoUrl.DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
    }
}

