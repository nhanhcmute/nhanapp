import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalInfoPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const availableAddresses = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Kiểm tra nếu tất cả các trường không trống
    if (!name || !phone || !dob || !address) {
      setError('Tất cả các trường đều phải điền!');
      return;
    }

    // Kiểm tra định dạng số điện thoại (sử dụng regex)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ!');
      return;
    }

    // Lưu thông tin vào API
    const personalInfo = { name, phone, dob, address };

    axios.post('http://localhost:5000/personalInfo', personalInfo)  // Gửi dữ liệu đến API
      .then(response => {
        alert('Thông tin đã được lưu thành công!');
        navigate('/profile');
      })
      .catch(error => {
        console.error('Có lỗi khi lưu thông tin:', error);
        setError('Lỗi khi lưu thông tin. Vui lòng thử lại!');
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Thông Tin Cá Nhân
      </Typography>
      
      {error && <Typography color="error" align="center">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Họ tên"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Số điện thoại"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Ngày sinh"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="address-label">Địa chỉ</InputLabel>
          <Select
            labelId="address-label"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Địa chỉ"
          >
            {availableAddresses.map((addressOption, index) => (
              <MenuItem key={index} value={addressOption}>
                {addressOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" type="submit">
            Lưu Thông Tin
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PersonalInfoPage;
