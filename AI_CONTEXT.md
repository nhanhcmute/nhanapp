# AI_CONTEXT – Nhân's Pet Haven

> File này mô tả toàn bộ hệ thống để AI (Claude, Cursor, ChatGPT…) đọc trước khi sửa / thêm code.
> Khi làm việc với dự án này: **đọc hết file, tuân theo quy ước ở mục 9, và cập nhật file này khi thay đổi kiến trúc / API.**

---

## 1. Tổng quan

- **Sản phẩm:** website thương mại điện tử cho cửa hàng thú cưng *Nhân's Pet Haven*: bán thức ăn, đồ chơi, phụ kiện, cát vệ sinh, đồ y tế cho chó/mèo; có thư viện giống chó/mèo; giao hàng qua shipper.
- **Ngôn ngữ giao diện & thông báo API:** tiếng Việt.
- **Tác nhân:** Khách vãng lai, Khách hàng (`role = 2`), Admin (`role = 1`), Shipper (`role = 3`, chỉ dùng app mobile – `signup` luôn tạo role 2 nên tài khoản shipper phải chỉnh role trong DB).
- **Monorepo:**

```
nhanapp/
├── backend/            ASP.NET Core 8 Web API (C#), MongoDB
│   ├── Program.cs  backend.csproj  appsettings*.json  Dockerfile  global.json
│   └── ECommerceAI/
│       ├── Controllers/        API endpoints
│       ├── DataAccess/         MongoContext, IndexInitializer
│       ├── DTOs/<Module>/      request/response
│       ├── Models/<Module>/    document Mongo (*_model)
│       ├── Repositories/       Interfaces/ + Implementations/ + MongoFilterHelpers
│       └── Services/           Interfaces/ + Implementations/ + ImportPetsDataService
├── frontend/           React 18 (Create React App) + MUI 6
│   └── src/ components/{common,layout,product}  pages/  pages/admin/
│            services/  store/  hooks/  config/  styles/  utils/
├── shipper-app/        React Native 0.81 + Expo 54 (app cho shipper)
├── package.json        concurrently: chạy FE + BE
├── render.yaml         deploy backend (Docker) lên Render
└── netlify.toml        deploy frontend lên Netlify
```

## 2. Công nghệ

| Phần | Công nghệ |
|---|---|
| Frontend | React 18, React Router DOM 7, MUI 6 (@mui/material, icons), Emotion, SCSS, axios + fetch, react-toastify, react-hook-form, swiper, chart.js/react-chartjs-2, leaflet, date-fns, react-icons, react-csv; **firebase** (còn sót ở một số trang cũ) |
| Backend | .NET 8, MongoDB.Driver 2.28, Swashbuckle 6.5 (Swagger), SkiaSharp (nén ảnh), IMemoryCache, HttpClientFactory, System.Net.Mail (SMTP Gmail) |
| Database | MongoDB Atlas, database `pet_shop` |
| Mobile | Expo 54, React Native 0.81, React Navigation 7 (native-stack, bottom-tabs), axios, AsyncStorage |
| Dịch vụ ngoài | provinces.open-api.vn (tỉnh/quận/phường), OpenStreetMap Nominatim (geocoding) + tile Leaflet, TheCatAPI / TheDogAPI, Open Pet Food Facts, Gmail SMTP |
| Deploy | Render (Docker, backend `https://petshop-a2ry.onrender.com`), Netlify (frontend) |

## 3. Chạy dự án

```bash
npm run install:frontend      # cài frontend
npm start                     # FRONTEND :3000 + BACKEND :5000 (concurrently)
npm run start:backend         # chỉ backend: dotnet run --project backend/backend.csproj
cd shipper-app && npx expo start
```

