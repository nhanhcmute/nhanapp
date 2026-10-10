import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Divider, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MapComponent from '../components/common/MapComponent';
import { FaPaw } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

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
      <Box display="flex" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Container maxWidth="sm" sx={{ marginTop: '50px', py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
              <FaPaw size={32} color="#ff6b81" />
              <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                Thông tin cá nhân
              </Typography>
              <FaPaw size={32} color="#ff6b81" />
            </Box>
            <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.8 }}>
              Chưa có thông tin cá nhân. Vui lòng cập nhật thông tin của bạn.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/personal')}
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                '&:hover': {
                  backgroundColor: '#ff4757',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              🐾 Cập nhật thông tin
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 4,
          overflowY: 'auto',
          paddingTop: '60px', 
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#ff6b81',
                textAlign: 'center',
              }}
            >
              👤 Thông tin cá nhân
            </Typography>
            <FaPaw size={32} color="#ff6b81" />
          </Box>

          <Card
            elevation={0}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
              padding: 4,
              marginBottom: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FaPaw size={16} color="#ff6b81" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>Họ và Tên:</Typography>
                </Box>
                <Typography variant="body1" sx={{ marginLeft: '24px', color: '#666', fontSize: '16px' }}>{userInfo.name}</Typography>
              </Box>
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FaPaw size={16} color="#ff6b81" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>Số điện thoại:</Typography>
                </Box>
                <Typography variant="body1" sx={{ marginLeft: '24px', color: '#666', fontSize: '16px' }}>{userInfo.phone}</Typography>
              </Box>
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FaPaw size={16} color="#ff6b81" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>Ngày sinh:</Typography>
                </Box>
                <Typography variant="body1" sx={{ marginLeft: '24px', color: '#666', fontSize: '16px' }}>{userInfo.dob}</Typography>
              </Box>
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FaPaw size={16} color="#ff6b81" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>Địa chỉ:</Typography>
                </Box>
                <Typography variant="body1" sx={{ marginLeft: '24px', color: '#666', fontSize: '16px', lineHeight: 1.8 }}>
                  {userInfo.ward}, {userInfo.district}, {userInfo.province}
                </Typography>
              </Box>

              <Divider sx={{ marginY: 3, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

              {/* Hiển thị bản đồ */}
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaPaw size={16} color="#ff6b81" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>📍 Vị trí:</Typography>
                </Box>
                <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255, 107, 129, 0.2)' }}>
                  <MapComponent
                    latitude={latitude}
                    longitude={longitude}
                  />
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" gap={2} marginTop={4}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    flex: 1,
                    borderColor: '#ff6b81',
                    color: '#ff6b81',
                    borderRadius: '16px',
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#ff4757',
                      backgroundColor: 'rgba(255, 107, 129, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    flex: 1,
                    backgroundColor: '#ff6b81',
                    color: 'white',
                    borderRadius: '16px',
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                    '&:hover': {
                      backgroundColor: '#ff4757',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  🐾 Lưu
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
