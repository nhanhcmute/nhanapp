# Thiết kế giao diện Thú y thông minh

Bản mẫu giao diện responsive (desktop và mobile) dành cho website cửa hàng thú cưng. Được phát triển bằng **HTML + CSS + JavaScript thuần trong 1 file**, không yêu cầu cài thư viện.

## Mở bản mẫu

Mở `thu-y-thong-minh-prototype.html` bằng Chrome, Brave, Edge hoặc Firefox. Chọn từng mục ở sidebar và thử các chức năng.

## 7 màn hình

| Màn hình | Nội dung |
| --- | --- |
| Tổng quan | Hero, cảnh báo an toàn, 4 thao tác nhanh, hồ sơ thú cưng, lịch chăm sóc sắp tới |
| Tư vấn thú y AI | Khung chat, chọn hồ sơ bé, thời gian/nhóm triệu chứng, chọn ảnh/video, câu hỏi mẫu, cảnh báo dấu hiệu cấp cứu |
| Hồ sơ thú cưng | Thêm, sửa và xem các bé; giới tính, giống, tuổi, cân nặng |
| Sổ sức khỏe | Lịch tiêm minh họa, biểu đồ cân nặng, lịch sử khám, thêm ghi chú |
| Đặt lịch khám | Chọn bác sĩ demo, bé, ngày, giờ, mô tả lý do và gửi yêu cầu giả lập |
| Cẩm nang chăm sóc | Thẻ nội dung, xem chi tiết hướng dẫn phổ thông |
| Bảng điều khiển bác sĩ | 3 cột ca chờ/đang xử lý/hoàn tất, thay đổi trạng thái giả lập |

## Những thao tác đã có trong bản mẫu

- Điều hướng qua 7 màn hình; menu cuộn ngang trên thiết bị di động.
- Thêm/sửa hồ sơ thú cưng (chỉ lưu trong bộ nhớ trang, tải lại sẽ khôi phục dữ liệu demo).
- Chat dựa trên câu trả lời mẫu có logic nhận biết một số dấu hiệu cảnh báo. Không gửi dữ liệu ra máy chủ.
- Chọn nhóm triệu chứng, ngày giờ hẹn, bác sĩ và thú cưng.
- Thêm ghi chú sức khỏe; đổi trạng thái ca trong bảng bác sĩ.
- Hiển thị thông báo thử nghiệm cho các tương tác.

## Gợi ý tích hợp React + Tailwind + .NET + MongoDB

```text
src/features/pet-care/
  pages/
    CareDashboardPage.tsx
    AiConsultationPage.tsx
    PetProfilesPage.tsx
    HealthRecordsPage.tsx
    BookAppointmentPage.tsx
    HealthArticlesPage.tsx
  components/
    PetCard.tsx
    ChatMessage.tsx
    SymptomForm.tsx
    VaccineTimeline.tsx
    DoctorCard.tsx
    BookingSummary.tsx
src/features/vet-portal/
  pages/
    VetCasesPage.tsx
```

Gợi ý các routes:

```text
/pet-care
/pet-care/ai-consultation
/pet-care/pets
/pet-care/health
/pet-care/appointments
/pet-care/articles
/vet/consultations   (phân quyền veterinarian/admin)
```

Gợi ý API (chưa triển khai):

```text
GET    /api/pets
POST   /api/pets
PATCH  /api/pets/{pet_id}
GET    /api/pets/{pet_id}/health-records
POST   /api/pets/{pet_id}/health-records
POST   /api/vet-ai/triage
GET    /api/appointments
POST   /api/appointments
GET    /api/vet/consultations
PATCH  /api/vet/consultations/{consultation_id}
```

MongoDB collections dự kiến: `pets`, `pet_health_records`, `pet_reminders`, `vet_ai_conversations`, `vet_consultations`, `vet_appointments`, `health_articles`, `veterinarian_profiles`.

## Nguyên tắc an toàn khi triển khai AI thực tế

- Dùng AI để giải thích thông tin, đặt câu hỏi bổ sung và phân loại mức độ ưu tiên; không khẳng định chẩn đoán, không tự kê đơn thuốc.
- Các dấu hiệu nguy hiểm như khó thở, co giật, bất tỉnh hoặc nghi ngộ độc cần chuyển hướng liên hệ cấp cứu ngay. Kiểm tra quy tắc cảnh báo ở cả backend, không chỉ dựa vào câu trả lời từ mô hình AI.
- Lịch tiêm, thuốc phòng ngừa và điều trị phải được bác sĩ xác nhận, không tự động suy luận chỉ từ tuổi hoặc loài.
- Yêu cầu người dùng đồng ý trước khi lưu cuộc hội thoại, ảnh hoặc chia sẻ hồ sơ cho bác sĩ; bảo vệ quyền truy cập và ghi nhật ký thao tác.
- Phân quyền giao diện bác sĩ; dữ liệu của mỗi khách hàng chỉ được truy cập khi có quyền hợp lệ.
- Khi đặt lịch thật, cần đồng bộ slot trống với phòng khám, xác nhận lịch bằng server và gửi thông báo.

## Lưu ý

Đây là **bản thiết kế UI tương tác**, không phải ứng dụng triển khai production. Tên bác sĩ, ca tư vấn, lịch sử sức khỏe và lịch hẹn là dữ liệu minh họa. Chat là mô phỏng có nhánh phản hồi, không kết nối AI thật. Dữ liệu không được lưu khi tải lại trang.