- Swagger: `http://localhost:5000/swagger` (chỉ môi trường Development).
- Chuỗi kết nối Mongo: biến môi trường `MONGODB_URI` được ưu tiên, sau đó `ConnectionStrings:MongoDb` trong appsettings.
- Frontend chọn API URL ở `src/config/api.js`: `REACT_APP_API_URL` → `http://localhost:5000` (localhost/dev) → URL Render.
- Shipper app: `shipper-app/src/api/client.js` đang hardcode `BASE_URL = 'http://192.168.1.11:5000'` (IP LAN). Đổi IP này khi chạy trên máy khác.

## 4. Backend – kiến trúc

**Luồng:** `Controller` → `I<Name>Repo` (Repository) / `I<Name>Service` → `MongoContext.Database.GetCollection<T>("name")`.

- `MongoContext` (Singleton): pool 10–100, timeout 5s/5s/10s, tạo index 1 lần (`IndexInitializer`).
- Repository đăng ký `AddScoped`. `IOTPCacheService`, `IImageCompressionService` là Singleton. `IEmailService`, `INotificationService`, `ImportPetsDataService` là Scoped.
- CORS policy `AllowFrontend`: `AllowedOrigins` trong appsettings rỗng thì AllowAnyOrigin.
- Lắng nghe `http://0.0.0.0:{PORT ?? 5000}`.
- **Khi khởi động** (`Program.cs`, đều idempotent):
  1. `ImportPetsDataService.ImportDataIfNeededAsync()`: nạp `cats.json`/`dogs.json` nếu collection rỗng.
  2. `BackfillCatImagesAsync()`: bổ sung ảnh mèo còn thiếu qua TheCatAPI.
  3. `ProductRepo.BackfillThumbnailsAsync()`: tạo `thumbnail_image` cho sản phẩm cũ.
  4. `ProductRepo.BackfillPetTypeAndCategoryAsync()`: suy ra `pet_type`/`category` cho sản phẩm cũ.
- **Không có JWT / [Authorize]**: API không xác thực phía server; danh tính truyền qua `customerId`, `userId`, `shipperId` trên query string hoặc body.

### 4.1. Format response chuẩn (mọi controller)
```json
{ "status": 200, "message": "Thông báo tiếng Việt", "data": { } }
```
Lỗi trả `BadRequest` / `NotFound` / `Unauthorized` / `StatusCode(500)` cùng format, `data = null`. Phân trang dùng `PaginationResponse<T> { data, page, pageSize, totalCount, totalPages }`.

### 4.2. Hai kiểu route (giữ nguyên kiểu của module đang sửa)
1. **Kiểu cũ** `<module>.ctr/<action>`: chỉ `POST`, body JSON. Gồm user, product, cat, dog, address, settings, import_pets.
2. **Kiểu REST** `/api/<resource>`: GET/POST/PUT/DELETE. Gồm cart, checkout, orders, payments, admin/orders, shipper, notifications.

## 5. Database `pet_shop` – collections

