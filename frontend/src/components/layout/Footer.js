import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PetsIcon from '@mui/icons-material/Pets';
import { FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 50%, #ffd3d9 100%)',
        color: '#ff6b81',
        textAlign: 'center',
        py: 4,
        px: 2,
        mt: 'auto',
        borderTop: '3px solid rgba(255, 107, 129, 0.3)',
        boxShadow: '0 -4px 20px rgba(255, 107, 129, 0.1)',
      }}
    >

      {/* Logo hoặc thương hiệu */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 1 }}>
        <FaPaw size={32} color="#ff6b81" />
        <PetsIcon sx={{ fontSize: 40, color: '#ffd93d' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff6b81', mx: 1 }}>
          Nhân's Pet Haven
        </Typography>
        <PetsIcon sx={{ fontSize: 40, color: '#ffd93d' }} />
        <FaPaw size={32} color="#ff6b81" />
      </Box>

      {/* Thông tin bản quyền */}
      <Typography variant="body2" sx={{ mb: 2, color: '#ff6b81', fontWeight: 500 }}>
        🐾 © {new Date().getFullYear()} Nhân's Pet Haven. All rights reserved. 🐾
      </Typography>

      {/* Liên kết */}
      <Typography variant="body2" sx={{ mb: 2, color: '#ff6b81' }}>
        Built with 💖 & 🐶 by{' '}
        <Link 
          href="https://www.facebook.com/thanhtroll4" 
          sx={{ 
            color: '#ff4757',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: '#ff6b81',
            }
          }}
        >
          Thiện Nhân
        </Link>
      </Typography>
      <Typography
        onClick={() => navigate('/blog')}
        variant="body2"
        sx={{
          mb: 3,
          color: '#ff6b81',
          cursor: "pointer",
          fontWeight: 500,
          textDecoration: "none",
          '&:hover': {
            textDecoration: "underline",
            color: '#ff4757',
          }
        }}
      >
        📝 Blog Nhân's Pet Haven
      </Typography>

      {/* Biểu tượng mạng xã hội */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          href="https://www.facebook.com/thanhtroll4"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            color: '#ff6b81',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.2)',
            '&:hover': {
              backgroundColor: '#ff6b81',
              color: 'white',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            color: '#ff6b81',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.2)',
            '&:hover': {
              backgroundColor: '#ff6b81',
              color: 'white',
              transform: 'scale(1.1) rotate(-5deg)',
              boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            color: '#ff6b81',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.2)',
            '&:hover': {
              backgroundColor: '#ff6b81',
              color: 'white',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <InstagramIcon />
        </IconButton>
      </Box>
      
      {/* Decorative Paws */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, opacity: 0.4 }}>
        <FaPaw size={16} color="#ff6b81" />
        <FaPaw size={16} color="#ffd93d" />
        <FaPaw size={16} color="#ff6b81" />
        <FaPaw size={16} color="#ffd93d" />
        <FaPaw size={16} color="#ff6b81" />
      </Box>
    </Box>
  );
}

export default Footer;

