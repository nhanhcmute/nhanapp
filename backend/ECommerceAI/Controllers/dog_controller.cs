using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Pet;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Models.Common;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("dog.ctr")]
    public class dog_controller : ControllerBase
    {
        private readonly IDogRepo _dogRepo;
        private readonly ILogger<dog_controller> _logger;

        public dog_controller(IDogRepo dogRepo, ILogger<dog_controller> logger)
        {
            _dogRepo = dogRepo;
            _logger = logger;
        }

        [HttpPost("get_all")]
        [ResponseCache(Duration = 300)] // Cache for 5 minutes
        public async Task<IActionResult> get_all()
        {
            try
            {
                var dogs = await _dogRepo.GetAllAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = dogs
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all dogs");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Internal server error",
                    data = (object?)null
                });
            }
        }

        [HttpPost("get_by_id")]
        [ResponseCache(Duration = 300)]
        public async Task<IActionResult> get_by_id([FromBody] GetDogByIdRequest request)
        {
            try
            {
                var dog = await _dogRepo.GetByIdAsync(request.id);
                if (dog == null)
                {
                    return NotFound(new
                    {
                        status = 404,
                        message = "Dog not found",
                        data = (object?)null
                    });
                }

                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = dog
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting dog by id: {request.id}");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Internal server error",
                    data = (object?)null
                });
            }
        }

        [HttpPost("search")]
        [ResponseCache(Duration = 60)]
        public async Task<IActionResult> search([FromBody] SearchDogRequest request)
        {
            try
            {
                var dogs = await _dogRepo.SearchAsync(request.query);
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = dogs
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching dogs: {request.query}");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "Internal server error",
                    data = (object?)null
                });
            }
        }
    }

    public class GetDogByIdRequest
    {
        public int id { get; set; }
    }

    public class SearchDogRequest
    {
        public string query { get; set; } = string.Empty;
    }
}
