using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Product;
using ECommerceAI.Models.Common;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class ProductRepo : IProductRepo
    {
        private readonly IMongoCollection<product_model> _products;

        public ProductRepo(MongoContext context)
        {
            _products = context.Database.GetCollection<product_model>("products");
        }

        public async Task<IEnumerable<product_model>> GetAllAsync()
        {
            // Tối ưu: Chỉ lấy sản phẩm còn hàng, giới hạn số lượng, và sort theo index
            // Sử dụng index trên Status và CreatedAt để tăng tốc độ query
            var filter = Builders<product_model>.Filter.Eq(p => p.Status, "Còn hàng");
            
            return await _products
                .Find(filter)
                .SortByDescending(p => p.CreatedAt) // Sử dụng index trên CreatedAt
                .Limit(500) // Giảm limit xuống 500 để tăng tốc độ
                .ToListAsync();
        }

        public async Task<product_model?> GetByIdAsync(string id)
        {
            // Hỗ trợ cả string thường và ObjectId
            // Luôn dùng FilterDefinition để tránh lỗi serialization với BsonRepresentation
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                // Nếu là ObjectId hợp lệ (24 ký tự hex), tìm theo ObjectId
                var filter = Builders<product_model>.Filter.Eq("_id", parsedObjectId);
                return await _products.Find(filter).FirstOrDefaultAsync();
            }
            else
            {
                // Nếu là string thường (như "0", "abc", v.v.), tìm theo string
                // Dùng FilterDefinition thay vì lambda để tránh lỗi
                var filter = Builders<product_model>.Filter.Eq("_id", id);
                return await _products.Find(filter).FirstOrDefaultAsync();
            }
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
                .Skip(skip)
                .Limit(pageSize)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return new PaginationResponse<product_model>
            {
                Data = products,
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

            return await _products.Find(filter).ToListAsync();
        }

        public async Task<product_model> CreateAsync(product_model product)
        {
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            await _products.InsertOneAsync(product);
            return product;
        }

        public async Task<product_model> UpdateAsync(string id, product_model product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            
            // Hỗ trợ cả string thường và ObjectId
            FilterDefinition<product_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<product_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<product_model>.Filter.Eq("_id", id);
            }
            
            await _products.ReplaceOneAsync(filter, product);
            return product;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            // Hỗ trợ cả string thường và ObjectId
            FilterDefinition<product_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<product_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<product_model>.Filter.Eq("_id", id);
            }
            
            var result = await _products.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<long> CountAsync()
        {
            return await _products.CountDocumentsAsync(_ => true);
        }

        public async Task<IEnumerable<product_model>> GetSortedAsync(string sortBy)
        {
            return sortBy.ToLower() switch
            {
                "name" => await _products.Find(_ => true).SortBy(p => p.Name).ToListAsync(),
                "price" => await _products.Find(_ => true).SortBy(p => p.Price).ToListAsync(),
                "quantity" => await _products.Find(_ => true).SortBy(p => p.Quantity).ToListAsync(),
                _ => await _products.Find(_ => true).SortByDescending(p => p.CreatedAt).ToListAsync()
            };
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
                .Skip(skip)
                .Limit(pageSize)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return new PaginationResponse<product_model>
            {
                Data = products,
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

            var query = _products.Find(_ => true).Skip(skip).Limit(pageSize);

            var products = sortBy.ToLower() switch
            {
                "name" => await query.SortBy(p => p.Name).ToListAsync(),
                "price" => await query.SortBy(p => p.Price).ToListAsync(),
                "quantity" => await query.SortBy(p => p.Quantity).ToListAsync(),
                _ => await query.SortByDescending(p => p.CreatedAt).ToListAsync()
            };

            return new PaginationResponse<product_model>
            {
                Data = products,
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }
    }
}

