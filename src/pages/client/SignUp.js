import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, set, database, get } from '../../firebaseConfig';

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

    if (!name || !email || !username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const isUsernameTaken = Object.values(users).some((user) => user.username === username);
        const isEmailTaken = Object.values(users).some((user) => user.email === email);

        if (isUsernameTaken) {
          setError('Tên đăng nhập đã tồn tại!');
          return;
        }

        if (isEmailTaken) {
          setError('Email này đã được sử dụng!');
          return;
        }
      }

      const newUserId = Date.now();
      const userRef = ref(database, `signup/${newUserId}`);
      await set(userRef, {
        id: newUserId,
        name,
        email,
        username,
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng ký!');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
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
          Đăng ký tài khoản
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

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
