using MongoDB.Driver;
using ECommerceAI.Models.Product;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Cart;
using ECommerceAI.Models.User;
using ECommerceAI.Models.Payment;

namespace ECommerceAI.DataAccess
{
    public class IndexInitializer
    {
        private readonly IMongoDatabase _database;

        public IndexInitializer(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task InitializeIndexesAsync()
        {
            // Products indexes
            var productsCollection = _database.GetCollection<product_model>("products");
            var productsIndexes = new List<CreateIndexModel<product_model>>
            {
                new CreateIndexModel<product_model>(Builders<product_model>.IndexKeys.Ascending(p => p.Name)),
                new CreateIndexModel<product_model>(Builders<product_model>.IndexKeys.Descending(p => p.CreatedAt)),
                new CreateIndexModel<product_model>(Builders<product_model>.IndexKeys.Ascending(p => p.Status)),
                new CreateIndexModel<product_model>(Builders<product_model>.IndexKeys.Ascending(p => p.Sku)),
            };
            await productsCollection.Indexes.CreateManyAsync(productsIndexes);

            // Orders indexes
            var ordersCollection = _database.GetCollection<order_model>("orders");
            var ordersIndexes = new List<CreateIndexModel<order_model>>
            {
                new CreateIndexModel<order_model>(Builders<order_model>.IndexKeys.Ascending(o => o.CustomerId)),
                new CreateIndexModel<order_model>(Builders<order_model>.IndexKeys.Ascending(o => o.OrderCode), new CreateIndexOptions { Unique = true }),
                new CreateIndexModel<order_model>(Builders<order_model>.IndexKeys.Descending(o => o.CreatedAt)),
                new CreateIndexModel<order_model>(Builders<order_model>.IndexKeys.Ascending(o => o.Status)),
                new CreateIndexModel<order_model>(Builders<order_model>.IndexKeys.Ascending(o => o.PaymentStatus)),
            };
            await ordersCollection.Indexes.CreateManyAsync(ordersIndexes);

            // Cart indexes
            var cartsCollection = _database.GetCollection<cart_model>("carts");
            var cartsIndexes = new List<CreateIndexModel<cart_model>>
            {
                new CreateIndexModel<cart_model>(Builders<cart_model>.IndexKeys.Ascending(c => c.CustomerId)),
                new CreateIndexModel<cart_model>(Builders<cart_model>.IndexKeys.Ascending(c => c.SessionId)),
                new CreateIndexModel<cart_model>(Builders<cart_model>.IndexKeys.Ascending(c => c.Status)),
            };
            await cartsCollection.Indexes.CreateManyAsync(cartsIndexes);

            // Cart Items indexes
            var cartItemsCollection = _database.GetCollection<cart_item_model>("cart_items");
            var cartItemsIndexes = new List<CreateIndexModel<cart_item_model>>
            {
                new CreateIndexModel<cart_item_model>(Builders<cart_item_model>.IndexKeys.Ascending(c => c.CartId)),
                new CreateIndexModel<cart_item_model>(Builders<cart_item_model>.IndexKeys.Ascending(c => c.ProductId)),
            };
            await cartItemsCollection.Indexes.CreateManyAsync(cartItemsIndexes);

            // Order Items indexes
            var orderItemsCollection = _database.GetCollection<order_item_model>("order_items");
            var orderItemsIndexes = new List<CreateIndexModel<order_item_model>>
            {
                new CreateIndexModel<order_item_model>(Builders<order_item_model>.IndexKeys.Ascending(o => o.OrderId)),
            };
            await orderItemsCollection.Indexes.CreateManyAsync(orderItemsIndexes);

            // Payments indexes
            var paymentsCollection = _database.GetCollection<payment_model>("payments");
            var paymentsIndexes = new List<CreateIndexModel<payment_model>>
            {
                new CreateIndexModel<payment_model>(Builders<payment_model>.IndexKeys.Ascending(p => p.OrderId)),
                new CreateIndexModel<payment_model>(Builders<payment_model>.IndexKeys.Descending(p => p.CreatedAt)),
            };
            await paymentsCollection.Indexes.CreateManyAsync(paymentsIndexes);

            // Users indexes
            var usersCollection = _database.GetCollection<user_model>("users");
            var usersIndexes = new List<CreateIndexModel<user_model>>
            {
                new CreateIndexModel<user_model>(Builders<user_model>.IndexKeys.Ascending(u => u.Username), new CreateIndexOptions { Unique = true }),
                new CreateIndexModel<user_model>(Builders<user_model>.IndexKeys.Ascending(u => u.Email)),
            };
            await usersCollection.Indexes.CreateManyAsync(usersIndexes);
        }
    }
}

