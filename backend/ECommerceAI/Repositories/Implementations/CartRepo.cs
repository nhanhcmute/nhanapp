using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Cart;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class CartRepo : ICartRepo
    {
        private readonly IMongoCollection<cart_model> _carts;
        private readonly IMongoCollection<cart_item_model> _cartItems;

        public CartRepo(MongoContext context)
        {
            _carts = context.Database.GetCollection<cart_model>("carts");
            _cartItems = context.Database.GetCollection<cart_item_model>("cart_items");
        }

        public async Task<cart_model?> GetByCustomerIdAsync(string customerId)
        {
            var filter = Builders<cart_model>.Filter.Eq(c => c.CustomerId, customerId) &
                         Builders<cart_model>.Filter.Eq(c => c.Status, "active");
            return await _carts.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<cart_model?> GetBySessionIdAsync(string sessionId)
        {
            var filter = Builders<cart_model>.Filter.Eq(c => c.SessionId, sessionId) &
                         Builders<cart_model>.Filter.Eq(c => c.Status, "active");
            return await _carts.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<cart_model> CreateAsync(cart_model cart)
        {
            cart.CreatedAt = DateTime.UtcNow;
            cart.UpdatedAt = DateTime.UtcNow;
            await _carts.InsertOneAsync(cart);
            return cart;
        }

        public async Task<cart_model> UpdateAsync(string id, cart_model cart)
        {
            cart.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<cart_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<cart_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<cart_model>.Filter.Eq("_id", id);
            }
            await _carts.ReplaceOneAsync(filter, cart);
            return cart;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            FilterDefinition<cart_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<cart_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<cart_model>.Filter.Eq("_id", id);
            }
            var result = await _carts.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<cart_item_model>> GetCartItemsAsync(string cartId)
        {
            var filter = Builders<cart_item_model>.Filter.Eq(c => c.CartId, cartId);
            return await _cartItems.Find(filter).ToListAsync();
        }

        public async Task<cart_item_model> AddCartItemAsync(cart_item_model item)
        {
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;
            await _cartItems.InsertOneAsync(item);
            return item;
        }

        public async Task<cart_item_model?> GetCartItemByIdAsync(string itemId)
        {
            FilterDefinition<cart_item_model> filter;
            if (ObjectId.TryParse(itemId, out var parsedObjectId))
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", itemId);
            }
            return await _cartItems.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<cart_item_model> UpdateCartItemAsync(string itemId, cart_item_model item)
        {
            item.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<cart_item_model> filter;
            if (ObjectId.TryParse(itemId, out var parsedObjectId))
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", itemId);
            }
            await _cartItems.ReplaceOneAsync(filter, item);
            return item;
        }

        public async Task<bool> DeleteCartItemAsync(string itemId)
        {
            FilterDefinition<cart_item_model> filter;
            if (ObjectId.TryParse(itemId, out var parsedObjectId))
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<cart_item_model>.Filter.Eq("_id", itemId);
            }
            var result = await _cartItems.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<bool> ClearCartItemsAsync(string cartId)
        {
            var filter = Builders<cart_item_model>.Filter.Eq(c => c.CartId, cartId);
            var result = await _cartItems.DeleteManyAsync(filter);
            return result.DeletedCount > 0;
        }
    }
}

