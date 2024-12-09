import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Grid, Card, CardContent, Typography, Button, CardMedia, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
//import RatingAndReviews from '../../function/RatingAndReviews';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);  // Trang hiện tại
  const [productsPerPage, setProductsPerPage] = useState(6);  // Số sản phẩm trên mỗi trang
  const [totalPages, setTotalPages] = useState(1);  // Tổng số trang

  useEffect(() => {
    const fetchProductImages = async () => {
      const updatedProducts = await Promise.all(
        productData.map(async (product) => {
          try {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random');
            product.image = response.data.message;
            return product;
          } catch (error) {
            console.error("Lỗi khi lấy ảnh sản phẩm:", error);
            product.image = 'https://via.placeholder.com/200';
            return product;
          }
        })
      );

      setProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / productsPerPage));  // Tính tổng số trang
      setLoading(false);
    };

    const productData = [
      {
        id: "1",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: "https://images.dog.ceo/breeds/labrador/n02099712_684.jpg"
      },
      {
        id: "2",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_2350.jpg"
      },
      {
        id: "3",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: ""
      },
      {
        id: "4",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 300000,
        image: ""
      },
      {
        id: "5",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: ""
      },
      {
        id: "6",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: ""
      },
      {
        id: "7",
        name: "Chó Cảnh",
        description: "Chó cảnh dễ thương, phù hợp với gia đình.",
        price: 500000,
        image: ""
      }
    ];

    fetchProductImages();
  }, []);

  // Lấy các sản phẩm cho trang hiện tại
  const currentProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ marginTop: 2, color: 'blue' }}>
          Đang tải danh sách sản phẩm...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <Grid container spacing={3}>
        {currentProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="350"
                image={product.image || '/default-product.jpg'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description || 'Mô tả không có sẵn'}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  color="primary"
                >
                  Xem chi tiết
                </Button>
                <Typography variant="h6">{product.price} VND</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" sx={{ marginTop: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default ProductList;
