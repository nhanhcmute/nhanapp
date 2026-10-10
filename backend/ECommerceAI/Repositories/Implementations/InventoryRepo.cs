using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Product;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Repositories;

namespace ECommerceAI.Repositories.Implementations
{
    public class InventoryRepo : IInventoryRepo
    {
        private readonly IMongoCollection<inventory_movement_model> _movements;
        private readonly IMongoCollection<product_variant_model> _variants;

        public InventoryRepo(MongoContext context)
        {
            _movements = context.Database.GetCollection<inventory_movement_model>("inventory_movements");
            _variants = context.Database.GetCollection<product_variant_model>("product_variants");
        }

        public async Task<inventory_movement_model> CreateMovementAsync(inventory_movement_model movement)
        {
            movement.CreatedAt = DateTime.UtcNow;
            await _movements.InsertOneAsync(movement);
            return movement;
        }

        public async Task<product_variant_model?> GetProductVariantByIdAsync(string id)
        {
            var filter = MongoFilterHelpers.ById<product_variant_model>(id);
            return await _variants.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<Dictionary<string, product_variant_model>> GetVariantsByIdsAsync(IEnumerable<string> ids)
        {
            var result = new Dictionary<string, product_variant_model>();
            if (ids == null || !ids.Any()) return result;

            // Tách thành ObjectId và string thường, giống ProductRepo.GetByIdsAsync
            var objectIds = new List<ObjectId>();
            var stringIds = new List<string>();

            foreach (var id in ids.Distinct())
            {
                if (ObjectId.TryParse(id, out var parsedObjectId))
                {
                    objectIds.Add(parsedObjectId);
                }
                else
                {
                    stringIds.Add(id);
                }
            }

            var filters = new List<FilterDefinition<product_variant_model>>();
            if (objectIds.Any())
            {
                filters.Add(Builders<product_variant_model>.Filter.In("_id", objectIds));
            }
            if (stringIds.Any())
            {
                filters.Add(Builders<product_variant_model>.Filter.In("_id", stringIds));
            }

            if (filters.Any())
            {
                var combinedFilter = filters.Count == 1 ? filters[0] : Builders<product_variant_model>.Filter.Or(filters);
                var variants = await _variants.Find(combinedFilter).ToListAsync();

                foreach (var variant in variants)
                {
                    result[variant.Id] = variant;
                }
            }

            return result;
        }

        public async Task<product_variant_model> UpdateProductVariantAsync(string id, product_variant_model variant)
        {
            variant.UpdatedAt = DateTime.UtcNow;
            var filter = MongoFilterHelpers.ById<product_variant_model>(id);
            await _variants.ReplaceOneAsync(filter, variant);
            return variant;
        }
    }
}

