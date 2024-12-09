// QualityPetSuppliesPage.js
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';

const PetSuppliesPage = () => {
  const [petSupplies, setPetSupplies] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ API (JSON Server)
    fetch('http://localhost:5000/petSupplies')
      .then((response) => response.json())
      .then((data) => setPetSupplies(data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Quality Pet Supplies
      </Typography>

      <Typography variant="h6" align="center" paragraph>
        Explore our premium selection of pet supplies. Our products are designed to keep your pets happy, healthy, and comfortable.
      </Typography>

      <Grid container spacing={4}>
        {petSupplies.map((supply) => (
          <Grid item xs={12} sm={6} md={4} key={supply.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={supply.image}
                alt={supply.name}
              />
              <CardContent>
                <Typography variant="h6">{supply.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {supply.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${supply.price.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PetSuppliesPage;
