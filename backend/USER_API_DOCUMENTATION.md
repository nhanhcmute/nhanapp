# 📘 User API Documentation

## Base URL
```
http://localhost:5000 (Development)
https://your-app.onrender.com (Production)
```

---

## 🔐 Authentication APIs

### 1. Đăng nhập (Login)

**Endpoint:** `POST /user.ctr/login`

**Request Body (JSON):**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Đăng nhập thành công!",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user",
    "lastLogin": "2025-11-01T10:30:00Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Thiếu username hoặc password
```json
{
  "status": 400,
  "message": "Vui lòng nhập tên đăng nhập và mật khẩu!",
  "data": null
}
```

- **401 Unauthorized:** Sai username hoặc password
```json
{
  "status": 401,
  "message": "Sai tên đăng nhập hoặc mật khẩu!",
  "data": null
}
```

---

### 2. Đăng ký (Signup)

**Endpoint:** `POST /user.ctr/signup`

**Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Đăng ký thành công!",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user",
    "lastLogin": null
  }
}
```

**Error Responses:**
- **400 Bad Request:** Thiếu thông tin
```json
{
  "status": 400,
  "message": "Vui lòng điền đầy đủ thông tin!",
  "data": null
}
```

- **400 Bad Request:** Username đã tồn tại
```json
{
  "status": 400,
  "message": "Tên đăng nhập đã tồn tại!",
  "data": null
}
```

- **400 Bad Request:** Email đã được sử dụng
```json
{
  "status": 400,
  "message": "Email này đã được sử dụng!",
  "data": null
}
```

---

### 3. Quên mật khẩu - Bước 1 (Forgot Password)

**Endpoint:** `POST /user.ctr/forgot_password`

**Request Body (JSON):**
```json
{
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Thông tin xác thực thành công!",
  "data": {
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Thiếu thông tin
```json
{
  "status": 400,
  "message": "Vui lòng nhập tên đăng nhập và email!",
  "data": null
}
```

- **404 Not Found:** Thông tin không đúng
```json
{
  "status": 404,
  "message": "Thông tin tài khoản hoặc email không đúng!",
  "data": null
}
```

---

### 4. Đặt lại mật khẩu - Bước 2 (Reset Password)

**Endpoint:** `POST /user.ctr/reset_password`

**Request Body (JSON):**
```json
{
  "username": "johndoe",
  "new_password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Mật khẩu của bạn đã được thay đổi thành công!",
  "data": true
}
```

**Error Responses:**
- **400 Bad Request:** Thiếu thông tin
```json
{
  "status": 400,
  "message": "Vui lòng nhập tên đăng nhập và mật khẩu mới!",
  "data": null
}
```

- **404 Not Found:** Người dùng không tồn tại
```json
{
  "status": 404,
  "message": "Người dùng không tồn tại!",
  "data": null
}
```

---

### 5. Kiểm tra Username tồn tại

**Endpoint:** `POST /user.ctr/check_username`

**Request Body (FormData):**
```
username=johndoe
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "exists": true
  }
}
```

---

### 6. Kiểm tra Email tồn tại

**Endpoint:** `POST /user.ctr/check_email`

**Request Body (FormData):**
```
email=john@example.com
```

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "exists": true
  }
}
```

---

## 📦 Data Models

### user_model

```csharp
{
  "id": "string (ObjectId)",
  "name": "string",
  "email": "string",
  "username": "string",
  "password": "string (hashed)",
  "role": "string (user | admin)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "lastLogin": "DateTime?"
}
```

---

## 🔄 Migration từ Firebase

### Trước (Firebase):
```javascript
// Login
const signupRef = ref(database, 'signup');
const snapshot = await get(signupRef);
const users = snapshot.val();
```

### Sau (Backend API):
```javascript
// Login
const response = await fetch(`${API_URL}/user.ctr/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'password123'
  })
});

const result = await response.json();
if (result.status === 200) {
  // Lưu user info vào localStorage
  localStorage.setItem('user', JSON.stringify(result.data));
  
  // Navigate dựa trên role
  if (result.data.role === 'admin') {
    navigate('/admin');
  } else {
    navigate('/');
  }
}
```

---

## ✅ Frontend Integration Checklist

- [ ] Thay thế Firebase Auth bằng `/user.ctr/login`
- [ ] Thay thế Firebase Signup bằng `/user.ctr/signup`
- [ ] Thay thế Firebase Password Reset bằng `/user.ctr/forgot_password` và `/user.ctr/reset_password`
- [ ] Lưu user info từ response vào localStorage
- [ ] Xử lý role-based navigation (admin vs user)
- [ ] Xử lý error messages từ API
- [ ] Update API_URL trong environment variables

---

## 🔒 Security Notes

### TODO - Recommendations:
1. **Password Hashing:** Implement bcrypt hoặc PBKDF2 để hash passwords
2. **JWT Tokens:** Thay vì trả user object, nên trả JWT token
3. **Email Verification:** Gửi email xác thực khi đăng ký
4. **Rate Limiting:** Giới hạn số lần đăng nhập/đăng ký
5. **HTTPS Only:** Bắt buộc HTTPS trong production
6. **Session Management:** Implement refresh tokens

---

## 🧪 Testing với curl

### Login:
```bash
curl -X POST http://localhost:5000/user.ctr/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

### Signup:
```bash
curl -X POST http://localhost:5000/user.ctr/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "username":"johndoe",
    "password":"password123"
  }'
```

### Forgot Password:
```bash
curl -X POST http://localhost:5000/user.ctr/forgot_password \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com"}'
```

### Reset Password:
```bash
curl -X POST http://localhost:5000/user.ctr/reset_password \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","new_password":"newpass123"}'
```

---

## 📊 Database Schema

### Collection: `users`

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "hashed_password", // TODO: Hash
  "role": "user",
  "createdAt": ISODate("2025-11-01T10:00:00Z"),
  "updatedAt": ISODate("2025-11-01T10:30:00Z"),
  "lastLogin": ISODate("2025-11-01T10:30:00Z")
}
```

### Indexes Recommendation:
```javascript
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
```

