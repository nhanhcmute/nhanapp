using ECommerceAI.Models.Settings;

namespace ECommerceAI.Repositories.Interfaces
{
    public interface ISettingsRepo
    {
        Task<store_settings_model> GetAsync();
        Task<store_settings_model> UpdateAsync(store_settings_model settings);
    }
}
