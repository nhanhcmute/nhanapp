using ECommerceAI.Models.Pet;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IDogRepo
    {
        Task<IEnumerable<dog_model>> GetAllAsync();
        Task<dog_model?> GetByIdAsync(int id);
        Task<IEnumerable<dog_model>> SearchAsync(string query);
        Task<long> CountAsync();
        Task<bool> BulkInsertAsync(IEnumerable<dog_model> dogs);
        Task<bool> DeleteAllAsync();
    }
}
