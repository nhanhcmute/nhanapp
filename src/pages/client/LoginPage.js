import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Modal, Fade, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../../firebaseConfig'; 
import { database, ref, get, update } from '../../firebaseConfig'; 

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
  
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu!');
      return;
    }
  
    try {
      // Fetch all user data from Firebase
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError('Dữ liệu không tồn tại!');
        return;
      }

      const users = snapshot.val();
      let userFound = null;

      // Search for user in the database
      Object.values(users).forEach((user) => {
        if (user.username === username && user.password === password) {
          userFound = user;
        }
      });

      if (!userFound) {
        setError('Sai tên đăng nhập hoặc mật khẩu!');
        return;
      }

      // Login success
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(userFound));

      if (username === 'admin' && password === 'Xenlulozo1@') {
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập!');
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
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError('Dữ liệu không tồn tại!');
        return;
      }

      const users = snapshot.val();
      let userFound = null;

      // Search for user
      Object.values(users).forEach((user) => {
        if (user.username === resetUsername && user.email === resetEmail) {
          userFound = user;
        }
      });

      if (!userFound) {
        setError('Thông tin tài khoản hoặc email không đúng!');
        return;
      }

      // Send password reset email
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
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError('Dữ liệu không tồn tại!');
        return;
      }

      const users = snapshot.val();
      let userKey = null;

      // Find user key
      Object.entries(users).forEach(([key, user]) => {
        if (user.username === resetUsername) {
          userKey = key;
        }
      });

      if (!userKey) {
        setError('Người dùng không tồn tại!');
        return;
      }

      // Update password in Firebase
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
        onKeyDown={handleKeyDown} 
        tabIndex={0}
      >
        <Typography variant="h5" mb={2}>
          Đăng nhập
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

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
          onClick={() => setForgotPassword(true)}
        >
          Quên mật khẩu?
        </Button>

        <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/signup')}
        >
          Chưa có tài khoản? Đăng ký
        </Button>
      </Box>

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
