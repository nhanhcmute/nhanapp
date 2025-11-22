# Hướng dẫn sử dụng API Config tập trung

## 📁 File Config

**Đường dẫn**: `frontend/src/config/api.js`

## ✅ Tính năng Auto-detect Environment

API config **tự động phát hiện** môi trường:

- `localhost:3000` → `http://localhost:5000`
- Production → `https://petshop-a2ry.onrender.com`

## 🚀 Cách sử dụng

### 1. Import vào file cần dùng

```javascript
import { API_URL } from "../config/api"; // Adjust path based on your file location
```

### 2. Sử dụng trong API calls

**Trước đây:**

```javascript
const API_URL = "https://petshop-a2ry.onrender.com"; // Hard-coded ❌

fetch(`${API_URL}/product.ctr/get_all`, {
  method: "POST",
  //...
});
```

**Bây giờ:**

```javascript
import { API_URL } from "../config/api"; // Auto-detect ✅

fetch(`${API_URL}/product.ctr/get_all`, {
  method: "POST",
  //...
});
```

## 📝 Các file cần update

Thay thế dòng này:

```javascript
const API_URL =
  process.env.REACT_APP_API_URL || "https://petshop-a2ry.onrender.com";
```

Bằng:

```javascript
import { API_URL } from "../config/api"; // hoặc '../../config/api' tùy vị trí file
```

**Danh sách file:**

- `src/components/product/ProductsGrid.js`
- `src/components/product/ProductDetail.js`
- `src/pages/admin/ManageProductsPage.js`
- `src/pages/LoginPage.js`
- `src/pages/ProductDetailPage.js`
- `src/pages/ProductList.js`
- `src/pages/ResetPasswordPage.js`
- `src/pages/SignUp.js`
- `src/pages/VerifyOTPPage.js`
- `src/services/reportService.js`

## 🛠️ Advanced: Override với .env

Tạo file `.env.local` (local development):

```bash
REACT_APP_API_URL=http://localhost:5000
```

Hoặc `.env.production`:

```bash
REACT_APP_API_URL=https://petshop-a2ry.onrender.com
```

## 🌈 Bonus: Sử dụng với Endpoints

```javascript
import { API_URL, API_ENDPOINTS } from '../config/api';

// Instead of:
fetch(`${API_URL}/product.ctr/get_by_id`, {...})

// Use:
fetch(`${API_URL}${API_ENDPOINTS.PRODUCTS_GET_BY_ID}`, {...})
```

## 🔧 Test nhanh

1. Chạy local → Check console sẽ thấy:

   ```
   🌐 API Configuration: {
     environment: 'development',
     apiUrl: 'http://localhost:5000',
     isLocalhost: true
   }
   ```

2. Build production → Auto switch sang `https://petshop-a2ry.onrender.com`
