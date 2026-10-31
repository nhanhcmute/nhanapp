import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

// Chrome tự tô nền vàng/trắng cho input khi autofill hoặc khi chọn gợi ý đã lưu,
// đè lên theme nền tối trong suốt của form. Dùng "mẹo" box-shadow inset để che nền
// đó bằng màu trong suốt, và transition dài để Chrome không kịp chuyển màu nền gốc.
const autofillFixSx = {
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
    WebkitTextFillColor: "white",
    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
    boxShadow: "0 0 0px 1000px transparent inset",
    caretColor: "white",
    transition: "background-color 5000s ease-in-out 0s",
  },
};

const SignupPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Form đăng ký, 2: Nhập OTP, 3: Đang xử lý
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setError('');
    setIsSendingOTP(true);

    if (!name || !email || !username || !password || !confirmPassword) {
      setError(t('auth.errors.fillAll'));
      setIsSendingOTP(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      setIsSendingOTP(false);
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
          type: 'signup'
        })
      });

      const result = await response.json();

      if (result.status === 200) {
        setStep(2); // Chuyển sang bước nhập OTP
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('auth.errors.sendOtpFailed'));
      console.error('Send OTP error:', err);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError(t('auth.errors.otp6'));
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
          type: 'signup'
        })
      });

      const result = await response.json();

      if (result.status === 200) {
        // Xác thực OTP thành công - tiến hành đăng ký
        await performSignup();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('auth.errors.verifyOtpFailed'));
      console.error('Verify OTP error:', err);
    }
  };

  const performSignup = async () => {
    setError('');
    setSuccess(false);

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
        setStep(3); // Chuyển sang màn hình thành công
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('auth.errors.signupFailed'));
      console.error('Signup error:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) {
        handleSendOTP();
      } else if (step === 2) {
        handleVerifyOTP();
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url(/blackcathalloween.jpg) no-repeat center center',
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(255, 107, 129, 0.3)',
            backgroundColor: 'rgba(20, 15, 20, 0.55)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FaPaw size={28} color="#ff6b81" />
            <Typography variant="h5" color='white' sx={{ fontWeight: 600 }}>
              {step === 1 ? t('auth.signupTitle') : step === 2 ? t('auth.otpTitle') : t('auth.done')}
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
              {t('auth.signupSuccess')}
            </Alert>
          )}

          {step === 1 ? (
            <>
              <TextField
            label={t('auth.fullName')}
            variant="standard"
            color="white"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

              ...autofillFixSx,
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },
            }}
          />

          <TextField
            label={t('auth.email')}
            variant="standard"
            color='white'
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

              ...autofillFixSx,
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },
            }}
          />

          <TextField
            label={t('auth.username')}
            variant="standard"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

              ...autofillFixSx,
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },
                      "& .MuiInput-underline:after": {
  borderBottomColor: "white !important",
},
            }}
          />

          <TextField
            label={t('auth.password')}
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

              ...autofillFixSx,
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },
                      "& .MuiInput-underline:after": {
  borderBottomColor: "white !important",
},
            }}
          />

          <TextField
            label={t('auth.confirmPassword')}
            variant="standard"
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

              ...autofillFixSx,
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
                  fontSize: '16px',
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
                onClick={handleSendOTP}
                disabled={isSendingOTP}
              >
                {isSendingOTP ? `📧 ${t('auth.sending')}` : `🚀 ${t('auth.continueSendOtp')}`}
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Typography variant="body1" sx={{ mb: 2, color: 'white', textAlign: 'center' }}>
                {`📧 ${t('auth.otpSentTo')}`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#ffd93d', fontWeight: 600, textAlign: 'center' }}>
                {email}
              </Typography>

              <TextField
                label={t('auth.otpCode')}
                variant="standard"
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
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
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
                disabled={otpCode.length !== 6}
              >
                {`✅ ${t('auth.verifyAndSignup')}`}
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
                onClick={() => {
                  setStep(1);
                  setOtpCode('');
                }}
              >
                {`← ${t('auth.back')}`}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaPaw size={24} color="#ffd93d" />
                {t('auth.processingSignup')}
                <FaPaw size={24} color="#ffd93d" />
              </Typography>
              {success && (
                <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                  {t('auth.signupSuccess')}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {error}
                </Alert>
              )}
            </>
          )}

          <Typography variant="body2" sx={{ mt: 3, color: 'white', textAlign: 'center' }}>
            {t('auth.haveAccount')}{' '}
            <Button 
              sx={{ 
                color: '#ffd93d',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 217, 61, 0.1)',
                },
              }} 
              onClick={() => navigate('/login')}
            >
              {t('auth.loginNow')}
            </Button>
          </Typography>
        </Box>
      </Container >
    </Box >
  );
};

export default SignupPage;
