<<<<<<< HEAD:frontend/src/pages/AddressPage.js
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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import axios from 'axios';
import { getDatabase, ref, set, get, remove, child } from 'firebase/database';
import { database } from '../firebaseConfig';
import { toast } from 'react-toastify'; 

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
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa', marginBottom: "20px" }}>
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>Địa chỉ của tôi</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              padding: '10px 30px',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Thêm Địa chỉ
          </Button>
        </Box>
        <Divider sx={{ marginBottom: 3 }} />
        {addresses.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#888' }}>
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới!
          </Typography>
        ) : (
          // Sắp xếp danh sách địa chỉ sao cho địa chỉ mặc định luôn ở đầu
          addresses
            .sort((a, b) => (a.isDefault ? -1 : 1)) // Đặt địa chỉ mặc định lên đầu
            .map((address) => (
              <Card key={address.id} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#fff', borderRadius: 0 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {address.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {address.street}, {address.wardName}, {address.districtName}, {address.provinceName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Số điện thoại: {address.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: address.isDefault ? '#3f51b5' : '#888' }}>
                    {address.isDefault ? 'Địa chỉ mặc định' : ''}
                  </Typography>

                  {/* Hiển thị bản đồ chỉ khi địa chỉ là mặc định */}
                  {address.isDefault && (
                    <Box style={{ marginTop: "20px", marginBottom: "40px" }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Vị trí:</Typography>
                      <MapComponent latitude={latitude} longitude={longitude} />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleEditDialogOpen(address)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Xóa
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => handleSetDefaultAddress(address.id)}
                      >
                        Đặt mặc định
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
        )}

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{newAddress.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Họ và tên"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
            />
            <TextField
              label="Số điện thoại"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
            <FormControl fullWidth variant='standard' margin="normal">
              <InputLabel>Tỉnh/Thành phố</InputLabel>
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
              >
                {provinces.map((province) => (
                  <MenuItem key={province.code} value={province.code}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='standard' margin="normal" disabled={!newAddress.province}>
              <InputLabel>Quận/Huyện</InputLabel>
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
              >
                {districts.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='standard' margin="normal" disabled={!newAddress.district}>
              <InputLabel>Phường/Xã</InputLabel>
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
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <TextField
              label="Ghi chú thêm (nếu có)"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
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
          <DialogActions>
            <Button onClick={handleDialogClose} color="error">
              Hủy
            </Button>
            <Button
              onClick={newAddress.id ? handleEditAddress : handleAddAddress}
              color="primary"
              variant="outlined"
            >
              {newAddress.id ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddressPage;
=======
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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../function/Sidebar';
import axios from 'axios';
import { getDatabase, ref, set, get, remove, child } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { toast } from 'react-toastify'; // Nếu bạn sử dụng toast để thông báo

import MapComponent from '../../component/MapComponent';

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
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa', marginBottom: "20px" }}>
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 , overflowY: 'auto'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>Địa chỉ của tôi</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              padding: '10px 30px',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Thêm Địa chỉ
          </Button>
        </Box>
        <Divider sx={{ marginBottom: 3 }} />
        {addresses.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#888' }}>
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới!
          </Typography>
        ) : (
          // Sắp xếp danh sách địa chỉ sao cho địa chỉ mặc định luôn ở đầu
          addresses
            .sort((a, b) => (a.isDefault ? -1 : 1)) // Đặt địa chỉ mặc định lên đầu
            .map((address) => (
              <Card key={address.id} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#fff', borderRadius: 0 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {address.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {address.street}, {address.wardName}, {address.districtName}, {address.provinceName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Số điện thoại: {address.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: address.isDefault ? '#3f51b5' : '#888' }}>
                    {address.isDefault ? 'Địa chỉ mặc định' : ''}
                  </Typography>

                  {/* Hiển thị bản đồ chỉ khi địa chỉ là mặc định */}
                  {address.isDefault && (
                    <Box style={{ marginTop: "20px", marginBottom: "40px" }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>Vị trí:</Typography>
                      <MapComponent latitude={latitude} longitude={longitude} />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleEditDialogOpen(address)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Xóa
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => handleSetDefaultAddress(address.id)}
                      >
                        Đặt mặc định
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
        )}

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{newAddress.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Họ và tên"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
            />
            <TextField
              label="Số điện thoại"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
            <FormControl fullWidth variant='standard' margin="normal">
              <InputLabel>Tỉnh/Thành phố</InputLabel>
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
              >
                {provinces.map((province) => (
                  <MenuItem key={province.code} value={province.code}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='standard' margin="normal" disabled={!newAddress.province}>
              <InputLabel>Quận/Huyện</InputLabel>
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
              >
                {districts.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant='standard' margin="normal" disabled={!newAddress.district}>
              <InputLabel>Phường/Xã</InputLabel>
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
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <TextField
              label="Ghi chú thêm (nếu có)"
              variant="standard"
              fullWidth
              margin="normal"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
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
          <DialogActions>
            <Button onClick={handleDialogClose} color="error">
              Hủy
            </Button>
            <Button
              onClick={newAddress.id ? handleEditAddress : handleAddAddress}
              color="primary"
              variant="outlined"
            >
              {newAddress.id ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AddressPage;
>>>>>>> f011f0b652c1d8351eaf0e6090ca6c093231e807:src/pages/client/AddressPage.js
