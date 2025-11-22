using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface ICatRepo
    {
        Task<IEnumerable<cat_model>> GetAllAsync();
        Task<cat_model?> GetByIdAsync(string id);
        Task<cat_model?> GetByCatIdAsync(string catId);
        Task<PaginationResponse<cat_model>> GetPagedAsync(int page, int pageSize);
        Task<IEnumerable<cat_model>> SearchAsync(string searchTerm);
        Task<cat_model> CreateAsync(cat_model cat);
        Task<cat_model> UpdateAsync(string id, cat_model cat);
        Task<bool> DeleteAsync(string id);
        Task<long> CountAsync();
        Task<bool> BulkInsertAsync(IEnumerable<cat_model> cats);
        Task<bool> DeleteAllAsync();
    }
}

