using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Payment;
using ECommerceAI.Models.Payment;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Product;
using System.Text.Json;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentRepo _paymentRepo;
        private readonly IOrderRepo _orderRepo;
        private readonly IInventoryRepo _inventoryRepo;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(
            IPaymentRepo paymentRepo,
            IOrderRepo orderRepo,
            IInventoryRepo inventoryRepo,
            ILogger<PaymentController> logger)
        {
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _inventoryRepo = inventoryRepo;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/payment-methods - Lấy danh sách phương thức thanh toán
        /// </summary>
        [HttpGet("payment-methods")]
        public async Task<IActionResult> GetPaymentMethods()
        {
            try
            {
                var methods = await _paymentRepo.GetActivePaymentMethodsAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = methods
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment methods");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy danh sách phương thức thanh toán",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/payments/init - Khởi tạo thanh toán online
        /// </summary>
        [HttpPost("init")]
        public async Task<IActionResult> InitPayment([FromBody] InitPaymentRequest request)
        {
            try
            {
                var order = await _orderRepo.GetByIdAsync(request.OrderId);
                if (order == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn hàng",
                        data = (object?)null
                    });
                }

                if (order.Status != OrderStatus.PENDING_PAYMENT)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Đơn hàng không ở trạng thái chờ thanh toán",
                        data = (object?)null
                    });
                }

                // Kiểm tra payment method
                var paymentMethod = await _paymentRepo.GetPaymentMethodByCodeAsync(request.PaymentMethod);
                if (paymentMethod == null || !paymentMethod.IsActive)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Phương thức thanh toán không hợp lệ hoặc đã bị vô hiệu hóa",
                        data = (object?)null
                    });
                }

                // Tạo payment record
                var payment = new payment_model
                {
                    OrderId = order.Id,
                    Provider = request.PaymentMethod,
                    Status = PaymentTransactionStatus.PENDING,
                    Amount = order.TotalAmount,
                    Currency = "VND"
                };

                // TODO: Tích hợp với cổng thanh toán thực tế (VNPAY, MOMO, PAYPAL)
                // Hiện tại chỉ tạo mock payment URL
                string paymentUrl = "";
                if (request.PaymentMethod.ToUpper() == "VNPAY")
                {
                    paymentUrl = $"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId={order.OrderCode}&amount={order.TotalAmount * 100}&orderDescription=Thanh toan don hang {order.OrderCode}";
                }
                else if (request.PaymentMethod.ToUpper() == "MOMO")
                {
                    paymentUrl = $"https://test-payment.momo.vn/gw_payment/transactionProcessor?orderId={order.OrderCode}&amount={order.TotalAmount}";
                }
                else if (request.PaymentMethod.ToUpper() == "PAYPAL")
                {
                    paymentUrl = $"https://www.sandbox.paypal.com/checkoutnow?token={order.OrderCode}";
                }
                else
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Phương thức thanh toán không được hỗ trợ",
                        data = (object?)null
                    });
                }

                payment.PaymentUrl = paymentUrl;
                payment.RawRequest = JsonSerializer.Serialize(new { OrderId = order.Id, PaymentMethod = request.PaymentMethod });

                payment = await _paymentRepo.CreateAsync(payment);

                return Ok(new
                {
                    status = 200,
                    message = "Khởi tạo thanh toán thành công",
                    data = new PaymentResponse
                    {
                        PaymentId = payment.Id,
                        OrderId = order.Id,
                        OrderCode = order.OrderCode,
                        PaymentUrl = paymentUrl,
                        Status = payment.Status.ToString(),
                        Amount = payment.Amount
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing payment");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi khởi tạo thanh toán",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// GET /api/payments/{paymentId}/status - Lấy trạng thái thanh toán
        /// </summary>
        [HttpGet("{paymentId}/status")]
        public async Task<IActionResult> GetPaymentStatus(string paymentId)
        {
            try
            {
                var payment = await _paymentRepo.GetByIdAsync(paymentId);
                if (payment == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy giao dịch thanh toán",
                        data = (object?)null
                    });
                }

                var order = await _orderRepo.GetByIdAsync(payment.OrderId);
                if (order == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn hàng",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new PaymentStatusResponse
                    {
                        PaymentId = payment.Id,
                        OrderId = order.Id,
                        OrderCode = order.OrderCode,
                        Status = payment.Status.ToString(),
                        PaymentStatus = order.PaymentStatus.ToString(),
                        Amount = payment.Amount
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment status");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy trạng thái thanh toán",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/payments/webhook/{provider} - Webhook từ cổng thanh toán
        /// </summary>
        [HttpPost("webhook/{provider}")]
        public async Task<IActionResult> Webhook(string provider, [FromBody] Dictionary<string, object> webhookData)
        {
            try
            {
                _logger.LogInformation($"Received webhook from {provider}: {JsonSerializer.Serialize(webhookData)}");

                // TODO: Validate signature theo từng provider
                // Hiện tại chỉ xử lý cơ bản

                string? orderCode = null;
                string? transactionId = null;
                string? status = null;
                decimal? amount = null;

                // Parse webhook data theo từng provider
                if (provider.ToUpper() == "VNPAY")
                {
                    orderCode = webhookData.GetValueOrDefault("vnp_TxnRef")?.ToString();
                    transactionId = webhookData.GetValueOrDefault("vnp_TransactionNo")?.ToString();
                    var responseCode = webhookData.GetValueOrDefault("vnp_ResponseCode")?.ToString();
                    status = responseCode == "00" ? "SUCCESS" : "FAILED";
                    var amountStr = webhookData.GetValueOrDefault("vnp_Amount")?.ToString();
                    if (!string.IsNullOrEmpty(amountStr) && decimal.TryParse(amountStr, out var parsedAmount))
                    {
                        amount = parsedAmount / 100; // VNPAY trả về số tiền * 100
                    }
                }
                else if (provider.ToUpper() == "MOMO")
                {
                    orderCode = webhookData.GetValueOrDefault("orderId")?.ToString();
                    transactionId = webhookData.GetValueOrDefault("transId")?.ToString();
                    var resultCode = webhookData.GetValueOrDefault("resultCode")?.ToString();
                    status = resultCode == "0" ? "SUCCESS" : "FAILED";
                    var amountStr = webhookData.GetValueOrDefault("amount")?.ToString();
                    if (!string.IsNullOrEmpty(amountStr) && decimal.TryParse(amountStr, out var parsedAmount))
                    {
                        amount = parsedAmount;
                    }
                }
                else if (provider.ToUpper() == "PAYPAL")
                {
                    orderCode = webhookData.GetValueOrDefault("order_id")?.ToString();
                    transactionId = webhookData.GetValueOrDefault("transaction_id")?.ToString();
                    status = webhookData.GetValueOrDefault("status")?.ToString()?.ToUpper();
                    var amountStr = webhookData.GetValueOrDefault("amount")?.ToString();
                    if (!string.IsNullOrEmpty(amountStr) && decimal.TryParse(amountStr, out var parsedAmount))
                    {
                        amount = parsedAmount;
                    }
                }

                if (string.IsNullOrEmpty(orderCode))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Không tìm thấy orderCode trong webhook data",
                        data = (object?)null
                    });
                }

                var order = await _orderRepo.GetByOrderCodeAsync(orderCode);
                if (order == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy đơn hàng",
                        data = (object?)null
                    });
                }

                var payment = await _paymentRepo.GetByOrderIdAsync(order.Id);
                if (payment == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy giao dịch thanh toán",
                        data = (object?)null
                    });
                }

                // Cập nhật payment
                payment.RawResponse = JsonSerializer.Serialize(webhookData);
                if (!string.IsNullOrEmpty(transactionId))
                {
                    payment.ProviderTransactionId = transactionId;
                }

                // Cập nhật order và payment theo status
                var oldOrderStatus = order.Status;
                var oldPaymentStatus = order.PaymentStatus;

                if (status == "SUCCESS")
                {
                    payment.Status = PaymentTransactionStatus.SUCCESS;
                    order.PaymentStatus = PaymentStatus.PAID;
                    order.Status = OrderStatus.PAID;

                    // Trừ tồn kho
                    var items = await _orderRepo.GetOrderItemsAsync(order.Id);
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
                                    ReferenceId = order.Id
                                };
                                await _inventoryRepo.CreateMovementAsync(movement);
                            }
                        }
                    }
                }
                else
                {
                    payment.Status = PaymentTransactionStatus.FAILED;
                    order.PaymentStatus = PaymentStatus.FAILED;
                    order.Status = OrderStatus.PAYMENT_FAILED;
                }

                payment.UpdatedAt = DateTime.UtcNow;
                await _paymentRepo.UpdateAsync(payment.Id, payment);

                order.UpdatedAt = DateTime.UtcNow;
                await _orderRepo.UpdateAsync(order.Id, order);

                // Log status change
                if (oldOrderStatus != order.Status)
                {
                    var statusLog = new order_status_log_model
                    {
                        OrderId = order.Id,
                        OldStatus = oldOrderStatus,
                        NewStatus = order.Status,
                        Note = $"Webhook từ {provider}: {status}"
                    };
                    await _orderRepo.AddStatusLogAsync(statusLog);
                }

                return Ok(new
                {
                    status = 200,
                    message = "Webhook processed successfully",
                    data = new { OrderId = order.Id, PaymentStatus = payment.Status.ToString() }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing webhook from {provider}");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xử lý webhook",
                    data = (object?)null
                });
            }
        }
    }
}

