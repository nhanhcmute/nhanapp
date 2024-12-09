// ExpertAdvicePage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Grid } from '@mui/material';

const ExpertAdvicePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi câu hỏi ở đây
    alert('Câu hỏi đã được gửi!');
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Expert Advice
      </Typography>
      <Typography variant="h6" align="center" paragraph>
        Our experts are here to help with all your pet care questions. Connect with us today!
      </Typography>

      <Box sx={{ marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom>
          How Can We Help You?
        </Typography>
        <Typography variant="body1" paragraph>
          We have a team of experienced pet care specialists ready to answer all your questions. Whether you're looking for tips on training, health care, or the best products for your pet, we're here to assist.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Contact Our Experts
        </Typography>
        <Typography variant="body1">
          If you have a specific question or need personalized advice, reach out to us:
        </Typography>
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body1">Email: <a href="mailto:experts@nhanspethaven.com">experts@nhanspethaven.com</a></Typography>
          <Typography variant="body1">Phone: <a href="tel:+1234567890">+123 456 7890</a></Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom>
          Ask Us A Question
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Your Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Your Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Your Question"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ExpertAdvicePage;
