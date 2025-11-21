# Tóm Tắt Tích Hợp API

## Đã Hoàn Thành

### 1. Service Files (frontend/src/services/)
- ✅ `cartService.js` - Quản lý giỏ hàng
- ✅ `orderService.js` - Quản lý đơn hàng (Customer)
- ✅ `checkoutService.js` - Checkout preview
- ✅ `adminOrderService.js` - Quản lý đơn hàng (Admin)
- ✅ `paymentService.js` - Quản lý thanh toán
- ✅ `shippingService.js` - Quản lý vận chuyển
- ✅ `couponService.js` - Quản lý coupon

### 2. Updated Components

#### CartContext (frontend/src/store/CartContext.js)
- ✅ Đã chuyển từ Firebase sang API
- ✅ Sử dụng `cartService` để quản lý giỏ hàng
- ✅ Hỗ trợ cả customerId và sessionId

#### useOrder Hook (frontend/src/hooks/useOrder.js)
- ✅ Đã chuyển từ Firebase sang API
- ✅ Sử dụng `orderService` để lấy danh sách đơn hàng
- ✅ Map status từ enum sang tiếng Việt

#### CheckoutPage (frontend/src/pages/CheckoutPage.js)
- ✅ Đã tích hợp `orderService.createOrder()`
- ✅ Map payment method và shipping method
- ✅ Xóa items khỏi giỏ hàng sau khi tạo đơn thành công

#### ManageOrdersPage (frontend/src/pages/admin/ManageOrdersPage.js)
- ✅ Đã tích hợp `adminOrderService`
- ✅ Lấy danh sách đơn hàng từ API
- ✅ Cập nhật trạng thái đơn hàng qua API

### 3. Cần Hoàn Thiện

#### OrderPage.js
- Cần load order items từ API khi hiển thị chi tiết
- Cần tích hợp `orderService.getOrderDetail()` để lấy đầy đủ thông tin

#### Payments.js (Admin)
- Cần tích hợp `adminOrderService` để quản lý thanh toán
- Có thể sử dụng các method: `confirmOrder`, `completeOrder`, `refundOrder`

#### Shipping.js (Admin)
- Cần tích hợp `adminOrderService.shipOrder()` để cập nhật shipping status

#### Voucher.js
- Hiện tại đang dùng Firebase, có thể giữ nguyên hoặc tích hợp API coupon sau

## Cách Sử Dụng

### 1. Cấu hình API URL
Đảm bảo biến môi trường `REACT_APP_API_URL` được set đúng:
```bash
# .env
REACT_APP_API_URL=http://localhost:5000
```

### 2. Session Management
- Nếu user chưa login: sử dụng `sessionId` (tự động tạo và lưu trong localStorage)
- Nếu user đã login: sử dụng `customerId` từ localStorage

### 3. Status Mapping
- Backend sử dụng enum: `PENDING_PAYMENT`, `PENDING_CONFIRM`, `PROCESSING`, etc.
- Frontend hiển thị tiếng Việt: `Chờ thanh toán`, `Chờ xác nhận`, `Chờ lấy hàng`, etc.
- Các service files đã có hàm map giữa 2 format

## Lưu Ý

1. **Cart Items**: Cần lưu `cartItemId` từ API response để có thể update/delete sau
2. **Order Items**: Khi hiển thị chi tiết đơn hàng, cần gọi `orderService.getOrderDetail()` để lấy order items
3. **Payment Flow**: 
   - COD: Tạo order → Admin confirm → Ship → Complete
   - Online: Tạo order → Init payment → Webhook → Complete
4. **Error Handling**: Tất cả API calls đều có try-catch và hiển thị error message

## Testing

Sử dụng Postman Collection đã tạo (`backend/ECommerceAI_Postman_Collection.json`) để test các API endpoints trước khi test trên frontend.

