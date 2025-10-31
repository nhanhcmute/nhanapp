import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212',
        color: 'white',
        textAlign: 'center',
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >

      {/* Logo hoặc thương hiệu */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <PetsIcon sx={{ fontSize: 40, mr: 1, color: '#FFD700' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Nhân's Pet Haven
        </Typography>
      </Box>

      {/* Thông tin bản quyền */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} Nhân's Pet Haven. All rights reserved.
      </Typography>

      {/* Liên kết */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        Built with ❤️ by{' '}
        <Link href="https://www.facebook.com/thanhtroll4" color="inherit" underline="hover">
          Thiện Nhân
        </Link>
        .
      </Typography>
      <Typography
        onClick={() => navigate('/blog')}
        variant="body2"
        sx={{
          mb: 2,
          color: "inherit",
          cursor: "pointer",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        }}
      >
        Blog Nhân's Pet Haven
      </Typography>

      {/* Biểu tượng mạng xã hội */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          href="https://www.facebook.com/thanhtroll4"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'white' }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'white' }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'white' }}
        >
          <InstagramIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;

