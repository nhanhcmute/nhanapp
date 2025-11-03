# 📘 Quy Tắc Đặt Tên API Backend

## 1️⃣. Quy tắc đặt tên file Controller

### 📘 Định dạng:
```
[controller_name]_controller.cs
```

### 📌 Ví dụ:

| Tên file | Giải thích |
|-----------|------------|
| `sys_user_controller.cs` | Controller quản lý người dùng hệ thống |
| `app_hoi_dap_ai_controller.cs` | Controller quản lý tính năng hỏi đáp AI |
| `sys_tuyen_dung_controller.cs` | Controller quản lý tuyển dụng |
| `cat_controller.cs` | Controller quản lý danh mục sản phẩm (category) |

> ⚠️ **Lưu ý:**  
> - Toàn bộ phần **trước "_controller" phải viết ở dạng snake_case**  
> - Phần mở rộng file luôn là `.cs`  
> - Tên file và tên class phải **trùng nhau**

---

## 2️⃣. Quy tắc đặt tên class

### 📘 Định dạng:
```csharp
public class [TênFile] : ControllerBase
```

### Ví dụ:

```csharp
// 📂 File: app_hoi_dap_ai_controller.cs
[ApiController]
[Route("app_hoi_dap_ai.ctr")]
public class app_hoi_dap_ai_controller : ControllerBase
{
    // code...
}
```

✅ Tên class = tên file (kể cả phần snake_case)  
✅ Không viết hoa chữ cái đầu để đảm bảo khớp với đường dẫn API.

---

## 3️⃣. Quy tắc đặt route (đường dẫn API)

### 📘 Mẫu route controller:
```csharp
[Route("controller_name.ctr")]
```

### 📘 Mẫu route API (action):
```csharp
[HttpPost("api_action_name")]
```

### ✅ Cấu trúc đầy đủ endpoint:
```
https://{domain_api}/{controller_name}.ctr/{api_action_name}
```

---

## 4️⃣. Ví dụ hoàn chỉnh

### 📂 File: cat_controller.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using ECommerceAI.Models.Pet;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("cat.ctr")]
    public class cat_controller : ControllerBase
    {
        private readonly ICatRepo _catRepo;
        private readonly ILogger<cat_controller> _logger;

        public cat_controller(ICatRepo catRepo, ILogger<cat_controller> logger)
        {
            _catRepo = catRepo;
            _logger = logger;
        }

        [HttpPost("get_all")]
        public async Task<IActionResult> get_all()
        {
            try
            {
                var cats = await _catRepo.GetAllAsync();
                return Ok(new
                {
                    status = 200,
                    message = "Success",
                    data = cats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all cats");
                return StatusCode(500, new
                {
                    status = 500,
                    message = "An error occurred",
                    data = (object?)null
                });
            }
        }

        [HttpPost("get_by_id")]
        public async Task<IActionResult> get_by_id([FromForm] string? id)
        {
            // implementation...
            return Ok(new
            {
                status = 200,
                message = "Success",
                data = new { id }
            });
        }
    }
}
```

### ✅ URL tương ứng:

| API | Method | URL đầy đủ |
|-----|--------|-----------|
| Lấy tất cả cats | POST | `https://domain_api/cat.ctr/get_all` |
| Lấy cat theo ID | POST | `https://domain_api/cat.ctr/get_by_id` |

---

## 5️⃣. Quy tắc chung

| Mục | Quy tắc |
|-----|---------|
| Đặt tên file Controller | `snake_case + "_controller.cs"` |
| Đặt tên class Controller | giống tên file |
| Đặt tên file Model | `snake_case + "_model.cs"` |
| Đặt tên class Model | giống tên file (ví dụ: `cat_model`) |
| Route controller | `"controller_name.ctr"` |
| Route API | `"api_action_name"` (snake_case) |
| Phương thức mặc định | `[HttpPost]` (tránh lộ dữ liệu qua URL) |
| Dữ liệu gửi lên | FormData (`application/x-www-form-urlencoded`) hoặc JSON |
| Dữ liệu trả về | JSON có cấu trúc `{ status, message, data }` |

---

## 6️⃣. Cấu trúc response chuẩn

Tất cả API phải trả về JSON với cấu trúc:

```json
{
  "status": 200,
  "message": "Success",
  "data": { ... }
}
```

### Status codes thường dùng:
- `200`: Success
- `400`: Bad Request (thiếu tham số, dữ liệu không hợp lệ)
- `404`: Not Found
- `500`: Internal Server Error

---

## 7️⃣. Ví dụ nhanh các controller khác

| Controller | File | Route | Ví dụ URL |
|------------|------|-------|-----------|
| sys_user_controller | sys_user_controller.cs | sys_user.ctr | `https://domain_api/sys_user.ctr/get_list_user` |
| sys_tuyen_dung_controller | sys_tuyen_dung_controller.cs | sys_tuyen_dung.ctr | `https://domain_api/sys_tuyen_dung.ctr/get_list` |
| cat_controller | cat_controller.cs | cat.ctr | `https://domain_api/cat.ctr/get_all` |

---

## 8️⃣. Cấu hình ApiDomain

Domain API được cấu hình trong `appsettings.json`:

```json
{
  "ApiDomain": "http://localhost:5000",
  "ConnectionStrings": { ... }
}
```

**Các môi trường:**
- Development: `http://localhost:5000`
- Production (Render): `https://your-app.onrender.com`
- Production (custom): Thay đổi theo domain thực tế

> 💡 **Lưu ý:** Nên set `ApiDomain` qua Environment Variable trên Render để dễ quản lý.

---

## 🧾 Ghi chú

1. Tên route controller (`controller_name.ctr`) phải trùng hoàn toàn với phần snake_case trong tên file.

2. Tất cả API endpoint phải tuân thủ format `/{controller}.ctr/{action_name}`

3. Sử dụng `[FromForm]` cho FormData và `[FromBody]` cho JSON body

4. Luôn validate input và return đúng status code

5. Log errors để dễ debug

---

## ✅ Checklist khi tạo Controller mới

- [ ] Tên file Controller: `[name]_controller.cs`
- [ ] Tên class Controller: `[name]_controller`
- [ ] Tên file Model: `[name]_model.cs`
- [ ] Tên class Model: `[name]_model`
- [ ] Route: `[Route("[name].ctr")]`
- [ ] Mọi action dùng `[HttpPost]`
- [ ] Action names dùng snake_case
- [ ] Response format: `{ status, message, data }`
- [ ] Có error handling với try-catch
- [ ] Có logging cho errors

---

## 📦 Ví dụ cấu trúc hoàn chỉnh

```
backend/ECommerceAI/
├── Controllers/
│   └── cat_controller.cs           ✅ controller
├── Models/
│   └── Pet/
│       └── cat_model.cs             ✅ model chính
├── Repositories/
│   ├── Interfaces/
│   │   └── ICatRepo.cs             ✅ interface dùng cat_model
│   └── Implementations/
│       └── CatRepo.cs               ✅ implementation dùng cat_model
```

