import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { FaPaw } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config/api';

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin từ state (từ forgot password)
  const { email, username, type = 'forgot_password' } = location.state || {};
  
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOTP = async () => {
    setError('');
    setIsVerifying(true);

    if (!otpCode || otpCode.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số!');
      setIsVerifying(false);
      return;
    }

    if (!email) {
      setError('Thông tin không hợp lệ!');
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user.ctr/verify_otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otpCode: otpCode,
          type: type
        })
      });

      const result = await response.json();

      if (result.status === 200) {
        // Chuyển đến màn hình đặt lại mật khẩu
        navigate('/reset-password', {
          state: {
            email: email,
            username: username,
            otpVerified: true
          }
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xác thực OTP!');
      console.error('Verify OTP error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    
    if (!email || !username) {
      setError('Thông tin không hợp lệ!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user.ctr/send_otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          type: 'forgot_password'
        })
      });

      const result = await response.json();

      if (result.status === 200) {
        setError('');
        alert('Mã OTP đã được gửi lại đến email của bạn!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi lại mã OTP!');
      console.error('Resend OTP error:', err);
    }
  };

  // Nếu không có thông tin từ state, redirect về login
  if (!email) {
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
              Thông tin không hợp lệ! Vui lòng thử lại.
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FaPaw size={28} color="#ff6b81" />
            <Typography variant="h5" color='white' sx={{ fontWeight: 600 }}>
              Xác thực OTP
            </Typography>
            <FaPaw size={28} color="#ff6b81" />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" sx={{ mb: 2, color: 'white', textAlign: 'center' }}>
            📧 Chúng tôi đã gửi mã OTP 6 chữ số đến
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#ffd93d', fontWeight: 600, textAlign: 'center' }}>
            {email}
          </Typography>

          <TextField
            label="Mã OTP"
            variant="standard"
            color='white'
            fullWidth
            margin="normal"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' } }}
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
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },
                      "& .MuiInput-underline:after": {
  borderBottomColor: "white !important",
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
            onClick={handleVerifyOTP}
            disabled={otpCode.length !== 6 || isVerifying}
          >
            {isVerifying ? '⏳ Đang xác thực...' : '✅ Xác thực OTP'}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ 
              mt: 2,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={handleResendOTP}
          >
            🔄 Gửi lại mã OTP
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

export default VerifyOTPPage;

