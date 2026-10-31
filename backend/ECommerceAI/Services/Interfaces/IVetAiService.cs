using ECommerceAI.DTOs.VetAi;

namespace ECommerceAI.Services.Interfaces
{
    /// <summary>
    /// Trợ lý thú y AI. Tách interface để có thể đổi nhà cung cấp (Groq, Claude...) chỉ bằng cấu hình/DI.
    /// </summary>
    public interface IVetAiService
    {
        Task<VetAiChatResponse> ChatAsync(VetAiChatRequest request, CancellationToken cancellationToken = default);
    }
}
