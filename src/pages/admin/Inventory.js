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
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data);
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
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('quantity', data.quantity);
      formData.append('price', data.price);
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Thêm sản phẩm thất bại');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
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
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('quantity', data.quantity);
      formData.append('price', data.price);
      if (uploadedImage) {
        formData.append('image', uploadedImage); // Gửi file ảnh
      }

      // Gửi yêu cầu PUT đến API
      const response = await fetch(`http://localhost:5000/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cập nhật sản phẩm thất bại');
      }

      const updatedProduct = await response.json();

      // Cập nhật danh sách sản phẩm trong state
      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);

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
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Xóa sản phẩm thất bại');
      }

      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
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
