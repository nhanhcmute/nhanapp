namespace ECommerceAI.Services.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendOTPEmailAsync(string email, string otpCode, string type);
    }
}

