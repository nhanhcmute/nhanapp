using MongoDB.Driver;
using ECommerceAI.Models.User;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class UserRepo : IUserRepo
    {
        private readonly IMongoCollection<user_model> _users;

        public UserRepo(MongoContext context)
        {
            _users = context.Database.GetCollection<user_model>("users");
        }

        public async Task<user_model?> GetByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<user_model?> GetByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<user_model?> GetByIdAsync(string id)
        {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<user_model?> LoginAsync(string username, string password)
        {
            return await _users.Find(u => u.Username == username && u.Password == password)
                .FirstOrDefaultAsync();
        }

        public async Task<user_model> CreateAsync(user_model user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<user_model> UpdateAsync(string id, user_model user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            await _users.ReplaceOneAsync(u => u.Id == id, user);
            return user;
        }

        public async Task<bool> UpdatePasswordAsync(string username, string newPassword)
        {
            var update = Builders<user_model>.Update
                .Set(u => u.Password, newPassword)
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            var result = await _users.UpdateOneAsync(
                u => u.Username == username,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<bool> IsUsernameExistsAsync(string username)
        {
            var count = await _users.CountDocumentsAsync(u => u.Username == username);
            return count > 0;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            var count = await _users.CountDocumentsAsync(u => u.Email == email);
            return count > 0;
        }

        public async Task<bool> UpdateLastLoginAsync(string id)
        {
            var update = Builders<user_model>.Update
                .Set(u => u.LastLogin, DateTime.UtcNow);

            var result = await _users.UpdateOneAsync(
                u => u.Id == id,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<user_model?> FindByIdAsync(string id, CancellationToken ct)
        {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync(ct);
        }

        public async Task<user_model?> FindByUsernameAsync(string username, CancellationToken ct)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync(ct);
        }


    }
}

