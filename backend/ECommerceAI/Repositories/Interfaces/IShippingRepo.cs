using ECommerceAI.Models.Shipping;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IShippingRepo
    {
        Task<IEnumerable<shipping_method_model>> GetActiveShippingMethodsAsync();
        Task<shipping_method_model?> GetByIdAsync(string id);
    }
}

