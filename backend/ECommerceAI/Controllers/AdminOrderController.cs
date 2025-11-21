using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Admin;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Payment;
using ECommerceAI.Models.Product;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    public class AdminOrderController : ControllerBase
    {
        private readonly IOrderRepo _orderRepo;
        private readonly IPaymentRepo _paymentRepo;
        private readonly IInventoryRepo _inventoryRepo;
        private readonly IProductRepo _productRepo;
        private readonly ILogger<AdminOrderController> _logger;

        public AdminOrderController(
            IOrderRepo orderRepo,
            IPaymentRepo paymentRepo,
            IInventoryRepo inventoryRepo,
            IProductRepo productRepo,
            ILogger<AdminOrderController> logger)
        {
            _orderRepo = orderRepo;
            _paymentRepo = paymentRepo;
            _inventoryRepo = inventoryRepo;
            _productRepo = productRepo;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/admin/orders - Lấy danh sách đơn hàng với filter
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] OrderQueryRequest request)
        {
            try
            {
                OrderStatus? status = null;
                if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<OrderStatus>(request.Status, out var parsedStatus))
                {
                    status = parsedStatus;
                }

                PaymentStatus? paymentStatus = null;
                if (!string.IsNullOrEmpty(request.PaymentStatus) && Enum.TryParse<PaymentStatus>(request.PaymentStatus, out var parsedPaymentStatus))
                {
                    paymentStatus = parsedPaymentStatus;
                }

                var result = await _orderRepo.GetOrdersAsync(
                    request.Page,
                    request.PageSize,
                    status,
                    paymentStatus,
                    request.DateFrom,
                    request.DateTo,
                    request.Keyword
                );

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
        /// GET /api/admin/orders/{orderId} - Lấy chi tiết đơn hàng + log trạng thái
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
                var payment = await _paymentRepo.GetByOrderIdAsync(orderId);

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
                        StatusLogs = statusLogs,
                        Payment = payment
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
        /// PATCH /api/admin/orders/{orderId} - Admin cập nhật đơn hàng
        /// </summary>
        [HttpPatch("{orderId}")]
        public async Task<IActionResult> UpdateOrder(string orderId, [FromBody] UpdateOrderRequest request, [FromQuery] string? adminUserId)
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

                var oldStatus = order.Status;

                if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<OrderStatus>(request.Status, out var newStatus))
                {
                    order.Status = newStatus;
                }

                if (!string.IsNullOrEmpty(request.AdminNote))
                {
                    order.AdminNote = request.AdminNote;
                }

                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Log status change
                if (oldStatus != order.Status)
                {
                    var statusLog = new order_status_log_model
                    {
                        OrderId = orderId,
                        OldStatus = oldStatus,
                        NewStatus = order.Status,
                        ChangedByUserId = adminUserId,
                        Note = request.AdminNote
                    };
                    await _orderRepo.AddStatusLogAsync(statusLog);
                }

                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi cập nhật đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/admin/orders/{orderId}/confirm - Admin xác nhận đơn (đặc biệt cho COD)
        /// </summary>
        [HttpPost("{orderId}/confirm")]
        public async Task<IActionResult> ConfirmOrder(string orderId, [FromQuery] string? adminUserId)
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

                if (order.Status != OrderStatus.PENDING_CONFIRM)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Đơn hàng không ở trạng thái chờ xác nhận",
                        data = (object?)null
                    });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.PROCESSING;
                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Tạo payment record cho COD nếu chưa có
                var existingPayment = await _paymentRepo.GetByOrderIdAsync(orderId);
                if (existingPayment == null && order.PaymentMethod.ToUpper() == "COD")
                {
                    var payment = new payment_model
                    {
                        OrderId = orderId,
                        Provider = "INTERNAL_COD",
                        Status = PaymentTransactionStatus.PENDING,
                        Amount = order.TotalAmount,
                        Currency = "VND"
                    };
                    await _paymentRepo.CreateAsync(payment);
                }

                // Trừ tồn kho
                var items = await _orderRepo.GetOrderItemsAsync(orderId);
                foreach (var item in items)
                {
                    if (!string.IsNullOrEmpty(item.ProductVariantId))
                    {
                        var variant = await _inventoryRepo.GetProductVariantByIdAsync(item.ProductVariantId);
                        if (variant != null)
                        {
                            variant.StockQuantity -= item.Quantity;
                            await _inventoryRepo.UpdateProductVariantAsync(item.ProductVariantId, variant);

                            // Tạo inventory movement
                            var movement = new inventory_movement_model
                            {
                                ProductVariantId = item.ProductVariantId,
                                ChangeQuantity = -item.Quantity,
                                Reason = "order_created",
                                ReferenceType = "order",
                                ReferenceId = orderId
                            };
                            await _inventoryRepo.CreateMovementAsync(movement);
                        }
                    }
                }

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = orderId,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.PROCESSING,
                    ChangedByUserId = adminUserId,
                    Note = "Admin xác nhận đơn hàng"
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                return Ok(new
                {
                    status = 200,
                    message = "Xác nhận đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error confirming order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xác nhận đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/admin/orders/{orderId}/ship - Admin cập nhật shipping
        /// </summary>
        [HttpPost("{orderId}/ship")]
        public async Task<IActionResult> ShipOrder(string orderId, [FromQuery] string? adminUserId)
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

                if (order.Status != OrderStatus.PROCESSING && order.Status != OrderStatus.PAID)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Đơn hàng không ở trạng thái có thể giao hàng",
                        data = (object?)null
                    });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.SHIPPING;
                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = orderId,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.SHIPPING,
                    ChangedByUserId = adminUserId,
                    Note = "Đơn hàng đã được giao cho đơn vị vận chuyển"
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật trạng thái giao hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error shipping order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi cập nhật trạng thái giao hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/admin/orders/{orderId}/complete - Admin hoàn tất đơn
        /// </summary>
        [HttpPost("{orderId}/complete")]
        public async Task<IActionResult> CompleteOrder(string orderId, [FromQuery] string? adminUserId)
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

                if (order.Status != OrderStatus.SHIPPING)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Đơn hàng không ở trạng thái đang giao",
                        data = (object?)null
                    });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.COMPLETED;
                
                // Nếu là COD và chưa thanh toán, đánh dấu đã thanh toán
                if (order.PaymentMethod.ToUpper() == "COD" && order.PaymentStatus == PaymentStatus.NONE)
                {
                    order.PaymentStatus = PaymentStatus.PAID;
                    
                    // Cập nhật payment record
                    var payment = await _paymentRepo.GetByOrderIdAsync(orderId);
                    if (payment != null)
                    {
                        payment.Status = PaymentTransactionStatus.SUCCESS;
                        payment.UpdatedAt = DateTime.UtcNow;
                        await _paymentRepo.UpdateAsync(payment.Id, payment);
                    }
                }

                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = orderId,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.COMPLETED,
                    ChangedByUserId = adminUserId,
                    Note = "Đơn hàng đã hoàn tất"
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                return Ok(new
                {
                    status = 200,
                    message = "Hoàn tất đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi hoàn tất đơn hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/admin/orders/{orderId}/refund - Admin hoàn/đổi trả
        /// </summary>
        [HttpPost("{orderId}/refund")]
        public async Task<IActionResult> RefundOrder(string orderId, [FromQuery] string? adminUserId, [FromQuery] string? note)
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

                if (order.Status != OrderStatus.COMPLETED && order.Status != OrderStatus.SHIPPING)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Chỉ có thể hoàn trả đơn hàng đã hoàn tất hoặc đang giao",
                        data = (object?)null
                    });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.CANCELLED;
                order.PaymentStatus = PaymentStatus.REFUNDED;
                order.AdminNote = note ?? "Đơn hàng đã được hoàn trả";
                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(orderId, order);

                // Cập nhật payment
                var payment = await _paymentRepo.GetByOrderIdAsync(orderId);
                if (payment != null)
                {
                    payment.Status = PaymentTransactionStatus.REFUNDED;
                    payment.UpdatedAt = DateTime.UtcNow;
                    await _paymentRepo.UpdateAsync(payment.Id, payment);

                    // TODO: Gửi request refund sang provider nếu là thanh toán online
                    // if (payment.Provider != "INTERNAL_COD" && payment.Provider != "COD")
                    // {
                    //     // Call refund API của provider
                    // }
                }

                // Cộng lại tồn kho
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
                                Reason = "order_refunded",
                                ReferenceType = "order",
                                ReferenceId = orderId
                            };
                            await _inventoryRepo.CreateMovementAsync(movement);
                        }
                    }
                }

                // Log status
                var statusLog = new order_status_log_model
                {
                    OrderId = orderId,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.CANCELLED,
                    ChangedByUserId = adminUserId,
                    Note = $"Hoàn trả đơn hàng: {note ?? ""}"
                };
                await _orderRepo.AddStatusLogAsync(statusLog);

                return Ok(new
                {
                    status = 200,
                    message = "Hoàn trả đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refunding order");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi hoàn trả đơn hàng",
                    data = (object?)null
                });
            }
        }
    }
}

