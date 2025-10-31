# 📦 Setup Guide - Hướng Dẫn Cài Đặt

## Yêu Cầu Hệ Thống

### Frontend
- **Node.js**: >= 18.x
- **npm**: >= 8.x hoặc **yarn**: >= 1.22.x hoặc **pnpm**: >= 8.x

### Backend
- **.NET SDK**: 8.0
- **MongoDB**: 7.x (hoặc Docker)
- **Redis**: 7.x (hoặc Docker)

### Tools
- **Git**: >= 2.30.x
- **Docker**: >= 20.x (optional, cho deployment)
- **Docker Compose**: >= 2.x (optional)

---

## 🚀 Bước 1: Cài Đặt Dependencies

### Frontend

```bash
cd frontend
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Backend

```bash
cd backend/ECommerceAI
dotnet restore
```

---

## 🗄️ Bước 2: Setup Database

### MongoDB

#### Option 1: Docker (Khuyến nghị)

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=ecommerce_ai \
  -v mongodb-data:/data/db \
  mongo:7
```

#### Option 2: Local Installation

1. Download MongoDB từ [mongodb.com](https://www.mongodb.com/try/download/community)
2. Cài đặt và start service
3. MongoDB sẽ chạy trên `localhost:27017`

### Redis

#### Option 1: Docker (Khuyến nghị)

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine
```

#### Option 2: Local Installation

1. Download Redis từ [redis.io](https://redis.io/download)
2. Cài đặt và start service
3. Redis sẽ chạy trên `localhost:6379`

---

## ⚙️ Bước 3: Cấu Hình Environment

### Frontend

1. Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLAUDE_API_KEY=your_claude_api_key_here
VITE_ENV=development
```

2. Lấy Claude API key từ [Anthropic Console](https://console.anthropic.com/)

### Backend

1. Tạo file `appsettings.json` trong thư mục `backend/ECommerceAI/`:

```json
{
  "ConnectionStrings": {
    "MongoDb": "mongodb://localhost:27017/ecommerce_ai"
  },
  "Redis": {
    "Host": "localhost",
    "Port": 6379,
    "Password": "",
    "Database": 0
  },
  "Jwt": {
    "Key": "your_super_secret_key_min_32_characters_long",
    "Issuer": "ECommerceAI",
    "Audience": "ECommerceUsers",
    "ExpirationMinutes": 60
  },
  "AI": {
    "ClaudeApiKey": "your_claude_api_key_here",
    "ClaudeApiUrl": "https://api.anthropic.com/v1/messages",
    "Model": "claude-3-5-sonnet-20241022"
  },
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
```

2. **Quan trọng**: Thay `your_super_secret_key_min_32_characters_long` bằng một key bảo mật ngẫu nhiên (ít nhất 32 ký tự)

3. Thay `your_claude_api_key_here` bằng API key thực tế từ Anthropic

---

## ▶️ Bước 4: Chạy Application

### Development Mode

#### Terminal 1: Backend

```bash
cd backend/ECommerceAI
dotnet watch run
```

Backend sẽ chạy trên: `http://localhost:5000`

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Frontend sẽ chạy trên: `http://localhost:5173` (Vite) hoặc `http://localhost:3000` (CRA)

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

Build output sẽ ở thư mục `frontend/dist/`

#### Build Backend

```bash
cd backend/ECommerceAI
dotnet publish -c Release -o ./publish
```

Build output sẽ ở thư mục `backend/ECommerceAI/publish/`

---

## 🐳 Bước 5: Docker Setup (Optional)

### Chạy toàn bộ với Docker Compose

```bash
# Từ thư mục root
docker-compose up -d
```

Sau khi chạy:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`

### Stop services

```bash
docker-compose down
```

### Xem logs

```bash
docker-compose logs -f
```

---

## ✅ Bước 6: Verify Installation

### Check Backend

1. Mở browser: `http://localhost:5000/swagger`
2. Swagger UI sẽ hiển thị tất cả API endpoints
3. Test endpoint: `GET /api/products` (nếu đã tạo)

### Check Frontend

1. Mở browser: `http://localhost:5173` (hoặc `http://localhost:3000`)
2. Kiểm tra console không có lỗi
3. Test navigation giữa các pages

### Check MongoDB

```bash
# Docker
docker exec -it mongodb mongosh

# Hoặc local MongoDB shell
mongosh

# Test connection
use ecommerce_ai
db.test.insertOne({ test: "connection" })
```

### Check Redis

```bash
# Docker
docker exec -it redis redis-cli

# Hoặc local Redis CLI
redis-cli

# Test connection
PING
# Should return: PONG
```

---

## 🔧 Troubleshooting

### Backend không kết nối MongoDB

**Lỗi**: `Cannot connect to MongoDB`

**Giải pháp**:
1. Kiểm tra MongoDB đang chạy: `docker ps` hoặc `mongod --version`
2. Kiểm tra connection string trong `appsettings.json`
3. Kiểm tra firewall/port 27017

### Backend không kết nối Redis

**Lỗi**: `Cannot connect to Redis`

**Giải pháp**:
1. Kiểm tra Redis đang chạy: `docker ps` hoặc `redis-cli ping`
2. Kiểm tra Redis config trong `appsettings.json`
3. Kiểm tra firewall/port 6379

### Frontend không kết nối Backend

**Lỗi**: `Network Error` hoặc `CORS error`

**Giải pháp**:
1. Kiểm tra `VITE_API_URL` trong `.env`
2. Kiểm tra Backend đang chạy
3. Kiểm tra CORS config trong `Program.cs`
4. Đảm bảo backend URL trong `AllowedOrigins`

### JWT Token Issues

**Lỗi**: `Unauthorized` hoặc `Token expired`

**Giải pháp**:
1. Kiểm tra JWT key trong `appsettings.json` (ít nhất 32 ký tự)
2. Kiểm tra token expiration time
3. Clear localStorage và đăng nhập lại

### Claude API Issues

**Lỗi**: `API key invalid` hoặc `Rate limit`

**Giải pháp**:
1. Kiểm tra Claude API key trong `.env` và `appsettings.json`
2. Kiểm tra API key có đủ credits
3. Kiểm tra rate limits trên Anthropic Console

---

## 📚 Next Steps

1. Đọc [BUILD_FULL_ECOMMERCE_AI_PROJECT.md](./BUILD_FULL_ECOMMERCE_AI_PROJECT.md) để bắt đầu build
2. Đọc [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) nếu muốn migrate code cũ
3. Follow từng giai đoạn trong BUILD guide

---

## 🆘 Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs` hoặc check console
2. Verify all services đang chạy
3. Check environment variables
4. Xem lại documentation trong các file MD