| Collection | Model | Trường chính |
|---|---|---|
| users | user_model | name, email, username (unique), password (**plain text**), phone, birthday, role (1 Admin, 2 User, 3 Shipper), createdAt, updatedAt, lastLogin |
| addresses | address_model | user_id, full_name, phone, province/province_name, district/district_name, ward/ward_name, street, details, address_type (home/office), is_default, location (GeoJSON lon,lat), is_active |
| customer_profiles | customer_profile_model | user_id, full_name, phone, default_shipping/billing_address_id |
| products | product_model | name, sku, description, base_price (decimal), price (**string**, ví dụ "550k"), quantity, image (base64 gốc), thumbnail_image (base64 đã nén), status ("Còn hàng"/"Hết hàng"/"Ngừng kinh doanh"), pet_type ("Mèo"/"Chó"/"Cả hai"), category ("Thức ăn"/"Đồ chơi"/"Phụ kiện"/"Vệ sinh"/"Y tế"/"Khác") |
| product_variants | product_variant_model | product_id, sku, variant_name, price, stock_quantity |
| inventory_movements | inventory_movement_model | product_variant_id, change_quantity (±), reason (order_created, order_cancelled, manual_adjust…), reference_type, reference_id |
| carts | cart_model | customer_id **hoặc** session_id, status (active / converted_to_order / abandoned) |
| cart_items | cart_item_model | cart_id, product_id, product_variant_id, quantity, unit_price (giá chụp lúc thêm) |
| cats | cat_model | catId, name, origin, temperament, description, life_span, weight{imperial,metric}, các chỉ số 1–5 (adaptability, affection_level, child_friendly, energy_level, grooming, intelligence, shedding_level…), cờ (hairless, rare, hypoallergenic…), image_data, wikipedia_url, price |
| dogs | dog_model | dogId (int), name, bred_for, breed_group, life_span, temperament, origin, weight, height, image |
| orders | order_model | order_code (unique, dạng `DHyyyyMMdd-xxxx`), customer_id, shipper_id, status (OrderStatus), payment_method (COD/VNPAY/MOMO/PAYPAL), payment_status (PaymentStatus), shipping_method_id, shipping_full_name/phone/address_line/ward/district/city/country, subtotal_amount, shipping_fee, discount_amount, total_amount, note, admin_note |
| order_items | order_item_model | order_id, product_id, product_variant_id, product_name & sku (snapshot), quantity, unit_price, total_price |
| order_status_logs | order_status_log_model | order_id, old_status, new_status, changed_by_user_id, note |
| payments | payment_model | order_id, provider (VNPAY/MOMO/PAYPAL/INTERNAL_COD), provider_transaction_id, status (PENDING/SUCCESS/FAILED/REFUNDED), amount, currency "VND", payment_url, raw_request/raw_response |
| payment_methods | payment_method_model | code, display_name, is_active, config_json |
| coupons | coupon_model | code, discount_type (PERCENT/FIXED), discount_value, min_order_amount, max_discount_amount, start_date, end_date, usage_limit, used_count, status |
| order_coupons | order_coupon_model | order_id, coupon_id, discount_amount |
| shipping_methods | shipping_method_model | code, name, base_fee, is_active |
| notifications | notification_model | user_id, title, message, type (ORDER_STATUS/PROMOTION/SYSTEM), link, is_read, read_at |
| store_settings | store_settings_model | **1 document duy nhất, `_id = "store"`**: store_name, store_logo, contact_info, payment_method, shipping_fee, shipping_partner, api_key |

- Model dùng `[BsonId][BsonRepresentation(BsonType.ObjectId)] string Id` và `[BsonElement("snake_case")]`.
- Dữ liệu cũ có `_id` là chuỗi thường. Luôn lọc theo id bằng `MongoFilterHelpers.ById<T>(id)`.
- Index được khai báo trong `DataAccess/IndexInitializer.cs`. Thêm truy vấn mới hay dùng thì thêm index ở đó.

## 6. API

### 6.1. `user.ctr` (POST)
`login {username,password}` · `signup {name,email,username,password}` · `send_otp {email,type:"signup"|"forgot_password",username?}` · `verify_otp {email,otpCode,type}` · `forgot_password {username,email}` · `reset_password {username,new_password}` · `check_username "x"` · `check_email "x"` · `getUserLogin {id|username}` (kèm danh sách địa chỉ) · `count_customers` · `create_admin_test` (chỉ để test).
OTP: 6 số, lưu IMemoryCache key `OTP_{type}_{email}`, hết hạn **1 phút**, dùng 1 lần; OTP luôn được log ra console.

