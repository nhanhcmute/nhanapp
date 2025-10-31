# 🚀 Hướng Dẫn Xây Dựng Website Thương Mại Điện Tử Nâng Cao (AI + UX + Admin)

> **Lộ trình chi tiết từng bước để xây dựng website thương mại điện tử hoàn chỉnh với AI gợi ý, UX cao cấp và hệ thống quản trị**

> **Công nghệ**: ReactJS + TypeScript + MUI (Frontend) | C# .NET 8 + MongoDB + Redis (Backend)

---

## 📋 Mục Lục

1. [Tổng Quan Dự Án](#-tổng-quan-dự-án)
2. [Quy Tắc Đặt Tên File & Folder](#-quy-tắc-đặt-tên-file--folder)
3. [Cấu Trúc Thư Mục Chi Tiết](#-cấu-trúc-thư-mục-chi-tiết)
4. [Ngôn Ngữ & Công Nghệ](#-ngôn-ngữ--công-nghệ)
5. [Các Bước Thực Hiện Chi Tiết](#-các-bước-thực-hiện-chi-tiết)
6. [Câu Lệnh Để Hỏi Cursor](#-câu-lệnh-để-hỏi-cursor)
7. [Docker & Deployment](#-docker--deployment)
8. [CI/CD & Testing](#-cicd--testing)

---

## 🎯 Tổng Quan Dự Án

### Mục tiêu
Xây dựng website thương mại điện tử với:
- 🏠 Trang chủ + AI gợi ý sản phẩm thông minh
- 🔍 Tìm kiếm nâng cao + lọc sản phẩm
- 🧾 Giỏ hàng, thanh toán, quản lý đơn hàng
- 👤 Hồ sơ cá nhân, đăng nhập/đăng ký với JWT
- 🧑‍💼 Trang quản trị chi tiết (Dashboard)
- 💬 AI chatbot tư vấn sản phẩm
- ⚡ UX mượt (Skeleton, animation, responsive)

### Công nghệ Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.x |
| **Frontend** | TypeScript | 5.x |
| **Frontend** | Material-UI (MUI) | 6.x |
| **Frontend** | Zustand | 4.x |
| **Frontend** | React Router | 7.x |
| **Frontend** | Framer Motion | 11.x |
| **Backend** | .NET | 8.0 |
| **Database** | MongoDB | 7.x |
| **Cache** | Redis | 7.x |
| **Auth** | JWT | - |
| **AI** | Claude API / OpenAI | - |

---

## 📐 Quy Tắc Đặt Tên File & Folder

### Frontend (React + TypeScript)

| Loại | Quy Tắc | Ví Dụ | Mô Tả |
|------|---------|-------|-------|
| **Component** | PascalCase | `ProductCard.tsx`, `UserProfile.tsx` | Components React |
| **Page** | PascalCase + "Page" | `HomePage.tsx`, `ProductDetailPage.tsx` | Trang chính |
| **Hook** | camelCase + "use" | `useCartStore.ts`, `useAuth.ts` | Custom hooks |
| **Service** | camelCase + "Service" | `productService.ts`, `authService.ts` | API services |
| **Store** | camelCase + "Store" | `useAuthStore.ts`, `useCartStore.ts` | Zustand stores |
| **Type/Interface** | PascalCase | `ProductModel.ts`, `UserTypes.ts` | TypeScript types |
| **Utility** | camelCase | `formatPrice.ts`, `validateEmail.ts` | Helper functions |
| **Constant** | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts`, `ROUTES.ts` | Constants |
| **Folder** | kebab-case | `product-detail/`, `manage-products/` | Thư mục |

### Backend (C# .NET)

| Loại | Quy Tắc | Ví Dụ | Mô Tả |
|------|---------|-------|-------|
| **Controller** | PascalCase + "Controller" | `ProductController.cs`, `AuthController.cs` | API Controllers |
| **Model** | PascalCase + "Model" | `ProductModel.cs`, `UserModel.cs` | Data models |
| **Service** | PascalCase + "Service" | `ProductService.cs`, `AuthService.cs` | Business logic |
| **Repository** | PascalCase + "Repo" | `ProductRepo.cs`, `UserRepo.cs` | Data access |
| **Interface** | PascalCase + "I" prefix | `IProductRepo.cs`, `IAuthService.cs` | Interfaces |
| **Middleware** | PascalCase + "Middleware" | `ExceptionMiddleware.cs`, `AuthMiddleware.cs` | Middlewares |
| **Configuration** | PascalCase + "Settings" | `MongoSettings.cs`, `JwtSettings.cs` | Config classes |
| **Folder** | PascalCase | `Controllers/`, `Services/`, `DataAccess/` | Thư mục |

### API Endpoints

| Method | Pattern | Ví Dụ |
|--------|---------|-------|
| **GET** | `/api/{resource}` | `/api/products`, `/api/users/{id}` |
| **POST** | `/api/{resource}` | `/api/auth/login`, `/api/orders` |
| **PUT** | `/api/{resource}/{id}` | `/api/products/{id}` |
| **DELETE** | `/api/{resource}/{id}` | `/api/products/{id}` |

---

## 📁 Cấu Trúc Thư Mục Chi Tiết

### Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductSearch.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartIcon.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentMethod.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── ai/
│   │       ├── ChatBot.tsx
│   │       ├── ChatMessage.tsx
│   │       └── AIRecommendation.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   └── admin/
│   │       ├── DashboardPage.tsx
│   │       ├── ManageProductsPage.tsx
│   │       ├── ManageOrdersPage.tsx
│   │       ├── ManageUsersPage.tsx
│   │       ├── ManageCategoriesPage.tsx
│   │       └── ReportsPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── userService.ts
│   │   └── aiService.ts
│   ├── store/
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useProductStore.ts
│   │   └── useThemeStore.ts
│   ├── types/
│   │   ├── product.types.ts
│   │   ├── user.types.ts
│   │   ├── order.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── formatPrice.ts
│   │   ├── validateEmail.ts
│   │   ├── dateFormatter.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── global.scss
│   │   ├── theme.ts
│   │   └── mixins.scss
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── PrivateRoute.tsx
│   ├── config/
│   │   └── env.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Backend Structure

```
backend/
├── ECommerceAI/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProductController.cs
│   │   ├── OrderController.cs
│   │   ├── UserController.cs
│   │   ├── CategoryController.cs
│   │   ├── CartController.cs
│   │   └── AIController.cs
│   ├── Models/
│   │   ├── Product/
│   │   │   ├── ProductModel.cs
│   │   │   ├── CategoryModel.cs
│   │   │   └── ProductFilterModel.cs
│   │   ├── User/
│   │   │   ├── UserModel.cs
│   │   │   └── UserRole.cs
│   │   ├── Order/
│   │   │   ├── OrderModel.cs
│   │   │   ├── OrderItemModel.cs
│   │   │   └── OrderStatus.cs
│   │   ├── Cart/
│   │   │   └── CartModel.cs
│   │   ├── Auth/
│   │   │   ├── LoginRequest.cs
│   │   │   ├── RegisterRequest.cs
│   │   │   └── AuthResponse.cs
│   │   └── Common/
│   │       ├── ResponseModel.cs
│   │       └── PaginationModel.cs
│   ├── DataAccess/
│   │   ├── MongoContext.cs
│   │   ├── RedisCache.cs
│   │   └── IDatabaseContext.cs
│   ├── Repositories/
│   │   ├── Interfaces/
│   │   │   ├── IProductRepo.cs
│   │   │   ├── IUserRepo.cs
│   │   │   ├── IOrderRepo.cs
│   │   │   └── IGenericRepo.cs
│   │   └── Implementations/
│   │       ├── ProductRepo.cs
│   │       ├── UserRepo.cs
│   │       └── OrderRepo.cs
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   ├── IAuthService.cs
│   │   │   ├── IProductService.cs
│   │   │   ├── IOrderService.cs
│   │   │   ├── IUserService.cs
│   │   │   └── IAIService.cs
│   │   └── Implementations/
│   │       ├── AuthService.cs
│   │       ├── ProductService.cs
│   │       ├── OrderService.cs
│   │       ├── UserService.cs
│   │       └── AIService.cs
│   ├── Middlewares/
│   │   ├── ExceptionMiddleware.cs
│   │   ├── AuthMiddleware.cs
│   │   └── LoggingMiddleware.cs
│   ├── Configurations/
│   │   ├── MongoSettings.cs
│   │   ├── RedisSettings.cs
│   │   ├── JwtSettings.cs
│   │   └── AISettings.cs
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   └── ApplicationBuilderExtensions.cs
│   ├── Helpers/
│   │   ├── JwtHelper.cs
│   │   ├── PasswordHelper.cs
│   │   └── ValidationHelper.cs
│   ├── DTOs/
│   │   ├── ProductDto.cs
│   │   ├── UserDto.cs
│   │   └── OrderDto.cs
│   ├── Validators/
│   │   ├── LoginRequestValidator.cs
│   │   └── RegisterRequestValidator.cs
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── ECommerceAI.csproj
│   └── ECommerceAI.csproj.user
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🛠 Ngôn Ngữ & Công Nghệ

### Frontend
- **React 18.x** - UI Framework
- **TypeScript 5.x** - Type safety
- **Material-UI (MUI) 6.x** - Component library
- **Zustand 4.x** - State management
- **React Router 7.x** - Routing
- **Axios** - HTTP client
- **Framer Motion 11.x** - Animation
- **React Hook Form** - Form handling
- **Zod** - Schema validation (optional)
- **Vite** - Build tool (nếu migrate từ CRA)

### Backend
- **.NET 8.0** - Framework
- **C# 12** - Programming language
- **MongoDB.Driver 2.x** - MongoDB driver
- **StackExchange.Redis** - Redis client
- **JWT Bearer** - Authentication
- **BCrypt.Net** - Password hashing
- **Swashbuckle (Swagger)** - API documentation
- **Serilog** - Logging (optional)
- **AutoMapper** - Object mapping (optional)

### Database & Cache
- **MongoDB 7.x** - NoSQL database
- **Redis 7.x** - In-memory cache

### AI Integration
- **Anthropic Claude API** - AI chatbot
- **OpenAI API** (alternative) - AI chatbot

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD
- **Postman** - API testing

---

## 🎯 Các Bước Thực Hiện Chi Tiết

### 🔸 Giai Đoạn 1: Khởi Tạo & Setup (Ngày 1-5)

#### **Bước 1.1: Tạo cấu trúc thư mục**

```bash
# Tạo thư mục root
mkdir ecommerce-ai-project
cd ecommerce-ai-project

# Tạo thư mục frontend và backend
mkdir frontend backend
```

#### **Bước 1.2: Setup Frontend (React + TypeScript + Vite)**

```bash
cd frontend

# Tạo project Vite với React + TypeScript
npm create vite@latest . -- --template react-ts

# Cài đặt dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom axios zustand framer-motion
npm install react-hook-form @hookform/resolvers zod
npm install dayjs

# Dev dependencies
npm install -D @types/node sass
```

#### **Bước 1.3: Setup Backend (C# .NET)**

```bash
cd ../backend

# Tạo project Web API
dotnet new webapi -n ECommerceAI

cd ECommerceAI

# Cài đặt packages
dotnet add package MongoDB.Driver
dotnet add package StackExchange.Redis
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package Swashbuckle.AspNetCore
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

#### **Bước 1.4: Cấu hình Environment**

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLAUDE_API_KEY=your_claude_api_key
```

**Backend `appsettings.json`:**
```json
{
  "ConnectionStrings": {
    "MongoDb": "mongodb://localhost:27017/ecommerce_ai"
  },
  "Redis": {
    "Host": "localhost",
    "Port": 6379,
    "Password": ""
  },
  "Jwt": {
    "Key": "your_super_secret_key_min_32_characters",
    "Issuer": "ECommerceAI",
    "Audience": "ECommerceUsers",
    "ExpirationMinutes": 60
  },
  "AI": {
    "ClaudeApiKey": "your_claude_api_key",
    "ClaudeApiUrl": "https://api.anthropic.com/v1/messages",
    "Model": "claude-3-5-sonnet-20241022"
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
```

---

### 🔸 Giai Đoạn 2: Layout & Routing (Ngày 6-10)

#### **Bước 2.1: Tạo Layout Components**

1. **Header.tsx** - Header với logo, search, cart icon
2. **Footer.tsx** - Footer với thông tin liên hệ
3. **Navbar.tsx** - Navigation menu
4. **Layout.tsx** - Wrapper layout chính

#### **Bước 2.2: Setup Routing**

1. **AppRoutes.tsx** - Định nghĩa routes
2. **PrivateRoute.tsx** - Protect admin routes
3. **AuthGuard.tsx** - Check authentication

#### **Bước 2.3: Setup Theme & State Management**

1. **theme.ts** - MUI theme config (light/dark)
2. **useThemeStore.ts** - Zustand store cho theme
3. **useAuthStore.ts** - Zustand store cho authentication
4. **useCartStore.ts** - Zustand store cho cart

#### **Bước 2.4: Setup API Base**

1. **api.ts** - Axios instance với interceptors
2. **authService.ts** - Auth API calls
3. **productService.ts** - Product API calls

---

### 🔸 Giai Đoạn 3: Authentication (Ngày 11-15)

#### **Backend: Auth Controller & Service**

1. **AuthController.cs** - Login, Register, RefreshToken endpoints
2. **AuthService.cs** - Business logic cho auth
3. **JwtHelper.cs** - Generate và validate JWT tokens
4. **PasswordHelper.cs** - Hash và verify passwords

#### **Frontend: Auth Pages & Components**

1. **LoginPage.tsx** - Trang đăng nhập
2. **RegisterPage.tsx** - Trang đăng ký
3. **LoginForm.tsx** - Form component
4. **RegisterForm.tsx** - Form component

#### **Backend: User Model & Repository**

1. **UserModel.cs** - User entity
2. **UserRepo.cs** - CRUD operations cho User
3. **IUserRepo.cs** - Interface

---

### 🔸 Giai Đoạn 4: Products & AI (Ngày 16-25)

#### **Backend: Product Management**

1. **ProductModel.cs** - Product entity với fields: name, price, description, images, category, stock, etc.
2. **ProductController.cs** - CRUD endpoints
3. **ProductService.cs** - Business logic
4. **ProductRepo.cs** - Data access
5. **CategoryModel.cs** - Category entity
6. **ProductFilterModel.cs** - Filter và pagination

#### **Backend: AI Integration**

1. **AIController.cs** - AI endpoints
2. **AIService.cs** - Call Claude API
3. **GenerateProductDescription** - Tự động sinh mô tả sản phẩm
4. **GetProductRecommendations** - Gợi ý sản phẩm dựa trên user behavior

#### **Frontend: Product Pages**

1. **HomePage.tsx** - Trang chủ với featured products
2. **ProductListPage.tsx** - Danh sách sản phẩm với filter
3. **ProductDetailPage.tsx** - Chi tiết sản phẩm
4. **ProductCard.tsx** - Card component
5. **ProductFilter.tsx** - Filter component
6. **ProductSearch.tsx** - Search component

#### **Backend: Redis Caching**

1. **RedisCache.cs** - Cache helper
2. Cache product list (TTL: 5 phút)
3. Cache product detail (TTL: 10 phút)

---

### 🔸 Giai Đoạn 5: Cart & Checkout (Ngày 26-35)

#### **Frontend: Cart Management**

1. **CartPage.tsx** - Trang giỏ hàng
2. **CartItem.tsx** - Cart item component
3. **CartSummary.tsx** - Summary component
4. **useCartStore.ts** - Cart state management
5. **cartService.ts** - Cart API calls

#### **Backend: Cart & Order**

1. **CartModel.cs** - Cart entity
2. **CartController.cs** - Add/Remove/Update cart
3. **OrderModel.cs** - Order entity
4. **OrderController.cs** - Create order, Get orders
5. **OrderService.cs** - Order business logic

#### **Frontend: Checkout**

1. **CheckoutPage.tsx** - Trang thanh toán
2. **CheckoutForm.tsx** - Form nhập thông tin
3. **PaymentMethod.tsx** - Chọn phương thức thanh toán
4. **OrderSummary.tsx** - Tóm tắt đơn hàng

---

### 🔸 Giai Đoạn 6: Admin Dashboard (Ngày 36-45)

#### **Backend: Admin Endpoints**

1. **UserController.cs** - Get all users, Update user, Delete user
2. **AdminProductController.cs** - Full CRUD cho admin
3. **AdminOrderController.cs** - Get all orders, Update order status
4. **AdminReportsController.cs** - Thống kê doanh thu

#### **Frontend: Admin Pages**

1. **DashboardPage.tsx** - Dashboard với charts
2. **ManageProductsPage.tsx** - Quản lý sản phẩm
3. **ManageOrdersPage.tsx** - Quản lý đơn hàng
4. **ManageUsersPage.tsx** - Quản lý người dùng
5. **ReportsPage.tsx** - Báo cáo thống kê

#### **Admin Features**

1. Phân quyền (Role-based access)
2. Charts với Recharts
3. Export data (CSV/Excel)
4. Bulk operations

---

### 🔸 Giai Đoạn 7: UX & Animation (Ngày 46-55)

#### **Loading States**

1. **SkeletonLoader.tsx** - Skeleton loading component
2. **LoadingSpinner.tsx** - Spinner component
3. Implement skeleton cho ProductList, ProductDetail

#### **Animations**

1. **Framer Motion** - Page transitions
2. **ProductCard** - Hover animations
3. **Cart Icon** - Badge animation
4. **Toast notifications** - Success/Error animations

#### **Responsive Design**

1. Mobile-first approach
2. Breakpoints: xs, sm, md, lg, xl
3. Responsive navigation (drawer trên mobile)
4. Responsive product grid

#### **Performance Optimization**

1. **Lazy loading** - React.lazy cho routes
2. **Code splitting** - Split admin routes
3. **Image optimization** - Lazy load images
4. **Memoization** - useMemo, useCallback

---

### 🔸 Giai Đoạn 8: AI Chatbot (Ngày 56-65)

#### **Backend: AI Chat**

1. **AIController.cs** - Chat endpoint
2. **AIService.cs** - Chat logic với Claude
3. **ChatHistoryModel.cs** - Lưu lịch sử chat
4. **ChatRepo.cs** - CRUD chat history

#### **Frontend: Chatbot UI**

1. **ChatBot.tsx** - Chatbot component
2. **ChatMessage.tsx** - Message component
3. **ChatInput.tsx** - Input component
4. Integrate vào ProductDetailPage
5. Floating chat button

#### **AI Features**

1. Gợi ý sản phẩm dựa trên nhu cầu
2. Trả lời câu hỏi về sản phẩm
3. Lưu lịch sử chat theo user
4. Context-aware responses

---

### 🔸 Giai Đoạn 9: Testing & Deployment (Ngày 66-70)

#### **Testing**

1. **Unit tests** - Backend services
2. **Integration tests** - API endpoints
3. **E2E tests** - Critical user flows (optional)

#### **Docker Setup**

1. **Dockerfile** cho Frontend
2. **Dockerfile** cho Backend
3. **docker-compose.yml** - Orchestrate tất cả services
4. **nginx.conf** - Reverse proxy config

#### **Deployment**

1. Build frontend: `npm run build`
2. Publish backend: `dotnet publish`
3. Docker compose up
4. Configure domain và SSL

---

## 💬 Câu Lệnh Để Hỏi Cursor

### Giai Đoạn 1: Setup

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

```
Tạo backend C# .NET Web API với:
- Controllers/AuthController.cs
- Models/User/UserModel.cs
- Services/AuthService.cs với JWT authentication
- DataAccess/MongoContext.cs để kết nối MongoDB
- Program.cs setup dependency injection và CORS

Cấu hình appsettings.json với MongoDB connection string, JWT settings.
```

### Giai Đoạn 2: Authentication

```
Tạo AuthController.cs với endpoints:
- POST /api/auth/register - Đăng ký user mới
- POST /api/auth/login - Đăng nhập, trả về JWT token
- POST /api/auth/refresh - Refresh token

Sử dụng BCrypt để hash password, JWT Bearer để authenticate.
Tạo UserModel.cs với fields: Id, Email, PasswordHash, Name, Role, CreatedAt.
```

```
Tạo LoginPage.tsx và RegisterPage.tsx với:
- Form validation bằng React Hook Form + Zod
- Material-UI components (TextField, Button)
- Gọi authService.login() và authService.register()
- Lưu token vào useAuthStore (Zustand)
- Redirect sau khi đăng nhập thành công
```

### Giai Đoạn 3: Products

```
Tạo ProductController.cs với endpoints:
- GET /api/products - Lấy danh sách (có filter, pagination)
- GET /api/products/{id} - Lấy chi tiết
- POST /api/products - Tạo mới (admin only)
- PUT /api/products/{id} - Cập nhật (admin only)
- DELETE /api/products/{id} - Xóa (admin only)

Tạo ProductModel.cs với: Id, Name, Price, Description, Images[], Category, Stock, CreatedAt.
Implement Redis cache cho GET endpoints.
```

```
Tạo ProductListPage.tsx với:
- Hiển thị grid products từ API
- ProductFilter component (filter theo category, price range)
- ProductSearch component (search real-time)
- Pagination
- Skeleton loader khi loading
- Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
```

### Giai Đoạn 4: Cart & Checkout

```
Tạo CartController.cs và OrderController.cs:
- POST /api/cart/add - Thêm vào giỏ
- GET /api/cart - Lấy giỏ hàng của user
- POST /api/orders - Tạo đơn hàng từ cart

Tạo OrderModel.cs với: Id, UserId, Items[], TotalPrice, Status, ShippingAddress, CreatedAt.
```

```
Tạo CartPage.tsx và CheckoutPage.tsx:
- CartPage: Hiển thị items, update quantity, remove item, tính tổng
- CheckoutPage: Form nhập thông tin giao hàng, chọn payment method
- useCartStore để quản lý state
- Redirect đến OrderHistoryPage sau khi đặt hàng thành công
```

### Giai Đoạn 5: Admin

```
Tạo AdminDashboardPage.tsx với:
- Thống kê: Tổng doanh thu, số đơn hàng, số user, sản phẩm bán chạy
- Charts bằng Recharts (Line chart doanh thu theo ngày, Pie chart category)
- Table recent orders
- Material-UI Grid layout, responsive

Tạo ManageProductsPage.tsx với DataGrid:
- CRUD operations (Create, Edit, Delete)
- Upload images với preview
- Bulk actions (delete multiple)
```

### Giai Đoạn 6: AI Chatbot

```
Tạo AIController.cs với endpoint:
- POST /api/ai/chat - Chat với AI
- Request body: { message: string, productId?: string, userId?: string }
- Response: { message: string }

Tích hợp Claude API:
- Call Claude API với message history
- Lưu chat history vào MongoDB
- Context-aware: biết product đang xem, user history
```

```
Tạo ChatBot.tsx component:
- Floating chat button (bottom-right)
- Chat modal với messages list
- Input field để gửi message
- Loading state khi AI đang trả lời
- Framer Motion animation cho open/close
- Tích hợp vào ProductDetailPage
```

### Giai Đoạn 7: UX & Performance

```
Thêm skeleton loading:
- SkeletonLoader.tsx component sử dụng MUI Skeleton
- Áp dụng cho ProductListPage, ProductDetailPage
- Hiển thị skeleton khi data đang load

Thêm animations:
- Page transitions với Framer Motion
- ProductCard hover effect
- Cart icon badge animation khi thêm sản phẩm
```

---

## 🐳 Docker & Deployment

### Docker Compose

```yaml
version: "3.9"

services:
  # MongoDB
  mongodb:
    image: mongo:7
    container_name: ecommerce-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: ecommerce_ai

  # Redis
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # Backend API
  api:
    build:
      context: ./backend/ECommerceAI
      dockerfile: Dockerfile
    container_name: ecommerce-api
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__MongoDb=mongodb://mongodb:27017/ecommerce_ai
      - Redis__Host=redis
      - Redis__Port=6379
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped

  # Frontend
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ecommerce-web
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - api
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: ecommerce-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  mongo-data:
  redis-data:
```

### Backend Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ECommerceAI/ECommerceAI.csproj", "ECommerceAI/"]
RUN dotnet restore "ECommerceAI/ECommerceAI.csproj"
COPY . .
WORKDIR "/src/ECommerceAI"
RUN dotnet build "ECommerceAI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ECommerceAI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ECommerceAI.dll"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔄 CI/CD & Testing

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Test
        run: npm test -- --coverage
```

---

## ✅ Checklist Hoàn Thiện

### Backend
- [ ] Setup MongoDB connection
- [ ] Setup Redis connection
- [ ] JWT Authentication
- [ ] Product CRUD API
- [ ] Order CRUD API
- [ ] User Management API
- [ ] AI Chat API
- [ ] Redis Caching
- [ ] Error handling middleware
- [ ] Logging
- [ ] Swagger documentation

### Frontend
- [ ] Layout components (Header, Footer, Navbar)
- [ ] Routing setup
- [ ] Authentication pages
- [ ] Product pages (List, Detail)
- [ ] Cart & Checkout pages
- [ ] Admin pages
- [ ] AI Chatbot UI
- [ ] State management (Zustand)
- [ ] API services
- [ ] Error handling
- [ ] Loading states (Skeleton)
- [ ] Animations (Framer Motion)
- [ ] Responsive design

### DevOps
- [ ] Docker setup
- [ ] Docker Compose
- [ ] Nginx config
- [ ] CI/CD pipeline
- [ ] Environment variables
- [ ] SSL certificates

---

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [MongoDB C# Driver](https://www.mongodb.com/docs/drivers/csharp/)
- [Redis C# Client](https://stackexchange.github.io/StackExchange.Redis/)
- [Claude API Documentation](https://docs.anthropic.com/)

---

## 🎯 Lưu Ý Quan Trọng

1. **Bảo mật**:
   - Không commit API keys vào git
   - Sử dụng environment variables
   - Validate input ở cả frontend và backend
   - Rate limiting cho API

2. **Performance**:
   - Cache với Redis
   - Lazy loading components
   - Image optimization
   - Database indexing

3. **Code Quality**:
   - Follow naming conventions
   - Code comments cho complex logic
   - Error handling đầy đủ
   - Unit tests cho critical functions

---

**Chúc bạn build thành công! 🚀**

