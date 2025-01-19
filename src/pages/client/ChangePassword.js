import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';
import { database, ref, update, get } from '../../firebaseConfig';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess(false);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('Bạn chưa đăng nhập!');
      return;
    }

    if (!oldPassword || oldPassword !== user.password) {
      setError('Mật khẩu cũ không đúng!');
      return;
    }

    if (!newPassword || !validatePassword(newPassword)) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError('Dữ liệu người dùng không tồn tại!');
        return;
      }

      const users = snapshot.val();
      let userKey = null;

      // Tìm user trong cơ sở dữ liệu
      Object.entries(users).forEach(([key, dbUser]) => {
        if (dbUser.username === user.username) {
          userKey = key;
        }
      });

      if (!userKey) {
        setError('Người dùng không tồn tại trong cơ sở dữ liệu!');
        return;
      }

      // Cập nhật mật khẩu trong Firebase
      const userRef = ref(database, `signup/${userKey}`);
      await update(userRef, { password: newPassword });

      // Cập nhật thông tin trong localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, password: newPassword }));

      setSuccess(true);

      setTimeout(() => {
        alert('Mật khẩu đã được thay đổi thành công!');
        navigate('/'); // Điều hướng về trang chính sau khi đổi mật khẩu
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa' }}>
      <Sidebar />
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            boxShadow: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" mb={2}>
            Thay đổi mật khẩu
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              Mật khẩu đã được thay đổi thành công!
            </Alert>
          )}

          <TextField
            label="Mật khẩu cũ"
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu"
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 3 , color: 'black' , borderColor: 'black' }}
            onClick={handleChangePassword}
          >
            Cập nhật mật khẩu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