### 6.2. `product.ctr` (POST)
`get_all` (còn hàng, cache key `products_all` 5 phút) · `get_paged {page,page_size,pet_type?,category?}` · `get_by_id {id}` (trả ảnh gốc) · `search {query,page?,page_size?}` · `get_sorted {sort_by: name|price|quantity}` · `create` · `update` · `delete {id}`.
- API trả danh sách **không trả ảnh gốc**: dùng projection loại `image`, rồi gán `image = thumbnail_image`. Chỉ `get_by_id`/`GetByIdsAsync` trả ảnh gốc.
- `create`/`update`/`delete` phải xóa cache `products_all`. Khi lưu, ảnh được nén thành thumbnail bằng `ImageCompressionService.CompressBase64Image` (max 400px, JPEG 70).
- Lọc `pet_type = Mèo/Chó` thì vẫn trả cả sản phẩm `"Cả hai"`.

### 6.3. `cat.ctr` / `dog.ctr` / `import_pets.ctr` (POST)
- cat: `get_all, get_paged, get_by_id, get_by_cat_id, search, create, update` (multipart: IFormFile `image` hoặc `image_data`), `delete, bulk_import`.
- dog: `get_all, get_paged, get_by_id, search`.
- import_pets: `import_all, import_from_api` (thêm giống mới từ TheCatAPI/TheDogAPI), `import_products_from_api` (Open Pet Food Facts, giá random), `force_import_all`. Các lệnh import không xóa dữ liệu cũ, trừ `force_import_all`.

### 6.4. `address.ctr` (POST)
`get_all_by_user {user_id}` · `get_by_id {id}` · `create {user_id, fullName, phone, province, provinceName, district, districtName, ward, wardName, street, details?, addressType, isDefault, latitude?, longitude?}` · `update {id,...}` · `delete {id}` · `set_default {user_id,id}` (bỏ cờ mặc định ở mọi địa chỉ rồi đặt cờ cho địa chỉ được chọn).

### 6.5. `settings.ctr` (POST)
`get`, `update`: cấu hình cửa hàng (document `_id="store"`). Frontend đọc qua hook `useStoreSettings`.

### 6.6. Giỏ hàng `/api/cart`
Mọi request kèm `?customerId=` (đã đăng nhập) **hoặc** `?sessionId=` (khách vãng lai).
`GET /api/cart` · `POST /api/cart/items {productId, productVariantId?, quantity}` · `PUT /api/cart/items/{itemId} {quantity}` · `DELETE /api/cart/items/{itemId}` · `DELETE /api/cart`.
- Đơn giá: dùng `base_price`; nếu bằng 0 thì parse chuỗi `price` (bỏ VND/VNĐ/đ và dấu phẩy, hậu tố `k` ×1000).
- Kiểm tra `stock_quantity` của biến thể. Thêm trùng sản phẩm thì cộng dồn. Sản phẩm và biến thể được batch load để tránh N+1 query.

### 6.7. Checkout / Order / Payment
- `POST /api/checkout/preview?customerId|sessionId` body `{shippingMethodId?, couponCode?, shippingAddress{fullName,phone,addressLine,ward,district,city,country}}` trả `{subtotalAmount, shippingFee, discountAmount, totalAmount}`.
  - Phí ship = `shipping_methods.base_fee`.
  - Coupon hợp lệ khi active, trong khoảng start/end date, subtotal ≥ min_order_amount. PERCENT có trần max_discount_amount, FIXED trừ thẳng.
- `POST /api/orders?customerId|sessionId` body `CreateOrderRequest {paymentMethod, shippingMethodId?, couponCode?, shippingAddress, note?}`:
  - Tạo order từ giỏ active và snapshot order_items. COD → `PENDING_CONFIRM`, cổng online → `PENDING_PAYMENT`.
  - Tăng `coupon.used_count`, ghi `order_status_logs`, tạo notification, chuyển giỏ sang `converted_to_order`.
- `GET /api/orders?customerId=&page=&pageSize=` (đơn của khách) · `GET /api/orders/{id}` · `POST /api/orders/{id}/cancel` (chỉ khi PENDING_PAYMENT / PENDING_CONFIRM / PAID).
- `GET /api/payments/payment-methods` · `POST /api/payments/init {orderId, paymentMethod}` (**chỉ tạo URL sandbox giả**, chưa tích hợp thật) · `GET /api/payments/{id}/status` · `POST /api/payments/webhook/{provider}` (VNPAY: `vnp_ResponseCode == "00"`, MOMO: `resultCode == "0"`).

