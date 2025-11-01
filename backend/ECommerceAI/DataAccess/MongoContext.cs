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
            
            var client = new MongoClient(connectionString);
            var databaseName = new MongoUrl(connectionString).DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;
    }
}

