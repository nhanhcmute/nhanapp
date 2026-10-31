namespace ECommerceAI.DTOs.VetAi
{
    public class VetAiChatMessage
    {
        /// <summary>"user" hoặc "assistant"</summary>
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class VetAiPetInfo
    {
        public string? Name { get; set; }
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? Sex { get; set; }
        public string? Age { get; set; }
        public double? Weight { get; set; }
    }

    public class VetAiChatRequest
    {
        /// <summary>Lịch sử hội thoại, tin cuối cùng là câu hỏi của người dùng</summary>
        public List<VetAiChatMessage> Messages { get; set; } = new();
        public VetAiPetInfo? Pet { get; set; }
        /// <summary>Thời gian triệu chứng đã xuất hiện (đã dịch sẵn ở frontend)</summary>
        public string? Duration { get; set; }
        /// <summary>Nhóm triệu chứng (đã dịch sẵn ở frontend)</summary>
        public List<string>? Symptoms { get; set; }
        /// <summary>"vi" hoặc "en"</summary>
        public string Lang { get; set; } = "vi";
    }

    public class VetAiChatResponse
    {
        public string Reply { get; set; } = string.Empty;
        /// <summary>true khi phát hiện dấu hiệu cấp cứu - frontend hiển thị dạng cảnh báo đỏ</summary>
        public bool Emergency { get; set; }
    }
}
