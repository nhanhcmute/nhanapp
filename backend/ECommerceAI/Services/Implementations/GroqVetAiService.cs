using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using ECommerceAI.DTOs.VetAi;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Services.Implementations
{
    /// <summary>
    /// Gọi Groq (API tương thích OpenAI Chat Completions) cho trợ lý thú y.
    /// Cấu hình: Groq:ApiKey (bắt buộc - đặt bằng user-secrets hoặc biến môi trường Groq__ApiKey),
    /// Groq:Model (mặc định qwen/qwen3.8-27b), Groq:BaseUrl.
    /// </summary>
    public class GroqVetAiService : IVetAiService
    {
        private const int MaxHistoryMessages = 12;
        private const int MaxMessageLength = 1500;

        // Dấu hiệu cấp cứu được kiểm tra ở server trước khi gọi AI - không phụ thuộc vào câu trả lời của mô hình.
        private static readonly Regex EmergencyPattern = new(
            @"khó thở|không thở|co giật|bất tỉnh|ngất|chảy máu nhiều|ngộ độc|độc chất|ăn phải thuốc|" +
            @"can'?t breathe|not breathing|trouble breathing|seizure|convuls|unconscious|collaps|heavy bleeding|poison|toxic",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex ThinkBlock = new(@"<think>[\s\S]*?</think>", RegexOptions.Compiled);

        private readonly HttpClient _http;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GroqVetAiService> _logger;

        public GroqVetAiService(HttpClient http, IConfiguration configuration, ILogger<GroqVetAiService> logger)
        {
            _http = http;
            _configuration = configuration;
            _logger = logger;
        }

        public static bool IsEmergency(string text) => EmergencyPattern.IsMatch(text);

        public static string EmergencyReply(string lang, string petName) => lang == "en"
            ? $"🚨 SIGNS THAT NEED EMERGENCY CARE\n\nWhat you describe may need a veterinarian right away. Take {petName} to the nearest emergency vet clinic or call them directly.\n\nDon't wait on this chat to decide, and don't give your pet any medication yourself."
            : $"🚨 DẤU HIỆU CẦN HỖ TRỢ KHẨN CẤP\n\nNhững biểu hiện bạn mô tả có thể cần được bác sĩ thú y xử lý ngay. Hãy đưa {petName} đến cơ sở thú y cấp cứu gần nhất hoặc gọi trực tiếp cho họ.\n\nĐừng chờ cuộc trò chuyện này để quyết định đi khám, và không tự dùng thuốc cho bé.";

        public async Task<VetAiChatResponse> ChatAsync(VetAiChatRequest request, CancellationToken cancellationToken = default)
        {
            var lang = request.Lang == "en" ? "en" : "vi";
            var petName = string.IsNullOrWhiteSpace(request.Pet?.Name) ? (lang == "en" ? "your pet" : "bé") : request.Pet!.Name!;
            var lastUser = request.Messages.LastOrDefault(m => m.Role == "user")?.Content ?? string.Empty;

            if (IsEmergency(lastUser))
            {
                return new VetAiChatResponse { Reply = EmergencyReply(lang, petName), Emergency = true };
            }

            var apiKey = _configuration["Groq:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new InvalidOperationException("Chưa cấu hình Groq:ApiKey");
            }

            var messages = new List<object> { new { role = "system", content = BuildSystemPrompt(request, lang) } };
            messages.AddRange(request.Messages
                .Where(m => (m.Role == "user" || m.Role == "assistant") && !string.IsNullOrWhiteSpace(m.Content))
                .TakeLast(MaxHistoryMessages)
                .Select(m => new
                {
                    role = m.Role,
                    content = m.Content.Length > MaxMessageLength ? m.Content[..MaxMessageLength] : m.Content,
                }));

            var body = new
            {
                model = _configuration["Groq:Model"] ?? "qwen/qwen3.8-27b",
                messages,
                temperature = 0.4,
                max_tokens = 900,
            };

            var baseUrl = (_configuration["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1").TrimEnd('/');
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"),
            };
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            using var response = await _http.SendAsync(httpRequest, cancellationToken);
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Groq trả về {Status}: {Body}", (int)response.StatusCode, json.Length > 500 ? json[..500] : json);
                throw new HttpRequestException($"Groq error {(int)response.StatusCode}", null, response.StatusCode);
            }

            using var doc = JsonDocument.Parse(json);
            var content = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? string.Empty;
            content = ThinkBlock.Replace(content, string.Empty).Trim();

            return new VetAiChatResponse { Reply = content, Emergency = false };
        }

        private static string BuildSystemPrompt(VetAiChatRequest request, string lang)
        {
            var pet = request.Pet;
            var context = new StringBuilder();
            if (pet != null)
            {
                context.AppendLine($"- Tên: {pet.Name}; loài: {pet.Species}; giống: {pet.Breed}; giới tính: {pet.Sex}; tuổi: {pet.Age}; cân nặng: {(pet.Weight is > 0 ? $"{pet.Weight} kg" : "chưa rõ")}");
            }
            if (!string.IsNullOrWhiteSpace(request.Duration)) context.AppendLine($"- Thời gian triệu chứng: {request.Duration}");
            if (request.Symptoms is { Count: > 0 }) context.AppendLine($"- Nhóm triệu chứng người dùng chọn: {string.Join(", ", request.Symptoms)}");

            var language = lang == "en"
                ? "Reply only in English."
                : "Chỉ trả lời bằng tiếng Việt có dấu, chuẩn chính tả. Không chèn từ tiếng Trung, tiếng Anh hay ngôn ngữ khác.";

            return $@"Bạn là PetCare AI - trợ lý sàng lọc sức khỏe thú cưng trên website cửa hàng thú cưng Nhân's Pet Haven.

Nguyên tắc bắt buộc:
- Không chẩn đoán bệnh chắc chắn, không kê đơn, không nêu tên thuốc hay liều lượng. Chỉ giải thích khả năng, hướng dẫn theo dõi và chăm sóc an toàn tại nhà.
- Luôn nói rõ khi nào cần đưa bé đi khám bác sĩ thú y, và khi nào là cấp cứu.
- Nếu thiếu thông tin quan trọng (tuổi, thời gian, mức độ, triệu chứng kèm theo), hỏi lại tối đa 3 câu ngắn.
- Không khuyên dùng thuốc của người. Không trả lời các chủ đề không liên quan đến chăm sóc thú cưng - lịch sự từ chối và quay lại chủ đề.
- Có thể gợi ý người dùng bấm ""Đặt lịch khám"" trên website khi cần gặp bác sĩ.
- Trình bày ngắn gọn, dễ đọc: tối đa khoảng 200 từ, dùng gạch đầu dòng khi liệt kê.
- {language}

Thông tin thú cưng đang được tư vấn:
{(context.Length > 0 ? context.ToString() : "- Chưa có thông tin")}";
        }
    }
}
