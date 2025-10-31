using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface ICatRepo
    {
        Task<IEnumerable<CatModel>> GetAllAsync();
        Task<CatModel?> GetByIdAsync(string id);
        Task<CatModel?> GetByCatIdAsync(string catId);
        Task<PaginationResponse<CatModel>> GetPagedAsync(int page, int pageSize);
        Task<IEnumerable<CatModel>> SearchAsync(string searchTerm);
        Task<CatModel> CreateAsync(CatModel cat);
        Task<CatModel> UpdateAsync(string id, CatModel cat);
        Task<bool> DeleteAsync(string id);
        Task<long> CountAsync();
        Task<bool> BulkInsertAsync(IEnumerable<CatModel> cats);
    }
}

