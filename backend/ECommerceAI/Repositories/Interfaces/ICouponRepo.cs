using ECommerceAI.Models.Coupon;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface ICouponRepo
    {
        Task<coupon_model?> GetByCodeAsync(string code);
        Task<coupon_model> UpdateAsync(string id, coupon_model coupon);
        Task<order_coupon_model> CreateOrderCouponAsync(order_coupon_model orderCoupon);
    }
}

