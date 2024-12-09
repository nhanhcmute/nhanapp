import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating, Divider } from '@mui/material';
import axios from 'axios';

const RatingAndReviews = ({ productId, productImage }) => {
  const [rating, setRating] = useState(0); // Đánh giá của người dùng (sao)
  const [comment, setComment] = useState(''); // Bình luận của người dùng
  const [reviews, setReviews] = useState([]);

  // Lấy các đánh giá từ API khi component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/reviews?productId=${productId}`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Có lỗi khi lấy đánh giá:', error);
      });
  }, [productId]);

  // Cập nhật đánh giá vào API khi có thay đổi
  const handleCommentSubmit = () => {
    if (rating === 0 || comment === '') {
      alert('Vui lòng chọn đánh giá và viết bình luận.');
      return;
    }

    // Thêm đánh giá và bình luận mới vào API
    const newReview = {
      productId,
      rating,
      comment,
      image: productImage, // Hình ảnh sản phẩm
    };

    axios.post('http://localhost:5000/reviews', newReview)
      .then(response => {
        // Cập nhật danh sách đánh giá sau khi thêm
        setReviews([...reviews, response.data]);
        setRating(0);
        setComment('');
      })
      .catch(error => {
        console.error('Có lỗi khi gửi đánh giá:', error);
      });
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Đánh giá và bình luận
      </Typography>

      {/* Hiển thị các đánh giá hiện tại */}
      {reviews.map((review, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Người dùng: Người dùng mới</Typography>
          <Rating value={review.rating} readOnly />
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
          {/* Hiển thị hình ảnh sản phẩm từ API */}
          <img 
            src={`http://localhost:5000${review.image}`} 
            alt="Product" 
            width="100" 
          />
          <Divider sx={{ marginTop: 1 }} />
        </Box>
      ))}

      <Box sx={{ marginTop: 3 }}>
        {/* Cho phép người dùng đánh giá */}
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Đánh giá sản phẩm:
        </Typography>
        <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />

        {/* Cho phép người dùng viết bình luận */}
        <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 1 }}>
          Viết bình luận:
        </Typography>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
        />

        {/* Nút gửi bình luận */}
        <Button
          onClick={handleCommentSubmit}
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Gửi bình luận
        </Button>
      </Box>
    </Box>
  );
};

export default RatingAndReviews;
