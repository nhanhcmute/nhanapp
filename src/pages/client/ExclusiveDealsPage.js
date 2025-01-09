import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import { database, ref, get } from '../../firebaseConfig';

const ExclusiveDealsPage = () => {
  const [exclusiveDeals, setExclusiveDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu từ Firebase Realtime Database
    const fetchExclusiveDeals = async () => {
      try {
        const dealsRef = ref(database, 'exclusiveDeals');
        const snapshot = await get(dealsRef);
        if (snapshot.exists()) {
          setExclusiveDeals(Object.values(snapshot.val())); // Chuyển đổi object thành array
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExclusiveDeals();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Đang tải dữ liệu...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Exclusive Deals
      </Typography>

      <Typography variant="h6" align="center" paragraph>
        Explore discounts and offers available only at Nhân's Pet Haven. Don't miss out!
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {exclusiveDeals.map((deal) => (
          <Grid item xs={12} sm={6} md={4} key={deal.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image={deal.image}
                alt={deal.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {deal.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {deal.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ marginTop: 1 }}>
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
