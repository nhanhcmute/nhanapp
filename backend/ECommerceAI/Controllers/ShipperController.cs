using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.User;
using Microsoft.AspNetCore.Authorization;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/shipper")]
    public class ShipperController : ControllerBase
    {
        private readonly IOrderRepo _orderRepo;
        private readonly INotificationService _notificationService;
        private readonly ILogger<ShipperController> _logger;

        public ShipperController(IOrderRepo orderRepo, INotificationService notificationService, ILogger<ShipperController> logger)
        {
            _orderRepo = orderRepo;
            _notificationService = notificationService;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/shipper/orders/available - Lấy danh sách đơn hàng chờ giao (Status = PROCESSING hoặc PAID)
        /// </summary>
        [HttpGet("orders/available")]
        public async Task<IActionResult> GetAvailableOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _orderRepo.GetAvailableForShipperAsync(page, pageSize);
                _logger.LogInformation($"Found {result.TotalCount} available orders for shipper (page {page}, pageSize {pageSize})");
                return Ok(new { status = 200, message = "Success", data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available orders");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// POST /api/shipper/orders/{id}/accept - Shipper nhận đơn
        /// </summary>
        [HttpPost("orders/{id}/accept")]
        public async Task<IActionResult> AcceptOrder(string id, [FromQuery] string shipperId)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { status = 404, message = "Order not found" });
                }

                // Chấp nhận cả PROCESSING và PAID
                if (order.Status != OrderStatus.PROCESSING && order.Status != OrderStatus.PAID)
                {
                    return BadRequest(new { status = 400, message = $"Order is not available for shipping. Current status: {order.Status}" });
                }

                if (!string.IsNullOrEmpty(order.ShipperId))
                {
                    return BadRequest(new { status = 400, message = "Order already assigned to another shipper" });
                }

                order.ShipperId = shipperId;
                order.Status = OrderStatus.SHIPPING;
                order.UpdatedAt = DateTime.UtcNow;

                await _orderRepo.UpdateAsync(id, order);

                // Log status
                await _orderRepo.AddStatusLogAsync(new order_status_log_model
                {
                    OrderId = id,
                    OldStatus = OrderStatus.PROCESSING,
                    NewStatus = OrderStatus.SHIPPING,
                    ChangedByUserId = shipperId,
                    Note = "Shipper accepted order"
                });

                // Create Notification
                await _notificationService.CreateNotificationAsync(
                    order.CustomerId,
                    "Đơn hàng đang được giao",
                    $"Đơn hàng #{order.OrderCode} đã được shipper tiếp nhận và đang trên đường giao đến bạn.",
                    "ORDER_STATUS",
                    $"/orders/{id}"
                );

                return Ok(new { status = 200, message = "Order accepted successfully", data = order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting order");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// GET /api/shipper/orders/my-orders - Lấy danh sách đơn đang giao của shipper
        /// </summary>
        [HttpGet("orders/my-orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] string shipperId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _orderRepo.GetByShipperIdAsync(shipperId, page, pageSize, OrderStatus.SHIPPING);
                return Ok(new { status = 200, message = "Success", data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting my orders");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// POST /api/shipper/orders/{id}/complete - Hoàn thành đơn hàng (Giao thành công)
        /// </summary>
        [HttpPost("orders/{id}/complete")]
        public async Task<IActionResult> CompleteOrder(string id, [FromQuery] string shipperId)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { status = 404, message = "Order not found" });
                }

                if (order.ShipperId != shipperId)
                {
                    return Forbid();
                }

                if (order.Status != OrderStatus.SHIPPING)
                {
                    return BadRequest(new { status = 400, message = "Order is not in shipping status" });
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.COMPLETED;
                order.PaymentStatus = PaymentStatus.PAID; // Giả sử COD thì thu tiền luôn
                order.UpdatedAt = DateTime.UtcNow;

                await _orderRepo.UpdateAsync(id, order);

                // Log status
                await _orderRepo.AddStatusLogAsync(new order_status_log_model
                {
                    OrderId = id,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.COMPLETED,
                    ChangedByUserId = shipperId,
                    Note = "Order delivered successfully"
                });

                // Create Notification
                await _notificationService.CreateNotificationAsync(
                    order.CustomerId,
                    "Giao hàng thành công",
                    $"Đơn hàng #{order.OrderCode} đã được giao thành công. Cảm ơn bạn đã mua sắm!",
                    "ORDER_STATUS",
                    $"/orders/{id}"
                );

                return Ok(new { status = 200, message = "Order completed successfully", data = order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing order");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// POST /api/shipper/orders/{id}/cancel - Shipper hủy đơn đã nhận (chưa giao)
        /// </summary>
        [HttpPost("orders/{id}/cancel")]
        public async Task<IActionResult> CancelOrder(string id, [FromQuery] string shipperId, [FromBody] string? reason = null)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { status = 404, message = "Order not found" });
                }

                if (order.ShipperId != shipperId)
                {
                    return StatusCode(403, new { status = 403, message = "You can only cancel your own orders" });
                }

                if (order.Status != OrderStatus.SHIPPING)
                {
                    return BadRequest(new { status = 400, message = "Only orders in SHIPPING status can be cancelled" });
                }

                var oldStatus = order.Status;
                // Chuyển về PROCESSING và xóa ShipperId để đơn hàng hiển thị lại cho shipper khác
                order.Status = OrderStatus.PROCESSING;
                order.ShipperId = null;
                if (!string.IsNullOrEmpty(reason))
                {
                    order.Note = string.IsNullOrEmpty(order.Note) 
                        ? $"[Shipper Cancelled]: {reason}" 
                        : $"{order.Note}\n[Shipper Cancelled]: {reason}";
                }
                order.UpdatedAt = DateTime.UtcNow;

                await _orderRepo.UpdateAsync(id, order);

                // Log status
                await _orderRepo.AddStatusLogAsync(new order_status_log_model
                {
                    OrderId = id,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.PROCESSING,
                    ChangedByUserId = shipperId,
                    Note = $"Shipper cancelled order: {reason ?? "No reason provided"}"
                });

                return Ok(new { status = 200, message = "Order cancelled successfully. Order is now available for other shippers.", data = order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// POST /api/shipper/orders/{id}/fail - Giao hàng thất bại
        /// </summary>
        [HttpPost("orders/{id}/fail")]
        public async Task<IActionResult> FailOrder(string id, [FromQuery] string shipperId, [FromBody] string reason)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { status = 404, message = "Order not found" });
                }

                if (order.ShipperId != shipperId)
                {
                    return Forbid();
                }

                if (order.Status != OrderStatus.SHIPPING)
                {
                    return BadRequest(new { status = 400, message = "Order is not in shipping status" });
                }

                var oldStatus = order.Status;
                // Chuyển về PENDING_CONFIRM để Admin xử lý lại hoặc CANCELLED tùy logic
                // Ở đây tạm chuyển về PENDING_CONFIRM để Admin gọi lại khách
                order.Status = OrderStatus.PENDING_CONFIRM; 
                order.ShipperId = null; // Bỏ shipper để người khác có thể nhận hoặc admin xử lý
                order.Note += $"\n[Shipper Failed]: {reason}";
                order.UpdatedAt = DateTime.UtcNow;

                await _orderRepo.UpdateAsync(id, order);

                // Log status
                await _orderRepo.AddStatusLogAsync(new order_status_log_model
                {
                    OrderId = id,
                    OldStatus = oldStatus,
                    NewStatus = OrderStatus.PENDING_CONFIRM,
                    ChangedByUserId = shipperId,
                    Note = $"Delivery failed: {reason}"
                });

                // Create Notification
                await _notificationService.CreateNotificationAsync(
                    order.CustomerId,
                    "Giao hàng thất bại",
                    $"Đơn hàng #{order.OrderCode} giao không thành công. Lý do: {reason}. Vui lòng liên hệ CSKH.",
                    "ORDER_STATUS",
                    $"/orders/{id}"
                );

                return Ok(new { status = 200, message = "Order marked as failed", data = order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error failing order");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }

        /// <summary>
        /// GET /api/shipper/history - Lịch sử giao hàng
        /// </summary>
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] string shipperId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                // Lấy các đơn đã hoàn thành bởi shipper này
                var result = await _orderRepo.GetByShipperIdAsync(shipperId, page, pageSize, OrderStatus.COMPLETED);
                return Ok(new { status = 200, message = "Success", data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting history");
                return StatusCode(500, new { status = 500, message = "Internal Server Error" });
            }
        }
    }
}
