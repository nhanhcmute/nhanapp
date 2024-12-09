import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [group, setGroup] = useState('');
  
  useEffect(() => {
    const mockCustomers = [
      { id: 1, name: 'Trần Hồng Cẩm Ly', email: 'nguyena@example.com', phone: '0123456789', orders: 5, totalSpent: 150000, history: 'Order 1, Order 2', feedback: 'Great service', group: 'VIP' },
      { id: 2, name: 'Độc Cô Cầu Bại', email: 'tranb@example.com', phone: '0987654321', orders: 3, totalSpent: 75000, history: 'Order 1, Order 3', feedback: 'Good quality', group: 'Regular' },
      { id: 3, name: 'Nguyễn Hữu Thiện Nhân', email: 'lec@example.com', phone: '0912345678', orders: 1, totalSpent: 20000, history: 'Order 1', feedback: 'Excellent experience', group: 'New' },
    ];
    setCustomers(mockCustomers);
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) || 
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search)
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleGroupChange = (customerId) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId ? { ...customer, group } : customer
    );
    setCustomers(updatedCustomers);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quản lý khách hàng</Typography>

      <TextField
        label="Tìm kiếm khách hàng"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Số đơn hàng</TableCell>
              <TableCell>Số tiền đã mua</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{customer.totalSpent.toLocaleString()} VND</TableCell>
                <TableCell>
                  <Button onClick={() => handleSelectCustomer(customer)}>Xem chi tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCustomer && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Chi tiết khách hàng: {selectedCustomer.name}</Typography>
          <Typography>Email: {selectedCustomer.email}</Typography>
          <Typography>Số điện thoại: {selectedCustomer.phone}</Typography>
          <Typography>Lịch sử mua hàng: {selectedCustomer.history}</Typography>
          <Typography>Đánh giá/nhận xét: {selectedCustomer.feedback}</Typography>
          <Typography>Số tiền đã mua: {selectedCustomer.totalSpent.toLocaleString()} VND</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Phân nhóm khách hàng"
              variant="outlined"
              fullWidth
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              select
              SelectProps={{ native: true }}
            >
              <option value="VIP">VIP</option>
              <option value="Regular">Thường xuyên</option>
              <option value="New">Mới</option>
            </TextField>
            <Button onClick={() => handleGroupChange(selectedCustomer.id)} sx={{ mt: 2 }}>Cập nhật nhóm</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomerManagement;
