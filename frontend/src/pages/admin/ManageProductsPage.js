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
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getDatabase, ref, set, get, child, remove, onValue } from "firebase/database";
import { database } from '../../firebaseConfig'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    status: "Còn hàng",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Lấy danh sách sản phẩm từ Firebase
  const fetchProducts = async () => {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(productsList);
      } else {
        setProducts([]);
      }
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Thêm sản phẩm mới vào Firebase
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.quantity && newProduct.description) {
      let base64Image = newProduct.image;

      if (selectedImage) {
        base64Image = await convertFileToBase64(selectedImage);
      }

      const productData = { ...newProduct, image: base64Image };

      const newProductRef = ref(database, 'products/' + new Date().getTime());
      try {
        await set(newProductRef, productData);
        setProducts((prevProducts) => [{ id: newProductRef.key, ...productData }, ...prevProducts]);
        handleCancel();
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
    }
  };

  // Xóa sản phẩm từ Firebase
  const handleDeleteProduct = async (productId) => {
    const productRef = ref(database, 'products/' + productId);
    try {
      await remove(productRef);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
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

      const updatedProduct = { ...editingProduct, image: base64Image };

      const productRef = ref(database, 'products/' + editingProduct.id);
      try {
        await set(productRef, updatedProduct);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        setOpenDialog(false);
        setEditingProduct(null);
        setSelectedImage(null);
      } catch (error) {
        console.error("Failed to edit product:", error);
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
      <Typography variant="h4" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Form thêm sản phẩm */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Thêm sản phẩm mới</Typography>
            <TextField
              label="Tên sản phẩm"
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Giá"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={handlePriceChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Số lượng"
              type="number"
              fullWidth
              value={newProduct.quantity}
              onChange={handleQuantityChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={4}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Trạng thái"
              select
              fullWidth
              value={newProduct.status}
              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Còn hàng">Còn hàng</MenuItem>
              <MenuItem value="Hết hàng">Hết hàng</MenuItem>
              <MenuItem value="Ngừng kinh doanh">Ngừng kinh doanh</MenuItem>
            </TextField>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </Box>
            <Button variant="contained" onClick={handleAddProduct}>
              Thêm sản phẩm
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={handleCancel}>
              Hủy
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Bảng sản phẩm */}
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3, mt: 3 }}
      />
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={() => setSortBy('name')}>
            Sắp xếp theo tên
          </Button>
          <Button variant="outlined" onClick={() => setSortBy('quantity')} sx={{ ml: 2 }}>
            Sắp xếp theo số lượng
          </Button>
          <Button variant="outlined" onClick={() => setSortBy('price')} sx={{ ml: 2 }}>
            Sắp xếp theo giá
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #ccc", width: '10%' }}>Ảnh</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '15%' }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '10%' }}>Giá</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '10%' }}>Số lượng</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '35%' }}>Mô tả</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '10%' }}>Trạng thái</TableCell>
              <TableCell sx={{ border: "1px solid #ccc", width: '10%' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '' }}>
                  {product.image ? (
                    <Avatar src={product.image} alt={product.name} sx={{ width: 50, height: 50 }} />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50 }}>N/A</Avatar>
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '' }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '' }}>
                  {product.price.toLocaleString()} VNĐ
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '' }}>
                  {product.quantity}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '', textAlign: 'justify', whiteSpace: 'normal' }}>
                  {product.description}
                </TableCell>
                <TableCell sx={{
                  border: "1px solid #ccc",
                  borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '',
                  color: product.status === "Hết hàng" ? "red" : product.status === "Còn hàng" ? "green" : "gray"
                }}>
                  {product.status}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", borderBottom: index === paginatedProducts.length - 1 ? '1px solid #ccc' : '' }}>
                  <IconButton onClick={() => handleEditProduct(product.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product.id)}>
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
      />

      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={editingProduct?.name || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Giá"
            type="number"
            fullWidth
            value={editingProduct?.price || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Số lượng"
            type="number"
            fullWidth
            value={editingProduct?.quantity || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, quantity: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mô tả"
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
            label="Trạng thái"
            select
            fullWidth
            value={editingProduct?.status || "Còn hàng"}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, status: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="Còn hàng">Còn hàng</MenuItem>
            <MenuItem value="Hết hàng">Hết hàng</MenuItem>
            <MenuItem value="Ngừng kinh doanh">Ngừng kinh doanh</MenuItem>
          </TextField>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveEdit}>Lưu</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Products;