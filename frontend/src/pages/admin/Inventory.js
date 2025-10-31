import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database, ref, set, push, update, remove, get } from "../../firebaseConfig";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = Object.entries(data).map(([id, product]) => ({
            id,
            ...product,
          }));
          setProducts(productList);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  // Thêm mới sản phẩm
  const onAddProduct = async (data) => {
    try {
      const productRef = push(ref(database, 'products')); // Tạo sản phẩm mới
      const productData = {
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        image: uploadedImage ? URL.createObjectURL(uploadedImage) : '',
      };

      await set(productRef, productData); // Lưu sản phẩm vào Firebase
      setProducts([...products, { id: productRef.key, ...productData }]);
      toast.success('Sản phẩm đã được thêm thành công');
      reset();
      setImagePreview('');
      setUploadedImage(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm');
    }
  };

  // Sửa thông tin sản phẩm
  const onEditProduct = async (data) => {
    try {
      const productRef = ref(database, `products/${selectedProduct.id}`);
      const updatedProduct = {
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        image: uploadedImage ? URL.createObjectURL(uploadedImage) : selectedProduct.image,
      };

      await update(productRef, updatedProduct); // Cập nhật sản phẩm
      setProducts(products.map((product) =>
        product.id === selectedProduct.id ? { id: selectedProduct.id, ...updatedProduct } : product
      ));
      toast.success('Cập nhật sản phẩm thành công');
      setOpenDialog(false);
      reset();
      setImagePreview('');
      setUploadedImage(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  // Mở form thêm hoặc sửa sản phẩm
  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setValue('name', product.name);
      setValue('quantity', product.quantity);
      setValue('price', product.price);
      setImagePreview(product.image || '');
    } else {
      reset();
      setImagePreview('');
      setUploadedImage(null);
    }
    setOpenDialog(true);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = ref(database, `products/${productId}`);
      await remove(productRef); // Xóa sản phẩm từ Firebase
      setProducts(products.filter((product) => product.id !== productId));
      toast.success('Sản phẩm đã được xóa');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  // Xử lý chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Quản lý tồn kho sản phẩm</Typography>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Paper 
              elevation={6} 
              sx={{
                padding: 2, 
                height: '100%', 
                transition: 'transform 0.3s', 
                '&:hover': { transform: 'scale(1.05)' },
                marginBottom: '20px' // Thêm khoảng cách dưới mỗi Paper
              }}
            >
              <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
              <Typography variant="body1" color="textSecondary">Số lượng: {product.quantity}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '10px' }}>Giá: {product.price} VNĐ</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenDialog(product)}
                  sx={{ marginRight: 1, padding: '6px 16px', fontSize: '0.875rem' }}
                >
                  Sửa
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteProduct(product.id)}
                  sx={{ padding: '6px 16px', fontSize: '0.875rem' }}
                >
                  Xóa
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Thêm / Sửa sản phẩm */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(selectedProduct ? onEditProduct : onAddProduct)}>
            <TextField
              label="Tên sản phẩm"
              fullWidth
              margin="normal"
              {...register('name', { required: true })}
            />
            <TextField
              label="Số lượng"
              fullWidth
              margin="normal"
              type="number"
              {...register('quantity', { required: true })}
            />
            <TextField
              label="Giá"
              fullWidth
              margin="normal"
              type="number"
              {...register('price', { required: true })}
            />
            <Box sx={{ marginTop: 2 }}>
              <Typography>Hình ảnh</Typography>
              <input type="file" onChange={handleImageChange} />
              {imagePreview && (
                <Box mt={2} sx={{ textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}
            </Box>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
              <Button type="submit">{selectedProduct ? 'Cập nhật' : 'Thêm'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toast thông báo */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
}

export default Inventory;
