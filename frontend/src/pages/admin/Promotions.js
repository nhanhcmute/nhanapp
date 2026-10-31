import React, { useState, useEffect } from 'react';
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
import { database, ref, set, get, child, update, remove } from '../../firebaseConfig'; 
import { useLanguage } from '../../i18n/LanguageContext';

const Promotions = () => {
  const { t } = useLanguage();
  const [promotions, setPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    id: null,
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    productCondition: '',
    expirationDate: '',
    usedCount: 0,
    quantity: '' // Thêm số lượng
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch promotions from Firebase when the component mounts
    fetchPromotionsFromDatabase();
  }, []);

  const fetchPromotionsFromDatabase = async () => {
    try {
      const promotionsRef = ref(database, 'promotions');
      const snapshot = await get(promotionsRef);
      if (snapshot.exists()) {
        setPromotions(Object.values(snapshot.val())); // Get promotions data from Firebase
      }
    } catch (error) {
      console.error('Error fetching promotions: ', error);
    }
  };

  const savePromotionToDatabase = async (promotion) => {
    const promotionsRef = ref(database, 'promotions/' + promotion.id);
    try {
      await set(promotionsRef, promotion); // Save the promotion to Firebase
      fetchPromotionsFromDatabase(); // Fetch updated promotions from Firebase
    } catch (error) {
      console.error('Error saving promotion: ', error);
    }
  };

  const handleAddOrEditPromotion = async () => {
    if (
      newPromotion.code &&
      newPromotion.discountValue &&
      newPromotion.minOrderAmount &&
      newPromotion.expirationDate &&
      newPromotion.quantity // Kiểm tra số lượng
    ) {
      const updatedPromotion = { ...newPromotion };

      if (newPromotion.id) {
        // Edit promotion
        const updatedPromotions = promotions.map((promo) =>
          promo.id === newPromotion.id ? updatedPromotion : promo
        );
        setPromotions(updatedPromotions);
        await savePromotionToDatabase(updatedPromotion); // Update in Firebase
      } else {
        // Add new promotion
        const newPromotionWithId = { ...updatedPromotion, id: Date.now().toString() };
        setPromotions([...promotions, newPromotionWithId]);
        await savePromotionToDatabase(newPromotionWithId); // Save new promotion to Firebase
      }

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
      quantity: '' // Đặt lại số lượng
    });
  };

  const handleDeletePromotion = async (promotionId) => {
    const updatedPromotions = promotions.filter((promotion) => promotion.id !== promotionId);
    setPromotions(updatedPromotions);

    const promotionRef = ref(database, 'promotions/' + promotionId);
    try {
      await remove(promotionRef); // Remove promotion from Firebase
      fetchPromotionsFromDatabase(); // Fetch updated promotions from Firebase
    } catch (error) {
      console.error('Error deleting promotion: ', error);
    }
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
    <Container style={{width:'100%'}}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        {t('admin.promotions.title')}
      </Typography>

      {/* Promo creation form */}
      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: '#1976d2' }}>
              {newPromotion.id ? t('admin.promotions.editTitle') : t('admin.promotions.createTitle')}
            </Typography>

            <TextField
              label={t('admin.promotions.code')}
              fullWidth
              value={newPromotion.code}
              onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('admin.promotions.discountType')}</InputLabel>
              <Select
                value={newPromotion.discountType}
                onChange={(e) => setNewPromotion({ ...newPromotion, discountType: e.target.value })}
                label={t('admin.promotions.discountType')}
              >
                <MenuItem value="percentage">{t('admin.promotions.percentage')}</MenuItem>
                <MenuItem value="amount">{t('admin.promotions.amount')}</MenuItem>
              </Select>
              <FormHelperText>{t('admin.promotions.typeHelp')}</FormHelperText>
            </FormControl>

            <TextField
              label={newPromotion.discountType === 'percentage' ? t('admin.promotions.discountPercent') : t('admin.promotions.discountAmount')}
              type="number"
              fullWidth
              value={newPromotion.discountValue}
              onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label={t('admin.promotions.minOrderVnd')}
              type="number"
              fullWidth
              value={newPromotion.minOrderAmount}
              onChange={(e) => setNewPromotion({ ...newPromotion, minOrderAmount: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label={t('admin.promotions.condition')}
              fullWidth
              value={newPromotion.productCondition}
              onChange={(e) => setNewPromotion({ ...newPromotion, productCondition: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
              color="primary"
            />

            <TextField
              label={t('admin.promotions.expires')}
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

            {/* Mục nhập số lượng */}
            <TextField
              label={t('admin.promotions.quantity')}
              type="number"
              fullWidth
              value={newPromotion.quantity}
              onChange={(e) => setNewPromotion({ ...newPromotion, quantity: e.target.value })}
              sx={{ mb: 2 }}
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
              {newPromotion.id ? t('admin.promotions.update') : t('admin.promotions.add')}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Table for displaying promotions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            label={t('admin.promotions.search')}
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableCell>{t('admin.promotions.code')}</TableCell>
                    <TableCell>{t('admin.promotions.discount')}</TableCell>
                    <TableCell>{t('admin.promotions.minOrder')}</TableCell>
                    <TableCell>{t('admin.promotions.condition')}</TableCell>
                    <TableCell>{t('admin.promotions.expires')}</TableCell>
                    <TableCell>{t('admin.promotions.quantity')}</TableCell> 
                    <TableCell>{t('admin.promotions.used')}</TableCell>
                    <TableCell>{t('admin.common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>{promotion.code}</TableCell>
                      <TableCell>{promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : `${promotion.discountValue} VND`}</TableCell>
                      <TableCell>{promotion.minOrderAmount} VND</TableCell>
                      <TableCell>{promotion.productCondition}</TableCell>
                      <TableCell>{promotion.expirationDate}</TableCell>
                      <TableCell>{promotion.quantity}</TableCell> {/* Số Lượng */}
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
              labelRowsPerPage={t('admin.pagination.rowsPerPage')}
              labelDisplayedRows={({ from, to, count }) => t('admin.pagination.displayed', { from, to, count })}
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Most used promotion */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {t('admin.promotions.mostUsed', { code: mostUsedPromotion.code || 'N/A' })}
        </Typography>
        <Typography sx={{ color: '#888' }}>
          {t('admin.promotions.usedCount', { n: mostUsedPromotion.usedCount })}
        </Typography>
      </Box>
    </Container>
  );
};

export default Promotions;
