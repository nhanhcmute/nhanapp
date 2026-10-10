using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Shipping;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Repositories;

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
            var filter = MongoFilterHelpers.ById<shipping_method_model>(id);
            return await _shippingMethods.Find(filter).FirstOrDefaultAsync();
        }
    }
}

