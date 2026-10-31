// Dữ liệu minh họa cho module Thú y thông minh.
// Văn bản song ngữ dạng { vi, en } được hiển thị qua pick() của useLanguage().
// Khi có API backend (/api/pets, /api/appointments...) thì thay thế bằng dữ liệu thật.

export const SPECIES = {
  dog: { emoji: '🐶', bg: '#fff3dc' },
  cat: { emoji: '🐱', bg: '#f5edff' },
  other: { emoji: '🐰', bg: '#e9f6ff' },
};

export const initialPets = [
  { id: 'p1', name: 'Milo', species: 'dog', breed: 'Poodle', sex: 'male', age: 2, weight: 5.2, status: 'healthy' },
  { id: 'p2', name: 'Miu', species: 'cat', breed: { vi: 'Mèo Anh lông ngắn', en: 'British Shorthair' }, sex: 'female', age: 1, weight: 3.8, status: 'reminder' },
];

export const initialVaccines = [
  { id: 'v1', petId: 'p1', name: { vi: 'Vaccine tổng hợp · nhắc lại', en: 'Combination vaccine · booster' }, date: '2026-11-05', status: 'upcoming' },
  { id: 'v2', petId: 'p1', name: { vi: 'Vaccine dại · đã ghi nhận', en: 'Rabies vaccine · recorded' }, date: '2026-08-10', status: 'done' },
  { id: 'v3', petId: 'p2', name: { vi: 'Vaccine tổng hợp · đã ghi nhận', en: 'Combination vaccine · recorded' }, date: '2026-06-12', status: 'done' },
  { id: 'v4', petId: 'p2', name: { vi: 'Vaccine dại · đã ghi nhận', en: 'Rabies vaccine · recorded' }, date: '2026-06-25', status: 'done' },
];

// month: tháng trong năm (1-12)
export const initialWeights = [
  { petId: 'p1', month: 6, kg: 4.4 },
  { petId: 'p1', month: 7, kg: 4.6 },
  { petId: 'p1', month: 8, kg: 4.8 },
  { petId: 'p1', month: 9, kg: 5.0 },
  { petId: 'p1', month: 10, kg: 5.2 },
  { petId: 'p2', month: 6, kg: 3.2 },
  { petId: 'p2', month: 7, kg: 3.4 },
  { petId: 'p2', month: 8, kg: 3.5 },
  { petId: 'p2', month: 9, kg: 3.7 },
  { petId: 'p2', month: 10, kg: 3.8 },
];

export const initialVisits = [
  {
    id: 'h1', petId: 'p1', date: '2026-09-02',
    type: { vi: 'Khám tổng quát', en: 'General check-up' },
    detail: { vi: 'Bác sĩ ghi nhận sức khỏe ổn định.', en: 'The vet noted stable health.' },
  },
  {
    id: 'h2', petId: 'p2', date: '2026-07-18',
    type: { vi: 'Tư vấn dinh dưỡng', en: 'Nutrition consultation' },
    detail: { vi: 'Điều chỉnh khẩu phần theo cân nặng.', en: 'Adjusted portions based on weight.' },
  },
];

export const initialReminders = [
  {
    id: 'r1', date: '2026-11-05', tone: 'pink', icon: 'shield',
    title: { vi: 'Tiêm nhắc vaccine tổng hợp · Milo', en: 'Combination vaccine booster · Milo' },
    note: { vi: 'Nhắc lịch theo hồ sơ sức khỏe', en: 'Reminder from health records' },
  },
  {
    id: 'r2', date: '2026-11-12', tone: 'green', icon: 'heart',
    title: { vi: 'Tẩy giun định kỳ · Miu', en: 'Routine deworming · Miu' },
    note: { vi: 'Xác nhận với bác sĩ trước khi thực hiện', en: 'Confirm with your vet first' },
  },
  {
    id: 'r3', date: '2026-11-18', tone: 'blue', icon: 'calendar',
    title: { vi: 'Kiểm tra sức khỏe tổng quát', en: 'General health check' },
    note: { vi: 'Dự kiến · Chưa đặt lịch', en: 'Planned · Not booked yet' },
  },
];

