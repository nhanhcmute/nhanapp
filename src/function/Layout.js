import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <CssBaseline />

      {/* Header */}
      <Header
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: "#ffffff",
          boxShadow: 3,
          height: "64px", // Giả sử header cao 64px
        }}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1, // Đẩy footer xuống cuối
          width: "100%",
          maxWidth: "auto",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box sx={{ mt: "auto", width: "100%" }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
