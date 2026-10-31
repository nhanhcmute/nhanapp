import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Box, AppBar, Toolbar, List, ListItem, ListItemText, Typography, IconButton, Button, SwipeableDrawer, Divider } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FaPaw } from 'react-icons/fa';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';

const menuItems = [
  { key: "dashboard", path: "/admin/dashboard" },
  { key: "products", path: "/admin/products" },
  { key: "orders", path: "/admin/ordermanagement" },
  { key: "customers", path: "/admin/customers" },
  { key: "reports", path: "/admin/reports" },
  { key: "inventory", path: "/admin/inventory" },
  { key: "promotions", path: "/admin/promotions" },
  { key: "reviews", path: "/admin/reviews" },
  { key: "notifications", path: "/admin/notifications" },
  { key: "shipping", path: "/admin/shipping" },
  { key: "payments", path: "/admin/payments" },
  { key: "users", path: "/admin/usermanagement" },
  { key: "settings", path: "/admin/settings" },
];

const AdminLayout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { storeName } = useStoreSettings();

  // Toggle drawer
  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, #ff6b81 0%, #ff8fa3 50%, #ffa8b5 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(255, 107, 129, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <FaPaw size={24} color="white" />
            <Typography 
              variant="h6" 
              noWrap 
              sx={{ 
                color: "white",
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {`🐾 ${storeName} ${t('admin.layout.admin')}`}
            </Typography>
            <FaPaw size={24} color="white" />
          </Box>
          <LanguageSwitcher sx={{ mr: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
          <Button 
            onClick={handleLogout} 
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              px: 3,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {`${t('admin.layout.logout')} 🚪`}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Swipeable Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            width: 280,
            background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 50%, #ffd3d9 100%)',
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            height: '100%',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, p: 2 }}>
            <FaPaw size={20} color="#ff6b81" />
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: "center",
                color: '#ff6b81',
                fontWeight: 700,
              }}
            >
              {`🐾 ${t('admin.layout.menu')}`}
            </Typography>
            <FaPaw size={20} color="#ff6b81" />
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 107, 129, 0.3)', borderWidth: 2 }} />
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.key}
                sx={{
                  borderRadius: '12px',
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 129, 0.2)',
                    transform: 'translateX(8px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Link 
                  to={item.path} 
                  style={{ 
                    textDecoration: "none", 
                    width: "100%",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaPaw size={14} color="#ff6b81" />
                  <ListItemText 
                    primary={t(`admin.layout.items.${item.key}`)}
                    sx={{
                      '& .MuiTypography-root': {
                        color: '#ff6b81',
                        fontWeight: 600,
                      }
                    }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
          p: 3,
          marginTop: { xs: '56px', sm: '64px' }, // Make room for the AppBar (mobile Toolbar is 56px)
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        }}
      >
        <Outlet /> {/* Các trang con sẽ được render ở đây */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
