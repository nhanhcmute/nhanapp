# 🔄 Frontend Integration Example

## Cách thay thế Firebase bằng Backend API

---

## 1. Login Page

### ❌ BEFORE (Firebase):

```javascript
// LoginPage.js - OLD
const handleLogin = async () => {
  try {
    const signupRef = ref(database, 'signup');
    const snapshot = await get(signupRef);

    if (!snapshot.exists()) {
      setError('Dữ liệu không tồn tại!');
      return;
    }

    const users = snapshot.val();
    let userFound = null;

    Object.values(users).forEach((user) => {
      if (user.username === username && user.password === password) {
        userFound = user;
      }
    });

    if (!userFound) {
      setError('Sai tên đăng nhập hoặc mật khẩu!');
      return;
    }

    setSuccess(true);
    localStorage.setItem('user', JSON.stringify(userFound));

    if (username === 'admin' && password === 'Xenlulozo1@') {
      setTimeout(() => navigate('/admin'), 2000);
    } else {
      setTimeout(() => navigate('/'), 2000);
    }
  } catch (err) {
    setError('Đã xảy ra lỗi khi đăng nhập!');
  }
};
```

### ✅ AFTER (Backend API):

```javascript
// LoginPage.js - NEW
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const handleLogin = async () => {
  setError('');
  setSuccess(false);

  if (!username || !password) {
    setError('Vui lòng nhập tên đăng nhập và mật khẩu!');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user.ctr/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const result = await response.json();

    if (result.status === 200) {
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(result.data));

      // Navigate dựa trên role từ backend
      if (result.data.role === 'admin') {
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setTimeout(() => navigate('/'), 2000);
      }
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Đã xảy ra lỗi khi đăng nhập!');
    console.error('Login error:', err);
  }
};
```

---

## 2. Signup Page

### ❌ BEFORE (Firebase):

```javascript
// SignUp.js - OLD
const handleSignup = async () => {
  try {
    const signupRef = ref(database, 'signup');
    const snapshot = await get(signupRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const isUsernameTaken = Object.values(users).some(
        (user) => user.username === username
      );
      const isEmailTaken = Object.values(users).some(
        (user) => user.email === email
      );

      if (isUsernameTaken) {
        setError('Tên đăng nhập đã tồn tại!');
        return;
      }

      if (isEmailTaken) {
        setError('Email này đã được sử dụng!');
        return;
      }
    }

    const newUserId = Date.now();
    const userRef = ref(database, `signup/${newUserId}`);
    await set(userRef, {
      id: newUserId,
      name,
      email,
      username,
      password,
    });

    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    setError('Đã xảy ra lỗi khi đăng ký!');
  }
};
```

### ✅ AFTER (Backend API):

```javascript
// SignUp.js - NEW
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const handleSignup = async () => {
  setError('');
  setSuccess(false);

  if (!name || !email || !username || !password || !confirmPassword) {
    setError('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  if (password !== confirmPassword) {
    setError('Mật khẩu và xác nhận mật khẩu không khớp!');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user.ctr/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        username: username,
        password: password
      })
    });

    const result = await response.json();

    if (result.status === 200) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Đã xảy ra lỗi khi đăng ký!');
    console.error('Signup error:', err);
  }
};
```

---

## 3. Forgot Password - Step 1

### ❌ BEFORE (Firebase):

```javascript
// LoginPage.js - OLD
const handleForgotPassword = async () => {
  try {
    const signupRef = ref(database, 'signup');
    const snapshot = await get(signupRef);

    if (!snapshot.exists()) {
      setError('Dữ liệu không tồn tại!');
      return;
    }

    const users = snapshot.val();
    const userFound = Object.values(users).find(
      (user) => user.username === resetUsername && user.email === resetEmail
    );

    if (!userFound) {
      setError('Thông tin tài khoản hoặc email không đúng!');
      return;
    }

    await sendPasswordResetEmail(auth, resetEmail);
    setSuccess(true);
    setStep(2);
    alert('Email yêu cầu đặt lại mật khẩu đã được gửi!');
  } catch (err) {
    setError('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!');
  }
};
```

### ✅ AFTER (Backend API):

