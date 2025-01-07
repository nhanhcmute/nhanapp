import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';
import MapComponent from '../../component/MapComponent'; 

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin từ localStorage khi trang load
  useEffect(() => {
    const savedInfo = JSON.parse(localStorage.getItem('personalInfo'));
    if (savedInfo) {
      setUserInfo(savedInfo);
    }
  }, []);

  const handleEdit = () => {
    navigate('/personal'); // Điều hướng đến trang chỉnh sửa thông tin
  };

  const latitude = userInfo?.latitude ? userInfo.latitude : 21.0285;  
  const longitude = userInfo?.longitude ? userInfo.longitude : 105.8542; 

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
            onClick={() => navigate('/personal')}
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
      <Box sx={{ width: '250px', backgroundColor: '#fff' }}>
        <Sidebar />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 3,
          overflowY: 'auto',
          paddingTop: '60px', // Thêm padding-top để tránh bị che bởi header
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              marginBottom: 3,
              fontWeight: 'bold',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Thông tin cá nhân
          </Typography>

          <Card
            sx={{
              boxShadow: 3,
              borderRadius: '12px',
              backgroundColor: '#fff',
              padding: 3,
              marginBottom: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <Box mb={2}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Họ và Tên:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.name}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Số điện thoại:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.phone}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Ngày sinh:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>{userInfo.dob}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Địa chỉ:</Typography>
                <Typography variant="body1" style={{ marginLeft: '10px', color: '#555' }}>
                  {userInfo.ward}, {userInfo.district}, {userInfo.province}
                </Typography>
              </Box>

              <Divider sx={{ marginY: 2 }} />

              {/* Hiển thị bản đồ */}
              <Box mb={3}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Vị trí:</Typography>
                <MapComponent 
                  latitude={latitude} 
                  longitude={longitude} 
                />
              </Box>

              <Box display="flex" justifyContent="space-between" marginTop={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{
                    width: '48%',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    width: '48%',
                    backgroundColor: '#e53935',
                    '&:hover': {
                      backgroundColor: '#c62828',
                    }
                  }}
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
