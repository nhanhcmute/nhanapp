# Import Cats & Dogs Data vào MongoDB

## 📋 Tổng quan

Import dữ liệu từ `frontend/public/cats.json` và `frontend/public/dogs.json` vào MongoDB để tạo API riêng.

## 🗄️ Collections sẽ tạo

- `cats` - Thông tin các giống mèo (67 breeds)
- `dogs` - Thông tin các giống chó (172 breeds)

## 🚀 Cách 1: Dùng MongoDB Compass (GUI - Dễ nhất)

### Bước 1: Mở MongoDB Compass

- Kết nối đến: `mongodb://localhost:27017`
- Chọn database: `ecommerce` (hoặc tên database bạn đang dùng)

### Bước 2: Import Cats

1. Click **Create Collection** → Tên: `cats`
2. Click vào collection `cats`
3. Click **ADD DATA** → **Import JSON or CSV file**
4. Chọn file: `C:\Users\ADMIN\Desktop\nhan\nhanapp\frontend\public\cats.json`
5. Click **Import**

### Bước 3: Import Dogs

1. Click **Create Collection** → Tên: `dogs`
2. Click vào collection `dogs`
3. Click **ADD DATA** → **Import JSON or CSV file**
4. Chọn file: `C:\Users\ADMIN\Desktop\nhan\nhanapp\frontend\public\dogs.json`
5. Click **Import**

---

## 🚀 Cách 2: Dùng PowerShell Script (Tự động)

### Script import tự động:

```powershell
# Navigate to frontend/public directory
cd C:\Users\ADMIN\Desktop\nhan\nhanapp\frontend\public

# Import cats.json
mongoimport --db ecommerce --collection cats --file cats.json --jsonArray

# Import dogs.json
mongoimport --db ecommerce --collection dogs --file dogs.json --jsonArray
```

**Chạy trong PowerShell:**

```powershell
# Kiểm tra mongoimport có sẵn không
mongoimport --version

# Nếu có, chạy import
cd C:\Users\ADMIN\Desktop\nhan\nhanapp\frontend\public
mongoimport --db ecommerce --collection cats --file cats.json --jsonArray
mongoimport --db ecommerce --collection dogs --file dogs.json --jsonArray
```

---

## 🚀 Cách 3: Dùng C# Script (Từ Backend)

Tạo file `ImportPetsData.cs` trong backend để import programmatically.

---

## ✅ Kiểm tra sau khi import

### MongoDB Compass:

- Mở collection `cats` → Xem có 67 documents
- Mở collection `dogs` → Xem có 172 documents

### MongoDB Shell:

```javascript
use ecommerce
db.cats.countDocuments()  // Should return 67
db.dogs.countDocuments()  // Should return 172
```

---

## 📝 Tiếp theo: Tạo API

Sau khi import xong, tôi sẽ tạo:

1. **Models**: `cat_model.cs`, `dog_model.cs`
2. **Repositories**: `CatRepo.cs`, `DogRepo.cs`
3. **Controllers**: `cat_controller.cs`, `dog_controller.cs`

API endpoints sẽ có:

- `GET /cat.ctr/get_all` - Lấy tất cả giống mèo
- `GET /cat.ctr/get_by_id/{id}` - Lấy mèo theo ID
- `GET /dog.ctr/get_all` - Lấy tất cả giống chó
- `GET /dog.ctr/get_by_id/{id}` - Lấy chó theo ID