```javascript
// LoginPage.js - NEW
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const handleForgotPassword = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  setError('');
  setSuccess(false);

  if (!resetUsername || !resetEmail) {
    setError('Vui lòng nhập tên đăng nhập và email!');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user.ctr/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: resetUsername,
        email: resetEmail
      })
    });

    const result = await response.json();

    if (result.status === 200) {
      setSuccess(true);
      setStep(2);
      alert('Thông tin xác thực thành công! Vui lòng đặt mật khẩu mới.');
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!');
    console.error('Forgot password error:', err);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 4. Reset Password - Step 2

### ❌ BEFORE (Firebase):

```javascript
// LoginPage.js - OLD
const handleResetPassword = async () => {
  try {
    const signupRef = ref(database, 'signup');
    const snapshot = await get(signupRef);

    if (!snapshot.exists()) {
      setError('Dữ liệu không tồn tại!');
      return;
    }

    const users = snapshot.val();
    let userKey = null;

    Object.entries(users).forEach(([key, user]) => {
      if (user.username === resetUsername) {
        userKey = key;
      }
    });

    if (!userKey) {
      setError('Người dùng không tồn tại!');
      return;
    }

    const userRef = ref(database, `signup/${userKey}`);
    await update(userRef, { password: newPassword });

    setSuccess(true);
    setTimeout(() => {
      alert('Mật khẩu của bạn đã được thay đổi thành công!');
      setForgotPassword(false);
    }, 2000);
  } catch (err) {
    setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
  }
};
```

### ✅ AFTER (Backend API):

```javascript
// LoginPage.js - NEW
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const handleResetPassword = async () => {
  setError('');

  if (!newPassword) {
    setError('Vui lòng nhập mật khẩu mới!');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user.ctr/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: resetUsername,
        new_password: newPassword
      })
    });

    const result = await response.json();

    if (result.status === 200) {
      setSuccess(true);
      setTimeout(() => {
        alert('Mật khẩu của bạn đã được thay đổi thành công!');
        setForgotPassword(false);
        setStep(1); // Reset về step 1
        setResetUsername('');
        setResetEmail('');
        setNewPassword('');
      }, 2000);
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
    console.error('Reset password error:', err);
  }
};
```

---

## 5. Environment Variables

### Tạo file `.env` trong frontend:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Production (Netlify/Vercel):
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 6. Remove Firebase Dependencies

### Xóa hoặc comment các import Firebase:

```javascript
// ❌ Remove these:
// import { auth, sendPasswordResetEmail } from '../firebaseConfig';
// import { database, ref, get, update } from '../firebaseConfig';
```

---

## ✅ Checklist Migration

### LoginPage.js:
- [ ] Thay thế `handleLogin` bằng API call
- [ ] Thay thế `handleForgotPassword` bằng API call  
- [ ] Thay thế `handleResetPassword` bằng API call
- [ ] Remove Firebase imports
- [ ] Add API_URL constant
- [ ] Test login flow với admin và user thường
- [ ] Test forgot password flow

### SignUp.js:
- [ ] Thay thế `handleSignup` bằng API call
- [ ] Remove Firebase imports
- [ ] Add API_URL constant
- [ ] Test signup flow
- [ ] Test validation messages

### General:
- [ ] Add `.env` với `REACT_APP_API_URL`
- [ ] Update error handling
- [ ] Test với backend running locally
- [ ] Deploy và test với production URL

---

## 🧪 Testing Flow

### 1. Start Backend:
```bash
cd backend
dotnet run
# Backend chạy trên http://localhost:5000
```

### 2. Start Frontend:
```bash
cd frontend
npm start
# Frontend chạy trên http://localhost:3000
```

### 3. Test Các Flow:
1. ✅ Đăng ký tài khoản mới
2. ✅ Đăng nhập với tài khoản vừa tạo
3. ✅ Đăng nhập với admin (cần tạo trong database trước)
4. ✅ Quên mật khẩu → Đặt lại mật khẩu
5. ✅ Đăng nhập với mật khẩu mới

---

## 🔒 Security Improvements (TODO)

### Backend cần thêm:
1. Password hashing (bcrypt)
2. JWT tokens thay vì trả user object
3. Rate limiting cho login/signup
4. Email verification
5. HTTPS only in production

### Frontend cần thêm:
1. JWT token storage và refresh
2. Auto-logout khi token expired
3. HTTPS API calls in production
4. Input sanitization
5. CSRF protection

---

## 📚 Related Files

- [USER_API_DOCUMENTATION.md](./USER_API_DOCUMENTATION.md) - API specs chi tiết
- [API_NAMING_CONVENTION.md](./API_NAMING_CONVENTION.md) - Quy tắc đặt tên
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Tổng kết thay đổi

