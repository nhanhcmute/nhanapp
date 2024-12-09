import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import GitHubLogin from 'react-github-login';
import { Button, TextField, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const SocialLoginPage = ({ setUser }) => {
  const handleLoginSuccessGoogle = (response) => {
    const token = response.credential;
    fetch('/api/login/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch((error) => console.log(error));
  };


  const handleLoginSuccessGitHub = (response) => {
    const token = response.code;
    fetch('/api/login/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <GoogleLogin
        onSuccess={handleLoginSuccessGoogle}
        onError={() => console.log('Đăng nhập thất bại')}
        useOneTap
        sx={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4285F4',
          color: 'white',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#357ae8',
          },
        }}
        text="signin_with"
      />

      <GitHubLogin
        clientId="YOUR_GITHUB_CLIENT_ID"
        onSuccess={handleLoginSuccessGitHub}
        onFailure={(error) => console.log('Đăng nhập GitHub thất bại:', error)}
        buttonText="Đăng nhập với GitHub"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#333',
          color: 'white',
          borderRadius: 2,
          fontSize: '16px',
          textAlign: 'center',
          margin: '10px 0',
          border: 'none',
          cursor: 'pointer',
        }}
      />
    </Box>
  );
};

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Tên đăng nhập và mật khẩu không được để trống!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/homepage');
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" align="center">Đăng nhập</Typography>

        {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}

        <form onSubmit={handleLogin}>
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ marginBottom: 2 }}
          >
            Đăng nhập
          </Button>
        </form>

        <Button
          variant="text"
          color="primary"
          fullWidth
          component={Link}
          to="/signup"
        >
          Đăng ký tài khoản mới
        </Button>

        <Typography sx={{ mt: 2 }} align="center">Hoặc đăng nhập qua:</Typography>

        <SocialLoginPage setUser={setUser} />
      </Paper>
    </Container>
  );
};

export default LoginPage;
