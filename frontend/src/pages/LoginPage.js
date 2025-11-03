import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Modal, Fade, Backdrop } from '@mui/material';
import { FaGoogle, FaFacebook, FaGithub, FaPaw } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

// API URL - Change this for production
const API_URL = process.env.REACT_APP_API_URL || 'https://petshop-a2ry.onrender.com';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin từ location.state (khi bị redirect từ ProtectedRoute)
  const from = location.state?.from || '/';
  const redirectMessage = location.state?.message;

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

        // Navigate dựa trên role từ backend (1 = Admin, 2 = User)
        if (result.data.role === 1) {
          setTimeout(() => {
            navigate('/admin');
          }, 2000);
        } else {
          // Nếu có trang gốc muốn truy cập, redirect về đó, nếu không thì về trang chủ
          const redirectTo = from && from !== '/login' ? from : '/';
          setTimeout(() => {
            navigate(redirectTo);
          }, 2000);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập!');
      console.error('Login error:', err);
    }
  };

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleForgotPassword = async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    setIsSendingOTP(true);
    setError('');
    setSuccess(false);

    if (!resetUsername || !resetEmail) {
      setError('Vui lòng nhập tên đăng nhập và email!');
      setIsSubmitting(false);
      setIsSendingOTP(false);
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
        // Chuyển đến màn hình verify OTP riêng
        navigate('/verify-otp', {
          state: {
            email: resetEmail,
            username: resetUsername,
            type: 'forgot_password'
          }
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!');
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSendingOTP(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Get user information from localStorage (if logged in)
  const user = JSON.parse(localStorage.getItem('user'));

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
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: '0',
          height: '80vh',
          paddingLeft: '10%',
          zIndex: 1,
        }}
      >
        <div>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '40px',
              fontWeight: 'bold',
              textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',
              background: 'linear-gradient(45deg, #ff5f6d, #ffc3a0)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              animation: 'fadeIn 2s ease-in-out',
              lineHeight: 1.2,
            }}
          >
            {greeting},
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '40px',
              fontWeight: 'bold',
              textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',
              background: 'linear-gradient(45deg, #ff5f6d, #ffc3a0)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              animation: 'fadeIn 2s ease-in-out',
              lineHeight: 1.2,
            }}
          >
            Welcome to Nhân's Pet Haven
          </Typography>
        </div>
      </Container>
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: '0',
          width: '50%',
          height: '100vh',
          paddingLeft: '10%',
          zIndex: 0,
        }}
      >
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
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FaPaw size={28} color="#ff6b81" />
            <Typography variant="h5" color='white' sx={{ fontWeight: 600 }}>
              Đăng nhập
            </Typography>
            <FaPaw size={28} color="#ff6b81" />
          </Box>

          {/* Hiển thị thông báo khi bị redirect từ protected route */}
          {redirectMessage && (
            <Alert severity="warning" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
              {redirectMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
              Đăng nhập thành công!
            </Alert>
          )}

          {/* Display user info if logged in */}
          {user && (
            <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
              Chào {user.name || user.username}, Bạn đã đăng nhập thành công!
            </Alert>
          )}
          <Box sx={{ backgroundColor: "transparent", width: "100%" }}>
            <form autoComplete="off">
              <TextField
                label="Tên đăng nhập"
                variant="standard"
                color="white"
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
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ffffff",
                      },

                  // Autofill fix
                  "& input:-webkit-autofill": {
                    backgroundColor: "transparent !important", 
                    color: "white !important", 
                    boxShadow: "0 0 0px 1000px transparent inset !important", 
                  },
                  "& input:-webkit-autofill:focus": {
                    backgroundColor: "transparent !important", 
                  },
                  "& input:-webkit-autofill::first-line": {
                    backgroundColor: "transparent !important", 
                  },
                }}
              />
            </form>
          </Box>

          <TextField
            label="Mật khẩu"
            variant="standard"
            color="white"
            fullWidth
            margin="normal"
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
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
              mt: 2,
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
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={handleLogin}
          >
            🐾 Đăng nhập
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button
              variant="text"
              color="white"
              sx={{ mx: 1 }}
            >
              <FaGoogle size={20} style={{ marginRight: '8px' }} />
            </Button>

            <Button
              variant="text"
              color="white"
              sx={{ mx: 1 }}
            >
              <FaFacebook size={20} style={{ marginRight: '8px' }} />
            </Button>

            <Button
              variant="text"
              color="white"
              sx={{ mx: 1 }}
            >
              <FaGithub size={20} style={{ marginRight: '8px' }} />
            </Button>
          </div>
          <Button
            variant="text"
            sx={{ 
              mt: 2,
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => {
              setForgotPassword(true);
              setResetUsername('');
              setResetEmail('');
              setError('');
              setSuccess(false);
            }}
          >
            🔑 Quên mật khẩu?
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ 
              mt: 2,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              padding: '10px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => navigate('/signup')}
          >
            🐶 Chưa có tài khoản? Đăng ký ngay
          </Button>
        </Box>

        {/* Forgot password modal */}
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
                width: 350,
                bgcolor: 'background.paper',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(255, 107, 129, 0.3)',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid rgba(255, 107, 129, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <FaPaw size={24} color="#ff6b81" />
                <Typography variant="h6" color='#ff6b81' sx={{ fontWeight: 600 }}>
                  Quên mật khẩu
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: "transparent", width: "100%" }}>
  <form autoComplete="off">
    {/* Ô nhập Tên đăng nhập */}
    <TextField
      label="Tên đăng nhập"
      variant="standard"
      fullWidth
      margin="normal"
      value={resetUsername}
      onChange={(e) => setResetUsername(e.target.value)}
      sx={{
        "& .MuiInputBase-root": {
          color: "#ff6b81", 
        },
        "& .MuiInputLabel-root": {
          color: "#ff6b81",
        },
        "& .MuiInput-underline:before": {
          borderBottom: "2px solid #ff6b81",
        },
        "& .MuiInput-underline:after": {
          borderBottom: "2px solid #ff4757",
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottom: "2px solid #ff6b81",
        },
      }}
    />
                  <TextField
                    label="Email"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "#ff6b81",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#ff6b81",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "2px solid #ff6b81",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "2px solid #ff4757",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid #ff6b81",
                      },
                    }}
                  />
                </form>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  backgroundColor: "#ff6b81",
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(255, 107, 129, 0.4)",
                  "&:hover": {
                    backgroundColor: "#ff4757",
                    boxShadow: "0 6px 16px rgba(255, 107, 129, 0.6)",
                  },
                  "&:disabled": {
                    backgroundColor: "#ffb3c1",
                    color: "white",
                  },
                }}
                onClick={handleForgotPassword}
                disabled={isSendingOTP}
              >
                {isSendingOTP ? '📧 Đang gửi...' : '🚀 Gửi mã OTP'}
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box >
  );
};

export default LoginPage;
