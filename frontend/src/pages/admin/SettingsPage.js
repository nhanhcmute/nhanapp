import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Alert, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { FaPaw } from 'react-icons/fa';
import { API_URL } from '../../config/api';

const fieldSx = {
  mb: 2.5,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(255, 107, 129, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 107, 129, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#ff6b81' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b81' },
};

const sectionSx = {
  p: 3,
  mb: 3,
  borderRadius: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 107, 129, 0.2)',
  boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
};

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    storeLogo: null,
    contactInfo: '',
    paymentMethod: '',
    shippingFee: '',
    shippingPartner: '',
    apiKey: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings.ctr/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.status === 200 && result.data) {
          setSettings({
            storeName: result.data.storeName || '',
            storeLogo: result.data.storeLogo || null,
            contactInfo: result.data.contactInfo || '',
            paymentMethod: result.data.paymentMethod || '',
            shippingFee: result.data.shippingFee || '',
            shippingPartner: result.data.shippingPartner || '',
            apiKey: result.data.apiKey || '',
          });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setFeedback({ type: 'error', message: 'Không thể tải cài đặt hiện tại' });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (field) => (e) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSettings((prev) => ({ ...prev, storeLogo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/settings.ctr/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: settings.storeName,
          storeLogo: settings.storeLogo,
          contactInfo: settings.contactInfo,
          paymentMethod: settings.paymentMethod,
          shippingFee: Number(settings.shippingFee) || 0,
          shippingPartner: settings.shippingPartner,
          apiKey: settings.apiKey,
        }),
      });
      const result = await res.json();
      if (result.status === 200) {
        setFeedback({ type: 'success', message: 'Lưu cài đặt thành công!' });
      } else {
        setFeedback({ type: 'error', message: result.message || 'Lưu cài đặt thất bại' });
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setFeedback({ type: 'error', message: 'Đã xảy ra lỗi khi lưu cài đặt' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#ff6b81' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <FaPaw size={26} color="#ff6b81" />
        <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Cài đặt hệ thống
        </Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3, borderRadius: '12px' }}>
          {feedback.message}
        </Alert>
      )}

      {/* Cấu hình cửa hàng */}
      <Paper elevation={0} sx={sectionSx}>
        <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700, mb: 2 }}>
          Cấu hình cửa hàng
        </Typography>
        <TextField
          label="Tên cửa hàng"
          fullWidth
          value={settings.storeName}
          onChange={handleChange('storeName')}
          sx={fieldSx}
        />
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>Logo cửa hàng</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
              id="upload-logo"
            />
            <label htmlFor="upload-logo">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ backgroundColor: '#ff6b81', borderRadius: '12px', '&:hover': { backgroundColor: '#ff4f70' } }}
              >
                Tải lên logo
              </Button>
            </label>
            {settings.storeLogo && (
              <Box
                component="img"
                src={settings.storeLogo}
                alt="Store Logo"
                sx={{ width: 64, height: 64, borderRadius: '12px', objectFit: 'cover', border: '2px solid rgba(255,107,129,0.3)' }}
              />
            )}
          </Box>
        </Box>
        <TextField
          label="Thông tin liên hệ"
          fullWidth
          value={settings.contactInfo}
          onChange={handleChange('contactInfo')}
          sx={fieldSx}
        />
      </Paper>

      {/* Thanh toán */}
      <Paper elevation={0} sx={sectionSx}>
        <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700, mb: 2 }}>
          Thanh toán
        </Typography>
        <FormControl fullWidth sx={fieldSx}>
          <InputLabel>Chọn cổng thanh toán</InputLabel>
          <Select
            value={settings.paymentMethod}
            onChange={handleChange('paymentMethod')}
            label="Chọn cổng thanh toán"
          >
            <MenuItem value="PayPal">PayPal</MenuItem>
            <MenuItem value="MoMo">MoMo</MenuItem>
            <MenuItem value="Stripe">Stripe</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Giao hàng */}
      <Paper elevation={0} sx={sectionSx}>
        <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700, mb: 2 }}>
          Giao hàng
        </Typography>
        <TextField
          label="Phí giao hàng"
          fullWidth
          type="number"
          value={settings.shippingFee}
          onChange={handleChange('shippingFee')}
          sx={fieldSx}
        />
        <TextField
          label="Đối tác vận chuyển"
          fullWidth
          value={settings.shippingPartner}
          onChange={handleChange('shippingPartner')}
          sx={{ ...fieldSx, mb: 0 }}
        />
      </Paper>

      {/* API Keys */}
      <Paper elevation={0} sx={sectionSx}>
        <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700, mb: 2 }}>
          API Keys
        </Typography>
        <TextField
          label="API Key"
          fullWidth
          value={settings.apiKey}
          onChange={handleChange('apiKey')}
          sx={{ ...fieldSx, mb: 0 }}
        />
      </Paper>

      {/* Save button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={saving}
          sx={{
            backgroundColor: '#ff6b81',
            borderRadius: '16px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
            '&:hover': { backgroundColor: '#ff4757' },
          }}
        >
          {saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
