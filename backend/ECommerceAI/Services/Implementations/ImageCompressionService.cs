using ECommerceAI.Services.Interfaces;
using Microsoft.Extensions.Logging;
using SkiaSharp;

namespace ECommerceAI.Services.Implementations
{
    public class ImageCompressionService : IImageCompressionService
    {
        private readonly ILogger<ImageCompressionService> _logger;

        public ImageCompressionService(ILogger<ImageCompressionService> logger)
        {
            _logger = logger;
        }

        public string? CompressBase64Image(string? base64DataUrl, int maxDimension = 400, int quality = 70)
        {
            if (string.IsNullOrWhiteSpace(base64DataUrl))
            {
                return base64DataUrl;
            }

            // Một số sản phẩm cũ lưu "image" là tên file tĩnh (vd "sp40.jpg") thay vì
            // base64 nhúng trực tiếp - những giá trị này vốn đã rất nhẹ, không cần nén,
            // và không phải base64 nên bỏ qua sớm thay vì thử giải mã rồi lại fail.
            if (base64DataUrl.Length < 256)
            {
                return base64DataUrl;
            }

            try
            {
                var commaIndex = base64DataUrl.IndexOf(',');
                var base64Data = commaIndex >= 0 ? base64DataUrl[(commaIndex + 1)..] : base64DataUrl;
                var bytes = Convert.FromBase64String(base64Data);

                using var original = SKBitmap.Decode(bytes);
                if (original == null)
                {
                    return base64DataUrl;
                }

                SKBitmap toEncode = original;
                SKBitmap? resized = null;
                if (original.Width > maxDimension || original.Height > maxDimension)
                {
                    var scale = Math.Min((double)maxDimension / original.Width, (double)maxDimension / original.Height);
                    var newWidth = Math.Max(1, (int)Math.Round(original.Width * scale));
                    var newHeight = Math.Max(1, (int)Math.Round(original.Height * scale));
                    resized = original.Resize(new SKImageInfo(newWidth, newHeight), new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.None));
                    if (resized != null)
                    {
                        toEncode = resized;
                    }
                }

                using var skImage = SKImage.FromBitmap(toEncode);
                using var encoded = skImage.Encode(SKEncodedImageFormat.Jpeg, quality);
                resized?.Dispose();

                return $"data:image/jpeg;base64,{Convert.ToBase64String(encoded.ToArray())}";
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Không thể nén ảnh, giữ nguyên ảnh gốc");
                return base64DataUrl;
            }
        }
    }
}
