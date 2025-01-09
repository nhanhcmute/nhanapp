import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { database, ref, get, update } from '../../firebaseConfig'; // import các hàm cần thiết từ firebase

const GetVoucher = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    // Fetch vouchers from Firebase when the component mounts
    fetchVouchersFromDatabase();
  }, []);

  const fetchVouchersFromDatabase = async () => {
    try {
      const promotionsRef = ref(database, 'promotions');
      const snapshot = await get(promotionsRef);
      if (snapshot.exists()) {
        setVouchers(Object.values(snapshot.val())); // Get vouchers data from Firebase
      }
    } catch (error) {
      console.error('Error fetching vouchers: ', error);
    }
  };

  const handleGetVoucher = async (voucher) => {
    if (voucher.quantity <= voucher.usedCount) {
      return; // If no vouchers left, do nothing
    }

    // Update the usedCount of the voucher in Firebase
    const updatedVoucher = { ...voucher, usedCount: voucher.usedCount + 1 };
    const voucherRef = ref(database, 'promotions/' + voucher.id);
    await update(voucherRef, { usedCount: updatedVoucher.usedCount });

    // Fetch updated vouchers from Firebase
    fetchVouchersFromDatabase();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Các Mã Khuyến Mãi
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Promo Code</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Min Order Amount</TableCell>
                    <TableCell>Product Condition</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell>{voucher.code}</TableCell>
                      <TableCell>{voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : `$${voucher.discountValue}`}</TableCell>
                      <TableCell>{voucher.minOrderAmount}</TableCell>
                      <TableCell>{voucher.productCondition}</TableCell>
                      <TableCell>{voucher.expirationDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={voucher.usedCount < voucher.quantity ? 'primary' : 'disabled'}
                          onClick={() => handleGetVoucher(voucher)}
                          disabled={voucher.usedCount >= voucher.quantity} // Disable button when quantity is reached
                          sx={{ backgroundColor: voucher.usedCount >= voucher.quantity ? '#b0bec5' : '#1976d2', '&:hover': { backgroundColor: voucher.usedCount >= voucher.quantity ? '#b0bec5' : '#1565c0' } }}
                        >
                          {voucher.usedCount < voucher.quantity ? 'Lấy Mã' : 'Đã hết mã'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GetVoucher;
