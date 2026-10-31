using MongoDB.Driver;
using ECommerceAI.Models.Settings;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class SettingsRepo : ISettingsRepo
    {
        private const string SettingsId = "store";
        private readonly IMongoCollection<store_settings_model> _settings;

        public SettingsRepo(MongoContext context)
        {
            _settings = context.Database.GetCollection<store_settings_model>("store_settings");
        }

        public async Task<store_settings_model> GetAsync()
        {
            var settings = await _settings.Find(s => s.Id == SettingsId).FirstOrDefaultAsync();
            return settings ?? new store_settings_model { Id = SettingsId };
        }

        public async Task<store_settings_model> UpdateAsync(store_settings_model settings)
        {
            settings.Id = SettingsId;
            settings.UpdatedAt = DateTime.UtcNow;
            await _settings.ReplaceOneAsync(
                s => s.Id == SettingsId,
                settings,
                new ReplaceOptions { IsUpsert = true }
            );
            return settings;
        }
    }
}
