import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from '../Header'; // Thành phần Header
import Footer from '../Footer'; // Thành phần Footer
import { Outlet } from 'react-router-dom'; // Hiển thị nội dung route con

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Chiều cao tối thiểu là viewport
        backgroundColor: '#f9f9f9', // Màu nền của bố cục
      }}
    >
      <CssBaseline /> {/* Reset các thiết lập mặc định của trình duyệt */}

      {/* Header */}
      <Header
        sx={{
          position: 'sticky', // Giữ cố định khi cuộn
          top: 0,
          zIndex: 1100, // Đảm bảo header hiển thị trên các thành phần khác
          backgroundColor: '#ffffff', // Màu nền header
        }}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1, // Chiếm không gian còn lại giữa Header và Footer
          width: '100%', // Chiếm toàn bộ chiều ngang
          maxWidth: '1200px', // Giới hạn chiều ngang nội dung
          margin: '0 auto', // Căn giữa nội dung
          padding: '16px', // Thêm khoảng cách nội dung
          overflowY: 'auto', // Cuộn dọc nếu nội dung dài
        }}
      >
        <Outlet /> {/* Nội dung động từ các route con */}
      </Box>

      {/* Footer */}
      <Footer
        sx={{
          backgroundColor: '#121212',
          color: 'white',
          textAlign: 'center',
          py: 3,
        }}
      />
    </Box>
  );
};

export default Layout;
