// Phân loại câu hỏi cho trợ lý PetCare AI mô phỏng (chưa kết nối AI thật).
// Chỉ trả về mã câu trả lời; nội dung nằm trong petCare.chat.replies.* của từ điển i18n
// để tin nhắn cũ cũng đổi theo khi người dùng chuyển ngôn ngữ.
// Quy tắc phát hiện dấu hiệu khẩn cấp cũng phải được kiểm tra ở backend khi tích hợp AI thật.

export const EMERGENCY_PATTERN =
  /khó thở|khong tho|không thở|co giật|co giat|bất tỉnh|bat tinh|ngất|\bngat\b|chảy máu nhiều|chay mau nhieu|ngộ độc|ngo doc|độc chất|doc chat|can'?t breathe|not breathing|trouble breathing|seizure|convuls|unconscious|collaps|faint|heavy bleeding|bleeding a lot|poison|toxic/;

const RULES = [
  { key: 'digestion', pattern: /nôn|tiêu chảy|tieu chay|ói|vomit|diarrh|throw(ing)? up/ },
  { key: 'appetite', pattern: /bỏ ăn|\bbo an\b|ăn ít|\ban it\b|not eating|won'?t eat|no appetite|stopped eating|eating less/ },
  { key: 'vaccine', pattern: /tiêm|tiem|vaccin|vacxin|shot|booster/ },
  { key: 'skin', pattern: /\bda\b|lông|ngứa|ngua|skin|itch|fur|coat|rash|scratch/ },
];

export function classifyQuestion(question) {
  const low = question.toLowerCase();
  if (EMERGENCY_PATTERN.test(low)) return 'emergency';
  return RULES.find((r) => r.pattern.test(low))?.key || 'general';
}
