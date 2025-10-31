# 🛒 E-Commerce AI Project - Hướng Dẫn Sử Dụng

> **Website thương mại điện tử nâng cao với AI gợi ý, UX mượt và hệ thống quản trị hoàn chỉnh**

## 📚 Tài Liệu

Dự án này bao gồm các file hướng dẫn chi tiết:

1. **[BUILD_FULL_ECOMMERCE_AI_PROJECT.md](./BUILD_FULL_ECOMMERCE_AI_PROJECT.md)**
   - Hướng dẫn chi tiết từng bước build project
   - Quy tắc đặt tên file và folder
   - Cấu trúc thư mục chi tiết
   - Câu lệnh để hỏi Cursor
   - Docker & Deployment

2. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**
   - Hướng dẫn migrate code hiện tại sang cấu trúc mới
   - Mapping file cũ → mới
   - Convert JavaScript → TypeScript
   - Convert Context → Zustand

3. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**
   - Hướng dẫn cài đặt môi trường
   - Setup MongoDB, Redis
   - Cấu hình Environment variables
   - Troubleshooting

## 🚀 Quick Start

### 1. Đọc Tài Liệu

```bash
# Đọc file BUILD guide để hiểu rõ toàn bộ project
cat BUILD_FULL_ECOMMERCE_AI_PROJECT.md

# Đọc file SETUP guide để cài đặt
cat SETUP_GUIDE.md

# Nếu có code cũ, đọc MIGRATION guide
cat MIGRATION_GUIDE.md
```

### 2. Tạo Cấu Trúc Folder

```powershell
# Windows PowerShell
.\create-structure.ps1

# Hoặc tạo thủ công theo BUILD_FULL_ECOMMERCE_AI_PROJECT.md
```

### 3. Setup Project

```bash
# Backend
cd backend/ECommerceAI
dotnet restore
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

## 📖 Cách Sử Dụng Với Cursor

### Bước 1: Đọc BUILD Guide

Mở file `BUILD_FULL_ECOMMERCE_AI_PROJECT.md` và đọc từng giai đoạn.

### Bước 2: Hỏi Cursor Theo Từng Giai Đoạn

Copy câu lệnh từ mục **"Câu Lệnh Để Hỏi Cursor"** trong BUILD guide, ví dụ:

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

### Bước 3: Follow Từng Giai Đoạn

1. **Giai Đoạn 1**: Setup (Ngày 1-5)
2. **Giai Đoạn 2**: Layout & Routing (Ngày 6-10)
3. **Giai Đoạn 3**: Authentication (Ngày 11-15)
4. **Giai Đoạn 4**: Products & AI (Ngày 16-25)
5. **Giai Đoạn 5**: Cart & Checkout (Ngày 26-35)
6. **Giai Đoạn 6**: Admin Dashboard (Ngày 36-45)
7. **Giai Đoạn 7**: UX & Animation (Ngày 46-55)
8. **Giai Đoạn 8**: AI Chatbot (Ngày 56-65)
9. **Giai Đoạn 9**: Testing & Deployment (Ngày 66-70)

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18.x** + **TypeScript 5.x**
- **Material-UI (MUI) 6.x**
- **Zustand 4.x** - State management
- **React Router 7.x** - Routing
- **Axios** - HTTP client
- **Framer Motion 11.x** - Animation
- **Vite** - Build tool

### Backend
- **.NET 8.0** + **C# 12**
- **MongoDB 7.x** - Database
- **Redis 7.x** - Cache
- **JWT Bearer** - Authentication
- **Swagger** - API Documentation

### AI
- **Claude API** - AI Chatbot & Recommendations

## 📐 Quy Tắc Đặt Tên

### Frontend
- **Components**: `PascalCase.tsx` (ví dụ: `ProductCard.tsx`)
- **Pages**: `PascalCase + Page.tsx` (ví dụ: `HomePage.tsx`)
- **Hooks**: `use + camelCase.ts` (ví dụ: `useCartStore.ts`)
- **Services**: `camelCase + Service.ts` (ví dụ: `productService.ts`)
- **Folders**: `kebab-case` (ví dụ: `product-detail/`)

### Backend
- **Controllers**: `PascalCase + Controller.cs` (ví dụ: `ProductController.cs`)
- **Models**: `PascalCase + Model.cs` (ví dụ: `ProductModel.cs`)
- **Services**: `PascalCase + Service.cs` (ví dụ: `ProductService.cs`)
- **Folders**: `PascalCase` (ví dụ: `Controllers/`)

## 🗂️ Cấu Trúc Thư Mục

```
project/
├── frontend/          # React + TypeScript + MUI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── ...
│   └── package.json
│
├── backend/           # C# .NET Web API
│   └── ECommerceAI/
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── ...
│
├── BUILD_FULL_ECOMMERCE_AI_PROJECT.md
├── MIGRATION_GUIDE.md
├── SETUP_GUIDE.md
└── README_PROJECT.md
```

## ✅ Checklist

- [x] Tạo BUILD guide chi tiết
- [x] Tạo MIGRATION guide
- [x] Tạo SETUP guide
- [x] Tạo script tạo cấu trúc folder
- [x] Tạo README

## 📝 Notes

- **Không xóa code cũ ngay**: Giữ lại để tham chiếu khi migrate
- **Test từng module**: Đảm bảo hoạt động trước khi chuyển sang module tiếp theo
- **Follow từng giai đoạn**: Không nhảy cóc, làm từng bước một
- **Backup code**: Commit vào git trước khi thay đổi lớn

## 🆘 Support

Nếu gặp vấn đề:
1. Đọc lại file guide tương ứng
2. Check logs và console errors
3. Verify environment variables
4. Check documentation links trong BUILD guide

---

**Chúc bạn build thành công! 🚀**

