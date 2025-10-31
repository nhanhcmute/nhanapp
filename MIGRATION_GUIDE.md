# 🔄 Migration Guide - Chuyển Đổi Code Hiện Tại

## Mục Tiêu

Chuyển đổi code hiện tại từ cấu trúc cũ sang cấu trúc mới theo chuẩn React + TypeScript + C# .NET.

---

## 📋 Bước 1: Phân Tích Code Hiện Tại

### Cấu Trúc Cũ
```
src/
├── api/              → Chuyển sang src/services/
├── component/        → Chuyển sang src/components/
├── function/         → Chuyển sang src/components/layout/
├── hooks/            → Giữ nguyên src/hooks/
├── pages/            → Giữ nguyên src/pages/
└── asset/            → Chuyển sang src/assets/
```

### Mapping File Cũ → Mới

| File Cũ | File Mới | Action |
|---------|----------|--------|
| `src/api/productsapi.js` | `src/services/productService.ts` | Convert to TS |
| `src/api/server.js` | Backend C# API | Tạo mới trong backend |
| `src/component/ProductDetail.js` | `src/components/product/ProductDetail.tsx` | Convert to TS |
| `src/component/ProductsGrid.js` | `src/components/product/ProductsGrid.tsx` | Convert to TS |
| `src/function/Layout.js` | `src/components/layout/Layout.tsx` | Convert to TS |
| `src/function/CartContext.js` | `src/store/useCartStore.ts` | Chuyển sang Zustand |
| `src/pages/client/Homepage.js` | `src/pages/HomePage.tsx` | Convert to TS |
| `src/pages/client/ProductPage.js` | `src/pages/ProductDetailPage.tsx` | Convert to TS |
| `src/pages/admin/Dashboard.js` | `src/pages/admin/DashboardPage.tsx` | Convert to TS |

---

## 🔄 Bước 2: Migration Plan

### Phase 1: Setup Cấu Trúc Mới (Không xóa code cũ)

1. Tạo folder structure mới song song với code cũ
2. Setup TypeScript config
3. Setup dependencies mới

### Phase 2: Convert Từng Module

1. Convert Components → TypeScript
2. Convert Pages → TypeScript
3. Convert Services → TypeScript
4. Chuyển Context sang Zustand

### Phase 3: Tạo Backend C#

1. Tạo C# Web API project
2. Migrate API logic từ Express sang C#
3. Setup MongoDB connection
4. Setup Redis cache

### Phase 4: Testing & Cleanup

1. Test từng module
2. Remove code cũ khi đã migrate xong
3. Update imports

---

## 📝 Chi Tiết Migration

### 1. Convert JavaScript → TypeScript

**Ví dụ: ProductDetail.js → ProductDetail.tsx**

```javascript
// OLD: ProductDetail.js
import React, { useState } from 'react';

function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  // ...
}
```

```typescript
// NEW: ProductDetail.tsx
import React, { useState } from 'react';
import { Product } from '@/types/product.types';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  // ...
};
```

### 2. Context → Zustand

**Ví dụ: CartContext.js → useCartStore.ts**

```javascript
// OLD: CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // ...
};
```

```typescript
// NEW: useCartStore.ts
import { create } from 'zustand';
import { CartItem } from '@/types/cart.types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
}));
```

### 3. Express API → C# Web API

**Ví dụ: productsapi.js → ProductController.cs**

```javascript
// OLD: productsapi.js (Express)
app.get('/api/products', async (req, res) => {
  const products = await db.collection('products').find({}).toArray();
  res.json(products);
});
```

```csharp
// NEW: ProductController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseModel<List<ProductModel>>>> GetProducts(
        [FromQuery] ProductFilterModel filter)
    {
        var products = await _productService.GetProductsAsync(filter);
        return Ok(new ResponseModel<List<ProductModel>>
        {
            Success = true,
            Data = products
        });
    }
}
```

---

## 🗂️ Tạo Cấu Trúc Folder Mới

### Frontend Structure

```bash
# Tạo cấu trúc folder mới
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/product
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/auth
mkdir -p src/components/ai
mkdir -p src/pages/admin
mkdir -p src/services
mkdir -p src/store
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/styles
mkdir -p src/routes
mkdir -p src/config
mkdir -p src/assets/images
mkdir -p src/assets/icons
```

### Backend Structure

```bash
# Tạo backend structure
mkdir -p backend/ECommerceAI/Controllers
mkdir -p backend/ECommerceAI/Models/Product
mkdir -p backend/ECommerceAI/Models/User
mkdir -p backend/ECommerceAI/Models/Order
mkdir -p backend/ECommerceAI/Models/Auth
mkdir -p backend/ECommerceAI/Models/Common
mkdir -p backend/ECommerceAI/DataAccess
mkdir -p backend/ECommerceAI/Repositories/Interfaces
mkdir -p backend/ECommerceAI/Repositories/Implementations
mkdir -p backend/ECommerceAI/Services/Interfaces
mkdir -p backend/ECommerceAI/Services/Implementations
mkdir -p backend/ECommerceAI/Middlewares
mkdir -p backend/ECommerceAI/Configurations
mkdir -p backend/ECommerceAI/Extensions
mkdir -p backend/ECommerceAI/Helpers
mkdir -p backend/ECommerceAI/DTOs
mkdir -p backend/ECommerceAI/Validators
```

---

## ✅ Checklist Migration

### Frontend
- [ ] Setup TypeScript config
- [ ] Install dependencies mới
- [ ] Tạo cấu trúc folder mới
- [ ] Convert components sang TS
- [ ] Convert pages sang TS
- [ ] Convert services sang TS
- [ ] Chuyển Context sang Zustand
- [ ] Setup routing mới
- [ ] Update imports
- [ ] Test từng module
- [ ] Remove code cũ

### Backend
- [ ] Tạo C# Web API project
- [ ] Setup MongoDB connection
- [ ] Setup Redis connection
- [ ] Tạo Models
- [ ] Tạo Controllers
- [ ] Tạo Services
- [ ] Tạo Repositories
- [ ] Setup JWT authentication
- [ ] Migrate API logic
- [ ] Test API endpoints
- [ ] Setup Swagger

---

## 🚨 Lưu Ý

1. **Không xóa code cũ ngay** - Giữ lại để tham chiếu
2. **Test từng module** - Đảm bảo hoạt động trước khi chuyển sang module tiếp theo
3. **Backup code cũ** - Commit vào git trước khi migrate
4. **Incremental migration** - Migrate từng phần, không làm tất cả cùng lúc

---

## 📚 Tài Liệu Hỗ Trợ

- [TypeScript Migration Guide](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [.NET Migration Guide](https://learn.microsoft.com/en-us/dotnet/core/migration/)

