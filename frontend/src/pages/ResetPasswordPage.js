import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { FaPaw } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

// API URL - Change this for production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin từ state (từ verify OTP)
  const { email, username, otpVerified } = location.state || {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    setIsResetting(true);

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin!');
      setIsResetting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp!');
      setIsResetting(false);
      return;
    }

    if (!otpVerified) {
      setError('Vui lòng xác thực OTP trước!');
      setIsResetting(false);
      return;
    }

    if (!username) {
      setError('Thông tin không hợp lệ!');
      setIsResetting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user.ctr/reset_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          new_password: newPassword
        })
      });

      const result = await response.json();

      if (result.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          alert('Mật khẩu của bạn đã được thay đổi thành công!');
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
      console.error('Reset password error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Nếu không có thông tin từ state, redirect về login
  if (!email || !otpVerified) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'url(/bao.jpg) no-repeat center center',
          backgroundSize: 'cover',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 4,
              boxShadow: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
          >
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              Vui lòng xác thực OTP trước!
            </Alert>
            <Button
              variant="outlined"
              color="white"
              fullWidth
              onClick={() => navigate('/login')}
            >
              Quay lại đăng nhập
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url(/bao.jpg) no-repeat center center',
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(255, 107, 129, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FaPaw size={28} color="#ff6b81" />
            <Typography variant="h5" color='white' sx={{ fontWeight: 600 }}>
              Đặt lại mật khẩu
            </Typography>
            <FaPaw size={28} color="#ff6b81" />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              Mật khẩu của bạn đã được thay đổi thành công!
            </Alert>
          )}

          <TextField
            label="Mật khẩu mới"
            variant="standard"
            color='white'
            fullWidth
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
                backgroundColor: "transparent !important",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "1px solid white",
              },
              "& .MuiInput-underline.Mui-focused:before": {
                borderBottom: "1px solid #ffffff",
              },
              "& .MuiInput-underline.Mui-focused": {
                borderBottom: "1px solid #ffffff",
              },
              "& input:-webkit-autofill": {
                backgroundColor: "transparent !important",
                color: "white !important",
                boxShadow: "0 0 0px 1000px transparent inset !important",
              },
              "& input:-webkit-autofill:focus": {
                backgroundColor: "transparent !important",
              },
            }}
          />

          <TextField
            label="Xác nhận mật khẩu"
            variant="standard"
            color='white'
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
                backgroundColor: "transparent !important",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "1px solid white",
              },
              "& .MuiInput-underline.Mui-focused:before": {
                borderBottom: "1px solid #ffffff",
              },
              "& .MuiInput-underline.Mui-focused": {
                borderBottom: "1px solid #ffffff",
              },
              "& input:-webkit-autofill": {
                backgroundColor: "transparent !important",
                color: "white !important",
                boxShadow: "0 0 0px 1000px transparent inset !important",
              },
              "& input:-webkit-autofill:focus": {
                backgroundColor: "transparent !important",
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ 
              mt: 3,
              backgroundColor: '#ff6b81',
              color: 'white',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(255, 107, 129, 0.4)',
              '&:hover': {
                backgroundColor: '#ff4757',
                boxShadow: '0 6px 16px rgba(255, 107, 129, 0.6)',
              },
              '&:disabled': {
                backgroundColor: '#ffb3c1',
                color: 'white',
              },
            }}
            onClick={handleResetPassword}
            disabled={isResetting}
          >
            {isResetting ? '⏳ Đang cập nhật...' : '🔒 Đặt lại mật khẩu'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ 
              mt: 2,
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => navigate('/login')}
          >
            ← Quay lại đăng nhập
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;

