namespace ECommerceAI.Models.Pet
{
    public class UpdateCatRequest
    {
        public string id { get; set; } = string.Empty;
        public string? name { get; set; }
        public string? origin { get; set; }
        public IFormFile? image { get; set; }
        public string? image_data { get; set; }
    }
}