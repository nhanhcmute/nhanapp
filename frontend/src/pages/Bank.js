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
  FormControl,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/layout/Sidebar';
import { FaPaw } from 'react-icons/fa';

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
    <Box
      display="flex"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      }}
    >
      <Sidebar />
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81' }}>
              🏦 Quản Lý Ngân Hàng
            </Typography>
            <FaPaw size={32} color="#ff6b81" />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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
            🐾 Thêm Ngân Hàng
          </Button>
        </Box>

        <Divider sx={{ marginBottom: 4, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

        {/* Danh sách ngân hàng */}
        {banks.length === 0 ? (
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
            <AccountBalanceIcon sx={{ fontSize: 64, color: '#ff6b81', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 2 }}>
              Chưa có ngân hàng nào
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Hãy thêm ngân hàng để quản lý tài khoản! 🐾
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
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
              🐾 Thêm Ngân Hàng
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gap: 3 }}>
            {banks.map((bank) => (
              <Card
                key={bank.id}
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 107, 129, 0.2)',
                  boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                  padding: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(255, 107, 129, 0.25)',
                    borderColor: 'rgba(255, 107, 129, 0.4)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={bank.logo}
                          alt="Bank Logo"
                          onError={(e) => (e.target.src = '/default-logo.png')}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            objectFit: 'contain',
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', mb: 0.5 }}>
                            {bank.bankName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {bank.accountHolder}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaPaw size={14} color="#ff6b81" />
                        Số tài khoản: <span style={{ fontWeight: 600, color: '#333' }}>{maskAccountNumber(bank.accountNumber)}</span>
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: '#666', fontWeight: 600 }}>
                          💰 Số dư: <span style={{ color: '#ff4757', fontSize: '18px' }}>
                            {showBalanceId === bank.id ? bank.balance.toLocaleString() + ' VND' : '*****'}
                          </span>
                        </Typography>
                        <IconButton
                          onClick={() => toggleBalanceVisibility(bank.id)}
                          sx={{
                            color: '#ff6b81',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 129, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {showBalanceId === bank.id ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => console.log(`Edit bank with ID: ${bank.id}`)}
                        sx={{
                          color: '#ff6b81',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 129, 0.1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteBank(bank.id)}
                        sx={{
                          color: '#ff4757',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 71, 87, 0.1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Dialog Thêm Ngân Hàng */}
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
            🏦 Thêm Ngân Hàng
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth variant='outlined' sx={{ marginBottom: 3 }}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b81' } }}>Tên Ngân Hàng</InputLabel>
              <Select
                value={newBank.bankName}
                onChange={(e) => {
                  const selectedBank = availableBanks.find((bank) => bank.name === e.target.value);
                  setNewBank({ ...newBank, bankName: e.target.value, logo: selectedBank.logo });
                }}
                label="Tên Ngân Hàng"
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
                {availableBanks.map((bank, index) => (
                  <MenuItem key={index} value={bank.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={bank.logo}
                        alt={bank.name}
                        sx={{ width: 40, height: 40, borderRadius: '8px' }}
                      />
                      <Typography sx={{ fontWeight: 600 }}>{bank.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Số Tài Khoản"
              variant="outlined"
              fullWidth
              value={newBank.accountNumber}
              onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
              sx={{
                marginBottom: 3,
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
              label="Chủ Tài Khoản"
              variant="outlined"
              fullWidth
              value={newBank.accountHolder}
              onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
              sx={{
                marginBottom: 3,
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
              label="Số Dư"
              variant="outlined"
              fullWidth
              type="number"
              value={newBank.balance}
              onChange={(e) => setNewBank({ ...newBank, balance: parseFloat(e.target.value) })}
              sx={{
                marginBottom: 2,
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
            {error && (
              <Typography variant="body2" sx={{ color: '#ff4757', marginTop: 1, fontWeight: 600 }}>
                ⚠️ {error}
              </Typography>
            )}
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
              onClick={handleAddBank}
              variant="contained"
              disabled={!newBank.bankName || !newBank.accountNumber || !newBank.accountHolder || newBank.balance <= 0}
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
                '&:disabled': {
                  backgroundColor: 'rgba(255, 107, 129, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              🐾 Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Bank;
