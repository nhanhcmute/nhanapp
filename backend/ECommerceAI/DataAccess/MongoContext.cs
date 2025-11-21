using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace ECommerceAI.DataAccess
{
    public class MongoContext
    {
        private readonly IMongoDatabase _database;
        private static bool _indexesInitialized = false;
        private static readonly object _lock = new object();

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

            // Optimize connection settings
            var clientSettings = MongoClientSettings.FromConnectionString(connectionString);
            clientSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
            clientSettings.ConnectTimeout = TimeSpan.FromSeconds(5);
            clientSettings.SocketTimeout = TimeSpan.FromSeconds(10);
            clientSettings.MaxConnectionPoolSize = 100;
            clientSettings.MinConnectionPoolSize = 10;
            
            var client = new MongoClient(clientSettings);
            
            var mongoUrl = new MongoUrl(connectionString);
            var databaseName = mongoUrl.DatabaseName ?? "pet_shop";
            _database = client.GetDatabase(databaseName);

            // Initialize indexes once
            if (!_indexesInitialized)
            {
                lock (_lock)
                {
                    if (!_indexesInitialized)
                    {
                        InitializeIndexes();
                        _indexesInitialized = true;
                    }
                }
            }
        }

        private void InitializeIndexes()
        {
            try
            {
                var initializer = new IndexInitializer(_database);
                initializer.InitializeIndexesAsync().Wait();
            }
            catch (Exception ex)
            {
                // Log error but don't fail startup
                Console.WriteLine($"Warning: Failed to initialize indexes: {ex.Message}");
            }
        }

        public IMongoDatabase Database => _database;
    }
}
