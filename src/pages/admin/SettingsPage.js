import React, { useState } from 'react';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const SettingsPage = () => {
  const [storeName, setStoreName] = useState('');
  const [storeLogo, setStoreLogo] = useState(null);
  const [contactInfo, setContactInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [shippingPartner, setShippingPartner] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    setStoreLogo(URL.createObjectURL(file)); // Chỉ hiển thị logo tạm thời
  };

  const handleSaveSettings = () => {
    // Save the settings here, e.g., send them to the server via an API call
    console.log('Saving settings:', {
      storeName,
      storeLogo,
      contactInfo,
      paymentMethod,
      shippingFee,
      shippingPartner,
      apiKey,
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cài đặt hệ thống
      </Typography>

      {/* Cấu hình cửa hàng */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Cấu hình cửa hàng</Typography>
        <TextField
          label="Tên cửa hàng"
          fullWidth
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Logo cửa hàng</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
            id="upload-logo"
          />
          <label htmlFor="upload-logo">
            <Button variant="contained" component="span" startIcon={<CloudUpload />}>
              Tải lên logo
            </Button>
          </label>
          {storeLogo && <img src={storeLogo} alt="Store Logo" width={100} height={100} />}
        </Box>
        <TextField
          label="Thông tin liên hệ"
          fullWidth
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* Thanh toán */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Thanh toán</Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Chọn cổng thanh toán</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Chọn cổng thanh toán"
          >
            <MenuItem value="PayPal">PayPal</MenuItem>
            <MenuItem value="MoMo">MoMo</MenuItem>
            <MenuItem value="Stripe">Stripe</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Giao hàng */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Giao hàng</Typography>
        <TextField
          label="Phí giao hàng"
          fullWidth
          type="number"
          value={shippingFee}
          onChange={(e) => setShippingFee(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Đối tác vận chuyển"
          fullWidth
          value={shippingPartner}
          onChange={(e) => setShippingPartner(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* API Keys */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">API Keys</Typography>
        <TextField
          label="API Key"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* Save button */}
      <Button variant="contained" color="primary" onClick={handleSaveSettings}>
        Lưu cài đặt
      </Button>
    </Box>
  );
};

export default SettingsPage;
