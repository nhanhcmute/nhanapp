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
import { getCoordinatesFromAddress } from '../utils/shippingUtils';
import { useLanguage } from '../i18n/LanguageContext';

const AddressPage = () => {
  const { t } = useLanguage();
  const [userInfo, setUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressCoordinates, setAddressCoordinates] = useState({});
  const [geocodingStatus, setGeocodingStatus] = useState({}); // Track geocoding status for each address
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
          setError(t('checkout.address.errors.noProvinces'));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
        setError(t('checkout.address.errors.provincesFailed'));
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
            setError(t('checkout.address.errors.noDistricts'));
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách quận/huyện:', error);
          setDistricts([]);
          setError(t('checkout.address.errors.districtsFailed'));
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
            setError(t('checkout.address.errors.noWards'));
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách phường/xã:', error);
          setWards([]);
          setError(t('checkout.address.errors.wardsFailed'));
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
  const handleSetDefaultAddress = async (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id
    }));
    setAddresses(updatedAddresses);
    
    // Geocode địa chỉ mới được đặt làm mặc định
    const newDefaultAddress = updatedAddresses.find(addr => addr.id === id);
    if (newDefaultAddress && !addressCoordinates[newDefaultAddress.id]) {
      await geocodeAddress(newDefaultAddress);
    }
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
  // Hàm geocode một địa chỉ
  const geocodeAddress = async (address) => {
    if (!address.street || !address.wardName || !address.districtName || !address.provinceName) {
      setGeocodingStatus(prev => ({ ...prev, [address.id]: 'failed' }));
      return null;
    }

    // Tạo địa chỉ đầy đủ với nhiều format khác nhau để tăng khả năng tìm thấy
    // Ưu tiên format có đầy đủ thông tin nhất trước
    const addressFormats = [
      `${address.street}, ${address.wardName}, ${address.districtName}, ${address.provinceName}, Vietnam`,
      `${address.street}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
      `${address.wardName}, ${address.districtName}, ${address.provinceName}, Vietnam`,
    ];
    
    try {
      setGeocodingStatus(prev => ({ ...prev, [address.id]: 'loading' }));
      
      // Thử với nhiều format địa chỉ
      for (const fullAddress of addressFormats) {
        try {
          // Thêm timeout để tránh chờ quá lâu (tăng lên 15 giây)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Geocoding timeout')), 15000)
          );
          
          const coordsPromise = getCoordinatesFromAddress(fullAddress, 2); // Retry 2 lần
          const coords = await Promise.race([coordsPromise, timeoutPromise]);
          
          if (coords) {
            // Lưu thông tin về độ chính xác
            const isHouseOrBuilding = coords.type?.includes('house') || coords.type?.includes('building');
            const isApproximate = coords.importance < 0.7 || !isHouseOrBuilding; // Nếu importance thấp hoặc không phải house/building thì là approximate
            
            const coordsWithInfo = {
              lat: coords.lat,
              lon: coords.lon,
              displayName: coords.displayName,
              type: coords.type,
              importance: coords.importance,
              isApproximate: isApproximate,
            };
            
            setAddressCoordinates(prev => ({ ...prev, [address.id]: coordsWithInfo }));
            setGeocodingStatus(prev => ({ ...prev, [address.id]: 'success' }));
            console.log(`Successfully geocoded address ${address.id} with format: ${fullAddress}`);
            console.log(`Geocoding result: ${coords.displayName} (type: ${coords.type}, importance: ${coords.importance})`);
            return coordsWithInfo;
          }
        } catch (error) {
          console.warn(`Failed to geocode with format "${fullAddress}":`, error.message);
          // Tiếp tục thử format tiếp theo
          continue;
        }
      }
      
      // Nếu tất cả format đều thất bại
      console.error(`Failed to geocode address ${address.id} with all formats`);
      setGeocodingStatus(prev => ({ ...prev, [address.id]: 'failed' }));
      return null;
    } catch (error) {
      console.error(`Error geocoding address ${address.id}:`, error);
      setGeocodingStatus(prev => ({ ...prev, [address.id]: 'failed' }));
      return null;
    }
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
          
          // Chỉ geocode địa chỉ mặc định trước (lazy loading cho các địa chỉ khác)
          const defaultAddress = addressList.find(addr => addr.isDefault);
          if (defaultAddress) {
            await geocodeAddress(defaultAddress);
          }
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        setError(t('checkout.address.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Geocode địa chỉ khi nó trở thành mặc định
  useEffect(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress && !addressCoordinates[defaultAddress.id] && geocodingStatus[defaultAddress.id] !== 'loading') {
      geocodeAddress(defaultAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);
  // Thêm địa chỉ mới vào Firebase
  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType) {
      alert(t('checkout.address.errors.fillAll'));
      return;
    }

    const addressData = { ...newAddress, id: Date.now().toString() };

    try {
      const addressRef = ref(database, 'addresses/' + addressData.id);
      await set(addressRef, addressData); // Thêm địa chỉ vào Firebase

      toast.success(t('checkout.address.added'));
      setAddresses([...addresses, addressData]);
      setOpenDialog(false); // Đóng dialog sau khi thêm địa chỉ
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      alert(t('checkout.address.errors.saveFailed'));
    }
  };

  // Cập nhật địa chỉ trong Firebase
  const handleEditAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType || !newAddress.street) {
      alert(t('checkout.address.errors.fillAll'));
      return;
    }

    const updatedAddress = { ...newAddress };

    try {
      const addressRef = ref(database, `addresses/${newAddress.id}`);
      await set(addressRef, updatedAddress); // Cập nhật địa chỉ trong Firebase

      toast.success(t('checkout.address.updated'));
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) => (address.id === newAddress.id ? updatedAddress : address))
      );
      setOpenDialog(false); // Đóng dialog
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      alert(t('checkout.address.errors.updateFailed'));
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

      toast.success(t('checkout.address.deleted'));
      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id !== addressId));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      alert(t('checkout.address.errors.deleteFailed'));
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      marginBottom: "20px"
    }}>
      <Sidebar />
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81' }}>
              {`📍 ${t('checkout.address.myAddresses')}`}
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
            {`🐾 ${t('checkout.address.add')}`}
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
              {t('checkout.address.none')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              {t('checkout.address.noneHint')}
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
              {`🐾 ${t('checkout.address.add')}`}
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
                        label={t('checkout.address.default')}
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
                    {`📞 ${t('checkout.address.phoneLine', { phone: address.phone })}`}
                  </Typography>

                  {/* Hiển thị bản đồ chỉ khi địa chỉ là mặc định */}
                  {address.isDefault && (
                    <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <FaPaw size={16} color="#ff6b81" />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>📍 {t('checkout.address.location')}</Typography>
                      </Box>
                      <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255, 107, 129, 0.2)' }}>
                        {addressCoordinates[address.id] ? (
                          <>
                            <MapComponent 
                              latitude={addressCoordinates[address.id].lat} 
                              longitude={addressCoordinates[address.id].lon}
                              addressLabel={`${address.street}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`}
                            />
                            {/* Hiển thị cảnh báo nếu vị trí không chính xác 100% */}
                            {addressCoordinates[address.id].isApproximate && (
                              <Box sx={{ p: 1.5, backgroundColor: '#fff3cd', borderTop: '1px solid rgba(255, 107, 129, 0.2)' }}>
                                <Typography variant="caption" sx={{ color: '#856404', fontSize: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                  <span>⚠️</span>
                                  <span>
                                    {t('checkout.address.approx', { area: address.wardName || t('checkout.address.area') })}
                                    {address.street?.match(/\d+/) ? t('checkout.address.mergedHint') : t('checkout.address.houseNumberHint')}
                                  </span>
                                </Typography>
                              </Box>
                            )}
                          </>
                        ) : geocodingStatus[address.id] === 'failed' ? (
                          <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3cd' }}>
                            <Typography variant="body2" sx={{ color: '#856404', mb: 1 }}>
                              {`⚠️ ${t('checkout.address.locationFailed')}`}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#856404', display: 'block', mb: 2 }}>
                              {t('checkout.address.mergedHintFull')}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => geocodeAddress(address)}
                              sx={{
                                mt: 1,
                                color: '#ff6b81',
                                borderColor: '#ff6b81',
                                '&:hover': {
                                  borderColor: '#ff4757',
                                  backgroundColor: 'rgba(255, 107, 129, 0.1)',
                                },
                              }}
                              variant="outlined"
                            >
                              {t('checkout.address.retry')}
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {t('checkout.address.loadingLocation')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                              {t('checkout.address.pleaseWait')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
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
                      {t('checkout.address.edit')}
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
                      {t('checkout.address.delete')}
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
                        {`🐾 ${t('checkout.address.setDefault')}`}
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
            {newAddress.id ? `📝 ${t('checkout.address.editTitle')}` : `➕ ${t('checkout.address.addTitle')}`}
          </DialogTitle>
          <DialogContent>
            <TextField
              label={t('checkout.address.fullName')}
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
              label={t('checkout.address.phone')}
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
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>{t('checkout.address.province')}</InputLabel>
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
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>{t('checkout.address.district')}</InputLabel>
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
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>{t('checkout.address.ward')}</InputLabel>
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
              label={t('checkout.address.street')}
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
              label={t('checkout.address.note')}
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
                {t('checkout.address.type')}
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
                  label={t('checkout.address.home')}
                />
                <FormControlLabel
                  value="office"
                  control={<Radio />}
                  label={t('checkout.address.office')}
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
              {t('checkout.address.cancel')}
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
              🐾 {newAddress.id ? t('checkout.address.saveChanges') : t('checkout.address.addNew')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddressPage;