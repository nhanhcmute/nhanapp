using MongoDB.Driver;
using ECommerceAI.Models.Product;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Cart;
using ECommerceAI.Models.User;
using ECommerceAI.Models.Payment;
using ECommerceAI.Models.Coupon;
using ECommerceAI.Models.Notification;
using ECommerceAI.Models.Address;
using ECommerceAI.Models.Pet;

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

            // Coupons indexes - CouponRepo.GetByCodeAsync chạy trên mọi lần checkout/áp mã
            var couponsCollection = _database.GetCollection<coupon_model>("coupons");
            var couponsIndexes = new List<CreateIndexModel<coupon_model>>
            {
                new CreateIndexModel<coupon_model>(Builders<coupon_model>.IndexKeys.Ascending(c => c.Code)),
            };
            await couponsCollection.Indexes.CreateManyAsync(couponsIndexes);

            // Notifications indexes - NotificationRepo query theo UserId, sort theo CreatedAt, filter theo IsRead
            var notificationsCollection = _database.GetCollection<notification_model>("notifications");
            var notificationsIndexes = new List<CreateIndexModel<notification_model>>
            {
                new CreateIndexModel<notification_model>(
                    Builders<notification_model>.IndexKeys.Ascending(n => n.UserId).Descending(n => n.CreatedAt)),
                new CreateIndexModel<notification_model>(
                    Builders<notification_model>.IndexKeys.Ascending(n => n.UserId).Ascending(n => n.IsRead)),
            };
            await notificationsCollection.Indexes.CreateManyAsync(notificationsIndexes);

            // Addresses indexes - AddressRepo query theo user_id trên mọi lần load danh sách địa chỉ
            var addressesCollection = _database.GetCollection<address_model>("addresses");
            var addressesIndexes = new List<CreateIndexModel<address_model>>
            {
                new CreateIndexModel<address_model>(Builders<address_model>.IndexKeys.Ascending(a => a.user_id)),
            };
            await addressesCollection.Indexes.CreateManyAsync(addressesIndexes);

            // Order status logs indexes - OrderRepo.GetStatusLogsAsync query theo OrderId
            var orderStatusLogsCollection = _database.GetCollection<order_status_log_model>("order_status_logs");
            var orderStatusLogsIndexes = new List<CreateIndexModel<order_status_log_model>>
            {
                new CreateIndexModel<order_status_log_model>(Builders<order_status_log_model>.IndexKeys.Ascending(l => l.OrderId)),
            };
            await orderStatusLogsCollection.Indexes.CreateManyAsync(orderStatusLogsIndexes);

            // Dogs indexes - DogRepo query theo DogId
            var dogsCollection = _database.GetCollection<dog_model>("dogs");
            var dogsIndexes = new List<CreateIndexModel<dog_model>>
            {
                new CreateIndexModel<dog_model>(Builders<dog_model>.IndexKeys.Ascending(d => d.DogId)),
            };
            await dogsCollection.Indexes.CreateManyAsync(dogsIndexes);

            // Payment methods indexes - PaymentRepo.GetPaymentMethodByCodeAsync query theo Code
            var paymentMethodsCollection = _database.GetCollection<payment_method_model>("payment_methods");
            var paymentMethodsIndexes = new List<CreateIndexModel<payment_method_model>>
            {
                new CreateIndexModel<payment_method_model>(Builders<payment_method_model>.IndexKeys.Ascending(m => m.Code)),
            };
            await paymentMethodsCollection.Indexes.CreateManyAsync(paymentMethodsIndexes);
        }
    }
}

