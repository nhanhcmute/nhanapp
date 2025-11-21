using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Coupon;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class CouponRepo : ICouponRepo
    {
        private readonly IMongoCollection<coupon_model> _coupons;
        private readonly IMongoCollection<order_coupon_model> _orderCoupons;

        public CouponRepo(MongoContext context)
        {
            _coupons = context.Database.GetCollection<coupon_model>("coupons");
            _orderCoupons = context.Database.GetCollection<order_coupon_model>("order_coupons");
        }

        public async Task<coupon_model?> GetByCodeAsync(string code)
        {
            var filter = Builders<coupon_model>.Filter.Eq(c => c.Code, code.ToUpper());
            return await _coupons.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<coupon_model> UpdateAsync(string id, coupon_model coupon)
        {
            coupon.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<coupon_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<coupon_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<coupon_model>.Filter.Eq("_id", id);
            }
            await _coupons.ReplaceOneAsync(filter, coupon);
            return coupon;
        }

        public async Task<order_coupon_model> CreateOrderCouponAsync(order_coupon_model orderCoupon)
        {
            await _orderCoupons.InsertOneAsync(orderCoupon);
            return orderCoupon;
        }
    }
}

