using MongoDB.Driver;
using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class CatRepo : ICatRepo
    {
        private readonly IMongoCollection<CatModel> _cats;

        public CatRepo(MongoContext context)
        {
            _cats = context.Database.GetCollection<CatModel>("cats");
        }

        public async Task<IEnumerable<CatModel>> GetAllAsync()
        {
            return await _cats.Find(cat => true).ToListAsync();
        }

        public async Task<CatModel?> GetByIdAsync(string id)
        {
            return await _cats.Find(cat => cat.Id == id).FirstOrDefaultAsync();
        }

        public async Task<CatModel?> GetByCatIdAsync(string catId)
        {
            return await _cats.Find(cat => cat.CatId == catId).FirstOrDefaultAsync();
        }

        public async Task<PaginationResponse<CatModel>> GetPagedAsync(int page, int pageSize)
        {
            var totalCount = await _cats.CountDocumentsAsync(_ => true);
            var skip = (page - 1) * pageSize;
            
            var cats = await _cats
                .Find(_ => true)
                .Skip(skip)
                .Limit(pageSize)
                .SortBy(cat => cat.Name)
                .ToListAsync();

            return new PaginationResponse<CatModel>
            {
                Data = cats,
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<IEnumerable<CatModel>> SearchAsync(string searchTerm)
        {
            var filter = Builders<CatModel>.Filter.Or(
                Builders<CatModel>.Filter.Regex(cat => cat.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<CatModel>.Filter.Regex(cat => cat.Origin, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<CatModel>.Filter.Regex(cat => cat.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<CatModel>.Filter.Regex(cat => cat.Temperament, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );

            return await _cats.Find(filter).ToListAsync();
        }

        public async Task<CatModel> CreateAsync(CatModel cat)
        {
            cat.CreatedAt = DateTime.UtcNow;
            cat.UpdatedAt = DateTime.UtcNow;
            await _cats.InsertOneAsync(cat);
            return cat;
        }

        public async Task<CatModel> UpdateAsync(string id, CatModel cat)
        {
            cat.UpdatedAt = DateTime.UtcNow;
            await _cats.ReplaceOneAsync(c => c.Id == id, cat);
            return cat;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _cats.DeleteOneAsync(cat => cat.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<long> CountAsync()
        {
            return await _cats.CountDocumentsAsync(_ => true);
        }

        public async Task<bool> BulkInsertAsync(IEnumerable<CatModel> cats)
        {
            try
            {
                foreach (var cat in cats)
                {
                    cat.CreatedAt = DateTime.UtcNow;
                    cat.UpdatedAt = DateTime.UtcNow;
                }
                await _cats.InsertManyAsync(cats);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}