### 6.8. Admin đơn hàng `/api/admin/orders`
`GET` (lọc OrderQueryRequest: page, pageSize, status, paymentStatus, dateFrom, dateTo, keyword) · `GET /{id}` (kèm items, logs, payment) · `PATCH /{id}?adminUserId=` body `{status?, adminNote?}` · `POST /{id}/confirm` · `POST /{id}/ship` · `POST /{id}/complete` · `POST /{id}/refund`.
- `confirm`: từ PENDING_CONFIRM sang PROCESSING, **trừ tồn kho biến thể + ghi inventory_movements**, tạo payment PENDING.
- `complete`: đơn COD thì chuyển payment sang PAID/SUCCESS.
- `refund`: chuyển sang CANCELLED + REFUNDED, **hoàn tồn kho**.

### 6.9. Shipper `/api/shipper` (`?shipperId=` trên mọi request)
`GET orders/available` (PROCESSING/PAID) · `POST orders/{id}/accept` (sang SHIPPING, gán shipper_id) · `GET orders/my-orders` · `POST orders/{id}/complete` (sang COMPLETED + PAID) · `POST orders/{id}/cancel` (trả đơn về PROCESSING) · `POST orders/{id}/fail` body `"reason"` · `GET history`.

### 6.10. Thông báo `/api/notifications`
`GET ?userId=&page=&pageSize=` · `GET unread-count?userId=` · `POST {id}/mark-read` · `POST mark-all-read`.
`NotificationService.CreateNotificationAsync(...)` được gọi khi tạo đơn và khi đổi trạng thái đơn.

### 6.11. Vòng đời đơn hàng
```
COD:     PENDING_CONFIRM ─confirm→ PROCESSING ─ship/shipper accept→ SHIPPING ─complete→ COMPLETED
Online:  PENDING_PAYMENT ─webhook OK→ PAID ─→ PROCESSING/SHIPPING ─→ COMPLETED
         PENDING_PAYMENT ─webhook fail→ PAYMENT_FAILED
Hủy:     PENDING_PAYMENT | PENDING_CONFIRM | PAID ─cancel→ CANCELLED
Hoàn:    SHIPPING | COMPLETED ─refund→ CANCELLED + payment_status REFUNDED
```
Nhãn tiếng Việt (AdminOrderController / `frontend/src/utils/orderStatus.js`): Chờ thanh toán, Chờ xác nhận, Đã thanh toán, Chờ lấy hàng, Chờ giao hàng, Hoàn thành, Đã hủy, Thanh toán thất bại.
**Mỗi lần đổi trạng thái phải:** ghi `order_status_logs` + tạo notification cho khách.

## 7. Frontend

### 7.1. Khung ứng dụng (`src/App.js`)
`ThemeProvider(theme)` → `GoogleOAuthProvider` (client id placeholder, chưa dùng) → `Router` → `AutoLogout` → `CartProvider` → `Routes`. Có 3 nhóm route:
1. Trang độc lập: `/login`, `/signup`, `/verify-otp`, `/reset-password`, `/homepage`, `/aboutus`.
2. `LayoutPage` (Header + Outlet), gồm:
   - Public: `/`, `/productlist`, `/petsupplies`, `/catlitter`, `/others`, `/otherpets`, `/product/:id`, `/productdetail/:id`, `/cats`, `/dogs`, `/petdetails`, `/search`, `/contact`, `/blog`, `/privacy`.
   - Bọc `ProtectedRoute`: `/profile`, `/personal`, `/cart`, `/checkout`, `/orders`, `/address`, `/bank`, `/alerts`, `/notificationsetting`, `/changepassword`, `/voucher`, `/getvoucher`.
   - `*` → ErrorPage.
