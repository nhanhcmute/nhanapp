using ECommerceAI.Models.Product;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IProductRepo
    {
        Task<IEnumerable<product_model>> GetAllAsync();
        Task<product_model?> GetByIdAsync(string id);
        Task<Dictionary<string, product_model>> GetByIdsAsync(IEnumerable<string> ids); // Batch load để tối ưu
        Task<PaginationResponse<product_model>> GetPagedAsync(int page, int pageSize);
        Task<IEnumerable<product_model>> SearchAsync(string searchTerm);
        Task<PaginationResponse<product_model>> SearchPagedAsync(string searchTerm, int page, int pageSize);
        Task<product_model> CreateAsync(product_model product);
        Task<product_model> UpdateAsync(string id, product_model product);
        Task<bool> DeleteAsync(string id);
        Task<long> CountAsync();
        Task<IEnumerable<product_model>> GetSortedAsync(string sortBy);
        Task<PaginationResponse<product_model>> GetSortedPagedAsync(string sortBy, int page, int pageSize);
    }
}

