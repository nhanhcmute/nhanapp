import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';

const AddressPage = () => {
  const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
  const [addresses, setAddresses] = useState(savedAddresses);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    addressType: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const provinces = ["Hà Nội", "TP HCM", "Đà Nẵng", "Cần Thơ"];
  const districts = ["Quận 1", "Quận 2", "Quận 3", "Quận 4"];
  const wards = ["Phường 1", "Phường 2", "Phường 3", "Phường 4"];

  const handleDeleteAddress = (id) => {
    const updatedAddresses = addresses.filter(address => address.id !== id);
    setAddresses(updatedAddresses);
  };

  const handleSetDefaultAddress = (id) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    }));
    setAddresses(updatedAddresses);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    const addressData = { ...newAddress, id: Date.now(), isDefault: false };
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    savedAddresses.push(addressData);
    localStorage.setItem('addresses', JSON.stringify(savedAddresses));
    setAddresses(savedAddresses);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor:'#fafafa' }}>
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        {/* Tiêu đề và nút thêm địa chỉ */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Địa chỉ của tôi
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: '25px',
              padding: '10px 30px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#3f51b5' }
            }}
          >
            Thêm Địa chỉ
          </Button>
        </Box>

        <Divider sx={{ marginBottom: 3 }} />

        {/* Danh sách địa chỉ */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 2, color: '#444' }}>
            Danh Sách Địa Chỉ
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {addresses.map((address) => (
              <Card
                key={address.id}
                sx={{
                  borderRadius: '10px',
                  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                  padding: 2,
                  backgroundColor: address.isDefault ? '#e3f2fd' : '#fff',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {address.fullName} ({address.addressType})
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#555' }}>
                        {address.phone}, {address.province}, {address.district}, {address.ward}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton color="primary" onClick={() => console.log(`Edit address with ID: ${address.id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteAddress(address.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ marginTop: 2 }}>
                    {address.isDefault ? (
                      <Typography variant="body2" sx={{ color: 'green' }}>Địa chỉ mặc định</Typography>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleSetDefaultAddress(address.id)}
                        sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}
                      >
                        Đặt làm mặc định
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Dialog Thêm Địa Chỉ */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Thêm Địa Chỉ</DialogTitle>
          <DialogContent>
            <TextField
              label="Họ và Tên"
              variant="outlined"
              fullWidth
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Tỉnh/Thành Phố</InputLabel>
              <Select
                value={newAddress.province}
                onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                label="Tỉnh/Thành Phố"
              >
                {provinces.map((province, index) => (
                  <MenuItem key={index} value={province}>{province}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Quận/Huyện</InputLabel>
              <Select
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                label="Quận/Huyện"
              >
                {districts.map((district, index) => (
                  <MenuItem key={index} value={district}>{district}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Phường/Xã</InputLabel>
              <Select
                value={newAddress.ward}
                onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                label="Phường/Xã"
              >
                {wards.map((ward, index) => (
                  <MenuItem key={index} value={ward}>{ward}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="fieldset" fullWidth sx={{ marginBottom: 2 }}>
              <RadioGroup
                value={newAddress.addressType}
                onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                row
              >
                <FormControlLabel value="Công ty" control={<Radio />} label="Công ty" />
                <FormControlLabel value="Nhà riêng" control={<Radio />} label="Nhà riêng" />
                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleAddAddress} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddressPage;
