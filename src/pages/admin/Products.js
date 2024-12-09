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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const Products = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    status: "Active",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Lấy dữ liệu khi component được mount
  }, []);

  // Thêm hoặc chỉnh sửa sản phẩm qua API
  const handleAddOrEditProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const productData = { ...newProduct, image: selectedImage || newProduct.image };

      try {
        if (newProduct.id) {
          // Nếu đang chỉnh sửa, gọi API PUT
          await fetch(`http://localhost:5000/products/${newProduct.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
        } else {
          // Nếu đang thêm mới, gọi API POST
          await fetch("http://localhost:5000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
        }

        fetchProducts(); // Cập nhật danh sách sản phẩm
        setNewProduct({ id: null, name: "", price: "", stock: "", status: "Active", image: "" });
        setSelectedImage(null);
      } catch (error) {
        console.error("Failed to add/edit product:", error);
      }
    }
  };

  // Xóa sản phẩm qua API
  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5000/products/${productId}`, { method: "DELETE" });
      fetchProducts(); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Chỉnh sửa sản phẩm
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setNewProduct(productToEdit);
    setSelectedImage(productToEdit.image);
  };

  // Tìm kiếm sản phẩm
  const handleSearch = (event) => setSearchTerm(event.target.value);

  // Xử lý phân trang
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cắt danh sách theo phân trang
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      {/* Form để thêm/sửa sản phẩm */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">{newProduct.id ? "Edit Product" : "Add Product"}</Typography>
            <TextField
              label="Product Name"
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Status"
              fullWidth
              value={newProduct.status}
              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              sx={{ mb: 2 }}
            />

            {/* Chọn ảnh sản phẩm */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
              {selectedImage && <Avatar src={selectedImage} sx={{ width: 56, height: 56, ml: 2 }} />}
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddOrEditProduct}
            >
              {newProduct.id ? "Update Product" : "Add Product"}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Tìm kiếm sản phẩm */}
      <TextField
        label="Search Product"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Danh sách sản phẩm */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <Avatar src={product.image} sx={{ width: 56, height: 56 }} />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Products;
