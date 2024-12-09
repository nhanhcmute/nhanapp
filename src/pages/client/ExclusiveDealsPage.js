// ExclusiveDealsPage.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';

const ExclusiveDealsPage = () => {
  const [exclusiveDeals, setExclusiveDeals] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ API (JSON Server)
    fetch('http://localhost:5000/exclusiveDeals')
      .then((response) => response.json())
      .then((data) => setExclusiveDeals(data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Exclusive Deals
      </Typography>

      <Typography variant="h6" align="center" paragraph>
        Explore discounts and offers available only at Nhân's Pet Haven. Don't miss out!
      </Typography>

      <Grid container spacing={4}>
        {exclusiveDeals.map((deal) => (
          <Grid item xs={12} sm={6} md={4} key={deal.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={deal.image}
                alt={deal.name}
              />
              <CardContent>
                <Typography variant="h6">{deal.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {deal.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {deal.discount}% Off
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
                  Claim Deal
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExclusiveDealsPage;
