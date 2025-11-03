using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Product;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("product.ctr")]
    public class product_controller : ControllerBase
    {
        private readonly IProductRepo _productRepo;
        private readonly ILogger<product_controller> _logger;

        public product_controller(IProductRepo productRepo, ILogger<product_controller> logger)
        {
            _productRepo = productRepo;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả products
        /// POST /product.ctr/get_all
        /// </summary>
        [HttpPost("get_all")]
        public async Task<IActionResult> get_all()
        {
            try
            {
                var products = await _productRepo.GetAllAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy danh sách sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy product theo ID
        /// POST /product.ctr/get_by_id
        /// </summary>
        [HttpPost("get_by_id")]
public async Task<IActionResult> get_by_id([FromForm] string id)
{
    try
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new
            {
                status = 400,
                message = "ID không được để trống",
                data = (object?)null
            });
        }

        // --- Xử lý linh hoạt cho cả ObjectId và string thường ---
        var product = await _productRepo.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                status = 404,
                message = $"Không tìm thấy sản phẩm với ID: {id}",
                data = (object?)null
            });
        }

        return Ok(new
        {
            status = 200,
            message = "Lấy sản phẩm thành công",
            data = product
        });
    }
    catch (FormatException ex)
    {
        _logger.LogError(ex, "ID không hợp lệ: {Id}", id);
        return BadRequest(new
        {
            status = 400,
            message = $"ID '{id}' không hợp lệ",
            data = (object?)null
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting product by id: {Id}", id);
        return StatusCode(500, new
        {
            status = 500,
            message = "Đã xảy ra lỗi khi lấy sản phẩm",
            data = (object?)null
        });
    }
}


        /// <summary>
        /// Tìm kiếm products
        /// POST /product.ctr/search
        /// </summary>
        [HttpPost("search")]
        public async Task<IActionResult> search([FromForm] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Từ khóa tìm kiếm không được để trống",
                        data = (object?)null
                    });
                }

                var products = await _productRepo.SearchAsync(q);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi tìm kiếm sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Sắp xếp products
        /// POST /product.ctr/get_sorted
        /// </summary>
        [HttpPost("get_sorted")]
        public async Task<IActionResult> get_sorted([FromForm] string sort_by)
        {
            try
            {
                var products = await _productRepo.GetSortedAsync(sort_by);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = products
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sorting products");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi sắp xếp sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Tạo product mới
        /// POST /product.ctr/create
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] product_model product)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(product.Name))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Tên sản phẩm không được để trống",
                        data = (object?)null
                    });
                }

                // Auto update status based on quantity
                if (product.Quantity == 0)
                {
                    product.Status = "Hết hàng";
                }

                var createdProduct = await _productRepo.CreateAsync(product);
                return Ok(new
                {
                    status = 200,
                    message = "Tạo sản phẩm thành công",
                    data = createdProduct
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi tạo sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Cập nhật product
        /// POST /product.ctr/update
        /// </summary>
        [HttpPost("update")]
        public async Task<IActionResult> update([FromBody] product_model product)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(product.Id))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "ID không được để trống",
                        data = (object?)null
                    });
                }

                var existingProduct = await _productRepo.GetByIdAsync(product.Id);
                if (existingProduct == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy sản phẩm",
                        data = (object?)null
                    });
                }
                
                // Auto update status based on quantity
                if (product.Quantity == 0)
                {
                    product.Status = "Hết hàng";
                }
                else if (product.Status == "Hết hàng" && product.Quantity > 0)
                {
                    product.Status = "Còn hàng";
                }

                var updatedProduct = await _productRepo.UpdateAsync(product.Id, product);
                return Ok(new
                {
                    status = 200,
                    message = "Cập nhật sản phẩm thành công",
                    data = updatedProduct
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product: {Id}", product.Id);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi cập nhật sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Xóa product
        /// POST /product.ctr/delete
        /// </summary>
        [HttpPost("delete")]
        public async Task<IActionResult> delete([FromForm] string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "ID không được để trống",
                        data = (object?)null
                    });
                }

                var deleted = await _productRepo.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Không tìm thấy sản phẩm",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Xóa sản phẩm thành công",
                    data = new { success = true }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product: {Id}", id);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi xóa sản phẩm",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy products với phân trang
        /// POST /product.ctr/get_paged
        /// </summary>
        [HttpPost("get_paged")]
        public async Task<IActionResult> get_paged([FromForm] int page = 1, [FromForm] int page_size = 5)
        {
            try
            {
                if (page < 1) page = 1;
                if (page_size < 1) page_size = 5;

                var result = await _productRepo.GetPagedAsync(page, page_size);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paged products");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Đã xảy ra lỗi khi lấy danh sách sản phẩm",
                    data = (object?)null
                });
            }
        }
    }
}

