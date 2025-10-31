import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemText, Typography, IconButton, Button, SwipeableDrawer, Divider } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"; 

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", path: "/admin/dashboard" },
  { text: "Products", path: "/admin/products" },
  { text: "Orders", path: "/admin/ordermanagement" },
  { text: "Customers", path: "/admin/customers" },
  { text: "Analytics and Reports", path: "/admin/reports" },
  { text: "Inventory", path: "/admin/inventory" },
  { text: "Promotions", path: "/admin/promotions" },
  { text: "Reviews", path: "/admin/reviews" },
  { text: "Notifications", path: "/admin/notifications" },
  { text: "Shipping", path: "/admin/shipping" },
  { text: "Payments", path: "/admin/payments" },
  { text: "User Management", path: "/admin/usermanagement" },
  { text: "Settings", path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [drawerOpen, setDrawerOpen] = useState(false); 

  // Toggle drawer
  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#001f3d" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}  // Tối ưu toggleDrawer
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Nhân's Pet Haven Admin
          </Typography>
          <Button onClick={handleLogout} color="inherit">Logout</Button>
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
            width: 250,
            backgroundColor: "#F4F4F4",
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ textAlign: "center", p: 2 }}>
            Admin Menu
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text}>
                <Link to={item.path} style={{ textDecoration: "none", color: "inherit", width: "100%" }}>
                  <ListItemText primary={item.text} />
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
          bgcolor: 'background.default',
          p: 3,
          marginTop: '64px', // Make room for the AppBar
        }}
      >
        <Outlet /> {/* Các trang con sẽ được render ở đây */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
