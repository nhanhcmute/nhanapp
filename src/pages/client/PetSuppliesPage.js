import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert } from '@mui/material';
import { ref, get } from 'firebase/database'; // Import các hàm của Realtime Database
import { database } from '../../firebaseConfig'; // Import database từ firebaseConfig

const PetSuppliesPage = () => {
  const [petSupplies, setPetSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPetSupplies = async () => {
      try {
        // Lấy dữ liệu từ Realtime Database
        const petSuppliesRef = ref(database, 'petSupplies'); // Truy cập đến node 'petSupplies'
        const snapshot = await get(petSuppliesRef);

        if (snapshot.exists()) {
          const data = snapshot.val(); // Lấy giá trị của node 'petSupplies'
          // Chuyển dữ liệu thành mảng
          const suppliesData = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          
          setPetSupplies(suppliesData);
        } else {
          setError('Không có dữ liệu');
        }

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
