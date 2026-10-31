using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IDogRepo
    {
        Task<IEnumerable<dog_model>> GetAllAsync();
        Task<dog_model?> GetByIdAsync(int id);
        Task<PaginationResponse<dog_model>> GetPagedAsync(int page, int pageSize);
        Task<IEnumerable<dog_model>> SearchAsync(string query);
        Task<long> CountAsync();
        Task<bool> BulkInsertAsync(IEnumerable<dog_model> dogs);
        Task<bool> DeleteAllAsync();
    }
}
