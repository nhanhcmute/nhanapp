using ECommerceAI.Models.Address;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IAddressRepo
    {
        string GenerateId();
        Task<List<address_model>> GetByUserIdAsync(string user_id);
        Task<address_model?> GetByIdAsync(string id);
        Task<address_model> CreateAsync(address_model model, bool setDefault);
        Task<address_model> UpdateAsync(string id, address_model updated, bool setDefault);
        Task<bool> DeleteAsync(string id);
        Task SetDefaultAsync(string user_id, string id);

        Task<List<address_model>> FindByUserIdAsync(string user_id, CancellationToken ct);
    }
}
