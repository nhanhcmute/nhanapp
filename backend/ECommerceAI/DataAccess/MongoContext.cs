using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace ECommerceAI.DataAccess
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;

        public MongoContext(IConfiguration configuration)
        {
            // Priority: Environment variable > appsettings.json
            var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI") 
                ?? configuration.GetConnectionString("MongoDb");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException(
                    "MongoDB connection string not configured. Set MONGODB_URI env variable or ConnectionStrings:MongoDb in appsettings.json");
            }

            // Simple connection - let driver handle everything
            var client = new MongoClient(connectionString);
            
            var mongoUrl = new MongoUrl(connectionString);
            var databaseName = mongoUrl.DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
    }
}