export const doctors = [
  {
    id: 'd1', name: { vi: 'BS. Minh Anh', en: 'Dr. Minh Anh' }, rating: 4.9, avatar: '👩‍⚕️', available: true,
    specialty: { vi: 'Khám tổng quát · Chó & mèo', en: 'General check-ups · Dogs & cats' },
  },
  {
    id: 'd2', name: { vi: 'BS. Tuấn Kiệt', en: 'Dr. Tuấn Kiệt' }, rating: 4.8, avatar: '👨‍⚕️', available: false,
    specialty: { vi: 'Tư vấn dinh dưỡng · Chăm sóc dự phòng', en: 'Nutrition advice · Preventive care' },
  },
];

export const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// Mã nhóm triệu chứng / khoảng thời gian, nhãn nằm trong petCare.chat.symptoms / durations
export const symptomGroups = ['eating', 'digestion', 'skin', 'breathing', 'movement', 'other'];

export const durations = ['lt24h', 'd1to3', 'd4to7', 'gt1w'];

export const articles = [
  {
    id: 'a1', emoji: '💉', gradient: 'linear-gradient(135deg, #ffe3ea 0%, #ffd0db 100%)',
    tag: { vi: 'Phòng bệnh', en: 'Prevention' },
    title: { vi: 'Làm sao để không bỏ lỡ lịch tiêm phòng?', en: 'How not to miss a vaccination' },
    summary: { vi: 'Ghi lại các mũi đã tiêm và những ngày cần theo dõi tiếp theo.', en: 'Log the shots given and the next dates to watch.' },
    body: {
      vi: 'Tiêm phòng giúp giảm nguy cơ mắc một số bệnh truyền nhiễm. Hãy mang hồ sơ của bé đến bác sĩ để lập lịch dựa trên độ tuổi, loài và tình trạng sức khỏe.',
      en: "Vaccination lowers the risk of some infectious diseases. Bring your pet's records to the vet to plan a schedule based on age, species and health.",
    },
  },
  {
    id: 'a2', emoji: '🚨', gradient: 'linear-gradient(135deg, #fff1dc 0%, #ffe0bf 100%)',
    tag: { vi: 'Cảnh báo', en: 'Warning' },
    title: { vi: '6 dấu hiệu không nên chờ tư vấn trực tuyến', en: "6 signs you shouldn't wait on online advice" },
    summary: { vi: 'Nhận biết tình huống khẩn cấp để đưa bé đến bác sĩ kịp thời.', en: 'Recognise emergencies so your pet gets to a vet in time.' },
    body: {
      vi: 'Các dấu hiệu như khó thở, co giật, bất tỉnh, chảy máu nghiêm trọng hoặc nghi ngộ độc cần được bác sĩ thú y đánh giá khẩn cấp. Không trì hoãn để chờ tư vấn trực tuyến.',
      en: "Signs such as trouble breathing, seizures, collapse, heavy bleeding or suspected poisoning need urgent veterinary care. Don't delay to wait for online advice.",
    },
  },
  {
    id: 'a3', emoji: '🥗', gradient: 'linear-gradient(135deg, #e3f8ec 0%, #cdf0dd 100%)',
    tag: { vi: 'Dinh dưỡng', en: 'Nutrition' },
    title: { vi: 'Chọn chế độ dinh dưỡng phù hợp cho bé', en: 'Choosing the right diet for your pet' },
    summary: { vi: 'Những điều cần theo dõi về ăn uống và cân nặng hằng ngày.', en: 'What to watch in daily eating and weight.' },
    body: {
      vi: 'Thức ăn cần phù hợp với loài, độ tuổi, mức hoạt động và bệnh nền. Không tự ý thay đổi chế độ ăn đặc biệt khi thú cưng đang điều trị mà chưa trao đổi bác sĩ.',
      en: "Food should suit the species, age, activity level and any health conditions. Don't change a special diet during treatment without talking to your vet.",
    },
  },
  {
    id: 'a4', emoji: '🪥', gradient: 'linear-gradient(135deg, #e6f0ff 0%, #d3e3ff 100%)',
    tag: { vi: 'Chăm sóc', en: 'Care' },
    title: { vi: 'Chăm sóc răng miệng tại nhà cho chó mèo', en: 'Dental care at home for dogs and cats' },
    summary: { vi: 'Những thói quen nhỏ để răng miệng của bé được chăm sóc tốt.', en: "Small habits that keep your pet's teeth healthy." },
    body: {
      vi: 'Tạo thói quen vệ sinh răng miệng nhẹ nhàng với dụng cụ dành cho thú cưng. Nếu có hôi miệng nặng, đau hoặc bỏ ăn, hãy đặt lịch kiểm tra.',
      en: 'Build a gentle tooth-cleaning routine with pet-specific tools. If there is strong bad breath, pain or loss of appetite, book a check-up.',
    },
  },
  {
    id: 'a5', emoji: '📈', gradient: 'linear-gradient(135deg, #f1eaff 0%, #e3d6ff 100%)',
    tag: { vi: 'Sức khỏe', en: 'Health' },
    title: { vi: 'Vì sao nên theo dõi cân nặng thường xuyên?', en: 'Why track weight regularly?' },
    summary: { vi: 'Lưu mốc thay đổi để dễ trao đổi với bác sĩ trong mỗi lần khám.', en: 'Log changes so each vet visit is easier.' },
    body: {
      vi: 'Ghi cân nặng vào cùng thời điểm và điều kiện tương tự nhau để nhận biết thay đổi. Tăng hoặc giảm cân nhanh, không rõ nguyên nhân cần bác sĩ kiểm tra.',
      en: 'Weigh at the same time and under similar conditions to spot changes. Fast, unexplained weight gain or loss needs a vet check.',
    },
  },
  {
    id: 'a6', emoji: '🏡', gradient: 'linear-gradient(135deg, #ffe6ec 0%, #ffd6e0 100%)',
    tag: { vi: 'Mẹo hay', en: 'Tips' },
    title: { vi: 'Biến ngôi nhà thành nơi an toàn cho bé', en: 'Making your home safe for pets' },
    summary: { vi: 'Những điều đơn giản để giảm nguy cơ tai nạn tại nhà.', en: 'Simple steps to reduce accidents at home.' },
    body: {
      vi: 'Giữ các vật sắc nhọn, thuốc của người, hóa chất và thực phẩm nguy hiểm ngoài tầm với của thú cưng. Khi nghi ngờ bé đã nuốt chất độc, hãy đến cơ sở thú y ngay.',
      en: 'Keep sharp objects, human medication, chemicals and dangerous foods out of reach. If you suspect your pet swallowed something toxic, go to a vet clinic right away.',
    },
  },
];

export const initialCases = [
  {
    id: 'c1', petName: 'Milo', species: 'dog', state: 'pending', time: { vi: '08:45 hôm nay', en: '08:45 today' },
    description: { vi: 'Bỏ ăn từ sáng, chủ nuôi muốn được tư vấn.', en: 'Not eating since this morning; owner wants advice.' },
  },
  {
    id: 'c2', petName: 'Bông', species: 'cat', state: 'pending', time: { vi: '09:10 hôm nay', en: '09:10 today' },
    description: { vi: 'Ngứa tai kéo dài, yêu cầu xem hình ảnh.', en: 'Ongoing ear itching; asked for photos to be reviewed.' },
  },
  {
    id: 'c3', petName: 'Na', species: 'dog', state: 'processing', time: { vi: 'Hôm qua', en: 'Yesterday' },
    description: { vi: 'Theo dõi sau buổi khám định kỳ.', en: 'Follow-up after a routine check-up.' },
  },
  {
    id: 'c4', petName: 'Miu', species: 'cat', state: 'done', time: { vi: '29/10', en: 'Oct 29' },
    description: { vi: 'Đã hoàn tất tư vấn phòng bệnh.', en: 'Preventive care consultation completed.' },
  },
];
