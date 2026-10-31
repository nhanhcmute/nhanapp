import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database'; 
import { database } from '../firebaseConfig';
import axios from 'axios';
import MapComponent from '../components/common/MapComponent';
import { useLanguage } from '../i18n/LanguageContext';

const PersonalInfoPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [error, setError] = useState('');
  const [provinces, setProvinces] = useState([]);  // Đổi tên state này từ 'addresses' thành 'provinces'
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(21.0285); // Tọa độ mặc định Hà Nội
  const [longitude, setLongitude] = useState(105.8542); // Tọa độ mặc định Hà Nội
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
    if (province) {
      const fetchDistricts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://provinces.open-api.vn/api/p/${province}?depth=2`);
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
  }, [province]);

  // Lấy danh sách phường/xã dựa trên quận/huyện
  useEffect(() => {
    if (district) {
      const fetchWards = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${district}?depth=2`);
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
  }, [district]);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!name || !phone || !dob || !province || !district || !ward) {
      setError(t('account.personal.allRequired'));
      return;
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError(t('account.personal.invalidPhone'));
      return;
    }
  
    const provinceName = provinces.find((address) => address.code === province)?.name || '';
    const districtName = districts.find((d) => d.code === district)?.name || '';
    const wardName = wards.find((w) => w.code === ward)?.name || '';
  
    const personalInfo = { name, phone, dob, province: provinceName, district: districtName, ward: wardName };
  
    // Lưu thông tin vào localStorage
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
  
    // Lưu dữ liệu vào Firebase Realtime Database
    const userRef = ref(database, 'personalInfo/' + phone); // Lưu theo số điện thoại (hoặc một ID duy nhất khác)
    set(userRef, personalInfo)
      .then(() => {
        alert(t('account.personal.saved'));
        navigate('/profile'); // Điều hướng sang trang Profile
      })
      .catch((error) => {
        console.error('Có lỗi khi lưu thông tin:', error);
        setError(t('account.personal.saveFailed'));
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('account.personal.title')}
      </Typography>

      {error && <Typography color="error" align="center">{error}</Typography>}

      {loading && (
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label={t('account.personal.fullName')}
          variant="standard"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={t('account.personal.phone')}
          variant="standard"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label={t('account.personal.birthday')}
          variant="standard"
          fullWidth
          margin="normal"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth variant='standard' margin="normal">
          <InputLabel id="province-label">{t('checkout.address.province')}</InputLabel>
          <Select
            labelId="province-label"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            label={t('checkout.address.province')}
          >
            {provinces.map((provinceOption) => (
              <MenuItem key={provinceOption.code} value={provinceOption.code}>
                {provinceOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant='standard' margin="normal">
          <InputLabel id="district-label">{t('checkout.address.district')}</InputLabel>
          <Select
            labelId="district-label"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            label={t('checkout.address.district')}
            disabled={!province}
          >
            {districts.map((districtOption) => (
              <MenuItem key={districtOption.code} value={districtOption.code}>
                {districtOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant='standard' margin="normal">
          <InputLabel id="ward-label">{t('checkout.address.ward')}</InputLabel>
          <Select
            labelId="ward-label"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            label={t('checkout.address.ward')}
            disabled={!district}
          >
            {wards.map((wardOption) => (
              <MenuItem key={wardOption.code} value={wardOption.code}>
                {wardOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Hiển thị bản đồ */}
        <MapComponent latitude={latitude} longitude={longitude} />

        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="outlined" color="primary" type="submit" disabled={loading}>
            {t('account.personal.save')}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PersonalInfoPage;
