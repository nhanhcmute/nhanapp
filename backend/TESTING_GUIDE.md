# Hướng Dẫn Test API trên Postman

## Bước 1: Khởi động Backend

```bash
cd backend
dotnet run
```

Backend sẽ chạy trên: `http://localhost:5000` (hoặc port khác theo cấu hình)

## Bước 2: Import Collection vào Postman

1. Mở Postman
2. Click **Import** (góc trên bên trái)
3. Chọn file `ECommerceAI_Postman_Collection.json`
4. Collection sẽ được import với tất cả các API endpoints

## Bước 3: Cấu hình Variables

Trong Postman Collection, có các biến cần thiết:

- `baseUrl`: `http://localhost:5000` (mặc định)
- `customerId`: ID khách hàng (để trống nếu test với session)
- `sessionId`: Session ID để test giỏ hàng (mặc định: `test-session-123`)
- `orderId`: ID đơn hàng (sẽ được điền sau khi tạo đơn)
- `cartItemId`: ID item trong giỏ hàng
- `paymentId`: ID giao dịch thanh toán
- `adminUserId`: ID admin user

**Cách set variables:**
1. Click vào Collection name
2. Chọn tab **Variables**
3. Điền các giá trị cần thiết

## Bước 4: Test Flow Cơ Bản

### Flow 1: Giỏ hàng → Đặt hàng COD

1. **Add Cart Item**
   - Method: `POST /api/cart/items`
   - Body: 
   ```json
   {
     "productId": "product_id_from_database",
     "productVariantId": "variant_id_if_has",
     "quantity": 2
   }
   ```
   - Query: `sessionId=test-session-123`

2. **Get Cart**
   - Method: `GET /api/cart`
   - Query: `sessionId=test-session-123`
   - Lưu `cartItemId` từ response

3. **Checkout Preview**
   - Method: `POST /api/checkout/preview`
   - Body:
   ```json
   {
     "shippingMethodId": "shipping_method_id",
     "couponCode": "DISCOUNT10",
     "shippingAddress": {
       "fullName": "Nguyễn Văn A",
       "phone": "0123456789",
       "addressLine": "123 Đường ABC",
       "ward": "Phường 1",
       "district": "Quận 1",
       "city": "Hồ Chí Minh",
       "country": "Vietnam"
     }
   }
   ```

4. **Create Order**
   - Method: `POST /api/orders`
   - Body:
   ```json
   {
     "paymentMethod": "COD",
     "shippingMethodId": "shipping_method_id",
     "shippingAddress": {
       "fullName": "Nguyễn Văn A",
       "phone": "0123456789",
       "addressLine": "123 Đường ABC",
       "ward": "Phường 1",
       "district": "Quận 1",
       "city": "Hồ Chí Minh",
       "country": "Vietnam"
     },
     "note": "Giao hàng vào buổi sáng"
   }
   ```
   - Lưu `orderId` từ response

5. **Get Order Detail**
   - Method: `GET /api/orders/{orderId}`
   - Kiểm tra order status = `PENDING_CONFIRM`

### Flow 2: Admin Xác Nhận Đơn COD

1. **Get Orders (Admin)**
   - Method: `GET /api/admin/orders?status=PENDING_CONFIRM`
   - Tìm order vừa tạo

2. **Confirm Order**
   - Method: `POST /api/admin/orders/{orderId}/confirm`
   - Query: `adminUserId=admin_id`
   - Order status sẽ chuyển sang `PROCESSING`

3. **Ship Order**
   - Method: `POST /api/admin/orders/{orderId}/ship`
   - Order status sẽ chuyển sang `SHIPPING`

4. **Complete Order**
   - Method: `POST /api/admin/orders/{orderId}/complete`
   - Order status sẽ chuyển sang `COMPLETED`
   - Payment status sẽ chuyển sang `PAID` (cho COD)

### Flow 3: Thanh Toán Online

1. **Create Order với PaymentMethod = VNPAY**
   - Method: `POST /api/orders`
   - Body: `"paymentMethod": "VNPAY"`
   - Order status = `PENDING_PAYMENT`

2. **Init Payment**
   - Method: `POST /api/payments/init`
   - Body:
   ```json
   {
     "orderId": "order_id",
     "paymentMethod": "VNPAY"
   }
   ```
   - Lưu `paymentId` và `paymentUrl` từ response

3. **Simulate Webhook (VNPAY)**
   - Method: `POST /api/payments/webhook/vnpay`
   - Body:
   ```json
   {
     "vnp_TxnRef": "DH20241115-0001",
     "vnp_TransactionNo": "12345678",
     "vnp_ResponseCode": "00",
     "vnp_Amount": "1000000"
   }
   ```
   - Order status sẽ chuyển sang `PAID`
   - Payment status = `SUCCESS`

4. **Get Payment Status**
   - Method: `GET /api/payments/{paymentId}/status`
   - Kiểm tra status

## Lưu Ý Quan Trọng

### 1. Cần có dữ liệu mẫu trong Database

Trước khi test, cần có:
- **Products**: Sản phẩm trong database
- **Product Variants**: Biến thể sản phẩm (nếu có)
- **Shipping Methods**: Phương thức vận chuyển
- **Payment Methods**: Phương thức thanh toán
- **Coupons**: Mã giảm giá (nếu test coupon)

### 2. Test với Session ID

Nếu chưa có authentication, có thể test với `sessionId`:
- Set `sessionId` trong collection variables
- Sử dụng `sessionId` trong query params của các API

### 3. Test với Customer ID

Nếu đã có user system:
- Set `customerId` trong collection variables
- Sử dụng `customerId` thay vì `sessionId`

### 4. Lấy ID từ Response

Sau mỗi request thành công:
- Copy `id` từ response
- Paste vào collection variables để dùng cho request tiếp theo

### 5. Kiểm tra Response Format

Tất cả API trả về format:
```json
{
  "status": 200,
  "message": "Success",
  "data": { ... }
}
```

## Troubleshooting

### Lỗi 404 Not Found
- Kiểm tra `baseUrl` đúng chưa
- Kiểm tra backend đã chạy chưa
- Kiểm tra route path đúng chưa

### Lỗi 400 Bad Request
- Kiểm tra request body format
- Kiểm tra required fields đã điền đủ chưa
- Kiểm tra data types (string, number, etc.)

### Lỗi 500 Internal Server Error
- Kiểm tra MongoDB connection
- Kiểm tra logs trong console của backend
- Kiểm tra dữ liệu trong database có hợp lệ không

## Test Cases Mẫu

### Test Case 1: Tạo đơn hàng COD thành công
1. Add item vào cart
2. Preview checkout
3. Create order với COD
4. Verify order status = PENDING_CONFIRM
5. Admin confirm order
6. Verify order status = PROCESSING
7. Admin ship order
8. Verify order status = SHIPPING
9. Admin complete order
10. Verify order status = COMPLETED, payment status = PAID

### Test Case 2: Hủy đơn hàng
1. Create order
2. Cancel order
3. Verify order status = CANCELLED
4. Verify inventory được cộng lại (nếu đã trừ)

### Test Case 3: Thanh toán online thành công
1. Create order với VNPAY
2. Init payment
3. Simulate webhook success
4. Verify order status = PAID
5. Verify payment status = SUCCESS
6. Verify inventory được trừ

### Test Case 4: Thanh toán online thất bại
1. Create order với VNPAY
2. Init payment
3. Simulate webhook failed
4. Verify order status = PAYMENT_FAILED
5. Verify payment status = FAILED

