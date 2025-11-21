using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Cart;
using ECommerceAI.Models.Cart;
using ECommerceAI.Models.Product;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartRepo _cartRepo;
        private readonly IProductRepo _productRepo;
        private readonly IInventoryRepo _inventoryRepo;
        private readonly ILogger<CartController> _logger;

        public CartController(
            ICartRepo cartRepo,
            IProductRepo productRepo,
            IInventoryRepo inventoryRepo,
            ILogger<CartController> logger)
        {
            _cartRepo = cartRepo;
            _productRepo = productRepo;
            _inventoryRepo = inventoryRepo;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/cart - Lấy giỏ hàng hiện tại
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCart([FromQuery] string? customerId, [FromQuery] string? sessionId)
        {
            try
            {
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
                    return Ok(new
                    {
                        status = 200,
                        message = "Giỏ hàng trống",
                        data = new CartResponse
                        {
                            Items = new List<CartItemResponse>()
                        }
                    });
                }

                var items = await _cartRepo.GetCartItemsAsync(cart.Id);
                var itemResponses = new List<CartItemResponse>();

                // Tối ưu: Batch load products để tránh N+1 query
                var productIds = items.Select(i => i.ProductId).Distinct().ToList();
                var productsDict = await _productRepo.GetByIdsAsync(productIds);

                // Load variants nếu có
                var variantIds = items.Where(i => !string.IsNullOrEmpty(i.ProductVariantId))
                    .Select(i => i.ProductVariantId!)
                    .Distinct()
                    .ToList();
                var variantsDict = new Dictionary<string, product_variant_model>();
                
                foreach (var variantId in variantIds)
                {
                    try
                    {
                        var variant = await _inventoryRepo.GetProductVariantByIdAsync(variantId);
                        if (variant != null)
                        {
                            variantsDict[variantId] = variant;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, $"Failed to load variant {variantId}");
                    }
                }

                // Build response
                foreach (var item in items)
                {
                    productsDict.TryGetValue(item.ProductId, out var product);
                    string productName = product?.Name ?? "Unknown";
                    string? variantName = null;
                    string? productImage = product?.Image;
                    string? productDescription = product?.Description;

                    if (!string.IsNullOrEmpty(item.ProductVariantId) && variantsDict.TryGetValue(item.ProductVariantId, out var variant))
                    {
                        variantName = variant.VariantName;
                    }

                    itemResponses.Add(new CartItemResponse
                    {
                        Id = item.Id,
                        ProductId = item.ProductId,
                        ProductVariantId = item.ProductVariantId,
                        ProductName = productName,
                        VariantName = variantName,
                        Image = productImage,
                        Description = productDescription,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = item.Quantity * item.UnitPrice
                    });
                }

                var totalAmount = itemResponses.Sum(i => i.TotalPrice);

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = new CartResponse
                    {
                        Id = cart.Id,
                        CustomerId = cart.CustomerId,
                        SessionId = cart.SessionId,
                        Status = cart.Status,
                        Items = itemResponses,
                        TotalAmount = totalAmount,
                        CreatedAt = cart.CreatedAt,
                        UpdatedAt = cart.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cart");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy giỏ hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// POST /api/cart/items - Thêm item vào giỏ hàng
        /// </summary>
        [HttpPost("items")]
        public async Task<IActionResult> AddCartItem([FromBody] AddCartItemRequest request, [FromQuery] string? customerId, [FromQuery] string? sessionId)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.ProductId))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "ProductId là bắt buộc",
                        data = (object?)null
                    });
                }

                if (request.Quantity <= 0)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Số lượng phải lớn hơn 0",
                        data = (object?)null
                    });
                }

                // Lấy hoặc tạo cart
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
                    cart = new cart_model
                    {
                        CustomerId = customerId,
                        SessionId = sessionId,
                        Status = "active"
                    };
                    cart = await _cartRepo.CreateAsync(cart);
                }

                // Lấy giá sản phẩm
                var product = await _productRepo.GetByIdAsync(request.ProductId);
                if (product == null)
                {
                    _logger.LogWarning($"Product not found: {request.ProductId}");
                    return NotFound(new
                    {
                        status = 404,
                        message = $"Không tìm thấy sản phẩm với ID: {request.ProductId}",
                        data = (object?)null
                    });
                }

                // Lấy giá sản phẩm: ưu tiên BasePrice, nếu = 0 thì parse từ Price
                decimal unitPrice = product.BasePrice;
                if (unitPrice == 0 && !string.IsNullOrEmpty(product.Price))
                {
                    // Parse từ Price string (có thể chứa "VND", "VNĐ", "k", "K", dấu phẩy, dấu chấm, etc.)
                    var priceStr = product.Price
                        .Replace("VND", "", StringComparison.OrdinalIgnoreCase)
                        .Replace("VNĐ", "", StringComparison.OrdinalIgnoreCase)
                        .Replace("đ", "", StringComparison.OrdinalIgnoreCase)
                        .Replace(",", "") // Loại bỏ dấu phẩy phân cách hàng nghìn
                        .Trim();

                    // Xử lý "k" hoặc "K" (ví dụ: "550k" = 550000)
                    var hasK = priceStr.EndsWith("k", StringComparison.OrdinalIgnoreCase);
                    if (hasK)
                    {
                        priceStr = priceStr.Substring(0, priceStr.Length - 1).Trim();
                        if (decimal.TryParse(priceStr, out var baseValue))
                        {
                            unitPrice = baseValue * 1000; // "550k" = 550000
                        }
                    }
                    else
                    {
                        // Loại bỏ dấu chấm nếu là phân cách hàng nghìn (VD: "550.000")
                        // Nhưng giữ lại nếu là số thập phân (VD: "550.5")
                        var parts = priceStr.Split('.');
                        if (parts.Length == 2 && parts[1].Length <= 3)
                        {
                            // Có thể là phân cách hàng nghìn
                            priceStr = string.Join("", parts);
                        }
                        
                        if (decimal.TryParse(priceStr, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsedPrice))
                        {
                            unitPrice = parsedPrice;
                        }
                    }
                }
                
                if (unitPrice == 0)
                {
                    _logger.LogWarning($"Product {request.ProductId} has invalid price: BasePrice={product.BasePrice}, Price={product.Price}");
                    return BadRequest(new
                    {
                        status = 400,
                        message = $"Sản phẩm chưa có giá hợp lệ. Giá hiện tại: {product.Price ?? "N/A"}",
                        data = (object?)null
                    });
                }
                if (!string.IsNullOrEmpty(request.ProductVariantId))
                {
                    var variant = await _inventoryRepo.GetProductVariantByIdAsync(request.ProductVariantId);
                    if (variant == null)
                    {
                        return NotFound(new
                        {
                            status = 404,
                            message = "Không tìm thấy biến thể sản phẩm",
                            data = (object?)null
                        });
                    }
                    unitPrice = variant.Price;

                    // Kiểm tra tồn kho
                    if (variant.StockQuantity < request.Quantity)
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = $"Chỉ còn {variant.StockQuantity} sản phẩm trong kho",
                            data = (object?)null
                        });
                    }
                }

                // Kiểm tra item đã tồn tại chưa
                var existingItems = await _cartRepo.GetCartItemsAsync(cart.Id);
                var existingItem = existingItems.FirstOrDefault(i => 
                    i.ProductId == request.ProductId && 
                    i.ProductVariantId == request.ProductVariantId);

                if (existingItem != null)
                {
                    existingItem.Quantity += request.Quantity;
                    existingItem = await _cartRepo.UpdateCartItemAsync(existingItem.Id, existingItem);
                }
                else
                {
                    var newItem = new cart_item_model
                    {
                        CartId = cart.Id,
                        ProductId = request.ProductId,
                        ProductVariantId = request.ProductVariantId,
                        Quantity = request.Quantity,
                        UnitPrice = unitPrice
                    };
                    existingItem = await _cartRepo.AddCartItemAsync(newItem);
                }

                return Ok(new
                {
                    status = 200,
                    message = "Thêm vào giỏ hàng thành công",
                    data = existingItem
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding cart item");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi thêm vào giỏ hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// PUT /api/cart/items/{itemId} - Cập nhật số lượng item
        /// </summary>
        [HttpPut("items/{itemId}")]
        public async Task<IActionResult> UpdateCartItem(string itemId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                if (request.Quantity <= 0)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Số lượng phải lớn hơn 0",
                        data = (object?)null
                    });
                }

                var item = await _cartRepo.GetCartItemByIdAsync(itemId);
                if (item == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy item trong giỏ hàng",
                        data = (object?)null
                    });
                }

                // Kiểm tra tồn kho nếu có variant
                if (!string.IsNullOrEmpty(item.ProductVariantId))
                {
                    var variant = await _inventoryRepo.GetProductVariantByIdAsync(item.ProductVariantId);
                    if (variant != null && variant.StockQuantity < request.Quantity)
                    {
                        return BadRequest(new
                        {
                            status = 400,
                            message = $"Chỉ còn {variant.StockQuantity} sản phẩm trong kho",
                            data = (object?)null
                        });
                    }
                }

                item.Quantity = request.Quantity;
                item = await _cartRepo.UpdateCartItemAsync(itemId, item);

                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật giỏ hàng thành công",
                    data = item
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi cập nhật giỏ hàng",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// DELETE /api/cart/items/{itemId} - Xóa item khỏi giỏ hàng
        /// </summary>
        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> DeleteCartItem(string itemId)
        {
            try
            {
                var deleted = await _cartRepo.DeleteCartItemAsync(itemId);
                if (!deleted)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy item trong giỏ hàng",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Xóa item thành công",
                    data = new { success = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting cart item");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xóa item",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// DELETE /api/cart - Xóa toàn bộ giỏ hàng
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> ClearCart([FromQuery] string? customerId, [FromQuery] string? sessionId)
        {
            try
            {
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
                    return Ok(new
                    {
                        status = 200,
                        message = "Giỏ hàng đã trống",
                        data = new { success = true }
                    });
                }

                await _cartRepo.ClearCartItemsAsync(cart.Id);

                return Ok(new
                {
                    status = 200,
                    message = "Xóa giỏ hàng thành công",
                    data = new { success = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xóa giỏ hàng",
                    data = (object?)null
                });
            }
        }
    }
}

