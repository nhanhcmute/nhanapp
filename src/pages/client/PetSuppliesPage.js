import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert } from '@mui/material';

const PetSuppliesPage = () => {
  const [petSupplies, setPetSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPetSupplies = async () => {
      try {
        // Lấy dữ liệu từ petsupplies.json trong thư mục public
        const response = await fetch('/petsupplies.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu');
        }

        const data = await response.json();
        setPetSupplies(data);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu!');
        setLoading(false);
      }
    };

    fetchPetSupplies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Quality Pet Supplies
      </Typography>

      <Typography variant="h6" align="center" paragraph>
        Explore our premium selection of pet supplies. Our products are designed to keep your pets happy, healthy, and comfortable.
      </Typography>

      {loading ? (
        <Grid container justifyContent="center" spacing={2}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {petSupplies.map((supply) => (
            <Grid item xs={12} sm={6} md={4} key={supply.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={supply.image}
                  alt={supply.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {supply.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    {supply.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ marginTop: 1 }}>
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
      )}
    </Container>
  );
};

export default PetSuppliesPage;
