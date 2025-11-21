using ECommerceAI.Models.Address;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;
using MongoDB.Driver;
using MongoDB.Bson;

namespace ECommerceAI.Repositories.Implementations
{
    public class AddressRepo : IAddressRepo 
    {
        private readonly IMongoCollection<address_model> _addresses;

        public AddressRepo(IMongoDatabase db) 
        {
            _addresses = db.GetCollection<address_model>("addresses");
        }

        public AddressRepo(MongoContext context)
        {
            _addresses = context.Database.GetCollection<address_model>("addresses");
        }

        public string GenerateId() => ObjectId.GenerateNewId().ToString();

        public async Task<List<address_model>> GetByUserIdAsync(string user_id)
        {
            try 
            {
                if (!ObjectId.TryParse(user_id, out _))
                {
                    throw new ArgumentException($"Invalid user_id format: {user_id}", nameof(user_id));
                }
                return await _addresses.Find(a => a.user_id == user_id).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting addresses for user {user_id}: {ex.Message}", ex);
            }
        }

        public async Task<address_model?> GetByIdAsync(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                {
                    throw new ArgumentException($"Invalid id format: {id}", nameof(id));
                }
                return await _addresses.Find(a => a.id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting address {id}: {ex.Message}", ex);
            }
        }

        public async Task<address_model> CreateAsync(address_model model, bool setDefault)
        {
            try
            {
                if (string.IsNullOrEmpty(model.id))
                {
                    model.id = GenerateId();
                }

                // Validate user_id
                if (!ObjectId.TryParse(model.user_id, out _))
                {
                    throw new ArgumentException($"Invalid user_id format: {model.user_id}", nameof(model.user_id));
                }

                await _addresses.InsertOneAsync(model);
                
                if (setDefault)
                {
                    await SetDefaultAsync(model.user_id, model.id);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating address: {ex.Message}", ex);
            }
        }

        public async Task<address_model> UpdateAsync(string id, address_model updated, bool setDefault)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                {
                    throw new ArgumentException($"Invalid id format: {id}", nameof(id));
                }

                if (!ObjectId.TryParse(updated.user_id, out _))
                {
                    throw new ArgumentException($"Invalid user_id format: {updated.user_id}", nameof(updated.user_id));
                }

                await _addresses.ReplaceOneAsync(a => a.id == id, updated);
                
                if (setDefault)
                {
                    await SetDefaultAsync(updated.user_id, id);
                }

                return updated;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating address {id}: {ex.Message}", ex);
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out _))
                {
                    throw new ArgumentException($"Invalid id format: {id}", nameof(id));
                }

                var result = await _addresses.DeleteOneAsync(a => a.id == id);
                return result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting address {id}: {ex.Message}", ex);
            }
        }

        public async Task SetDefaultAsync(string user_id, string id)
        {
            try
            {
                if (!ObjectId.TryParse(user_id, out _))
                {
                    throw new ArgumentException($"Invalid user_id format: {user_id}", nameof(user_id));
                }

                if (!ObjectId.TryParse(id, out _))
                {
                    throw new ArgumentException($"Invalid id format: {id}", nameof(id));
                }

                // First, unset default for all user's addresses
                var update = Builders<address_model>.Update.Set(a => a.is_default, false);
                await _addresses.UpdateManyAsync(a => a.user_id == user_id, update);

                // Then set the specified address as default
                update = Builders<address_model>.Update.Set(a => a.is_default, true);
                await _addresses.UpdateOneAsync(a => a.id == id, update);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error setting default address: {ex.Message}", ex);
            }
        }

        public async Task<List<address_model>> FindByUserIdAsync(string user_id, CancellationToken ct)
        {
            try
            {
                if (!ObjectId.TryParse(user_id, out _))
                {
                    throw new ArgumentException($"Invalid user_id format: {user_id}", nameof(user_id));
                }
                return await _addresses.Find(a => a.user_id == user_id).ToListAsync(ct);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error finding addresses for user {user_id}: {ex.Message}", ex);
            }
        }
    }
}
