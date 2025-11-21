using ECommerceAI.Models.Cart;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface ICartRepo
    {
        Task<cart_model?> GetByCustomerIdAsync(string customerId);
        Task<cart_model?> GetBySessionIdAsync(string sessionId);
        Task<cart_model> CreateAsync(cart_model cart);
        Task<cart_model> UpdateAsync(string id, cart_model cart);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<cart_item_model>> GetCartItemsAsync(string cartId);
        Task<cart_item_model> AddCartItemAsync(cart_item_model item);
        Task<cart_item_model?> GetCartItemByIdAsync(string itemId);
        Task<cart_item_model> UpdateCartItemAsync(string itemId, cart_item_model item);
        Task<bool> DeleteCartItemAsync(string itemId);
        Task<bool> ClearCartItemsAsync(string cartId);
    }
}

