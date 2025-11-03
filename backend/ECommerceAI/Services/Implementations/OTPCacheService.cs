using Microsoft.Extensions.Caching.Memory;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Services.Implementations
{
    public class OTPCacheService : IOTPCacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<OTPCacheService> _logger;

        public OTPCacheService(IMemoryCache cache, ILogger<OTPCacheService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public void SetOTP(string email, string otpCode, string type, TimeSpan expiration)
        {
            var cacheKey = GetCacheKey(email, type);
            
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(expiration)
                .SetPriority(CacheItemPriority.High);

            _cache.Set(cacheKey, otpCode, cacheOptions);
            
            _logger.LogInformation("OTP cached for {Email} (Type: {Type}), expires in {Expiration}", 
                email, type, expiration);
        }

        public string? GetOTP(string email, string type)
        {
            var cacheKey = GetCacheKey(email, type);
            
            if (_cache.TryGetValue(cacheKey, out string? otpCode))
            {
                return otpCode;
            }
            
            return null;
        }

        public bool VerifyAndRemoveOTP(string email, string otpCode, string type)
        {
            var cacheKey = GetCacheKey(email, type);
            
            if (_cache.TryGetValue(cacheKey, out string? cachedOtp))
            {
                if (cachedOtp == otpCode)
                {
                    // OTP đúng, xóa khỏi cache
                    _cache.Remove(cacheKey);
                    _logger.LogInformation("OTP verified and removed for {Email} (Type: {Type})", email, type);
                    return true;
                }
                
                _logger.LogWarning("Invalid OTP attempt for {Email} (Type: {Type})", email, type);
                return false;
            }
            
            _logger.LogWarning("OTP not found or expired for {Email} (Type: {Type})", email, type);
            return false;
        }

        public void RemoveOTP(string email, string type)
        {
            var cacheKey = GetCacheKey(email, type);
            _cache.Remove(cacheKey);
            _logger.LogInformation("OTP removed for {Email} (Type: {Type})", email, type);
        }

        private string GetCacheKey(string email, string type)
        {
            return $"OTP_{type}_{email.ToLower()}";
        }
    }
}

