namespace ECommerceAI.Services.Interfaces
{
    public interface IOTPCacheService
    {
        void SetOTP(string email, string otpCode, string type, TimeSpan expiration);
        string? GetOTP(string email, string type);
        bool VerifyAndRemoveOTP(string email, string otpCode, string type);
        void RemoveOTP(string email, string type);
    }
}

