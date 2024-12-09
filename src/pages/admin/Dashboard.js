import React from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registering ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Sample data for the charts
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 8000, 6500, 9000, 11000, 12000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const orderData = {
    labels: ["Pending", "Completed", "Canceled"],
    datasets: [
      {
        label: "Orders",
        data: [30, 50, 20],
        backgroundColor: ["#ffeb3b", "#4caf50", "#f44336"],
      },
    ],
  };

  const productData = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [
      {
        label: "Top Products",
        data: [100, 150, 120],
        backgroundColor: ["#ff5733", "#33ff57", "#3357ff"],
      },
    ],
  };

  const customersData = {
    labels: ["New Customers"],
    datasets: [
      {
        label: "Customers",
        data: [300],
        backgroundColor: ["#3f51b5"],
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Tổng doanh thu */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">$50,000</Typography>
            <Typography variant="body2">Daily: $1,200</Typography>
            <Typography variant="body2">Monthly: $30,000</Typography>
            <Typography variant="body2">Yearly: $120,000</Typography>
          </Paper>
        </Grid>

        {/* Số lượng đơn hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Orders</Typography>
            <Typography variant="body1">Pending: 30</Typography>
            <Typography variant="body1">Completed: 50</Typography>
            <Typography variant="body1">Canceled: 20</Typography>
          </Paper>
        </Grid>

        {/* Sản phẩm bán chạy nhất */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Top Selling Products</Typography>
            <Typography variant="body1">Product A - 100 units</Typography>
            <Typography variant="body1">Product B - 150 units</Typography>
            <Typography variant="body1">Product C - 120 units</Typography>
          </Paper>
        </Grid>

        {/* Số lượng khách hàng mới */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">New Customers</Typography>
            <Typography variant="h4">300</Typography>
          </Paper>
        </Grid>

        {/* Biểu đồ doanh thu */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <Line data={revenueData} />
          </Paper>
        </Grid>

        {/* Biểu đồ đơn hàng */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Orders Breakdown
            </Typography>
            <Bar data={orderData} />
          </Paper>
        </Grid>

        {/* Biểu đồ sản phẩm bán chạy */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Products
            </Typography>
            <Pie data={productData} />
          </Paper>
        </Grid>

        {/* Biểu đồ khách hàng mới */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              New Customers Overview
            </Typography>
            <Pie data={customersData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
