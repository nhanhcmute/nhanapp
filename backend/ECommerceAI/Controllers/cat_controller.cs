using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("cat.ctr")]
    public class cat_controller : ControllerBase
    {
        private readonly ICatRepo _catRepo;
        private readonly ILogger<cat_controller> _logger;

        public cat_controller(ICatRepo catRepo, ILogger<cat_controller> logger)
        {
            _catRepo = catRepo;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả cats
        /// </summary>
        [HttpPost("get_all")]
        public async Task<IActionResult> get_all()
        {
            try
            {
                var cats = await _catRepo.GetAllAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = cats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all cats");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while retrieving cats",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy cat theo ID
        /// </summary>
        [HttpPost("get_by_id")]
        public async Task<IActionResult> get_by_id([FromBody] string? id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "ID is required",
                        data = (object?)null
                    });
                }

                var cat = await _catRepo.GetByIdAsync(id);
                if (cat == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Cat not found",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = cat
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cat by id: {Id}", id);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while retrieving cat",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy cat theo CatId (abys, aege, ...)
        /// </summary>
        [HttpPost("get_by_cat_id")]
        public async Task<IActionResult> get_by_cat_id([FromBody] string? cat_id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(cat_id))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "cat_id is required",
                        data = (object?)null
                    });
                }

                var cat = await _catRepo.GetByCatIdAsync(cat_id);
                if (cat == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Cat not found",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = cat
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cat by catId: {CatId}", cat_id);
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while retrieving cat",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy cats với phân trang
        /// </summary>
        [HttpPost("get_paged")]
        public async Task<IActionResult> get_paged([FromBody] PagingRequest request)
        {
            try
            {
                if (request.page < 1) request.page = 1;
                if (request.page_size < 1) request.page_size = 9;

                var result = await _catRepo.GetPagedAsync(request.page, request.page_size);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paged cats");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while retrieving cats",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Tìm kiếm cats
        /// </summary>
        [HttpPost("search")]
        public async Task<IActionResult> search([FromBody] string? q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Search query is required",
                        data = (object?)null
                    });
                }

                var cats = await _catRepo.SearchAsync(q);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = cats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching cats");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while searching cats",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Tạo cat mới
        /// </summary>
        [HttpPost("create")]
public async Task<IActionResult> Create([FromBody] cat_model cat)
{
    try
    {
        cat.CreatedAt = DateTime.UtcNow;
        cat.UpdatedAt = DateTime.UtcNow;

        // Nếu có ảnh base64 nhưng thiếu prefix, thêm MIME type mặc định
        if (!string.IsNullOrEmpty(cat.ImageData) && !cat.ImageData.StartsWith("data:"))
        {
            cat.ImageData = $"data:image/jpeg;base64,{cat.ImageData}";
        }

        var createdCat = await _catRepo.CreateAsync(cat);

        return Ok(new
        {
            status = 200,
            message = "Cat created successfully",
            data = createdCat
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating cat");
        return StatusCode(500, new
        {
            status = 500,
            message = "An error occurred while creating cat",
            data = (object?)null
        });
    }
}


        /// <summary>
        /// Cập nhật cat
        /// </summary>
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromForm] string id, [FromForm] string? name = null, [FromForm] string? origin = null, [FromForm] IFormFile? image = null, [FromForm] string? image_data = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "ID is required",
                        data = (object?)null
                    });
                }

                var existingCat = await _catRepo.GetByIdAsync(id);
                if (existingCat == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Cat not found",
                        data = (object?)null
                    });
                }

                // Cập nhật field nếu có giá trị mới
                if (!string.IsNullOrEmpty(name))
                    existingCat.Name = name;

                if (!string.IsNullOrEmpty(origin))
                    existingCat.Origin = origin;

                // Nếu người dùng gửi ảnh base64
                if (!string.IsNullOrEmpty(image_data))
                {
                    if (!image_data.StartsWith("data:"))
                        image_data = $"data:image/jpeg;base64,{image_data}";
                    existingCat.ImageData = image_data;
        }

        // Nếu người dùng gửi ảnh file
        if (image != null)
        {
            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            var bytes = ms.ToArray();
            existingCat.ImageData = $"data:{image.ContentType};base64,{Convert.ToBase64String(bytes)}";
        }

        existingCat.UpdatedAt = DateTime.UtcNow;

        var updatedCat = await _catRepo.UpdateAsync(id, existingCat);

        return Ok(new
        {
            status = 200,
            message = "Cat updated successfully",
            data = updatedCat
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error updating cat: {Id}", id);
        return StatusCode(500, new
        {
            status = 500,
            message = "An error occurred while updating cat",
            data = (object?)null
        });
    }
}


        /// <summary>
        /// Xóa cat
        /// </summary>
[HttpPost("delete")]
public async Task<IActionResult> delete([FromBody] string? id)
{
    try
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new
            {
                status = 400,
                message = "ID is required",
                data = (object?)null
            });
        }

        var deleted = await _catRepo.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new
            {
                status = 404,
                message = "Cat not found",
                data = (object?)null
            });
        }

        return Ok(new
        {
            status = 200,
            message = "Cat deleted successfully",
            data = new { success = true }
        });
    }
    catch (Exception ex)
    {
        // 👇 Dòng này nên nằm trong try-catch của cùng method delete
        _logger.LogError(ex, $"Error deleting cat: {id}");
        return StatusCode(500, new
        {
            status = 500,
            message = "An error occurred while deleting cat",
            data = (object?)null
        });
    }
}



        /// <summary>
        /// Import nhiều cats từ JSON
        /// </summary>
        [HttpPost("bulk_import")]
        public async Task<IActionResult> bulk_import([FromBody] IEnumerable<cat_model> cats)
        {
            try
            {
                var success = await _catRepo.BulkInsertAsync(cats);
                return Ok(new
                {
                    status = 200,
                    message = success ? "Cats imported successfully" : "Failed to import cats",
                    data = new { success }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk importing cats");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while importing cats",
                    data = (object?)null
                });
            }
        }
    }
}

