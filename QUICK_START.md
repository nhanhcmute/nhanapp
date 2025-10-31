# ⚡ Quick Start - Bắt Đầu Nhanh

## 📋 Checklist Trước Khi Bắt Đầu

- [ ] Đã đọc `BUILD_FULL_ECOMMERCE_AI_PROJECT.md`
- [ ] Đã đọc `SETUP_GUIDE.md`
- [ ] Đã tạo cấu trúc folder (chạy `create-structure.ps1`)
- [ ] Đã cài đặt Node.js >= 18.x
- [ ] Đã cài đặt .NET SDK 8.0
- [ ] Đã setup MongoDB (Docker hoặc local)
- [ ] Đã setup Redis (Docker hoặc local)
- [ ] Đã có Claude API key

---

## 🚀 3 Bước Bắt Đầu

### Bước 1: Setup Environment

```bash
# Tạo .env cho frontend
cd frontend
copy ..\backend\appsettings.Example.json .env
# Sửa file .env với API key thực tế

# Tạo appsettings.json cho backend
cd ..\backend\ECommerceAI
copy ..\..\backend\appsettings.Example.json appsettings.json
# Sửa file appsettings.json với config thực tế
```

### Bước 2: Cài Đặt Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ..\backend\ECommerceAI
dotnet restore
```

### Bước 3: Chạy Project

**Terminal 1 - Backend:**
```bash
cd backend\ECommerceAI
dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 💬 Hỏi Cursor Theo Từng Giai Đoạn

### Giai Đoạn 1: Setup (Copy paste vào Cursor)

```
Tạo cấu trúc thư mục frontend theo chuẩn React + TypeScript + Vite:
- src/components/common/LoadingSpinner.tsx
- src/components/layout/Header.tsx, Footer.tsx
- src/pages/HomePage.tsx
- src/routes/AppRoutes.tsx
- src/services/api.ts với Axios instance
- src/store/useThemeStore.ts với Zustand

Sử dụng Material-UI cho components, TypeScript cho type safety.
```

### Giai Đoạn 2: Backend Setup (Copy paste vào Cursor)

```
Tạo backend C# .NET Web API với:
- Controllers/AuthController.cs
- Models/User/UserModel.cs
- Services/AuthService.cs với JWT authentication
- DataAccess/MongoContext.cs để kết nối MongoDB
- Program.cs setup dependency injection và CORS

Cấu hình appsettings.json với MongoDB connection string, JWT settings.
```

---

## 📁 Cấu Trúc Đã Tạo

### Frontend Folders
```
frontend/src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── auth/
│   └── ai/
├── pages/
│   └── admin/
├── services/
├── store/
├── types/
├── utils/
├── styles/
├── routes/
├── config/
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

### Backend Folders
```
backend/ECommerceAI/
├── Controllers/
├── Models/
│   ├── Product/
│   ├── User/
│   ├── Order/
│   ├── Auth/
│   └── Common/
├── DataAccess/
├── Repositories/
│   ├── Interfaces/
│   └── Implementations/
├── Services/
│   ├── Interfaces/
│   └── Implementations/
├── Middlewares/
├── Configurations/
├── Extensions/
├── Helpers/
├── DTOs/
└── Validators/
```

---

## 📚 Tài Liệu Tham Khảo

1. **BUILD_FULL_ECOMMERCE_AI_PROJECT.md** - Hướng dẫn chi tiết build toàn bộ project
2. **SETUP_GUIDE.md** - Hướng dẫn cài đặt và troubleshooting
3. **MIGRATION_GUIDE.md** - Hướng dẫn migrate code cũ
4. **README_PROJECT.md** - Tổng quan project

---

## ✅ Next Steps

1. Follow từng giai đoạn trong `BUILD_FULL_ECOMMERCE_AI_PROJECT.md`
2. Copy câu lệnh từ mục "Câu Lệnh Để Hỏi Cursor"
3. Paste vào Cursor và để AI sinh code
4. Test từng module trước khi chuyển sang module tiếp theo

---

**Chúc bạn build thành công! 🚀**

