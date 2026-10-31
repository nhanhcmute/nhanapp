using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using ECommerceAI.DTOs.VetAi;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("vetai.ctr")]
    public class vet_ai_controller : ControllerBase
    {
        // Giới hạn số câu hỏi mỗi IP trong 1 giờ để tránh spam làm hết hạn mức API
        private const int MaxRequestsPerHour = 30;

        private readonly IVetAiService _vetAi;
        private readonly IMemoryCache _cache;
        private readonly ILogger<vet_ai_controller> _logger;

        public vet_ai_controller(IVetAiService vetAi, IMemoryCache cache, ILogger<vet_ai_controller> logger)
        {
            _vetAi = vetAi;
            _cache = cache;
            _logger = logger;
        }

        /// <summary>
        /// Tư vấn sức khỏe thú cưng bằng AI
        /// POST /vetai.ctr/chat
        /// </summary>
        [HttpPost("chat")]
        public async Task<IActionResult> chat([FromBody] VetAiChatRequest request, CancellationToken cancellationToken)
        {
            if (request.Messages.Count == 0 || request.Messages.Last().Role != "user" || string.IsNullOrWhiteSpace(request.Messages.Last().Content))
            {
                return BadRequest(new { status = 400, message = "Thiếu câu hỏi", data = (object?)null });
            }

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var cacheKey = $"vetai:{ip}";
            var count = _cache.GetOrCreate(cacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return 0;
            });
            if (count >= MaxRequestsPerHour)
            {
                return StatusCode(429, new { status = 429, message = "Bạn đã hỏi quá nhiều trong 1 giờ, vui lòng thử lại sau.", data = (object?)null });
            }
            _cache.Set(cacheKey, count + 1, TimeSpan.FromHours(1));

            try
            {
                var result = await _vetAi.ChatAsync(request, cancellationToken);
                return Ok(new { status = 200, message = "Success", data = result });
            }
            catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)
            {
                return StatusCode(429, new { status = 429, message = "Trợ lý AI đang quá tải, vui lòng thử lại sau ít phút.", data = (object?)null });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling vet AI");
                return StatusCode(503, new { status = 503, message = "Trợ lý AI tạm thời không khả dụng.", data = (object?)null });
            }
        }
    }
}
