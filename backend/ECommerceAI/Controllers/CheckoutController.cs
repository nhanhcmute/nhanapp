using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Checkout;
using ECommerceAI.Models.Cart;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Coupon;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly ICartRepo _cartRepo;
        private readonly IProductRepo _productRepo;
        private readonly IInventoryRepo _inventoryRepo;
        private readonly IShippingRepo _shippingRepo;
        private readonly ICouponRepo _couponRepo;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(
            ICartRepo cartRepo,
            IProductRepo productRepo,
            IInventoryRepo inventoryRepo,
            IShippingRepo shippingRepo,
            ICouponRepo couponRepo,
            ILogger<CheckoutController> logger)
        {
            _cartRepo = cartRepo;
            _productRepo = productRepo;
            _inventoryRepo = inventoryRepo;
            _shippingRepo = shippingRepo;
            _couponRepo = couponRepo;
            _logger = logger;
        }

        /// <summary>
        /// POST /api/checkout/preview - Tính toán giá, phí ship, coupon
        /// </summary>
        [HttpPost("preview")]
        public async Task<IActionResult> Preview([FromBody] CheckoutPreviewRequest request, [FromQuery] string? customerId, [FromQuery] string? sessionId)
        {
            try
            {
                // Lấy cart
                cart_model? cart = null;
                if (!string.IsNullOrEmpty(customerId))
                {
                    cart = await _cartRepo.GetByCustomerIdAsync(customerId);
                }
                else if (!string.IsNullOrEmpty(sessionId))
                {
                    cart = await _cartRepo.GetBySessionIdAsync(sessionId);
                }

                if (cart == null)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Giỏ hàng trống",
                        data = (object?)null
                    });
                }

                var items = await _cartRepo.GetCartItemsAsync(cart.Id);
                if (!items.Any())
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Giỏ hàng trống",
                        data = (object?)null
                    });
                }

                // Tính subtotal
                decimal subtotal = 0;
                foreach (var item in items)
                {
                    subtotal += item.Quantity * item.UnitPrice;
                }

                // Tính shipping fee
                decimal shippingFee = 0;
                if (!string.IsNullOrEmpty(request.ShippingMethodId))
                {
                    var shippingMethod = await _shippingRepo.GetByIdAsync(request.ShippingMethodId);
                    if (shippingMethod != null && shippingMethod.IsActive)
                    {
                        shippingFee = shippingMethod.BaseFee;
                    }
                }

                // Tính discount từ coupon
                decimal discountAmount = 0;
                coupon_model? coupon = null;
                if (!string.IsNullOrEmpty(request.CouponCode))
                {
                    coupon = await _couponRepo.GetByCodeAsync(request.CouponCode);
                    if (coupon != null && coupon.Status == "active")
                    {
                        var now = DateTime.UtcNow;
                        if (now >= coupon.StartDate && now <= coupon.EndDate)
                        {
                            if (subtotal >= coupon.MinOrderAmount)
                            {
                                if (coupon.DiscountType == DiscountType.PERCENT)
                                {
                                    discountAmount = subtotal * (coupon.DiscountValue / 100);
                                    if (coupon.MaxDiscountAmount.HasValue && discountAmount > coupon.MaxDiscountAmount.Value)
                                    {
                                        discountAmount = coupon.MaxDiscountAmount.Value;
                                    }
                                }
                                else
                                {
                                    discountAmount = coupon.DiscountValue;
                                }
                            }
                        }
                    }
                }

                var totalAmount = subtotal + shippingFee - discountAmount;

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new CheckoutPreviewResponse
                    {
                        SubtotalAmount = subtotal,
                        ShippingFee = shippingFee,
                        DiscountAmount = discountAmount,
                        TotalAmount = totalAmount,
                        CouponCode = request.CouponCode,
                        ShippingMethodId = request.ShippingMethodId
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error previewing checkout");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi tính toán",
                    data = (object?)null
                });
            }
        }
    }
}

