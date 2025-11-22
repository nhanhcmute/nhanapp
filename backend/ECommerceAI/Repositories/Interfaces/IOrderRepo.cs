using ECommerceAI.Models.Order;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IOrderRepo
    {
        Task<order_model> CreateAsync(order_model order);
        Task<order_model?> GetByIdAsync(string id);
        Task<order_model?> GetByOrderCodeAsync(string orderCode);
        Task<order_model> UpdateAsync(string id, order_model order);
        Task<PaginationResponse<order_model>> GetByCustomerIdAsync(string customerId, int page, int pageSize);
        Task<PaginationResponse<order_model>> GetOrdersAsync(int page, int pageSize, OrderStatus? status = null, PaymentStatus? paymentStatus = null, DateTime? dateFrom = null, DateTime? dateTo = null, string? keyword = null);
        Task<PaginationResponse<order_model>> GetAvailableForShipperAsync(int page, int pageSize);
        Task<PaginationResponse<order_model>> GetByShipperIdAsync(string shipperId, int page, int pageSize, OrderStatus? status = null);
        Task<IEnumerable<order_item_model>> GetOrderItemsAsync(string orderId);
        Task<order_item_model> AddOrderItemAsync(order_item_model item);
        Task<order_status_log_model> AddStatusLogAsync(order_status_log_model log);
        Task<IEnumerable<order_status_log_model>> GetStatusLogsAsync(string orderId);
        Task<string> GenerateOrderCodeAsync();
    }
}

