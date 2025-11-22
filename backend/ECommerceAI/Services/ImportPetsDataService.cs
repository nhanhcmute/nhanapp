using System.Text.Json;
using ECommerceAI.Models.Pet;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Services
{
    public class ImportPetsDataService
    {
        private readonly ICatRepo _catRepo;
        private readonly IDogRepo _dogRepo;
        private readonly ILogger<ImportPetsDataService> _logger;

        public ImportPetsDataService(ICatRepo catRepo, IDogRepo dogRepo, ILogger<ImportPetsDataService> logger)
        {
            _catRepo = catRepo;
            _dogRepo = dogRepo;
            _logger = logger;
        }

        public async Task ImportDataIfNeededAsync()
        {
            await ImportCatsIfNeededAsync();
            await ImportDogsIfNeededAsync();
        }

        public async Task ForceImportAllAsync()
        {
            // Xóa dữ liệu cũ và import lại
            await _catRepo.DeleteAllAsync();
            await _dogRepo.DeleteAllAsync();
            
            await ImportCatsIfNeededAsync(force: true);
            await ImportDogsIfNeededAsync(force: true);
        }

        private string? FindJsonFile(string fileName)
        {
            // Thử nhiều đường dẫn khác nhau
            var possiblePaths = new[]
            {
                Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", fileName),
                Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "frontend", "public", fileName),
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "frontend", "public", fileName),
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "frontend", "public", fileName),
            };

            foreach (var path in possiblePaths)
            {
                var normalizedPath = Path.GetFullPath(path);
                if (File.Exists(normalizedPath))
                {
                    return normalizedPath;
                }
            }

            return null;
        }

        private async Task ImportCatsIfNeededAsync(bool force = false)
        {
            try
            {
                if (!force)
                {
                    var count = await _catRepo.CountAsync();
                    if (count > 0)
                    {
                        _logger.LogInformation($"Cats collection already has {count} documents. Skipping import.");
                        return;
                    }
                }

                var jsonPath = FindJsonFile("cats.json");
                if (string.IsNullOrEmpty(jsonPath) || !File.Exists(jsonPath))
                {
                    _logger.LogWarning($"Cats JSON file not found. Searched in multiple locations.");
                    return;
                }

                _logger.LogInformation($"Loading cats from: {jsonPath}");

                var jsonContent = await File.ReadAllTextAsync(jsonPath);
                var catsData = JsonSerializer.Deserialize<List<CatJsonModel>>(jsonContent);

                if (catsData == null || !catsData.Any())
                {
                    _logger.LogWarning("No cats data found in JSON file");
                    return;
                }

                var cats = catsData.Select(c => new cat_model
                {
                    CatId = c.id,
                    Name = c.name,
                    Weight = c.weight != null ? new cat_weight
                    {
                        Imperial = c.weight.imperial,
                        Metric = c.weight.metric
                    } : null,
                    CfaUrl = c.cfa_url,
                    VetstreetUrl = c.vetstreet_url,
                    VcahospitalsUrl = c.vcahospitals_url,
                    Temperament = c.temperament,
                    Origin = c.origin,
                    CountryCodes = c.country_codes,
                    CountryCode = c.country_code,
                    Description = c.description,
                    LifeSpan = c.life_span,
                    Indoor = c.indoor,
                    Lap = c.lap ?? 0,
                    AltNames = c.alt_names,
                    Adaptability = c.adaptability,
                    AffectionLevel = c.affection_level,
                    ChildFriendly = c.child_friendly,
                    DogFriendly = c.dog_friendly,
                    EnergyLevel = c.energy_level,
                    Grooming = c.grooming,
                    HealthIssues = c.health_issues,
                    Intelligence = c.intelligence,
                    SheddingLevel = c.shedding_level,
                    SocialNeeds = c.social_needs,
                    StrangerFriendly = c.stranger_friendly,
                    Vocalisation = c.vocalisation,
                    Experimental = c.experimental,
                    Hairless = c.hairless,
                    Natural = c.natural,
                    Rare = c.rare,
                    Rex = c.rex,
                    SuppressedTail = c.suppressed_tail,
                    ShortLegs = c.short_legs,
                    WikipediaUrl = c.wikipedia_url,
                    Hypoallergenic = c.hypoallergenic,
                    ReferenceImageId = c.reference_image_id,
                    ImageData = null, // Image data sẽ được lưu sau khi upload hoặc từ nguồn khác
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }).ToList();

                var success = await _catRepo.BulkInsertAsync(cats);
                if (success)
                {
                    _logger.LogInformation($"Successfully imported {cats.Count} cats");
                }
                else
                {
                    _logger.LogError("Failed to import cats");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing cats data");
            }
        }

        private async Task ImportDogsIfNeededAsync(bool force = false)
        {
            try
            {
                if (!force)
                {
                    var count = await _dogRepo.CountAsync();
                    if (count > 0)
                    {
                        _logger.LogInformation($"Dogs collection already has {count} documents. Skipping import.");
                        return;
                    }
                }

                var jsonPath = FindJsonFile("dogs.json");
                if (string.IsNullOrEmpty(jsonPath) || !File.Exists(jsonPath))
                {
                    _logger.LogWarning($"Dogs JSON file not found. Searched in multiple locations.");
                    return;
                }

                _logger.LogInformation($"Loading dogs from: {jsonPath}");

                var jsonContent = await File.ReadAllTextAsync(jsonPath);
                var dogsData = JsonSerializer.Deserialize<List<DogJsonModel>>(jsonContent);

                if (dogsData == null || !dogsData.Any())
                {
                    _logger.LogWarning("No dogs data found in JSON file");
                    return;
                }

                var dogs = dogsData.Select(d => new dog_model
                {
                    DogId = d.id,
                    Name = d.name,
                    Weight = d.weight != null ? new dog_weight
                    {
                        Imperial = d.weight.imperial,
                        Metric = d.weight.metric
                    } : null,
                    Height = d.height != null ? new dog_height
                    {
                        Imperial = d.height.imperial,
                        Metric = d.height.metric
                    } : null,
                    BredFor = d.bred_for,
                    BreedGroup = d.breed_group,
                    LifeSpan = d.life_span,
                    Temperament = d.temperament,
                    Origin = d.origin,
                    ReferenceImageId = d.reference_image_id,
                    Image = d.GetImageUrl(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }).ToList();

                var success = await _dogRepo.BulkInsertAsync(dogs);
                if (success)
                {
                    _logger.LogInformation($"Successfully imported {dogs.Count} dogs");
                }
                else
                {
                    _logger.LogError("Failed to import dogs");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing dogs data");
            }
        }
    }

    // Helper class for JSON deserialization
    public class CatJsonModel
    {
        public string id { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public WeightJson? weight { get; set; }
        public string? cfa_url { get; set; }
        public string? vetstreet_url { get; set; }
        public string? vcahospitals_url { get; set; }
        public string? temperament { get; set; }
        public string? origin { get; set; }
        public string? country_codes { get; set; }
        public string? country_code { get; set; }
        public string? description { get; set; }
        public string? life_span { get; set; }
        public int indoor { get; set; }
        public int? lap { get; set; }
        public string? alt_names { get; set; }
        public int adaptability { get; set; }
        public int affection_level { get; set; }
        public int child_friendly { get; set; }
        public int dog_friendly { get; set; }
        public int energy_level { get; set; }
        public int grooming { get; set; }
        public int health_issues { get; set; }
        public int intelligence { get; set; }
        public int shedding_level { get; set; }
        public int social_needs { get; set; }
        public int stranger_friendly { get; set; }
        public int vocalisation { get; set; }
        public int experimental { get; set; }
        public int hairless { get; set; }
        public int natural { get; set; }
        public int rare { get; set; }
        public int rex { get; set; }
        public int suppressed_tail { get; set; }
        public int short_legs { get; set; }
        public string? wikipedia_url { get; set; }
        public int hypoallergenic { get; set; }
        public string? reference_image_id { get; set; }
    }

    public class WeightJson
    {
        public string? imperial { get; set; }
        public string? metric { get; set; }
    }

    public class DogJsonModel
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public WeightJson? weight { get; set; }
        public HeightJson? height { get; set; }
        public string? bred_for { get; set; }
        public string? breed_group { get; set; }
        public string? life_span { get; set; }
        public string? temperament { get; set; }
        public string? origin { get; set; }
        public string? reference_image_id { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("image")]
        public System.Text.Json.JsonElement? image_element { get; set; }
        
        // Helper property để xử lý image có thể là string hoặc object
        public string? GetImageUrl()
        {
            if (image_element == null || !image_element.HasValue) return null;
            
            if (image_element.Value.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                return image_element.Value.GetString();
            }
            else if (image_element.Value.ValueKind == System.Text.Json.JsonValueKind.Object)
            {
                if (image_element.Value.TryGetProperty("url", out var urlElement))
                {
                    return urlElement.GetString();
                }
            }
            return null;
        }
    }

    public class HeightJson
    {
        public string? imperial { get; set; }
        public string? metric { get; set; }
    }

    public class ImageJson
    {
        public string? id { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public string? url { get; set; }
    }
}
