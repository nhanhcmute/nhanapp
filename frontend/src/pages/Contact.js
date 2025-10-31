import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';

const Contact = () => {
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            '@media (max-width: 600px)': {
              padding: '20px',
            },
          }}
        >
          <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
            Liên Hệ Với Chúng Tôi
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', fontSize: '1.2rem', marginBottom: '30px' }}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng điền vào mẫu dưới đây và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField label="Họ Tên" variant="outlined" fullWidth sx={{ marginBottom: '20px', borderRadius: '8px' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" variant="outlined" fullWidth sx={{ marginBottom: '20px', borderRadius: '8px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Số Điện Thoại" variant="outlined" fullWidth sx={{ marginBottom: '20px', borderRadius: '8px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Lời Nhắn"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{ marginBottom: '20px', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ffeb3b',
              color: '#333',
              padding: '12px 30px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: '#fbc02d',
              },
            }}
          >
            Gửi
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
