import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from "@mui/material";
import Sidebar from '../components/layout/Sidebar';
import { FaPaw } from 'react-icons/fa';
import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Person,
  Security,
  DeleteForever,
  Download,
  Info,
  Public,
  Block,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Privacy = () => {
  const [user, setUser] = useState(null);
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    showProfile: true,
    allowMarketing: false,
    allowAnalytics: true,
    shareData: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    setUser(storedUser);
    
    // Lấy cài đặt riêng tư từ localStorage (nếu có)
    const storedPrivacySettings = JSON.parse(localStorage.getItem('privacySettings'));
    if (storedPrivacySettings) {
      setPrivacySettings(storedPrivacySettings);
    }
  }, []);

  // Lưu cài đặt riêng tư vào localStorage
  const handleSettingChange = (setting) => {
    const newSettings = {
      ...privacySettings,
      [setting]: !privacySettings[setting],
    };
    setPrivacySettings(newSettings);
    localStorage.setItem('privacySettings', JSON.stringify(newSettings));
    toast.success('Đã cập nhật cài đặt riêng tư');
  };

  // Xuất dữ liệu cá nhân
  const handleExportData = () => {
    try {
      const userData = {
        user: user,
        privacySettings: privacySettings,
        addresses: JSON.parse(localStorage.getItem('addresses') || '{}'),
        cart: JSON.parse(localStorage.getItem('cart') || '[]'),
        orders: JSON.parse(localStorage.getItem('orders') || '[]'),
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Đã xuất dữ liệu thành công!');
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Có lỗi xảy ra khi xuất dữ liệu');
    }
  };

  // Xóa tài khoản (cần xác nhận)
  const handleDeleteAccount = () => {
    // TODO: Gọi API backend để xóa tài khoản
    // Hiện tại chỉ xóa dữ liệu local
    localStorage.clear();
    toast.success('Đã xóa tài khoản. Bạn sẽ được chuyển về trang đăng nhập.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    setDeleteDialogOpen(false);
  };

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
        marginBottom: "20px"
      }}
    >
      <Sidebar />
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
          <FaPaw size={32} color="#ff6b81" />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81' }}>
            🔒 Thiết lập riêng tư
          </Typography>
          <FaPaw size={32} color="#ff6b81" />
        </Box>
        <Divider sx={{ marginBottom: 4, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

        {/* Thông tin tài khoản */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Person sx={{ color: '#ff6b81' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                Thông tin tài khoản
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user?.email || 'Chưa cập nhật'}
                />
                <Tooltip title={privacySettings.showEmail ? 'Email đang hiển thị công khai' : 'Email đang được ẩn'}>
                  <IconButton>
                    {privacySettings.showEmail ? <Visibility sx={{ color: '#4caf50' }} /> : <VisibilityOff sx={{ color: '#999' }} />}
                  </IconButton>
                </Tooltip>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={user?.phone || 'Chưa cập nhật'}
                />
                <Tooltip title={privacySettings.showPhone ? 'Số điện thoại đang hiển thị công khai' : 'Số điện thoại đang được ẩn'}>
                  <IconButton>
                    {privacySettings.showPhone ? <Visibility sx={{ color: '#4caf50' }} /> : <VisibilityOff sx={{ color: '#999' }} />}
                  </IconButton>
                </Tooltip>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Cài đặt quyền riêng tư */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security sx={{ color: '#ff6b81' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                Quyền riêng tư
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Visibility sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hiển thị email công khai"
                  secondary="Cho phép người khác xem email của bạn"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.showEmail}
                      onChange={() => handleSettingChange('showEmail')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemIcon>
                  <Phone sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hiển thị số điện thoại công khai"
                  secondary="Cho phép người khác xem số điện thoại của bạn"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.showPhone}
                      onChange={() => handleSettingChange('showPhone')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemIcon>
                  <Public sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hiển thị hồ sơ công khai"
                  secondary="Cho phép người khác xem thông tin hồ sơ của bạn"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.showProfile}
                      onChange={() => handleSettingChange('showProfile')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Cài đặt dữ liệu */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Info sx={{ color: '#ff6b81' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                Dữ liệu và quyền riêng tư
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cho phép gửi email marketing"
                  secondary="Nhận email về sản phẩm mới và khuyến mãi"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.allowMarketing}
                      onChange={() => handleSettingChange('allowMarketing')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemIcon>
                  <Block sx={{ color: '#ff6b81' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Chia sẻ dữ liệu với bên thứ ba"
                  secondary="Cho phép chia sẻ dữ liệu để cải thiện dịch vụ"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacySettings.shareData}
                      onChange={() => handleSettingChange('shareData')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ff6b81',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ff6b81',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Quản lý dữ liệu */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Download sx={{ color: '#ff6b81' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                Quản lý dữ liệu của bạn
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => setExportDialogOpen(true)}
                sx={{
                  borderColor: '#ff6b81',
                  color: '#ff6b81',
                  borderRadius: '12px',
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 107, 129, 0.1)',
                  },
                }}
              >
                Xuất dữ liệu của tôi
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteForever />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  borderColor: '#ff4757',
                  color: '#ff4757',
                  borderRadius: '12px',
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                  },
                }}
              >
                Xóa dữ liệu cá nhân
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Xóa tài khoản */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 240, 240, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 71, 87, 0.3)',
            boxShadow: '0 4px 12px rgba(255, 71, 87, 0.15)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DeleteForever sx={{ color: '#ff4757' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff4757' }}>
                Vùng nguy hiểm
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
              Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
            </Alert>
            <Button
              variant="contained"
              startIcon={<DeleteForever />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                backgroundColor: '#ff4757',
                color: 'white',
                borderRadius: '12px',
                px: 3,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#ff3838',
                },
              }}
            >
              Xóa tài khoản vĩnh viễn
            </Button>
          </CardContent>
        </Card>

        {/* Dialog xác nhận xuất dữ liệu */}
        <Dialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#ff6b81', fontWeight: 700 }}>
            📥 Xuất dữ liệu
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có muốn xuất tất cả dữ liệu cá nhân của mình không? Dữ liệu sẽ được tải xuống dưới dạng file JSON.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setExportDialogOpen(false)}
              sx={{ color: '#666', borderRadius: '12px' }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleExportData}
              variant="contained"
              sx={{
                backgroundColor: '#ff6b81',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#ff4757',
                },
              }}
            >
              Xuất dữ liệu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              border: '2px solid rgba(255, 71, 87, 0.3)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#ff4757', fontWeight: 700 }}>
            ⚠️ Xác nhận xóa
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa dữ liệu cá nhân / tài khoản của mình không? Hành động này không thể hoàn tác.
            </DialogContentText>
            <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
              Tất cả dữ liệu sẽ bị xóa vĩnh viễn!
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#666', borderRadius: '12px' }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              sx={{
                backgroundColor: '#ff4757',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#ff3838',
                },
              }}
            >
              Xác nhận xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Privacy;
