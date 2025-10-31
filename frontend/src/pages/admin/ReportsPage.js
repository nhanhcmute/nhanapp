import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Card, CardContent, Divider, Box, IconButton } from '@mui/material';
import { purple, blue, green, orange } from '@mui/material/colors';
import { ref, get } from 'firebase/database';
import { database } from '../../firebaseConfig';
function Reports() {
  const [salesData, setSalesData] = useState(null);
  const [otherData, setOtherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Lấy dữ liệu bán hàng từ Firebase
        const salesRef = ref(database, 'salesData');
        const salesSnapshot = await get(salesRef);
        const salesData = salesSnapshot.exists() ? salesSnapshot.val() : null;

        // Lấy dữ liệu khác từ Firebase
        const otherRef = ref(database, 'otherData');
        const otherSnapshot = await get(otherRef);
        const otherData = otherSnapshot.exists() ? otherSnapshot.val() : null;

        setSalesData(salesData);
        setOtherData(otherData);
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // Kiểm tra nếu salesData hoặc otherData không có hoặc không hợp lệ, trả về một thông báo lỗi hoặc không hiển thị
  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom align="center">Báo cáo bán hàng, thống kê</Typography>
        <Box display="flex" justifyContent="center" marginTop={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!salesData || !otherData) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom align="center">Báo cáo bán hàng, thống kê</Typography>
        <Typography variant="body1" align="center">Không có dữ liệu để hiển thị</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" color="primary">Báo cáo bán hàng, thống kê</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" marginTop={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Tổng quan thống kê */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: "100%", backgroundColor: purple[50], '&:hover': { backgroundColor: purple[100] } }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" gutterBottom color="primary">Tổng quan thống kê</Typography>
                <Divider />
                <Typography variant="body1" marginTop={2}>Tổng doanh thu: {salesData[0].totalSales} VNĐ</Typography>
                <Typography variant="body1">Tổng số đơn hàng: {salesData[0].totalOrders}</Typography>
                <Typography variant="body1">Sản phẩm bán ra: {salesData[0].productsSold}</Typography>
                <IconButton color="primary" sx={{ marginTop: 1 }}>
                </IconButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Doanh thu theo danh mục */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: "100%", backgroundColor: blue[50], '&:hover': { backgroundColor: blue[100] } }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" gutterBottom color="primary">Doanh thu </Typography>
                <Divider />
                {salesData[0].salesByCategory.map((item, index) => (
                  <Box key={index} marginTop={1}>
                    <Typography variant="body1">{item.category}: {item.sales} VNĐ (Đơn hàng: {item.orders})</Typography>
                  </Box>
                ))}
                <IconButton color="primary" sx={{ marginTop: 1 }}>
                </IconButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Thông tin khách hàng */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: "100%", backgroundColor: green[50], '&:hover': { backgroundColor: green[100] } }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" gutterBottom color="primary">Thông tin khách hàng</Typography>
                <Divider />
                <Typography variant="body1" marginTop={2}>Tổng số khách hàng: {otherData.totalCustomers}</Typography>
                <Typography variant="body1">Khách hàng mới: {otherData.newCustomers}</Typography>
                <Typography variant="body1">Người dùng đang hoạt động: {otherData.activeUsers}</Typography>
                <IconButton color="primary" sx={{ marginTop: 1 }}>
                </IconButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Đánh giá và sản phẩm */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ height: "100%", backgroundColor: orange[50], '&:hover': { backgroundColor: orange[100] } }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" gutterBottom color="primary">Đánh giá và sản phẩm</Typography>
                <Divider />
                <Typography variant="body1" marginTop={2}>Tổng số đánh giá: {otherData.totalReviews}</Typography>
                <Typography variant="body1">Đánh giá trung bình: {otherData.averageRating}</Typography>
                <Typography variant="body1">Tổng số sản phẩm: {otherData.totalProducts}</Typography>
                <Typography variant="body1">Sản phẩm hết hàng: {otherData.outOfStockProducts}</Typography>
                <IconButton color="primary" sx={{ marginTop: 1 }}>
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Reports;
