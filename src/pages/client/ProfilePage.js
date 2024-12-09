import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedInfo = JSON.parse(localStorage.getItem('personalInfo'));
    if (savedInfo) {
      setUserInfo(savedInfo);
    }
  }, []);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const handleSaveInfo = () => {
    if (!userInfo) {
      alert('Chưa có thông tin cá nhân để lưu.');
      return;
    }
    localStorage.setItem('personalInfo', JSON.stringify(userInfo));
    alert('Thông tin đã được lưu.');
  };

  if (!userInfo) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '50px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Typography variant="body1" align="center" style={{ color: '#757575' }}>
          Chưa có thông tin cá nhân. Vui lòng cập nhật thông tin của bạn.
        </Typography>
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            sx={{ width: '100%' }}
          >
            Cập nhật thông tin
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      display="flex"
      sx={{
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Sidebar */}
      <Box sx={{ width: '250px', backgroundColor: '#fff' }}>
        <Sidebar />
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          overflowY: 'auto',  // Đảm bảo nội dung có thể cuộn nếu quá dài
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ marginBottom: 3, fontWeight: 'bold', color: '#333' }}
          >
            Thông tin cá nhân
          </Typography>

          <Card
            sx={{
              boxShadow: 3,
              borderRadius: '8px',
              backgroundColor: '#fff',
              padding: 3,
            }}
          >
            <CardContent>
              <Box mb={3}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Họ và Tên:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.name}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Số điện thoại:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.phone}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Ngày sinh:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.dob}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Địa chỉ:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.address}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" marginTop={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{ width: '48%' }}
                >
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSaveInfo}
                  sx={{ width: '48%' }}
                >
                  Lưu thông tin
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;
