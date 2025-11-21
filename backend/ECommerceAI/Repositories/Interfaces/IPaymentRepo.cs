using ECommerceAI.Models.Payment;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IPaymentRepo
    {
        Task<payment_model> CreateAsync(payment_model payment);
        Task<payment_model?> GetByIdAsync(string id);
        Task<payment_model?> GetByOrderIdAsync(string orderId);
        Task<payment_model> UpdateAsync(string id, payment_model payment);
        Task<IEnumerable<payment_method_model>> GetActivePaymentMethodsAsync();
        Task<payment_method_model?> GetPaymentMethodByCodeAsync(string code);
    }
}

