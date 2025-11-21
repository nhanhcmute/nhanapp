using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Checkout;
using ECommerceAI.Models.Cart;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Coupon;
using ECommerceAI.Models.Product;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepo _orderRepo;
        private readonly ICartRepo _cartRepo;
        private readonly IProductRepo _productRepo;
        private readonly IInventoryRepo _inventoryRepo;
        private readonly IShippingRepo _shippingRepo;
        private readonly ICouponRepo _couponRepo;
        private readonly ILogger<OrderController> _logger;

        public OrderController(
            IOrderRepo orderRepo,
            ICartRepo cartRepo,
            IProductRepo productRepo,
            IInventoryRepo inventoryRepo,
            IShippingRepo shippingRepo,
            ICouponRepo couponRepo,
            ILogger<OrderController> logger)
        {
            _orderRepo = orderRepo;
            _cartRepo = cartRepo;
            _productRepo = productRepo;
            _inventoryRepo = inventoryRepo;
            _shippingRepo = shippingRepo;
            _couponRepo = couponRepo;
            _logger = logger;
        }

        /// <summary>
        /// POST /api/orders - Tạo đơn hàng
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, [FromQuery] string? customerId, [FromQuery] string? sessionId)
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

                // Tính toán giá
                decimal subtotal = 0;
                foreach (var item in items)
                {
                    subtotal += item.Quantity * item.UnitPrice;
                }

                decimal shippingFee = 0;
                if (!string.IsNullOrEmpty(request.ShippingMethodId))
                {
                    var shippingMethod = await _shippingRepo.GetByIdAsync(request.ShippingMethodId);
                    if (shippingMethod != null && shippingMethod.IsActive)
                    {
                        shippingFee = shippingMethod.BaseFee;
                    }
                }

                decimal discountAmount = 0;
                coupon_model? coupon = null;
                if (!string.IsNullOrEmpty(request.CouponCode))
                {
                    coupon = await _couponRepo.GetByCodeAsync(request.CouponCode);
                    if (coupon != null && coupon.Status == "active")
                    {
                        var now = DateTime.UtcNow;
                        if (now >= coupon.StartDate && now <= coupon.EndDate && subtotal >= coupon.MinOrderAmount)
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

                var totalAmount = subtotal + shippingFee - discountAmount;

                // Tạo order
                var order = new order_model
                {
                    CustomerId = customerId,
                    Status = request.PaymentMethod.ToUpper() == "COD" ? OrderStatus.PENDING_CONFIRM : OrderStatus.PENDING_PAYMENT,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = PaymentStatus.NONE,
                    ShippingMethodId = request.ShippingMethodId,
                    ShippingFullName = request.ShippingAddress.FullName,
                    ShippingPhone = request.ShippingAddress.Phone,
                    ShippingAddressLine = request.ShippingAddress.AddressLine,
                    ShippingWard = request.ShippingAddress.Ward,
                    ShippingDistrict = request.ShippingAddress.District,
                    ShippingCity = request.ShippingAddress.City,
                    ShippingCountry = request.ShippingAddress.Country,
                    SubtotalAmount = subtotal,
                    ShippingFee = shippingFee,
                    DiscountAmount = discountAmount,
                    TotalAmount = totalAmount,
                    Note = request.Note
                };

                order = await _orderRepo.CreateAsync(order);

                // Thêm order items
                foreach (var cartItem in items)
                {
                    var product = await _productRepo.GetByIdAsync(cartItem.ProductId);
                    string productName = product?.Name ?? "Unknown";
                    string sku = product?.Sku ?? "";

                    if (!string.IsNullOrEmpty(cartItem.ProductVariantId))
                    {
                        var variant = await _inventoryRepo.GetProductVariantByIdAsync(cartItem.ProductVariantId);
                        if (variant != null)
                        {
                            productName += $" - {variant.VariantName}";
                            sku = variant.Sku;
                        }
                    }

                    var orderItem = new order_item_model
                    {
                        OrderId = order.Id,
                        ProductId = cartItem.ProductId,
                        ProductVariantId = cartItem.ProductVariantId,
                        ProductName = productName,
                        Sku = sku,
                        Quantity = cartItem.Quantity,
                        UnitPrice = cartItem.UnitPrice,
                        TotalPrice = cartItem.Quantity * cartItem.UnitPrice
                    };

                    await _orderRepo.AddOrderItemAsync(orderItem);
                }

                // Lưu coupon nếu có
                if (coupon != null && discountAmount > 0)
                {
                    var orderCoupon = new order_coupon_model
                    {
                        OrderId = order.Id,
                        CouponId = coupon.Id,
                        DiscountAmount = discountAmount
                    };
                    await _couponRepo.CreateOrderCouponAsync(orderCoupon);

                    // Tăng used_count
                    coupon.UsedCount++;
                    await _couponRepo.UpdateAsync(coupon.Id, coupon);
                }

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = order.Id,
                    OldStatus = null,
                    NewStatus = order.Status,
                    ChangedByUserId = customerId
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                // Đánh dấu cart đã chuyển thành order
                cart.Status = "converted_to_order";
                await _cartRepo.UpdateAsync(cart.Id, cart);

                return Ok(new
                {
                    status = 200,
                    message = "Tạo đơn hàng thành công",
                    data = new
                    {
                        OrderId = order.Id,
                        OrderCode = order.OrderCode,
                        Status = order.Status.ToString(),
                        TotalAmount = order.TotalAmount
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi tạo đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// GET /api/orders - Lấy danh sách đơn hàng của user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] string customerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (string.IsNullOrEmpty(customerId))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "customerId là bắt buộc",
                        data = (object?)null
                    });
                }

                var result = await _orderRepo.GetByCustomerIdAsync(customerId, page, pageSize);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy danh sách đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// GET /api/orders/{orderId} - Lấy chi tiết đơn hàng
        /// </summary>
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderDetail(string orderId)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(orderId);
                if (order == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn hàng",
                        data = (object?)null
                    });
                }

                var items = await _orderRepo.GetOrderItemsAsync(orderId);
                var statusLogs = await _orderRepo.GetStatusLogsAsync(orderId);

                // Batch load products để lấy image và description
                var productIds = items.Select(i => i.ProductId).Distinct().ToList();
                var productsDict = await _productRepo.GetByIdsAsync(productIds);

                // Tạo response items với image và description
                var itemsWithDetails = items.Select(item =>
                {
                    // Thử tìm product bằng ProductId trực tiếp
                    productsDict.TryGetValue(item.ProductId, out var product);
                    
                    // Nếu không tìm thấy, thử tìm bằng cách so sánh Id
                    if (product == null)
                    {
                        product = productsDict.Values.FirstOrDefault(p => p.Id == item.ProductId);
                    }
                    
                    return new
                    {
                        item.Id,
                        item.OrderId,
                        item.ProductId,
                        item.ProductVariantId,
                        item.ProductName,
                        item.Sku,
                        item.Quantity,
                        item.UnitPrice,
                        item.TotalPrice,
                        Image = product?.Image,
                        Description = product?.Description
                    };
                }).ToList();

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new
                    {
                        Order = order,
                        Items = itemsWithDetails,
                        StatusLogs = statusLogs
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order detail");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy chi tiết đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/orders/{orderId}/cancel - Khách yêu cầu hủy đơn
        /// </summary>
        [HttpPost("{orderId}/cancel")]
        public async Task<IActionResult> CancelOrder(string orderId, [FromQuery] string? customerId)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(orderId);
                if (order == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn hàng",
                        data = (object?)null
                    });
                }

                // Kiểm tra quyền
                if (!string.IsNullOrEmpty(customerId) && order.CustomerId != customerId)
                {
                    return Forbid();
                }

                // Chỉ cho phép hủy nếu đơn ở trạng thái phù hợp
                if (order.Status != OrderStatus.PENDING_PAYMENT && 
                    order.Status != OrderStatus.PENDING_CONFIRM &&
                    order.Status != OrderStatus.PAID)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Không thể hủy đơn hàng ở trạng thái này",
                        data = (object?)null
                    });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.CANCELLED;
                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = orderId,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.CANCELLED,
                    ChangedByUserId = customerId,
                    Note = "Khách hàng yêu cầu hủy"
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                // Nếu đã trừ tồn kho thì cộng lại
                if (oldStatus == OrderStatus.PAID || oldStatus == OrderStatus.PROCESSING)
                {
                    var items = await _orderRepo.GetOrderItemsAsync(orderId);
                    foreach (var item in items)
                    {
                        if (!string.IsNullOrEmpty(item.ProductVariantId))
                        {
                            var variant = await _inventoryRepo.GetProductVariantByIdAsync(item.ProductVariantId);
                            if (variant != null)
                            {
                                variant.StockQuantity += item.Quantity;
                                await _inventoryRepo.UpdateProductVariantAsync(item.ProductVariantId, variant);

                                // Tạo inventory movement
                                var movement = new inventory_movement_model
                                {
                                    ProductVariantId = item.ProductVariantId,
                                    ChangeQuantity = item.Quantity,
                                    Reason = "order_cancelled",
                                    ReferenceType = "order",
                                    ReferenceId = orderId
                                };
                                await _inventoryRepo.CreateMovementAsync(movement);
                            }
                        }
                    }
                }

                return Ok(new
                {
                    status = 200,
                    message = "Hủy đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi hủy đơn hàng",
                    data = (object?)null
                });
            }
        }
    }
}