3. `AdminLayout`, mọi route bọc `AdminRoute` (role === 1): `/admin`, `/admin/dashboard`, `/admin/products`, `/admin/ordermanagement`, `/admin/customers`, `/admin/inventory`, `/admin/promotions`, `/admin/reports`, `/admin/usermanagement`, `/admin/notifications`, `/admin/settings`, `/admin/reviews`, `/admin/payments`, `/admin/shipping`.

### 7.2. Trạng thái & dịch vụ
- **Đăng nhập:** `localStorage.user` = `{ id, name, email, username, role, lastLogin }`. Sau khi đổi user phát `window.dispatchEvent(new Event('userUpdated'))`. Hook `store/useAuthStore.js` nghe sự kiện này.
- `ProtectedRoute` chuyển về `/login` với `state.from`, `state.message`; LoginPage quay lại `from` sau khi đăng nhập. Admin thì đi `/admin`.
- `AutoLogout`: hằng số hiện là `10*60*10000` ms (~100 phút).
- **Giỏ hàng:** `store/CartContext.js` (`useCart()`: cart, addToCart, updateCartQuantity, removeFromCart, clearCart, getTotalQuantity, getTotalPrice) dùng `services/cartService.js`. `sessionId` lưu trong localStorage. Item trong context có dạng `{ id(productId), cartItemId, name, price, quantity, image, description }`.
- Services: `cartService`, `checkoutService`, `orderService`, `adminOrderService`, `notificationService`. Hooks: `useOrder`, `useStoreSettings`.
- Utils: `imageUtils` (xử lý ảnh base64 / ảnh mặc định `/default-product.jpg`), `orderStatus` (nhãn + màu), `shippingUtils` (`getCoordinatesFromAddress` qua Nominatim, tính phí/khoảng cách), `colors`.
- Địa chỉ VN: `https://provinces.open-api.vn/api/?depth=1`, rồi `/api/p/{code}?depth=2`, rồi `/api/d/{code}?depth=2`.
- Bản đồ: `components/common/MapComponent.js` (Leaflet, giữ instance bằng useRef).

### 7.3. Giao diện
- Theme `styles/theme.js`: primary `#42A5F5`, secondary `#81C784`, accent `#FFB74D`, nền `#F5F5F5`. Màu thương hiệu dùng nhiều trong sx là **hồng `#ff6b81`** (hover `#ff4757`). Card bo góc 16–24px, icon `FaPaw`.
- Responsive bằng MUI breakpoint `{ xs, sm, md }`. Header dùng Drawer trên mobile. Không để trang bị cuộn ngang.
- Thông báo người dùng: `react-toastify` / MUI `Snackbar`, `Alert`.

### 7.4. Trạng thái nối API của từng trang
| Đã gọi backend | Còn dùng Firebase / localStorage / dữ liệu tĩnh |
|---|---|
| LoginPage, SignUp, VerifyOTPPage, ResetPasswordPage, HomePage/ProductsGrid, ProductList, ProductDetail(Page), Cats, Dogs, CartPage, CheckoutPage (createOrder), OrderPage, NotificationBell, admin: AdminPage, ManageProductsPage, ManageOrdersPage, SettingsPage | **Firebase:** AddressPage, ChangePassword, Alerts, GetVoucher, Voucher, SelectVoucher, ProductPage, ProductListPage, RegisterPage, admin: Inventory, NotificationsPage, Payments, Promotions, ReportsPage, Reviews, Shipping, UserManagementPage. **localStorage:** ProfilePage, PersonalInfoPage (`personalInfo`) |

Khi sửa các trang ở cột phải, ưu tiên chuyển sang API backend tương ứng và bỏ import firebase.

