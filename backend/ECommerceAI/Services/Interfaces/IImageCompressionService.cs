namespace ECommerceAI.Services.Interfaces
{
    public interface IImageCompressionService
    {
        // Resize + nén một ảnh base64 (data URL hoặc base64 thuần) về kích thước/chất
        // lượng nhỏ hơn, trả về dạng data URL "data:image/jpeg;base64,...". Nếu input
        // rỗng hoặc không giải mã được thì trả nguyên input (không throw).
        string? CompressBase64Image(string? base64DataUrl, int maxDimension = 400, int quality = 70);
    }
}
