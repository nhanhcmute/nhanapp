import React, { useState } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Divider, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const Voucher = () => {
  // Dữ liệu giả cho các voucher
  const [vouchers, setVouchers] = useState([
    { id: 1, code: 'VOUCHER1', discount: '10%', description: 'Giảm giá 10%' },
    { id: 2, code: 'VOUCHER2', discount: '20%', description: 'Giảm giá 20%' },
    { id: 3, code: 'VOUCHER3', discount: '15%', description: 'Giảm giá 15%' },
  ]);

  // State để mở/đóng dialog thêm/sửa voucher
  const [openDialog, setOpenDialog] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null); // Dữ liệu voucher đang chỉnh sửa

  // Hàm mở/đóng dialog
  const handleDialogOpen = (voucher = null) => {
    setEditVoucher(voucher);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditVoucher(null);
  };

  // Hàm thêm hoặc sửa voucher
  const handleSaveVoucher = () => {
    if (editVoucher) {
      // Sửa voucher
      setVouchers(vouchers.map(v => v.id === editVoucher.id ? editVoucher : v));
    } else {
      // Thêm voucher
      const newVoucher = {
        id: vouchers.length + 1,
        code: editVoucher.code,
        discount: editVoucher.discount,
        description: editVoucher.description,
      };
      setVouchers([...vouchers, newVoucher]);
    }
    handleDialogClose();
  };

  // Hàm xóa voucher
  const handleDeleteVoucher = (id) => {
    setVouchers(vouchers.filter(voucher => voucher.id !== id));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>Quản lý Voucher</Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
        Thêm Voucher
      </Button>
      
      <List sx={{ marginTop: 2 }}>
        {vouchers.map((voucher) => (
          <ListItem key={voucher.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{voucher.code}</Typography>
              <Typography variant="body2" color="textSecondary">{voucher.description}</Typography>
            </Box>
            <Box>
              <IconButton color="primary" onClick={() => handleDialogOpen(voucher)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDeleteVoucher(voucher.id)}>
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mã Voucher"
            fullWidth
            variant="outlined"
            value={editVoucher ? editVoucher.code : ''}
            onChange={(e) => setEditVoucher({ ...editVoucher, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Giảm giá"
            fullWidth
            variant="outlined"
            value={editVoucher ? editVoucher.discount : ''}
            onChange={(e) => setEditVoucher({ ...editVoucher, discount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            variant="outlined"
            value={editVoucher ? editVoucher.description : ''}
            onChange={(e) => setEditVoucher({ ...editVoucher, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveVoucher} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Voucher;
