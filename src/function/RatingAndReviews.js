import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating, Divider, Stack } from '@mui/material';
import axios from 'axios';

const RatingAndReviews = ({ productId, productImage }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState(''); // Lưu tên người dùng

  // Các bình luận mẫu
  const sampleComments = [
    'Sản phẩm tuyệt vời!',
    'Đúng theo mô tả!',
    'Giao hàng nhanh chóng!',
    'Chất lượng tuyệt vời!',
    'Rất hài lòng với sản phẩm!',
    'Sản phẩm rất đẹp và tiện lợi!',
  ];

  // Lấy thông tin người dùng từ localStorage sau khi đăng nhập
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
    if (user) {
      setUserName(user.name); // Cập nhật tên người dùng
    }
  }, []);

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
      username: userName, // Thêm tên người dùng vào đánh giá
    };

    axios.post('http://localhost:5000/reviews', newReview)
      .then(response => {
        setReviews([...reviews, response.data]);
        setRating(0);
        setComment('');
      })
      .catch(error => {
        console.error('Có lỗi khi gửi đánh giá:', error);
      });
  };

  // Xử lý khi người dùng chọn bình luận mẫu
  const handleSampleComment = (sample) => {
    setComment(sample);
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Đánh giá và bình luận
      </Typography>

      {/* Hiển thị các đánh giá hiện tại */}
      {reviews.map((review, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">{review.username || 'Người dùng ẩn danh'}</Typography>
          <Rating value={review.rating} readOnly />
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
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

        {/* Các bình luận mẫu */}
        <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 1 }}>
          Chọn bình luận mẫu:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
          {sampleComments.map((sample, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleSampleComment(sample)}
            >
              {sample}
            </Button>
          ))}
        </Stack>

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
