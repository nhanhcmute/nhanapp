using MongoDB.Driver;
using ECommerceAI.Models.Auth;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class OTPRepo : IOTPRepo
    {
        private readonly IMongoCollection<otp_model> _otps;

        public OTPRepo(MongoContext context)
        {
            _otps = context.Database.GetCollection<otp_model>("otps");
        }

        public async Task<otp_model> CreateAsync(otp_model otp)
        {
            await _otps.InsertOneAsync(otp);
            return otp;
        }

        public async Task<otp_model?> GetByEmailAndCodeAsync(string email, string otpCode, string type)
        {
            return await _otps.Find(o => 
                o.Email == email && 
                o.OtpCode == otpCode && 
                o.Type == type && 
                !o.IsUsed && 
                o.ExpiresAt > DateTime.UtcNow
            ).FirstOrDefaultAsync();
        }

        public async Task<bool> InvalidateOTPAsync(string email, string type)
        {
            var update = Builders<otp_model>.Update
                .Set(o => o.IsUsed, true);

            var result = await _otps.UpdateManyAsync(
                o => o.Email == email && o.Type == type && !o.IsUsed,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<bool> MarkAsUsedAsync(string id)
        {
            var update = Builders<otp_model>.Update
                .Set(o => o.IsUsed, true);

            var result = await _otps.UpdateOneAsync(
                o => o.Id == id,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task CleanupExpiredOTPsAsync()
        {
            await _otps.DeleteManyAsync(o => o.ExpiresAt < DateTime.UtcNow);
        }
    }
}

