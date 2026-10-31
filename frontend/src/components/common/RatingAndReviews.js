import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Rating, Divider, Stack, Paper, Chip, Avatar } from '@mui/material';
import { ref, get, set, push } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { FaPaw } from 'react-icons/fa';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { useLanguage } from '../../i18n/LanguageContext';

const RatingAndReviews = ({ productId }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState(''); 

  // Các bình luận mẫu
  const sampleComments = t('shop.reviews.samples');

  // Lấy thông tin người dùng từ localStorage sau khi đăng nhập
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
    if (user) {
      setUserName(user.name || user.username); // Cập nhật tên người dùng
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
      alert(t('shop.reviews.needRatingAndComment'));
      return;
    }

    // Tạo đánh giá mới
    const newReview = {
      productId,
      rating,
      comment,
      username: userName,
      createdAt: new Date().toISOString(),
    };

    const reviewsRef = ref(database, 'reviews/' + productId); // Lưu đánh giá theo productId
    push(reviewsRef, newReview) // Thêm đánh giá mới vào Firebase
      .then((response) => {
        setReviews([...reviews, { ...newReview, id: response.key }]);
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

  // Lấy màu cho rating
  const getRatingColor = (value) => {
    if (value >= 4) return '#4caf50';
    if (value >= 3) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ marginTop: 5 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '2px solid rgba(255, 107, 129, 0.2)',
          boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <FaPaw size={28} color="#ff6b81" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff6b81' }}>
            {`⭐ ${t('shop.reviews.title')}`}
          </Typography>
          <FaPaw size={28} color="#ff6b81" />
        </Box>

        {/* Hiển thị các đánh giá hiện tại */}
        {reviews.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff6b81', mb: 2 }}>
              {`💬 ${t('shop.reviews.comments', { n: reviews.length })}`}
            </Typography>
            {reviews.map((review, index) => (
              <Paper
                key={review.id || index}
                elevation={0}
                sx={{
                  mb: 3,
                  p: 3,
                  backgroundColor: 'rgba(255, 107, 129, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 107, 129, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 129, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: '#ff6b81',
                      width: 48,
                      height: 48,
                    }}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                      {review.username || t('shop.reviews.anonymous')} 🐾
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: getRatingColor(review.rating),
                          },
                        }}
                      />
                      <Chip
                        label={review.rating} 
                        size="small"
                        sx={{
                          backgroundColor: getRatingColor(review.rating),
                          color: 'white',
                          fontWeight: 700,
                          height: '20px',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666', 
                    lineHeight: 1.8,
                    pl: 7,
                  }}
                >
                  {review.comment}
                </Typography>
                {review.createdAt && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#999', 
                      pl: 7,
                      display: 'block',
                      mt: 1,
                    }}
                  >
                    📅 {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                )}
                {index < reviews.length - 1 && (
                  <Divider sx={{ marginTop: 2, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, mb: 4 }}>
            <FaPaw size={48} color="#ff6b81" style={{ opacity: 0.3, marginBottom: 16 }} />
            <Typography variant="body1" sx={{ color: '#666' }}>
              {t('shop.reviews.none')}
            </Typography>
          </Box>
        )}

        {/* Form đánh giá */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff6b81', mb: 3 }}>
            {`✍️ ${t('shop.reviews.write')}`}
          </Typography>
          
          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#666', mb: 1 }}>
              {t('shop.reviews.rate')}
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#ff6b81',
                },
                '& .MuiRating-iconHover': {
                  color: '#ff4757',
                },
              }}
            />
          </Box>

          {/* Comment */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#666', mb: 1 }}>
              {t('shop.reviews.comment')}
            </Typography>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder={t('shop.reviews.placeholder')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff6b81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff6b81',
                },
              }}
            />
          </Box>

          {/* Sample Comments */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#666', mb: 2 }}>
              {`💡 ${t('shop.reviews.pickSample')}`}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {sampleComments.map((sample, index) => (
                <Chip
                  key={index}
                  label={sample}
                  onClick={() => handleSampleComment(sample)}
                  sx={{
                    backgroundColor: 'rgba(255, 107, 129, 0.1)',
                    color: '#ff6b81',
                    border: '1px solid rgba(255, 107, 129, 0.3)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 129, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Submit Button */}
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            startIcon={<SendIcon />}
            fullWidth
            disabled={rating === 0 || comment === ''}
            sx={{
              backgroundColor: '#ff6b81',
              color: 'white',
              borderRadius: '16px',
              py: 1.5,
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
              '&:hover': {
                backgroundColor: '#ff4757',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 107, 129, 0.3)',
                color: 'white',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {`🐾 ${t('shop.reviews.submit')}`}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RatingAndReviews;
