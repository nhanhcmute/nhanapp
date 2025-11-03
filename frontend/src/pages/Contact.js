import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { FaPaw } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể. 🐾');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      padding: '60px 0',
      minHeight: '100vh',
    }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            padding: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            '@media (max-width: 600px)': {
              padding: 3,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '2.5rem', 
                fontWeight: 700, 
                color: '#ff6b81',
              }}
            >
              Liên Hệ Với Chúng Tôi
            </Typography>
            <FaPaw size={32} color="#ff6b81" />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              fontSize: '1.2rem', 
              marginBottom: 4,
              lineHeight: 1.8,
            }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng điền vào mẫu dưới đây và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất. 🐾
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ Tên"
                  name="name"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b81',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b81',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b81',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b81',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Số Điện Thoại"
                  name="phone"
                  variant="outlined"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b81',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b81',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Lời Nhắn"
                  name="message"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b81',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b81',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                padding: '14px 40px',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '24px',
                marginTop: 4,
                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                '&:hover': {
                  backgroundColor: '#ff4757',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              🐾 Gửi Tin Nhắn
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
