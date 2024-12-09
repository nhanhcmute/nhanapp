import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Typography, Divider, Paper, Avatar } from '@mui/material';
import { Star } from '@mui/icons-material';
import { Rating } from '@mui/material';
import axios from 'axios';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);

  // Fetch reviews and product info from API
  useEffect(() => {
    const fetchReviewsAndProduct = async () => {
      try {
        // Lấy thông tin sản phẩm từ API
        const productResponse = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(productResponse.data);

        // Lấy đánh giá từ API
        const reviewsResponse = await axios.get(`http://localhost:5000/reviews?productId=${productId}`);
        const apiReviews = reviewsResponse.data;

        // Lấy đánh giá từ localStorage
        const storedReviews = localStorage.getItem(`reviews_${productId}`);
        const localReviews = storedReviews ? JSON.parse(storedReviews) : [];

        // Kết hợp đánh giá từ API và localStorage (ưu tiên API)
        setReviews([...apiReviews, ...localReviews]);
      } catch (err) {
        console.error('Error fetching reviews or product data:', err);
      }
    };

    fetchReviewsAndProduct();

    const handleStorageChange = () => {
      const storedReviews = localStorage.getItem(`reviews_${productId}`);
      const localReviews = storedReviews ? JSON.parse(storedReviews) : [];
      setReviews((prevReviews) => [...prevReviews, ...localReviews]);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [productId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const calculateRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  };

  const ratingCounts = calculateRatingCounts();

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Hiển thị thông tin sản phẩm */}
      {product && (
        <Box display="flex" alignItems="center" style={{ marginBottom: '20px' }}>
          <Avatar src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
          <Box>
            <Typography variant="h5">{product.name}</Typography>
            <Typography variant="body1">{product.description}</Typography>
          </Box>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>
        Product Reviews for Product {productId}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Average Rating: {calculateAverageRating()} / 5
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Grid item xs={12} sm={2} key={rating}>
            <Paper elevation={3} style={{ padding: '10px', textAlign: 'center' }}>
              <Typography variant="h6">{rating} Star</Typography>
              <Typography variant="body1">{ratingCounts[rating]} Reviews</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Card key={index} style={{ marginBottom: '20px' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Rating
                  name="read-only"
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  size="large"
                  icon={<Star style={{ color: 'gold' }} />}
                  emptyIcon={<Star />}
                />
                <Typography variant="body2" paragraph style={{ marginTop: '8px' }}>
                  {review.comment}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(review.id)}
                  style={{ marginTop: '10px' }}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
            <Divider />
          </Card>
        ))
      ) : (
        <Typography variant="body1">No reviews yet.</Typography>
      )}
    </div>
  );
};

export default Reviews;
