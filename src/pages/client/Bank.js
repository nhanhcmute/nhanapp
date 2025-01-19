import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import Sidebar from '../../function/Sidebar';

// Danh sách các ngân hàng có logo
const availableBanks = [
  { name: 'Vietcombank', logo: '/logovietcombank.jpg' },
  { name: 'BIDV', logo: '/logobidv.png' },
  { name: 'Techcombank', logo: '/logotechcombank.jpg' },
  { name: 'ACB', logo: '/logoacb.jpg' },
  { name: 'VPBank', logo: '/logovpbank.jpg' }
];

const Bank = () => {
  const savedBanks = JSON.parse(localStorage.getItem('banks')) || [];
  const [banks, setBanks] = useState(Array.isArray(savedBanks) ? savedBanks : []);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBank, setNewBank] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    balance: 0,
    logo: ''
  });
  const [showBalanceId, setShowBalanceId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('banks', JSON.stringify(banks));
  }, [banks]);

  // Xóa ngân hàng
  const handleDeleteBank = (id) => {
    const updatedBanks = banks.filter((bank) => bank.id !== id);
    setBanks(updatedBanks);
  };

  // Thêm ngân hàng mới
  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.accountHolder || newBank.balance <= 0) {
      setError('Vui lòng điền đầy đủ thông tin ngân hàng và số dư phải lớn hơn 0.');
      return;
    }

    if (!/^\d+$/.test(newBank.accountNumber)) {
      setError('Số tài khoản chỉ được chứa các chữ số.');
      return;
    }

    const bankData = { ...newBank, id: Date.now() };
    const updatedBanks = [...banks, bankData];
    setBanks(updatedBanks);
    setOpenDialog(false);
    setNewBank({ bankName: '', accountNumber: '', accountHolder: '', balance: 0, logo: '' });
    setError('');
  };

  // Ẩn/hiện số dư
  const toggleBalanceVisibility = (id) => {
    setShowBalanceId(showBalanceId === id ? null : id);
  };

  // Hàm ẩn số tài khoản
  const maskAccountNumber = (accountNumber) => {
    if (accountNumber.length <= 6) {
      return accountNumber; // Trả về nguyên số tài khoản nếu quá ngắn
    }
    const start = accountNumber.slice(0, 3);
    const end = accountNumber.slice(-3);
    const masked = '*'.repeat(accountNumber.length - 6);
    return `${start}${masked}${end}`;
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError('');
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            Quản Lý Ngân Hàng
          </Typography>
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
            Thêm Ngân Hàng
          </Button>
        </Box>

        <Divider sx={{ marginBottom: 3 }} />

        {/* Danh sách ngân hàng */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          {banks.map((bank) => (
            <Card
              key={bank.id}
              sx={{
                borderRadius: 0,
                boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                padding: 2,
                backgroundColor: '#fff',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' }
              }}
            >
              <CardContent sx={{ borderRadius: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        src={bank.logo}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                        alt="Bank Logo"
                        onError={(e) => (e.target.src = '/default-logo.png')}
                      />
                      {bank.bankName} - {bank.accountHolder}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      Số tài khoản: {maskAccountNumber(bank.accountNumber)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#333', marginTop: 1 }}>
                        Số dư: {showBalanceId === bank.id ? bank.balance.toLocaleString() + ' VND' : '*****'}
                      </Typography>
                      <IconButton onClick={() => toggleBalanceVisibility(bank.id)} sx={{ marginLeft: 1 }}>
                        {showBalanceId === bank.id ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="primary" onClick={() => console.log(`Edit bank with ID: ${bank.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteBank(bank.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Dialog Thêm Ngân Hàng */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Thêm Ngân Hàng</DialogTitle>
          <DialogContent sx={{borderRadius: 0}}>
            <FormControl fullWidth variant='standard' sx={{ marginBottom: 2 }}>
              <InputLabel>Tên Ngân Hàng</InputLabel>
              <Select
                value={newBank.bankName}
                onChange={(e) => {
                  const selectedBank = availableBanks.find((bank) => bank.name === e.target.value);
                  setNewBank({ ...newBank, bankName: e.target.value, logo: selectedBank.logo });
                }}
                label="Tên Ngân Hàng"
              >
                {availableBanks.map((bank, index) => (
                  <MenuItem key={index} value={bank.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                      />
                      <Typography>{bank.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Số Tài Khoản"
              variant="standard"
              fullWidth
              value={newBank.accountNumber}
              onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Chủ Tài Khoản"
              variant="standard"
              fullWidth
              value={newBank.accountHolder}
              onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Số Dư"
              variant="standard"
              fullWidth
              type="number"
              value={newBank.balance}
              onChange={(e) => setNewBank({ ...newBank, balance: parseFloat(e.target.value) })}
              sx={{ marginBottom: 2 }}
            />
            {error && <Typography variant="body2" sx={{ color: 'red', marginTop: 1 }}>{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={handleAddBank}
              color="primary"
              disabled={!newBank.bankName || !newBank.accountNumber || !newBank.accountHolder || newBank.balance <= 0}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Bank;
