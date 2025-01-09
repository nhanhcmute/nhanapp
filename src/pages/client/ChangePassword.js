import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'; // Import các hàm cần thiết từ Firebase Authentication

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

    const auth = getAuth(); // Lấy instance của Firebase Authentication
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError('Bạn chưa đăng nhập!');
      return;
    }

    if (oldPassword !== user.password) {
      setError('Mật khẩu cũ không đúng!');
      return;
    }

    if (!newPassword || !validatePassword(newPassword)) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      // Đăng nhập lại người dùng để xác thực mật khẩu cũ
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Cập nhật mật khẩu
      await updatePassword(currentUser, newPassword);

      setSuccess(true);
      localStorage.setItem('user', JSON.stringify({ ...user, password: newPassword }));

      setTimeout(() => {
        alert('Mật khẩu đã được thay đổi thành công!');
        navigate('/'); // Điều hướng về trang chính sau khi đổi mật khẩu
      }, 2000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật mật khẩu!');
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor:'#fafafa' }}>
      <Sidebar />
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
          <Typography variant="h5" mb={2}>Thay đổi mật khẩu</Typography>

          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Mật khẩu đã được thay đổi thành công!</Alert>}

          <TextField label="Mật khẩu cũ" variant="outlined" fullWidth margin="normal" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <TextField label="Mật khẩu mới" variant="outlined" fullWidth margin="normal" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <TextField label="Xác nhận mật khẩu" variant="outlined" fullWidth margin="normal" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleChangePassword}>Cập nhật mật khẩu</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
