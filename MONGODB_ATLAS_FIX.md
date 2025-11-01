# MongoDB Atlas Connection Fix

## Vấn đề
Lỗi SSL handshake `error:0A000438:SSL routines::tlsv1 alert internal error` thường do:

1. **MongoDB Atlas Network Access không cho phép Render IPs**
2. **CA certificates không đúng trong Docker container**
3. **TLS configuration mismatch**

## Giải pháp

### Bước 1: Kiểm tra MongoDB Atlas Network Access

1. Vào [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Chọn cluster → **Network Access**
3. Kiểm tra IP whitelist:
   - ✅ Nếu chỉ có localhost → Thêm Render IPs hoặc `0.0.0.0/0` (cho test)
   - ✅ Nếu đã có `0.0.0.0/0` → Kiểm tra security settings

### Bước 2: Thêm Render IPs vào whitelist

**Cách 1: Cho phép tất cả IPs (cho test)**
- Thêm entry: `0.0.0.0/0`
- ⚠️ **Cảnh báo**: Không an toàn cho production

**Cách 2: Thêm Render IP ranges**
- Render IPs có thể thay đổi
- Tốt nhất là dùng `0.0.0.0/0` cho development

### Bước 3: Kiểm tra MongoDB User Authentication

1. Vào **Database Access**
2. Đảm bảo user có quyền đúng
3. Kiểm tra password có đúng không

### Bước 4: Test connection string

Test connection string này trong MongoDB Compass hoặc mongosh để đảm bảo credentials đúng:

```
mongodb+srv://ssnn01:xenlulozo1@nhanapp-cluster.yfdohhl.mongodb.net/pet_shop?retryWrites=true&w=majority
```

## Code đã fix

- ✅ Dockerfile: Đã cài ca-certificates
- ✅ MongoContext.cs: Đã config SSL/TLS đúng
- ✅ Connection string: Đã có `tls=true`

## Nếu vẫn lỗi

1. **Kiểm tra MongoDB Atlas Network Access** - Đây là nguyên nhân phổ biến nhất
2. **Thử connection string khác** - Có thể có vấn đề với user/password
3. **Kiểm tra MongoDB Atlas cluster status** - Đảm bảo cluster đang hoạt động

