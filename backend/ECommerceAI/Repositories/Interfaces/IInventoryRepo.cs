using ECommerceAI.Models.Product;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IInventoryRepo
    {
        Task<inventory_movement_model> CreateMovementAsync(inventory_movement_model movement);
        Task<product_variant_model?> GetProductVariantByIdAsync(string id);
        Task<product_variant_model> UpdateProductVariantAsync(string id, product_variant_model variant);
    }
}

