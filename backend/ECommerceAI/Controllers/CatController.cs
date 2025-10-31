using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatController : ControllerBase
    {
        private readonly ICatRepo _catRepo;
        private readonly ILogger<CatController> _logger;

        public CatController(ICatRepo catRepo, ILogger<CatController> logger)
        {
            _catRepo = catRepo;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả cats
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CatModel>>>> GetAllCats()
        {
            try
            {
                var cats = await _catRepo.GetAllAsync();
                return Ok(new ApiResponse<IEnumerable<CatModel>>
                {
                    Success = true,
                    Data = cats,
                    Message = "Cats retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all cats");
                return StatusCode(500, new ApiResponse<IEnumerable<CatModel>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving cats"
                });
            }
        }

        /// <summary>
        /// Lấy cat theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CatModel>>> GetCatById(string id)
        {
            try
            {
                var cat = await _catRepo.GetByIdAsync(id);
                if (cat == null)
                {
                    return NotFound(new ApiResponse<CatModel>
                    {
                        Success = false,
                        Message = "Cat not found"
                    });
                }

                return Ok(new ApiResponse<CatModel>
                {
                    Success = true,
                    Data = cat,
                    Message = "Cat retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cat by id: {Id}", id);
                return StatusCode(500, new ApiResponse<CatModel>
                {
                    Success = false,
                    Message = "An error occurred while retrieving cat"
                });
            }
        }

        /// <summary>
        /// Lấy cat theo CatId (abys, aege, ...)
        /// </summary>
        [HttpGet("catId/{catId}")]
        public async Task<ActionResult<ApiResponse<CatModel>>> GetCatByCatId(string catId)
        {
            try
            {
                var cat = await _catRepo.GetByCatIdAsync(catId);
                if (cat == null)
                {
                    return NotFound(new ApiResponse<CatModel>
                    {
                        Success = false,
                        Message = "Cat not found"
                    });
                }

                return Ok(new ApiResponse<CatModel>
                {
                    Success = true,
                    Data = cat,
                    Message = "Cat retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cat by catId: {CatId}", catId);
                return StatusCode(500, new ApiResponse<CatModel>
                {
                    Success = false,
                    Message = "An error occurred while retrieving cat"
                });
            }
        }

        /// <summary>
        /// Lấy cats với phân trang
        /// </summary>
        [HttpGet("paged")]
        public async Task<ActionResult<ApiResponse<PaginationResponse<CatModel>>>> GetPagedCats(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 9)
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 9;

                var result = await _catRepo.GetPagedAsync(page, pageSize);
                return Ok(new ApiResponse<PaginationResponse<CatModel>>
                {
                    Success = true,
                    Data = result,
                    Message = "Cats retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paged cats");
                return StatusCode(500, new ApiResponse<PaginationResponse<CatModel>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving cats"
                });
            }
        }

        /// <summary>
        /// Tìm kiếm cats
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CatModel>>>> SearchCats(
            [FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new ApiResponse<IEnumerable<CatModel>>
                    {
                        Success = false,
                        Message = "Search query is required"
                    });
                }

                var cats = await _catRepo.SearchAsync(q);
                return Ok(new ApiResponse<IEnumerable<CatModel>>
                {
                    Success = true,
                    Data = cats,
                    Message = "Search completed successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching cats");
                return StatusCode(500, new ApiResponse<IEnumerable<CatModel>>
                {
                    Success = false,
                    Message = "An error occurred while searching cats"
                });
            }
        }

        /// <summary>
        /// Tạo cat mới
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CatModel>>> CreateCat([FromBody] CatModel cat)
        {
            try
            {
                var createdCat = await _catRepo.CreateAsync(cat);
                return CreatedAtAction(nameof(GetCatById), new { id = createdCat.Id }, 
                    new ApiResponse<CatModel>
                    {
                        Success = true,
                        Data = createdCat,
                        Message = "Cat created successfully"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating cat");
                return StatusCode(500, new ApiResponse<CatModel>
                {
                    Success = false,
                    Message = "An error occurred while creating cat"
                });
            }
        }

        /// <summary>
        /// Cập nhật cat
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CatModel>>> UpdateCat(string id, [FromBody] CatModel cat)
        {
            try
            {
                var existingCat = await _catRepo.GetByIdAsync(id);
                if (existingCat == null)
                {
                    return NotFound(new ApiResponse<CatModel>
                    {
                        Success = false,
                        Message = "Cat not found"
                    });
                }

                cat.Id = id;
                var updatedCat = await _catRepo.UpdateAsync(id, cat);
                return Ok(new ApiResponse<CatModel>
                {
                    Success = true,
                    Data = updatedCat,
                    Message = "Cat updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cat: {Id}", id);
                return StatusCode(500, new ApiResponse<CatModel>
                {
                    Success = false,
                    Message = "An error occurred while updating cat"
                });
            }
        }

        /// <summary>
        /// Xóa cat
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteCat(string id)
        {
            try
            {
                var deleted = await _catRepo.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Cat not found"
                    });
                }

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Cat deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting cat: {Id}", id);
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting cat"
                });
            }
        }

        /// <summary>
        /// Import nhiều cats từ JSON
        /// </summary>
        [HttpPost("bulk-import")]
        public async Task<ActionResult<ApiResponse<bool>>> BulkImportCats([FromBody] IEnumerable<CatModel> cats)
        {
            try
            {
                var success = await _catRepo.BulkInsertAsync(cats);
                return Ok(new ApiResponse<bool>
                {
                    Success = success,
                    Data = success,
                    Message = success ? "Cats imported successfully" : "Failed to import cats"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk importing cats");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while importing cats"
                });
            }
        }
    }
}

