import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Modal, Fade, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); 
  const [resetUsername, setResetUsername] = useState(''); 
  const [resetEmail, setResetEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setSuccess(false);

    // Kiểm tra trường dữ liệu
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu!');
      return;
    }

    const loginData = { username, password };

    try {
      // Gửi yêu cầu GET đến API /signup để lấy dữ liệu người dùng
      const response = await fetch('http://localhost:5000/signup');
      const users = await response.json();

      // Tìm người dùng trong dữ liệu
      const user = users.find((user) => user.username === username);

      if (!user) {
        setError('Tên đăng nhập không tồn tại!');
        return;
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = user.password === password;
      if (!isPasswordValid) {
        setError('Sai mật khẩu!');
        return;
      }

      // Đăng nhập thành công, kiểm tra quyền truy cập
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(user));

      // Kiểm tra quyền admin (username = 'admin' và mật khẩu tương ứng)
      if (username === 'admin' && password === 'Xenlulozo1@') {
        console.log('Admin credentials are correct, navigating to admin...');
        setTimeout(() => {
          navigate('/admin'); 
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/'); // Điều hướng về trang chính sau 2 giây
        }, 2000);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối đến máy chủ!');
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess(false);

    if (!resetUsername || !resetEmail) {
      setError('Vui lòng nhập tên đăng nhập và email!');
      return;
    }

    try {
      // Gửi yêu cầu đến API để kiểm tra người dùng có tồn tại
      const response = await fetch('http://localhost:5000/signup');
      const users = await response.json();
      const user = users.find((user) => user.username === resetUsername && user.email === resetEmail);

      if (!user) {
        setError('Thông tin tài khoản hoặc email không đúng!');
        return;
      }

      // Nếu thông tin đúng, chuyển sang bước thay đổi mật khẩu
      setStep(2);
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối đến máy chủ!');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới!');
      return;
    }

    try {
      // Cập nhật mật khẩu người dùng trong cơ sở dữ liệu
      const response = await fetch('http://localhost:5000/signup');
      const users = await response.json();
      const userIndex = users.findIndex((user) => user.username === resetUsername);

      if (userIndex === -1) {
        setError('Người dùng không tồn tại!');
        return;
      }

      // Cập nhật mật khẩu của người dùng
      users[userIndex].password = newPassword;

      // Gửi yêu cầu PUT để cập nhật mật khẩu
      await fetch('http://localhost:5000/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
      });

      setSuccess(true);
      setTimeout(() => {
        alert('Mật khẩu của bạn đã được thay đổi thành công!');
        setForgotPassword(false);
      }, 2000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
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
          Đăng nhập
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
            Đăng nhập thành công! Bạn sẽ được chuyển hướng.
          </Alert>
        )}

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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setForgotPassword(true)} // Mở modal quên mật khẩu
        >
          Quên mật khẩu?
        </Button>

        {/* Nút Đăng Ký */}
        <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/signup')} // Điều hướng đến trang đăng ký
        >
          Chưa có tài khoản? Đăng ký
        </Button>
      </Box>

      {/* Modal Quên mật khẩu */}
      <Modal
        open={forgotPassword}
        onClose={() => setForgotPassword(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={forgotPassword}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              boxShadow: 24,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {step === 1 ? (
              <>
                <Typography variant="h6" mb={2}>
                  Quên mật khẩu
                </Typography>

                <TextField
                  label="Tên đăng nhập"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleForgotPassword}
                >
                  Kiểm tra thông tin
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" mb={2}>
                  Đặt lại mật khẩu
                </Typography>

                <TextField
                  label="Mật khẩu mới"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleResetPassword}
                >
                  Đặt lại mật khẩu
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default LoginPage;