## 8. Shipper app (`shipper-app/`)
- `src/api/client.js`: axios với `BASE_URL` là IP LAN. Interceptor đọc `userToken` từ AsyncStorage nhưng chưa gửi header.
- `src/context/AuthContext.js`: quản lý đăng nhập (dùng `user.ctr/login`, signup, OTP như web).
- `src/navigation/AppNavigator.js`:
  - Stack chưa đăng nhập: Login, SignUp, ForgotPassword, VerifyOTP, ResetPassword.
  - Bottom tabs khi đã đăng nhập: **Available** (Đơn hàng mới), **MyOrders** (Đơn của tôi), **Profile** (Tài khoản), cùng OrderDetail.
- Các màn hình gọi `/api/shipper/*` với `shipperId = user.id`.

## 9. Quy ước code (AI phải tuân theo)

1. **Đặt tên:**
   - Backend: model `snake_case_model`; controller kiểu cũ `xxx_controller` + `[Route("xxx.ctr")]`; controller REST `XxxController` + `[Route("api/xxx")]`; repository `IXxxRepo`/`XxxRepo`; service `IXxxService`/`XxxService`.
   - Frontend: Page/Component PascalCase; hook `useXxx`; service `xxxService`.
2. Thêm repository hoặc service mới thì **phải đăng ký DI trong `backend/Program.cs`**.
3. Mọi response trả `{ status, message, data }`, message tiếng Việt. Bọc action trong try/catch, `_logger.LogError`, trả 500 cùng format.
4. Truy vấn theo `_id` dùng `MongoFilterHelpers.ById<T>`. Load nhiều bản ghi theo danh sách id dùng `$in` (ví dụ `GetByIdsAsync`), không gọi từng cái trong vòng lặp.
5. API danh sách sản phẩm **không trả ảnh gốc**. Giữ projection và cơ chế thumbnail. Sửa sản phẩm thì xóa cache `products_all`.
6. Code chạy lúc khởi động (import / backfill) phải **idempotent** và không xóa dữ liệu có sẵn.
7. Frontend gọi API qua `API_URL` từ `src/config/api.js`, không hardcode localhost. Gửi `Content-Type: application/json`.
8. Đổi trạng thái đơn thì ghi `order_status_logs` + gọi `NotificationService`. Trừ / hoàn tồn kho thì ghi `inventory_movements`.
9. Comment trong code viết tiếng Việt, ngắn gọn, giải thích *tại sao*.
10. Không commit secret. Đọc cấu hình từ biến môi trường hoặc appsettings, không ghi vào code.

## 10. Tồn đọng / hạn chế đã biết
- Mật khẩu lưu **plain text** (`TODO: Hash password` trong user_controller). Chưa có JWT hay phân quyền phía server. `AdminRoute`/`ProtectedRoute` chỉ chặn ở frontend.
- `user.ctr/create_admin_test` hardcode tài khoản admin, cần xóa trước khi phát hành.
- `appsettings.json` đang chứa chuỗi kết nối Mongo và mật khẩu SMTP thật. Cần chuyển sang biến môi trường và đổi mật khẩu.
- Thanh toán VNPAY/MOMO/PAYPAL chỉ là URL sandbox giả. Webhook chưa kiểm tra chữ ký.
- OTP lưu trong RAM, mất khi restart; chưa giới hạn số lần nhập sai.
- Nhiều trang còn dùng Firebase (xem 7.4). `AutoLogout` đang đặt sai thời gian.
- Giỏ hàng của khách vãng lai (sessionId) chưa được gộp vào giỏ của tài khoản khi đăng nhập. Sản phẩm không có biến thể chưa kiểm tra tồn kho theo `quantity`.
- Giá sản phẩm còn 2 trường (`base_price` decimal, `price` string). Code mới nên dùng `base_price`.
- Tài liệu phụ trong repo: `BUILD_FULL_ECOMMERCE_AI_PROJECT.md`, `backend/API_NAMING_CONVENTION.md`, `backend/USER_API_DOCUMENTATION.md`, `backend/TESTING_GUIDE.md`, `backend/ECommerceAI_Postman_Collection.json`.
