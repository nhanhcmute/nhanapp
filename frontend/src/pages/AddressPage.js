import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getDatabase, ref, set, get, remove, child } from 'firebase/database';
import { database } from '../firebaseConfig';
import { toast } from 'react-toastify'; 
import { FaPaw } from 'react-icons/fa';
import MapComponent from '../components/common/MapComponent';

const AddressPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const latitude = userInfo?.latitude ? userInfo.latitude : 21.0285;
  const longitude = userInfo?.longitude ? userInfo.longitude : 105.8542;
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: '',
    fullName: '',
    phone: '',
    province: '',
    provinceName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    details: '',
    addressType: '',
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        if (response.status === 200 && Array.isArray(response.data)) {
          setProvinces(response.data);
        } else {
          setError('Không có dữ liệu tỉnh/thành phố');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
        setError('Lỗi khi tải dữ liệu tỉnh/thành phố');
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố
  useEffect(() => {
    if (newAddress.province) {
      const fetchDistricts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://provinces.open-api.vn/api/p/${newAddress.province}?depth=2`);
          if (response.status === 200 && response.data.districts) {
            setDistricts(response.data.districts);
          } else {
            setDistricts([]);
            setError('Không có dữ liệu quận/huyện cho tỉnh này.');
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách quận/huyện:', error);
          setDistricts([]);
          setError('Lỗi khi tải dữ liệu quận/huyện');
        } finally {
          setLoading(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [newAddress.province]);

  // Lấy danh sách phường/xã dựa trên quận/huyện
  useEffect(() => {
    if (newAddress.district) {
      const fetchWards = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${newAddress.district}?depth=2`);
          if (response.status === 200 && response.data.wards) {
            setWards(response.data.wards);
          } else {
            setWards([]);
            setError('Không có dữ liệu phường/xã.');
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách phường/xã:', error);
          setWards([]);
          setError('Lỗi khi tải dữ liệu phường/xã');
        } finally {
          setLoading(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [newAddress.district]);

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefaultAddress = (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id
    }));
    setAddresses(updatedAddresses);
  };

  // Mở dialog chỉnh sửa địa chỉ
  const handleEditDialogOpen = (address) => {
    if (address) {
      setNewAddress({ ...address });
      setOpenDialog(true);
    }
  };

  // Đóng dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewAddress({
      id: '',
      fullName: '',
      phone: '',
      province: '',
      provinceName: '',
      district: '',
      districtName: '',
      ward: '',
      wardName: '',
      street: '',
      details: '',
      addressType: '',
    });
  };
  // Lấy danh sách địa chỉ từ Firebase
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const addressesRef = ref(database, 'addresses');
        const snapshot = await get(addressesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const addressList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setAddresses(addressList);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        setError('Lỗi khi tải dữ liệu địa chỉ');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);
  // Thêm địa chỉ mới vào Firebase
  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    const addressData = { ...newAddress, id: Date.now().toString() };

    try {
      const addressRef = ref(database, 'addresses/' + addressData.id);
      await set(addressRef, addressData); // Thêm địa chỉ vào Firebase

      toast.success('Địa chỉ đã được thêm thành công!');
      setAddresses([...addresses, addressData]);
      setOpenDialog(false); // Đóng dialog sau khi thêm địa chỉ
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      alert('Có lỗi xảy ra khi lưu địa chỉ');
    }
  };

  // Cập nhật địa chỉ trong Firebase
  const handleEditAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType || !newAddress.street) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    const updatedAddress = { ...newAddress };

    try {
      const addressRef = ref(database, `addresses/${newAddress.id}`);
      await set(addressRef, updatedAddress); // Cập nhật địa chỉ trong Firebase

      toast.success('Địa chỉ đã được cập nhật thành công!');
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) => (address.id === newAddress.id ? updatedAddress : address))
      );
      setOpenDialog(false); // Đóng dialog
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      alert('Có lỗi xảy ra khi cập nhật địa chỉ');
    }
  };

  // Xóa địa chỉ khỏi Firebase
  const handleDeleteAddress = async (addressId) => {
    if (!addressId) {
      console.log("ID địa chỉ không hợp lệ");
      return;
    }

    try {
      const addressRef = ref(database, `addresses/${addressId}`);
      await remove(addressRef); // Xóa địa chỉ khỏi Firebase

      toast.success('Địa chỉ đã được xóa thành công!');
      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id !== addressId));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      alert('Có lỗi xảy ra khi xóa địa chỉ');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      marginBottom: "20px" 
    }}>
      <Sidebar />
      <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81' }}>
              📍 Địa chỉ của tôi
            </Typography>
            <FaPaw size={32} color="#ff6b81" />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddLocationIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: '#ff6b81',
              color: 'white',
              borderRadius: '16px',
              px: 4,
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
            🐾 Thêm Địa chỉ
          </Button>
        </Box>
        <Divider sx={{ marginBottom: 4, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
        {addresses.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
            }}
          >
            <FaPaw size={64} color="#ff6b81" style={{ opacity: 0.3, marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 2 }}>
              Chưa có địa chỉ nào
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Hãy thêm địa chỉ mới để tiếp tục mua sắm! 🐾
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddLocationIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                borderRadius: '16px',
                px: 4,
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
              🐾 Thêm Địa chỉ
            </Button>
          </Paper>
        ) : (
          // Sắp xếp danh sách địa chỉ sao cho địa chỉ mặc định luôn ở đầu
          addresses
            .sort((a, b) => (a.isDefault ? -1 : 1))
            .map((address) => (
              <Card 
                key={address.id} 
                elevation={0}
                sx={{ 
                  marginBottom: 3, 
                  padding: 3, 
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 107, 129, 0.2)',
                  boxShadow: address.isDefault 
                    ? '0 8px 24px rgba(255, 107, 129, 0.25)' 
                    : '0 4px 12px rgba(255, 107, 129, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                    borderColor: 'rgba(255, 107, 129, 0.4)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FaPaw size={20} color="#ff6b81" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', flexGrow: 1 }}>
                      {address.fullName}
                    </Typography>
                    {address.isDefault && (
                      <Chip
                        label="Địa chỉ mặc định"
                        sx={{
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ color: '#666', mb: 1, lineHeight: 1.8 }}>
                    📍 {address.street}, {address.wardName}, {address.districtName}, {address.provinceName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    📞 Số điện thoại: {address.phone}
                  </Typography>

                  {/* Hiển thị bản đồ chỉ khi địa chỉ là mặc định */}
                  {address.isDefault && (
                    <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <FaPaw size={16} color="#ff6b81" />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>📍 Vị trí:</Typography>
                      </Box>
                      <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255, 107, 129, 0.2)' }}>
                        <MapComponent latitude={latitude} longitude={longitude} />
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditDialogOpen(address)}
                      sx={{
                        borderColor: '#ff6b81',
                        color: '#ff6b81',
                        borderRadius: '12px',
                        px: 3,
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
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteAddress(address.id)}
                      sx={{
                        borderColor: '#ff4757',
                        color: '#ff4757',
                        borderRadius: '12px',
                        px: 3,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#ff4757',
                          backgroundColor: 'rgba(255, 71, 87, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Xóa
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="contained"
                        onClick={() => handleSetDefaultAddress(address.id)}
                        sx={{
                          backgroundColor: '#ff6b81',
                          color: 'white',
                          borderRadius: '12px',
                          px: 3,
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
                        🐾 Đặt mặc định
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
        )}

        <Dialog 
          open={openDialog} 
          onClose={handleDialogClose}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 32px rgba(255, 107, 129, 0.25)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            color: '#ff6b81',
            fontWeight: 700,
          }}>
            <FaPaw size={20} color="#ff6b81" />
            {newAddress.id ? '📝 Chỉnh sửa địa chỉ' : '➕ Thêm địa chỉ mới'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b81',
                },
              }}
            />
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b81',
                },
              }}
            />
            <FormControl fullWidth variant='outlined' margin="normal">
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>Tỉnh/Thành phố</InputLabel>
              <Select
                value={newAddress.province}
                onChange={(e) => {
                  const selectedProvince = provinces.find(
                    (p) => p.code === e.target.value
                  );
                  setNewAddress({
                    ...newAddress,
                    province: e.target.value,
                    provinceName: selectedProvince ? selectedProvince.name : '',
                    district: '',
                    districtName: '',
                    ward: '',
                    wardName: '',
                  });
                  setDistricts([]);
                }}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b81',
                  },
                }}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.code} value={province.code}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='outlined' margin="normal" disabled={!newAddress.province}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>Quận/Huyện</InputLabel>
              <Select
                value={newAddress.district}
                onChange={(e) => {
                  const selectedDistrict = districts.find(
                    (d) => d.code === e.target.value
                  );
                  setNewAddress({
                    ...newAddress,
                    district: e.target.value,
                    districtName: selectedDistrict ? selectedDistrict.name : '',
                    ward: '',
                    wardName: '',
                  });
                  setWards([]);
                }}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b81',
                  },
                }}
              >
                {districts.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='outlined' margin="normal" disabled={!newAddress.district}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>Phường/Xã</InputLabel>
              <Select
                value={newAddress.ward}
                onChange={(e) => {
                  const selectedWard = wards.find((w) => w.code === e.target.value);
                  setNewAddress({
                    ...newAddress,
                    ward: e.target.value,
                    wardName: selectedWard ? selectedWard.name : '',
                  });
                }}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b81',
                  },
                }}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tên đường/Số nhà"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b81',
                },
              }}
            />
            <TextField
              label="Ghi chú thêm (nếu có)"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b81',
                },
              }}
            />
            <FormControl component="fieldset" margin="normal">
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                Loại địa chỉ
              </Typography>
              <RadioGroup
                value={newAddress.addressType}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressType: e.target.value })
                }
              >
                <FormControlLabel
                  value="home"
                  control={<Radio />}
                  label="Nhà riêng"
                />
                <FormControlLabel
                  value="office"
                  control={<Radio />}
                  label="Văn phòng"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={handleDialogClose}
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
              Hủy
            </Button>
            <Button
              onClick={newAddress.id ? handleEditAddress : handleAddAddress}
              variant="contained"
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                borderRadius: '12px',
                px: 4,
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
              🐾 {newAddress.id ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddressPage;