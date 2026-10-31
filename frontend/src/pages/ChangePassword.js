import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { database, ref, update, get } from '../firebaseConfig';
import { useLanguage } from '../i18n/LanguageContext';

const ChangePassword = () => {
  const { t } = useLanguage();
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
      setError(t('auth.errors.notLoggedIn'));
      return;
    }

    if (!oldPassword || oldPassword !== user.password) {
      setError(t('auth.errors.wrongOldPassword'));
      return;
    }

    if (!newPassword || !validatePassword(newPassword)) {
      setError(t('auth.errors.weakPassword'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.confirmMismatch'));
      return;
    }

    try {
      const signupRef = ref(database, 'signup');
      const snapshot = await get(signupRef);

      if (!snapshot.exists()) {
        setError(t('auth.errors.userDataMissing'));
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
        setError(t('auth.errors.userNotInDb'));
        return;
      }

      // Cập nhật mật khẩu trong Firebase
      const userRef = ref(database, `signup/${userKey}`);
      await update(userRef, { password: newPassword });

      // Cập nhật thông tin trong localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, password: newPassword }));

      setSuccess(true);

      setTimeout(() => {
        alert(t('auth.passwordChanged'));
        navigate('/'); // Điều hướng về trang chính sau khi đổi mật khẩu
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(t('auth.errors.updatePasswordFailed'));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', backgroundColor: '#fafafa' }}>
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
            {t('auth.changeTitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              {t('auth.passwordChanged')}
            </Alert>
          )}

          <TextField
            label={t('auth.oldPassword')}
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label={t('auth.newPassword')}
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label={t('auth.confirmPassword')}
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
            {t('auth.updatePassword')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
