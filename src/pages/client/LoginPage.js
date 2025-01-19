import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Modal, Fade, Backdrop } from '@mui/material';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../../firebaseConfig';
import { database, ref, get, update } from '../../firebaseConfig';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [greeting, setGreeting] = useState('');
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

      // Save user data to localStorage to keep personal information
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(userFound));

      // Navigate based on the username or role (e.g., admin)
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
    if (isSubmitting) return; // Ngăn người dùng click nhiều lần
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    if (!resetUsername || !resetEmail) {
      setError('Vui lòng nhập tên đăng nhập và email!');
      setIsSubmitting(false);
      return;
    }

    try {
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError('Dữ liệu không tồn tại!');
        setIsSubmitting(false);
        return;
      }

      const users = snapshot.val();
      const userFound = Object.values(users).find(
        (user) => user.username === resetUsername && user.email === resetEmail
      );

      if (!userFound) {
        setError('Thông tin tài khoản hoặc email không đúng!');
        setIsSubmitting(false);
        return;
      }

      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess(true);
      setStep(2);
      alert('Email yêu cầu đặt lại mật khẩu đã được gửi!');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Email không tồn tại trong hệ thống!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email không hợp lệ!');
      } else {
        setError('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!');
      }
    } finally {
      setIsSubmitting(false);
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
            boxShadow: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
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

                  // Autofill fix
                  "& input:-webkit-autofill": {
                    backgroundColor: "transparent !important", // Đặt nền trong suốt cho autofill
                    color: "white !important", // Đảm bảo chữ trắng
                    boxShadow: "0 0 0px 1000px transparent inset !important", // Xóa bóng của autofill
                  },
                  "& input:-webkit-autofill:focus": {
                    backgroundColor: "transparent !important", // Đảm bảo nền trong suốt khi autofill đang được focus
                  },
                  "& input:-webkit-autofill::first-line": {
                    backgroundColor: "transparent !important", // Nền trong suốt cho autofill
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
            }}
          />

          <Button
            variant="outlined"
            color="white"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Đăng nhập
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
            color="white"
            sx={{ mt: 2 }}
            onClick={() => setForgotPassword(true)}
          >
            Quên mật khẩu?
          </Button>

          <Button
            variant="text"
            color="white"
            sx={{ mt: 2 }}
            onClick={() => navigate('/signup')}
          >
            Chưa có tài khoản? Đăng ký
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
                width: 300,
                height: 300,
                bgcolor: 'background.paper',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 24,
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {step === 1 ? (
                <>
                  <Typography variant="h6" mb={2} color='white'>
                    Quên mật khẩu
                  </Typography>
                  <Box sx={{ backgroundColor: "transparent", width: "100%" }}>
                    <form autoComplete="off">
                      <TextField
                        label="Tên đăng nhập"
                        variant="standard"
                        color="white"
                        fullWidth
                        margin="normal"
                        value={resetUsername}
                        onChange={(e) => setResetUsername(e.target.value)}
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
                        label="Email"
                        variant="standard"
                        color='white'
                        fullWidth
                        margin="normal"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
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
                    </form>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 2,
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)", // Nền khi hover
                        borderColor: "white",
                      },
                    }}
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
                  <Button
                     variant="outlined"
                     fullWidth
                     sx={{
                       mt: 2,
                       color: "white",
                       borderColor: "white",
                       "&:hover": {
                         backgroundColor: "rgba(255, 255, 255, 0.1)", // Nền khi hover
                         borderColor: "white",
                       },
                     }}
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
    </Box >
  );
};

export default LoginPage;
