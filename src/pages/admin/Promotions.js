import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const Promotions = () => {
  const loadPromotionsFromLocalStorage = () => {
    const storedPromotions = localStorage.getItem('promotions');
    return storedPromotions ? JSON.parse(storedPromotions) : [];
  };

  const savePromotionsToLocalStorage = (promotions) => {
    localStorage.setItem('promotions', JSON.stringify(promotions));
  };

  const [promotions, setPromotions] = useState(loadPromotionsFromLocalStorage());
  const [newPromotion, setNewPromotion] = useState({
    id: null,
    code: '',
    discountType: 'percentage', 
    discountValue: '',
    minOrderAmount: '',
    productCondition: '',
    expirationDate: '',
    usedCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const handleAddOrEditPromotion = () => {
    if (
      newPromotion.code &&
      newPromotion.discountValue &&
      newPromotion.minOrderAmount &&
      newPromotion.expirationDate
    ) {
      const updatedPromotion = { ...newPromotion };

      let updatedPromotions;
      if (newPromotion.id) {
        updatedPromotions = promotions.map((promo) =>
          promo.id === newPromotion.id ? updatedPromotion : promo
        );
      } else {
        updatedPromotions = [
          ...promotions,
          { ...updatedPromotion, id: Date.now(), usedCount: 0 },
        ];
      }

      setPromotions(updatedPromotions);
      savePromotionsToLocalStorage(updatedPromotions);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewPromotion({
      id: null,
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      productCondition: '',
      expirationDate: '',
      usedCount: 0,
    });
  };

  const handleDeletePromotion = (promotionId) => {
    const updatedPromotions = promotions.filter(
      (promotion) => promotion.id !== promotionId
    );
    setPromotions(updatedPromotions);
    savePromotionsToLocalStorage(updatedPromotions);
  };

  const handleEditPromotion = (promotionId) => {
    const promoToEdit = promotions.find((promo) => promo.id === promotionId);
    setNewPromotion(promoToEdit);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.discountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.productCondition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPromotions = filteredPromotions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const mostUsedPromotion = promotions.reduce((maxPromo, promo) =>
    promo.usedCount > maxPromo.usedCount ? promo : maxPromo
  , { usedCount: 0 });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Sales and Promotions Management
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 , justifyContent : "center"}}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#1976d2' }}>
              {newPromotion.id ? 'Edit Promotion' : 'Tạo Mã Khuyến Mãi'}
            </Typography>

            <TextField
              label="Promo Code"
              fullWidth
              value={newPromotion.code}
              onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={newPromotion.discountType}
                onChange={(e) => setNewPromotion({ ...newPromotion, discountType: e.target.value })}
                label="Discount Type"
              >
                <MenuItem value="percentage">Percentage (%)</MenuItem>
                <MenuItem value="amount">Amount ($)</MenuItem>
              </Select>
              <FormHelperText>Choose the type of discount.</FormHelperText>
            </FormControl>

            <TextField
              label={newPromotion.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
              type="number"
              fullWidth
              value={newPromotion.discountValue}
              onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label="Min Order Amount ($)"
              type="number"
              fullWidth
              value={newPromotion.minOrderAmount}
              onChange={(e) => setNewPromotion({ ...newPromotion, minOrderAmount: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label="Product Condition"
              fullWidth
              value={newPromotion.productCondition}
              onChange={(e) => setNewPromotion({ ...newPromotion, productCondition: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label="Expiration Date"
              type="date"
              fullWidth
              value={newPromotion.expirationDate}
              onChange={(e) => setNewPromotion({ ...newPromotion, expirationDate: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              color="primary"
            />

            <Button
              variant="contained"
              onClick={handleAddOrEditPromotion}
              sx={{
                backgroundColor: '#1976d2',
                width: '100%',
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              {newPromotion.id ? 'Update Promotion' : 'Add Promotion'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            label="Tìm mã khuyến mãi"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
            variant="outlined"
            color="primary"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
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
                    <TableCell>Used</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>{promotion.code}</TableCell>
                      <TableCell>{promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : `$${promotion.discountValue}`}</TableCell>
                      <TableCell>{promotion.minOrderAmount}</TableCell>
                      <TableCell>{promotion.productCondition}</TableCell>
                      <TableCell>{promotion.expirationDate}</TableCell>
                      <TableCell>{promotion.usedCount}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditPromotion(promotion.id)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeletePromotion(promotion.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPromotions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Thống kê mã khuyến mãi */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#1976d2' }}>
          Mã khuyến mãi được sử dụng nhiều nhất: {mostUsedPromotion.code || 'N/A'}
        </Typography>
        <Typography sx={{ color: '#888' }}>
          Số lượng sử dụng: {mostUsedPromotion.usedCount}
        </Typography>
      </Box>
    </Container>
  );
};

export default Promotions;
