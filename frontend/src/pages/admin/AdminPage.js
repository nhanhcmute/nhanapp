import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PetsIcon from "@mui/icons-material/Pets";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";
import { FaPaw } from "react-icons/fa";
import { API_URL } from "../../config/api";
import { adminOrderService } from "../../services/adminOrderService";
import { useStoreSettings } from "../../hooks/useStoreSettings";

const statCards = [
  { key: "products", label: "Products", icon: PetsIcon, color: "#ff6b81", path: "products" },
  { key: "orders", label: "Orders", icon: ShoppingCartIcon, color: "#42A5F5", path: "ordermanagement" },
  { key: "customers", label: "Customers", icon: GroupIcon, color: "#66BB6A", path: "customers" },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { storeName } = useStoreSettings();
  const [stats, setStats] = useState({ products: null, orders: null, customers: null });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productRes, orderRes, customerRes] = await Promise.all([
          fetch(`${API_URL}/product.ctr/get_paged`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 1, page_size: 1 }),
          }).then((r) => r.json()),
          adminOrderService.getOrders({ page: 1, pageSize: 1 }),
          fetch(`${API_URL}/user.ctr/count_customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }).then((r) => r.json()),
        ]);

        setStats({
          products: productRes?.data?.totalCount ?? 0,
          orders: orderRes?.data?.totalCount ?? 0,
          customers: customerRes?.data?.count ?? 0,
        });
      } catch (err) {
        console.error('Error loading admin quick stats:', err);
        setStats({ products: 0, orders: 0, customers: 0 });
      }
    };

    loadStats();
  }, []);

  const handleNavigation = (section) => {
    navigate(section);
  };

  return (
    <Box>
      {/* Welcome banner */}
      <Box
        sx={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ff6b81 0%, #ff8fa3 50%, #ffa8b5 100%)',
          boxShadow: '0 8px 24px rgba(255, 107, 129, 0.3)',
          color: 'white',
          textAlign: 'center',
          p: { xs: 3, md: 5 },
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <FaPaw size={28} color="white" />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.6rem', md: '2.4rem' } }}>
            Welcome to {storeName}
          </Typography>
          <FaPaw size={28} color="white" />
        </Box>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, mb: 4, maxWidth: 640, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
          Quản lý sản phẩm, theo dõi đơn hàng, cập nhật thông tin khách hàng - tất cả ở một nơi
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => handleNavigation("products")}
            sx={{
              backgroundColor: 'white',
              color: '#ff6b81',
              borderRadius: '16px',
              px: 3,
              fontWeight: 600,
              '&:hover': { backgroundColor: '#fff5f7' },
            }}
          >
            🐾 Manage Products
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleNavigation("ordermanagement")}
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              borderRadius: '16px',
              px: 3,
              fontWeight: 600,
              '&:hover': { borderColor: 'white', borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            📦 View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleNavigation("customers")}
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              borderRadius: '16px',
              px: 3,
              fontWeight: 600,
              '&:hover': { borderColor: 'white', borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            👥 Manage Customers
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
        <FaPaw size={22} color="#ff6b81" />
        <Typography variant="h5" sx={{ color: '#ff6b81', fontWeight: 700 }}>
          Quick Stats
        </Typography>
        <FaPaw size={22} color="#ff6b81" />
      </Box>

      <Grid container spacing={3}>
        {statCards.map(({ key, label, icon: Icon, color, path }) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card
              onClick={() => handleNavigation(path)}
              sx={{
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: `2px solid ${color}33`,
                boxShadow: '0 8px 24px rgba(255, 107, 129, 0.12)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(255, 107, 129, 0.2)',
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: `${color}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 32, color }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                  {label}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color, mt: 1 }}>
                  {stats[key] ?? '…'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPage;
