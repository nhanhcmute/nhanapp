import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Modal, Fade, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../../firebaseConfig'; // Sửa lại import
import { database, ref, get, update } from '../../firebaseConfig'; // Import lại database, ref, get, update

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
  
    try {
      // Đăng nhập với Firebase Authentication
      await signInWithEmailAndPassword(auth, username, password);
  
      // Lấy thông tin người dùng từ Firebase Realtime Database (nếu cần)
      const userRef = ref(database, 'users/' + username);
      const snapshot = await get(userRef);
  
      if (!snapshot.exists()) {
        setError('Tên đăng nhập không tồn tại!');
        return;
      }
  
      const user = snapshot.val();
  
      // Đăng nhập thành công, kiểm tra quyền truy cập
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Kiểm tra quyền admin
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
      setError('Sai tên đăng nhập hoặc mật khẩu!');
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
      // Kiểm tra xem người dùng có tồn tại trong Firebase Authentication
      const userRef = ref(database, 'users/' + resetUsername);
      const snapshot = await get(userRef);
  
      if (!snapshot.exists() || snapshot.val().email !== resetEmail) {
        setError('Thông tin tài khoản hoặc email không đúng!');
        return;
      }
  
      // Gửi yêu cầu đặt lại mật khẩu
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess(true);
      setTimeout(() => {
        alert('Email yêu cầu đặt lại mật khẩu đã được gửi!');
        setStep(2);
      }, 2000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới!');
      return;
    }
  
    try {
      // Kiểm tra thông tin người dùng trong Firebase Authentication
      const userRef = ref(database, 'users/' + resetUsername);
      const snapshot = await get(userRef);
  
      if (!snapshot.exists()) {
        setError('Người dùng không tồn tại!');
        return;
      }
  
      // Cập nhật mật khẩu của người dùng trong Firebase Authentication
      const user = snapshot.val();
      user.password = newPassword;
  
      // Cập nhật mật khẩu trong Firebase Realtime Database
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
