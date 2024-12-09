import React, { useState } from 'react';
import { Button, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const LoadMore = ({ data = [] }) => {
  const [visibleItems, setVisibleItems] = useState(4);

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
  };

  const itemsToDisplay = Array.isArray(data) ? data.slice(0, visibleItems) : [];

  return (
    <div>
      <Grid container spacing={4}>
        {itemsToDisplay.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data.length > visibleItems && (
        <Button onClick={handleLoadMore} variant="contained" sx={{ mt: 3 }}>
          Load More
        </Button>
      )}
    </div>
  );
};

export default LoadMore;
