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
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
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

    const userData = { name, email, username, password };

    try {
      // Kiểm tra tên đăng nhập đã tồn tại hay chưa
      const checkUsernameResponse = await fetch('http://localhost:5000/signup');
      const users = await checkUsernameResponse.json();
      const existingUser = users.find((user) => user.username === username);

      if (existingUser) {
        setError('Tên đăng nhập đã tồn tại!');
        return;
      }

      // Nếu tên đăng nhập chưa tồn tại, gửi yêu cầu POST để đăng ký người dùng mới
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true); // Đăng ký thành công
        setTimeout(() => {
          navigate('/login'); // Chuyển hướng về trang đăng nhập
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối đến máy chủ!');
    }
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
