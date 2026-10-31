using MongoDB.Driver;
using ECommerceAI.Models.Pet;
using ECommerceAI.Models.Common;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DataAccess;

namespace ECommerceAI.Repositories.Implementations
{
    public class DogRepo : IDogRepo
    {
        private readonly IMongoCollection<dog_model> _dogs;

        public DogRepo(MongoContext context)
        {
            _dogs = context.Database.GetCollection<dog_model>("dogs");
        }

        public async Task<IEnumerable<dog_model>> GetAllAsync()
        {
            return await _dogs.Find(_ => true).ToListAsync();
        }

        public async Task<dog_model?> GetByIdAsync(int id)
        {
            var filter = Builders<dog_model>.Filter.Eq(d => d.DogId, id);
            return await _dogs.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<PaginationResponse<dog_model>> GetPagedAsync(int page, int pageSize)
        {
            var totalCount = await _dogs.CountDocumentsAsync(_ => true);
            var skip = (page - 1) * pageSize;

            var dogs = await _dogs
                .Find(_ => true)
                .Skip(skip)
                .Limit(pageSize)
                .SortBy(d => d.Name)
                .ToListAsync();

            return new PaginationResponse<dog_model>
            {
                Data = dogs,
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<IEnumerable<dog_model>> SearchAsync(string searchTerm)
        {
            var filter = Builders<dog_model>.Filter.Or(
                Builders<dog_model>.Filter.Regex(d => d.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<dog_model>.Filter.Regex(d => d.Temperament, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<dog_model>.Filter.Regex(d => d.BreedGroup, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
            return await _dogs.Find(filter).ToListAsync();
        }

        public async Task<long> CountAsync()
        {
            return await _dogs.CountDocumentsAsync(_ => true);
        }

        public async Task<bool> BulkInsertAsync(IEnumerable<dog_model> dogs)
        {
            try
            {
                await _dogs.InsertManyAsync(dogs);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAllAsync()
        {
            try
            {
                await _dogs.DeleteManyAsync(_ => true);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
