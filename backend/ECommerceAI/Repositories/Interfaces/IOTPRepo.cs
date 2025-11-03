using ECommerceAI.Models.Auth;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface IOTPRepo
    {
        Task<otp_model> CreateAsync(otp_model otp);
        Task<otp_model?> GetByEmailAndCodeAsync(string email, string otpCode, string type);
        Task<bool> InvalidateOTPAsync(string email, string type);
        Task<bool> MarkAsUsedAsync(string id);
        Task CleanupExpiredOTPsAsync();
    }
}

