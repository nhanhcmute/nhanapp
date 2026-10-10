using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Services;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("import_pets.ctr")]
    public class import_pets_controller : ControllerBase
    {
        private readonly ImportPetsDataService _importService;
        private readonly ILogger<import_pets_controller> _logger;

        public import_pets_controller(
            ImportPetsDataService importService,
            ILogger<import_pets_controller> logger)
        {
            _importService = importService;
            _logger = logger;
        }

        /// <summary>
        /// Import dữ liệu pets từ JSON files vào MongoDB (chỉ import nếu collection trống)
        /// </summary>
        [HttpPost("import_all")]
        public async Task<IActionResult> ImportAll()
        {
            try
            {
                await _importService.ImportDataIfNeededAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Import completed successfully",
                    data = (object?)null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing pets data");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while importing data",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy THÊM giống mèo/chó mới từ TheCatAPI/TheDogAPI (không xóa dữ liệu hiện có)
        /// </summary>
        [HttpPost("import_from_api")]
        public async Task<IActionResult> ImportFromApi()
        {
            try
            {
                var (catsAdded, dogsAdded) = await _importService.ImportAdditionalPetsFromApiAsync();
                return Ok(new
                {
                    status = 200,
                    message = $"Added {catsAdded} new cat breeds and {dogsAdded} new dog breeds",
                    data = new { catsAdded, dogsAdded }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing additional pets from API");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while importing from API",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Lấy THÊM sản phẩm thức ăn cho mèo/chó từ Open Pet Food Facts (không xóa dữ liệu hiện có)
        /// </summary>
        [HttpPost("import_products_from_api")]
        public async Task<IActionResult> ImportProductsFromApi()
        {
            try
            {
                var added = await _importService.ImportProductsFromOpenPetFoodFactsAsync();
                return Ok(new
                {
                    status = 200,
                    message = $"Added {added} new products",
                    data = new { added }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing products from Open Pet Food Facts");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while importing products from API",
                    data = (object?)null
                });
            }
        }

        /// <summary>
        /// Force import: Xóa dữ liệu cũ và import lại từ JSON files
        /// </summary>
        [HttpPost("force_import_all")]
        public async Task<IActionResult> ForceImportAll()
        {
            try
            {
                await _importService.ForceImportAllAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Force import completed successfully",
                    data = (object?)null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error force importing pets data");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred while force importing data",
                    data = (object?)null
                });
            }
        }
    }
}

