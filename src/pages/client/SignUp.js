import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Thêm trạng thái để hiển thị thông báo thành công
  const navigate = useNavigate();

  const handleSignup = () => {
    setError('');
    setSuccess(false);

    // Kiểm tra trường dữ liệu
    if (!name || !email || !username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError('Định dạng email không hợp lệ!');
      return;
    }

    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt.');
      return;
    }

    // Lưu thông tin người dùng (có thể thay bằng API)
    const userData = { name, email, username, password };
    localStorage.setItem('user', JSON.stringify(userData));

    // Hiển thị thông báo đăng ký thành công
    setSuccess(true);

    // Tự động chuyển hướng sau 2 giây
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" mb={2}>
          Đăng ký tài khoản
        </Typography>

        {/* Thông báo lỗi */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {/* Thông báo thành công */}
        {success && (
          <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
            Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.
          </Alert>
        )}

        <TextField
          label="Họ và tên"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Xác nhận mật khẩu"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
        >
          Đăng ký
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Bạn đã có tài khoản?{' '}
          <Button color="primary" onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignupPage;
