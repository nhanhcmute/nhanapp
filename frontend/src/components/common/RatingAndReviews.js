import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating, Divider, Stack } from '@mui/material';
import { ref, get, set, push } from 'firebase/database';
import { database } from '../../firebaseConfig'; 

const RatingAndReviews = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState(''); 

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

  // Lấy các đánh giá từ Firebase khi component mount
  useEffect(() => {
    const reviewsRef = ref(database, 'reviews/' + productId);
    get(reviewsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const reviewsArray = Object.entries(data).map(([id, review]) => ({
            id,
            ...review,
          }));
          setReviews(reviewsArray);
        }
      })
      .catch((error) => {
        console.error('Có lỗi khi lấy đánh giá từ Firebase:', error);
      });
  }, [productId]);

  // Cập nhật đánh giá vào Firebase
  const handleCommentSubmit = () => {
    if (rating === 0 || comment === '') {
      alert('Vui lòng chọn đánh giá và viết bình luận.');
      return;
    }

    // Tạo đánh giá mới
    const newReview = {
      productId,
      rating,
      comment,
      username: userName, // Thêm tên người dùng vào đánh giá
    };

    const reviewsRef = ref(database, 'reviews/' + productId); // Lưu đánh giá theo productId
    push(reviewsRef, newReview) // Thêm đánh giá mới vào Firebase
      .then((response) => {
        setReviews([...reviews, newReview]);
        setRating(0);
        setComment('');
      })
      .catch((error) => {
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
