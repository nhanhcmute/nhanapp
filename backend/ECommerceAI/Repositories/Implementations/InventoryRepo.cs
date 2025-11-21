using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Product;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

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
            FilterDefinition<product_variant_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<product_variant_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<product_variant_model>.Filter.Eq("_id", id);
            }
            return await _variants.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<product_variant_model> UpdateProductVariantAsync(string id, product_variant_model variant)
        {
            variant.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<product_variant_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<product_variant_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<product_variant_model>.Filter.Eq("_id", id);
            }
            await _variants.ReplaceOneAsync(filter, variant);
            return variant;
        }
    }
}

