import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', dob: '', address: '' });
  const navigate = useNavigate();
  const availableAddresses = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
  ];

  useEffect(() => {
    const savedInfo = JSON.parse(localStorage.getItem('personalInfo'));
    if (savedInfo) {
      setUserInfo(savedInfo);  // Lấy thông tin từ localStorage khi trang được load
    }
  }, []);

  const handleSave = () => {
    // Lưu thông tin vào localStorage
    localStorage.setItem('personalInfo', JSON.stringify(userInfo));
    navigate('/profile'); // Quay lại trang thông tin cá nhân sau khi lưu
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });  // Cập nhật thông tin khi thay đổi trường nhập liệu
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Chỉnh sửa thông tin cá nhân
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: '8px', padding: 2 }}>
        <CardContent>
          <TextField
            label="Họ và Tên"
            fullWidth
            margin="normal"
            value={userInfo.name}
            onChange={handleChange}
            name="name"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            value={userInfo.phone}
            onChange={handleChange}
            name="phone"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Ngày sinh"
            fullWidth
            margin="normal"
            type="date"
            value={userInfo.dob}
            onChange={handleChange}
            name="dob"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="address-label">Địa chỉ</InputLabel>
            <Select
              labelId="address-label"
              value={userInfo.address}
              onChange={handleChange}
              name="address"
              label="Địa chỉ"
            >
              {availableAddresses.map((addressOption, index) => (
                <MenuItem key={index} value={addressOption}>
                  {addressOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: '100%' }}
            >
              Lưu thay đổi
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditProfilePage;
