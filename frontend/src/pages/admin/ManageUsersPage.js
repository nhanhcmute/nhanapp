import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { useLanguage } from '../../i18n/LanguageContext';

const CustomerManagement = () => {
  const { t } = useLanguage();
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
      <Typography variant="h4" gutterBottom>{t('admin.customers.title')}</Typography>

      <TextField
        label={t('admin.customers.search')}
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.customers.name')}</TableCell>
              <TableCell>{t('admin.common.email')}</TableCell>
              <TableCell>{t('admin.customers.phone')}</TableCell>
              <TableCell>{t('admin.customers.orders')}</TableCell>
              <TableCell>{t('admin.customers.spent')}</TableCell>
              <TableCell>{t('admin.common.actions')}</TableCell>
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
                  <Button onClick={() => handleSelectCustomer(customer)}>{t('admin.customers.viewDetail')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCustomer && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">{t('admin.customers.detail', { name: selectedCustomer.name })}</Typography>
          <Typography>Email: {selectedCustomer.email}</Typography>
          <Typography>{t('admin.customers.phoneLine', { v: selectedCustomer.phone })}</Typography>
          <Typography>{t('admin.customers.history', { v: selectedCustomer.history })}</Typography>
          <Typography>{t('admin.customers.feedback', { v: selectedCustomer.feedback })}</Typography>
          <Typography>{t('admin.customers.spentLine', { v: selectedCustomer.totalSpent.toLocaleString() })}</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label={t('admin.customers.group')}
              variant="outlined"
              fullWidth
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              select
              SelectProps={{ native: true }}
            >
              <option value="VIP">VIP</option>
              <option value="Regular">{t('admin.customers.groups.Regular')}</option>
              <option value="New">{t('admin.customers.groups.New')}</option>
            </TextField>
            <Button onClick={() => handleGroupChange(selectedCustomer.id)} sx={{ mt: 2 }}>{t('admin.customers.updateGroup')}</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomerManagement;
