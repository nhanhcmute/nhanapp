using ECommerceAI.Models.User;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IUserRepo
    {
        Task<user_model?> GetByUsernameAsync(string username);
        Task<user_model?> GetByEmailAsync(string email);
        Task<user_model?> GetByIdAsync(string id);
        Task<user_model?> LoginAsync(string username, string password);
        Task<user_model> CreateAsync(user_model user);
        Task<user_model> UpdateAsync(string id, user_model user);
        Task<bool> UpdatePasswordAsync(string username, string newPassword);
        Task<bool> IsUsernameExistsAsync(string username);
        Task<bool> IsEmailExistsAsync(string email);
        Task<bool> UpdateLastLoginAsync(string id);


        Task<user_model?> FindByIdAsync(string id, CancellationToken ct);
        Task<user_model?> FindByUsernameAsync(string username, CancellationToken ct);


    }
}

