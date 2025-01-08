import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Typography, Divider, Paper, Avatar } from '@mui/material';
import { Star } from '@mui/icons-material';
import { Rating } from '@mui/material';
import { ref, get, remove, set } from 'firebase/database';
import { database } from '../../firebaseConfig';  // Import cấu hình Firebase

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);

  // Fetch reviews and product info from Firebase
  useEffect(() => {
    const fetchReviewsAndProduct = async () => {
      try {
        // Lấy thông tin sản phẩm từ Firebase (Giả sử sản phẩm có key là productId)
        const productRef = ref(database, `products/${productId}`);
        const productSnapshot = await get(productRef);
        if (productSnapshot.exists()) {
          setProduct(productSnapshot.val());
        }

        // Lấy đánh giá từ Firebase
        const reviewsRef = ref(database, `reviews/${productId}`);
        const reviewsSnapshot = await get(reviewsRef);
        if (reviewsSnapshot.exists()) {
          setReviews(reviewsSnapshot.val());
        } else {
          setReviews([]);  // Không có đánh giá, trả về mảng rỗng
        }
      } catch (err) {
        console.error('Error fetching reviews or product data from Firebase:', err);
      }
    };

    fetchReviewsAndProduct();
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
      // Xóa đánh giá từ Firebase
      const reviewRef = ref(database, `reviews/${productId}/${reviewId}`);
      await remove(reviewRef);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleAddReview = async (newReview) => {
    try {
      // Thêm đánh giá vào Firebase
      const newReviewId = new Date().toISOString();  // Tạo ID ngẫu nhiên dựa trên thời gian
      const newReviewRef = ref(database, `reviews/${productId}/${newReviewId}`);
      await set(newReviewRef, newReview);

      // Cập nhật lại danh sách đánh giá
      setReviews([...reviews, { id: newReviewId, ...newReview }]);
    } catch (err) {
      console.error('Error adding review:', err);
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
