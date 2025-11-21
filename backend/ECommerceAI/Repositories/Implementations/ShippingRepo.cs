using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Shipping;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class ShippingRepo : IShippingRepo
    {
        private readonly IMongoCollection<shipping_method_model> _shippingMethods;

        public ShippingRepo(MongoContext context)
        {
            _shippingMethods = context.Database.GetCollection<shipping_method_model>("shipping_methods");
        }

        public async Task<IEnumerable<shipping_method_model>> GetActiveShippingMethodsAsync()
        {
            var filter = Builders<shipping_method_model>.Filter.Eq(s => s.IsActive, true);
            return await _shippingMethods.Find(filter).ToListAsync();
        }

        public async Task<shipping_method_model?> GetByIdAsync(string id)
        {
            FilterDefinition<shipping_method_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<shipping_method_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<shipping_method_model>.Filter.Eq("_id", id);
            }
            return await _shippingMethods.Find(filter).FirstOrDefaultAsync();
        }
    }
}

