import React, { useState, useEffect } from "react";
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
  Avatar,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { FaPaw } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import { useLanguage } from '../../i18n/LanguageContext';

const PET_TYPES = ["Mèo", "Chó", "Cả hai"];
const CATEGORIES = ["Thức ăn", "Đồ chơi", "Phụ kiện", "Vệ sinh", "Y tế", "Khác"];

const selectFieldSx = {
  mb: 2,
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
};

const Products = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    status: "Còn hàng",
    petType: "Cả hai",
    category: "Khác",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortBy, setSortBy] = useState("");

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/product.ctr/get_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.status === 200) {
        setProducts(result.data);
      } else {
        console.error('Error fetching products:', result.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Thêm sản phẩm mới
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.quantity && newProduct.description) {
      let base64Image = newProduct.image;

      if (selectedImage) {
        base64Image = await convertFileToBase64(selectedImage);
      }

      const productData = {
        name: newProduct.name,
        price: newProduct.price, // Keep as string, backend expects string
        quantity: parseInt(newProduct.quantity),
        description: newProduct.description,
        status: newProduct.status,
        petType: newProduct.petType,
        category: newProduct.category,
        image: base64Image
      };

      try {
        const response = await fetch(`${API_URL}/product.ctr/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        const result = await response.json();
        if (result.status === 200) {
          await fetchProducts(); // Refresh list
          handleCancel();
          alert(t('admin.products.added'));
        } else {
          alert(result.message || t('admin.products.addFailedServer'));
        }
      } catch (error) {
        console.error("Failed to add product:", error);
        alert(t('admin.products.addFailed'));
      }
    } else {
      alert(t('admin.products.fillAll'));
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t('admin.products.confirmDelete'))) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', productId);

      const response = await fetch(`${API_URL}/product.ctr/delete`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.status === 200) {
        setProducts(products.filter((product) => product.id !== productId));
        alert(t('admin.products.deleted'));
      } else {
        alert(result.message || t('admin.products.deleteFailedServer'));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert(t('admin.products.deleteFailed'));
    }
  };

  // Cập nhật status khi thay đổi số lượng
  const handleQuantityChange = (e) => {
    const quantity = e.target.value;

    // Cấm nhập giá trị nhỏ hơn 0
    if (quantity < 0) return;

    // Cập nhật số lượng và status dựa trên số lượng
    setNewProduct((prev) => {
      const updatedStatus = quantity === 0 ? "Hết hàng" : "Còn hàng";
      return {
        ...prev,
        quantity,
        status: updatedStatus,
      };
    });
  };

  // Cập nhật giá trị khi thay đổi giá
  const handlePriceChange = (e) => {
    const price = e.target.value;

    // Cấm nhập giá trị nhỏ hơn 0 và không phải là số
    if (price < 0 || isNaN(price)) return;

    setNewProduct((prev) => ({
      ...prev,
      price,
    }));
  };

  // Mở Dialog chỉnh sửa sản phẩm
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    setOpenDialog(true);
  };

  // Cập nhật sản phẩm sau khi chỉnh sửa
  const handleSaveEdit = async () => {
    if (editingProduct) {
      let base64Image = editingProduct.image;

      if (selectedImage) {
        base64Image = await convertFileToBase64(selectedImage);
      }

      const productData = {
        id: editingProduct.id,
        name: editingProduct.name,
        price: editingProduct.price, // Keep as string, backend expects string
        quantity: parseInt(editingProduct.quantity),
        description: editingProduct.description,
        status: editingProduct.status,
        petType: editingProduct.petType || "Cả hai",
        category: editingProduct.category || "Khác",
        image: base64Image
      };

      try {
        const response = await fetch(`${API_URL}/product.ctr/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });

        const result = await response.json();
        if (result.status === 200) {
          await fetchProducts(); // Refresh list
          setOpenDialog(false);
          setEditingProduct(null);
          setSelectedImage(null);
          alert(t('admin.products.updated'));
        } else {
          alert(result.message || t('admin.products.updateFailedServer'));
        }
      } catch (error) {
        console.error("Failed to edit product:", error);
        alert(t('admin.products.updateFailed'));
      }
    }
  };

  const handleCancel = () => {
    setNewProduct({
      name: "",
      price: "",
      quantity: "",
      image: "",
      description: "",
      status: "Còn hàng",
      petType: "Cả hai",
      category: "Khác",
    });
    setSelectedImage(null);
  };

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp sản phẩm theo tên, số lượng hoặc giá
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'quantity') {
      return a.quantity - b.quantity;
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
        <FaPaw size={32} color="#ff6b81" />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#ff6b81',
            textShadow: '0 2px 4px rgba(255, 107, 129, 0.2)',
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
            textAlign: 'center',
          }}
        >
          {`🐾 ${t('admin.products.title')}`}
        </Typography>
        <FaPaw size={32} color="#ff6b81" />
      </Box>

      {/* Form thêm sản phẩm */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              padding: 3,
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FaPaw size={20} color="#ff6b81" />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ff6b81', 
                  fontWeight: 700 
                }}
              >
                {t('admin.products.addNew')}
              </Typography>
            </Box>
            <TextField
              label={t('admin.products.name')}
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              sx={{ 
                mb: 2,
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
              label={t('admin.products.price')}
              type="text"
              fullWidth
              value={newProduct.price}
              onChange={handlePriceChange}
              sx={{ 
                mb: 2,
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
              label={t('admin.products.quantity')}
              type="number"
              fullWidth
              value={newProduct.quantity}
              onChange={handleQuantityChange}
              sx={{ 
                mb: 2,
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
              label={t('admin.products.description')}
              fullWidth
              multiline
              rows={4}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              sx={{ 
                mb: 2,
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
              label={t('admin.products.status')}
              select
              fullWidth
              value={newProduct.status}
              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              sx={{ 
                mb: 2,
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
            >
              <MenuItem value="Còn hàng">{t('shop.statusNames')['Còn hàng']}</MenuItem>
              <MenuItem value="Hết hàng">{t('shop.statusNames')['Hết hàng']}</MenuItem>
              <MenuItem value="Ngừng kinh doanh">{t('shop.statusNames')['Ngừng kinh doanh']}</MenuItem>
            </TextField>
            <TextField
              label={t('admin.products.petType')}
              select
              fullWidth
              value={newProduct.petType}
              onChange={(e) => setNewProduct({ ...newProduct, petType: e.target.value })}
              sx={selectFieldSx}
            >
              {PET_TYPES.map((pt) => (
                <MenuItem key={pt} value={pt}>{t('shop.petTypes')[pt] || pt}</MenuItem>
              ))}
            </TextField>
            <TextField
              label={t('admin.products.category')}
              select
              fullWidth
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              sx={selectFieldSx}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{t('shop.categoryNames')[c] || c}</MenuItem>
              ))}
            </TextField>
            <Box
  sx={{
    mb: 2,
    p: 2,
    border: '2px dashed rgba(255, 107, 129, 0.3)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 107, 129, 0.05)',
    textAlign: 'center',
  }}
>
  <input
    type="file"
    accept="image/*"
    id="upload-image"
    style={{ display: 'none' }}
    onChange={(e) => setSelectedImage(e.target.files[0])}
  />
  
  <label htmlFor="upload-image">
    <Button
      component="span"
      variant="contained"
      sx={{
        backgroundColor: '#ff6b81',
        '&:hover': { backgroundColor: '#ff4f70' },
        textTransform: 'none',
        fontWeight: '600',
        borderRadius: '8px',
        px: 3,
      }}
    >
      {`📸 ${t('admin.products.chooseImage')}`}
    </Button>
  </label>

  {selectedImage && (
    <Typography sx={{ mt: 1, fontSize: '14px', color: '#ff6b81' }}>
      {selectedImage.name}
    </Typography>
  )}
</Box>

            <Button 
              variant="contained" 
              onClick={handleAddProduct}
              sx={{
                backgroundColor: '#ff6b81',
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
              {`🐾 ${t('admin.products.add')}`}
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                ml: 2,
                borderColor: '#ff6b81',
                color: '#ff6b81',
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#ff4757',
                  backgroundColor: 'rgba(255, 107, 129, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }} 
              onClick={handleCancel}
            >
              {t('admin.common.cancel')}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Bảng sản phẩm */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4, mb: 2 }}>
        <FaPaw size={20} color="#ff6b81" />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#ff6b81', 
            fontWeight: 700 
          }}
        >
          {t('admin.products.list')}
        </Typography>
      </Box>
      <TextField
        label={`🔍 ${t('admin.products.search')}`}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant={sortBy === 'name' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('name')}
            sx={{
              borderColor: '#ff6b81',
              color: sortBy === 'name' ? 'white' : '#ff6b81',
              backgroundColor: sortBy === 'name' ? '#ff6b81' : 'transparent',
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: sortBy === 'name' ? '#ff4757' : 'rgba(255, 107, 129, 0.1)',
              },
            }}
          >
            {t('admin.products.sortName')}
          </Button>
          <Button
            variant={sortBy === 'quantity' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('quantity')}
            sx={{
              borderColor: '#ff6b81',
              color: sortBy === 'quantity' ? 'white' : '#ff6b81',
              backgroundColor: sortBy === 'quantity' ? '#ff6b81' : 'transparent',
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: sortBy === 'quantity' ? '#ff4757' : 'rgba(255, 107, 129, 0.1)',
              },
            }}
          >
            {t('admin.products.sortQty')}
          </Button>
          <Button
            variant={sortBy === 'price' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('price')}
            sx={{
              borderColor: '#ff6b81',
              color: sortBy === 'price' ? 'white' : '#ff6b81',
              backgroundColor: sortBy === 'price' ? '#ff6b81' : 'transparent',
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: sortBy === 'price' ? '#ff4757' : 'rgba(255, 107, 129, 0.1)',
              },
            }}
          >
            {t('admin.products.sortPrice')}
          </Button>
          </Box>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 107, 129, 0.2)',
          boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Table sx={{ tableLayout: 'fixed', borderCollapse: 'collapse', minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255, 107, 129, 0.1)' }}>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '8%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.image')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '13%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.name')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '9%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.price')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '7%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.qty')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '8%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.pet')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '8%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.category')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '21%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.description')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '9%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.status')}</TableCell>
              <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", width: '9%', fontWeight: 700, color: '#ff6b81' }}>{t('admin.products.cols.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow 
                key={product.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 129, 0.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '' }}>
                  {product.image ? (
                    <Avatar 
                      src={product.image} 
                      alt={product.name} 
                      sx={{ 
                        width: 50, 
                        height: 50,
                        border: '2px solid rgba(255, 107, 129, 0.3)',
                      }} 
                    />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50, backgroundColor: '#ff6b81' }}>N/A</Avatar>
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '', fontWeight: 600, color: '#ff6b81' }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '', fontWeight: 600 }}>
                  {`${product.price} ${t('shop.currency')}`}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '' }}>
                  {product.quantity}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '' }}>
                  {t('shop.petTypes')[product.petType || 'Cả hai'] || product.petType}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '' }}>
                  {t('shop.categoryNames')[product.category || 'Khác'] || product.category}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '', textAlign: 'justify', whiteSpace: 'normal' }}>
                  {product.description}
                </TableCell>
                <TableCell sx={{
                  border: "1px solid rgba(255, 107, 129, 0.2)",
                  borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '',
                  color: product.status === "Hết hàng" ? "#ff4757" : product.status === "Còn hàng" ? "#2ed573" : "#a4b0be",
                  fontWeight: 600,
                }}>
                  {t('shop.statusNames')[product.status] || product.status}
                </TableCell>
                <TableCell sx={{ border: "1px solid rgba(255, 107, 129, 0.2)", borderBottom: index === paginatedProducts.length - 1 ? '1px solid rgba(255, 107, 129, 0.2)' : '' }}>
                  <IconButton 
                    onClick={() => handleEditProduct(product.id)}
                    sx={{
                      color: '#ff6b81',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 129, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteProduct(product.id)}
                    sx={{
                      color: '#ff4757',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('admin.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => t('admin.pagination.displayed', { from, to, count })}
      />

      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
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
          {t('admin.products.editTitle')}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t('admin.products.name')}
            fullWidth
            value={editingProduct?.name || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('admin.products.price')}
            type="text"
            fullWidth
            value={editingProduct?.price || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('admin.products.quantity')}
            type="number"
            fullWidth
            value={editingProduct?.quantity || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, quantity: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('admin.products.description')}
            fullWidth
            multiline
            rows={4}
            value={editingProduct?.description || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('admin.products.status')}
            select
            fullWidth
            value={editingProduct?.status || "Còn hàng"}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, status: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="Còn hàng">{t('shop.statusNames')['Còn hàng']}</MenuItem>
            <MenuItem value="Hết hàng">{t('shop.statusNames')['Hết hàng']}</MenuItem>
            <MenuItem value="Ngừng kinh doanh">{t('shop.statusNames')['Ngừng kinh doanh']}</MenuItem>
          </TextField>
          <TextField
            label={t('admin.products.petType')}
            select
            fullWidth
            value={editingProduct?.petType || "Cả hai"}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, petType: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            {PET_TYPES.map((pt) => (
              <MenuItem key={pt} value={pt}>{t('shop.petTypes')[pt] || pt}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('admin.products.category')}
            select
            fullWidth
            value={editingProduct?.category || "Khác"}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{t('shop.categoryNames')[c] || c}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{
              borderColor: '#ff6b81',
              color: '#ff6b81',
              borderRadius: '12px',
              px: 3,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 107, 129, 0.1)',
              },
            }}
          >
            {t('admin.common.cancel')}
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: '#ff6b81',
              borderRadius: '12px',
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
              '&:hover': {
                backgroundColor: '#ff4757',
                boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
              },
            }}
          >
            {`🐾 ${t('admin.common.save')}`}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Products;