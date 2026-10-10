using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Product;
using ECommerceAI.Models.Common;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.Repositories;
using ECommerceAI.Services.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class ProductRepo : IProductRepo
    {
        private readonly IMongoCollection<product_model> _products;
        private readonly IImageCompressionService _imageCompression;

        // Các API trả về DANH SÁCH (get_all/get_paged/search/sort) không cần ảnh gốc
        // full-size - rất nặng (có thể vài MB/ảnh dạng base64) - nên bỏ field "image"
        // ngay từ query Mongo, chỉ lấy "thumbnail_image" (đã resize/nén) để trả về.
        // Trang chi tiết (GetByIdAsync/GetByIdsAsync) vẫn lấy ảnh gốc như cũ.
        private static readonly ProjectionDefinition<product_model> ListProjection =
            Builders<product_model>.Projection.Exclude(p => p.Image);

        public ProductRepo(MongoContext context, IImageCompressionService imageCompression)
        {
            _products = context.Database.GetCollection<product_model>("products");
            _imageCompression = imageCompression;
        }

        // Dùng "thumbnail_image" làm giá trị "image" trả về cho các API danh sách, để
        // frontend không cần đổi gì (vẫn đọc product.image như cũ) nhưng payload nhẹ hơn
        // nhiều. Nếu sản phẩm cũ chưa có thumbnail (chưa chạy backfill) thì tạm thời
        // không có ảnh thay vì phải tải lại ảnh gốc nặng.
        private static IEnumerable<product_model> ApplyThumbnailForList(IEnumerable<product_model> products)
        {
            foreach (var product in products)
            {
                product.Image = product.ThumbnailImage;
            }
            return products;
        }

        public async Task<IEnumerable<product_model>> GetAllAsync()
        {
            // Tối ưu: Chỉ lấy sản phẩm còn hàng, giới hạn số lượng, và sort theo index
            // Sử dụng index trên Status và CreatedAt để tăng tốc độ query
            var filter = Builders<product_model>.Filter.Eq(p => p.Status, "Còn hàng");

            var products = await _products
                .Find(filter)
                .Project<product_model>(ListProjection)
                .SortByDescending(p => p.CreatedAt) // Sử dụng index trên CreatedAt
                .Limit(500) // Giảm limit xuống 500 để tăng tốc độ
                .ToListAsync();

            return ApplyThumbnailForList(products);
        }

        public async Task<product_model?> GetByIdAsync(string id)
        {
            // Hỗ trợ cả string thường và ObjectId
            // Luôn dùng FilterDefinition để tránh lỗi serialization với BsonRepresentation
            var filter = MongoFilterHelpers.ById<product_model>(id);
            return await _products.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<Dictionary<string, product_model>> GetByIdsAsync(IEnumerable<string> ids)
        {
            var result = new Dictionary<string, product_model>();
            if (ids == null || !ids.Any()) return result;

            // Tách thành ObjectId và string thường
            var objectIds = new List<ObjectId>();
            var stringIds = new List<string>();

            foreach (var id in ids.Distinct())
            {
                if (ObjectId.TryParse(id, out var parsedObjectId))
                {
                    objectIds.Add(parsedObjectId);
                }
                else
                {
                    stringIds.Add(id);
                }
            }

            // Build filter cho cả 2 loại
            var filters = new List<FilterDefinition<product_model>>();
            if (objectIds.Any())
            {
                filters.Add(Builders<product_model>.Filter.In("_id", objectIds));
            }
            if (stringIds.Any())
            {
                filters.Add(Builders<product_model>.Filter.In("_id", stringIds));
            }

            if (filters.Any())
            {
                var combinedFilter = filters.Count == 1 ? filters[0] : Builders<product_model>.Filter.Or(filters);
                var products = await _products.Find(combinedFilter).ToListAsync();

                foreach (var product in products)
                {
                    result[product.Id] = product;
                }
            }

            return result;
        }

        public async Task<PaginationResponse<product_model>> GetPagedAsync(int page, int pageSize)
        {
            var totalCount = await _products.CountDocumentsAsync(_ => true);
            var skip = (page - 1) * pageSize;

            var products = await _products
                .Find(_ => true)
                .Project<product_model>(ListProjection)
                .Skip(skip)
                .Limit(pageSize)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return new PaginationResponse<product_model>
            {
                Data = ApplyThumbnailForList(products),
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<IEnumerable<product_model>> SearchAsync(string searchTerm)
        {
            var filter = Builders<product_model>.Filter.Or(
                Builders<product_model>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<product_model>.Filter.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );

            var products = await _products.Find(filter).Project<product_model>(ListProjection).ToListAsync();
            return ApplyThumbnailForList(products);
        }

        public async Task<product_model> CreateAsync(product_model product)
        {
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            product.ThumbnailImage = _imageCompression.CompressBase64Image(product.Image);
            await _products.InsertOneAsync(product);
            return product;
        }

        public async Task<product_model> UpdateAsync(string id, product_model product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            product.ThumbnailImage = _imageCompression.CompressBase64Image(product.Image);

            // Hỗ trợ cả string thường và ObjectId
            var filter = MongoFilterHelpers.ById<product_model>(id);

            await _products.ReplaceOneAsync(filter, product);
            return product;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            // Hỗ trợ cả string thường và ObjectId
            var filter = MongoFilterHelpers.ById<product_model>(id);

            var result = await _products.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<long> CountAsync()
        {
            return await _products.CountDocumentsAsync(_ => true);
        }

        public async Task BackfillThumbnailsAsync()
        {
            var filter = Builders<product_model>.Filter.And(
                Builders<product_model>.Filter.Eq(p => p.ThumbnailImage, null),
                Builders<product_model>.Filter.Ne(p => p.Image, null)
            );

            // Chỉ lấy Id + Image, không cần các field khác cho việc tạo thumbnail
            var projection = Builders<product_model>.Projection
                .Include(p => p.Id)
                .Include(p => p.Image);

            var products = await _products.Find(filter).Project<product_model>(projection).ToListAsync();

            foreach (var product in products)
            {
                try
                {
                    var thumbnail = _imageCompression.CompressBase64Image(product.Image);
                    var updateFilter = MongoFilterHelpers.ById<product_model>(product.Id);
                    var update = Builders<product_model>.Update.Set(p => p.ThumbnailImage, thumbnail);
                    await _products.UpdateOneAsync(updateFilter, update);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Failed to backfill thumbnail for product {product.Id}: {ex.Message}");
                }
            }
        }

        public async Task<IEnumerable<product_model>> GetSortedAsync(string sortBy)
        {
            var query = _products.Find(_ => true).Project<product_model>(ListProjection);
            var products = sortBy.ToLower() switch
            {
                "name" => await query.SortBy(p => p.Name).ToListAsync(),
                "price" => await query.SortBy(p => p.Price).ToListAsync(),
                "quantity" => await query.SortBy(p => p.Quantity).ToListAsync(),
                _ => await query.SortByDescending(p => p.CreatedAt).ToListAsync()
            };
            return ApplyThumbnailForList(products);
        }

        public async Task<PaginationResponse<product_model>> SearchPagedAsync(string searchTerm, int page, int pageSize)
        {
            var filter = Builders<product_model>.Filter.Or(
                Builders<product_model>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<product_model>.Filter.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );

            var totalCount = await _products.CountDocumentsAsync(filter);
            var skip = (page - 1) * pageSize;

            var products = await _products
                .Find(filter)
                .Project<product_model>(ListProjection)
                .Skip(skip)
                .Limit(pageSize)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return new PaginationResponse<product_model>
            {
                Data = ApplyThumbnailForList(products),
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<PaginationResponse<product_model>> GetSortedPagedAsync(string sortBy, int page, int pageSize)
        {
            var totalCount = await _products.CountDocumentsAsync(_ => true);
            var skip = (page - 1) * pageSize;

            var query = _products.Find(_ => true).Project<product_model>(ListProjection).Skip(skip).Limit(pageSize);

            var products = sortBy.ToLower() switch
            {
                "name" => await query.SortBy(p => p.Name).ToListAsync(),
                "price" => await query.SortBy(p => p.Price).ToListAsync(),
                "quantity" => await query.SortBy(p => p.Quantity).ToListAsync(),
                _ => await query.SortByDescending(p => p.CreatedAt).ToListAsync()
            };

            return new PaginationResponse<product_model>
            {
                Data = ApplyThumbnailForList(products),
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }
    }
}
