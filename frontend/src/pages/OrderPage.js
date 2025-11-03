import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Pagination, PaginationItem, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../components/layout/Sidebar'; 
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FaPaw } from 'react-icons/fa';
import useOrders from '../hooks/useOrder'; 

const OrderPage = () => {
  const orderStatuses = [
    { id: 1, status: 'Tất Cả' },
    { id: 2, status: 'Chờ xác nhận' },
    { id: 3, status: 'Chờ lấy hàng' },
    { id: 4, status: 'Chờ giao hàng' },
    { id: 5, status: 'Hoàn thành' },
    { id: 6, status: 'Đã Hủy' },
    { id: 7, status: 'Trả hàng/Hoàn tiền' },
  ];

  const { orders, loading } = useOrders(); 
  const [selectedStatus, setSelectedStatus] = useState('Tất Cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const filteredOrders = orders
  ? orders
      .filter((order) => selectedStatus === 'Tất Cả' || order.status === selectedStatus)
      .filter((order) => {
        const details = order.details ? order.details : ''; 
        const term = searchTerm ? searchTerm : ''; 
        return details.toLowerCase().includes(term.toLowerCase());
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
  : [];

  const totalPages = filteredOrders.length > 0 ? Math.ceil(filteredOrders.length / itemsPerPage) : 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return '#ff9800';
      case 'Chờ lấy hàng':
        return '#2196f3';
      case 'Chờ giao hàng':
        return '#9c27b0';
      case 'Hoàn thành':
        return '#4caf50';
      case 'Đã Hủy':
        return '#f44336';
      case 'Trả hàng/Hoàn tiền':
        return '#ff5722';
      default:
        return '#ff6b81';
    }
  };

  return (
    <Box
      display="flex"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
      }}
    >
      <Sidebar />
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
          <FaPaw size={32} color="#ff6b81" />
          <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700, textAlign: 'center' }}>
            📦 Quản lý Đơn Hàng
          </Typography>
          <FaPaw size={32} color="#ff6b81" />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <TextField
            label="🔍 Tìm kiếm đơn hàng"
            placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc tên sản phẩm..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#ff6b81' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
            {orderStatuses.map((status) => (
              <Button
                key={status.id}
                variant={selectedStatus === status.status ? 'contained' : 'outlined'}
                onClick={() => handleStatusChange(status.status)}
                sx={{
                  borderColor: '#ff6b81',
                  color: selectedStatus === status.status ? 'white' : '#ff6b81',
                  backgroundColor: selectedStatus === status.status ? '#ff6b81' : 'transparent',
                  borderRadius: '16px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff4757',
                    backgroundColor: selectedStatus === status.status ? '#ff4757' : 'rgba(255, 107, 129, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {status.status}
              </Button>
            ))}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Paper
                  elevation={0}
                  sx={{
                    padding: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '2px solid rgba(255, 107, 129, 0.2)',
                    boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                      borderColor: 'rgba(255, 107, 129, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <FaPaw size={20} color="#ff6b81" />
                    <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                      📦 ID Đơn hàng: {order.id}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={order.status}
                      sx={{
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                        px: 2,
                        borderRadius: '12px',
                      }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1, color: '#666', fontWeight: 600 }}>
                    💰 Tổng tiền: <span style={{ color: '#ff4757', fontSize: '18px' }}>
                      {order.totalAmount ? order.totalAmount.toLocaleString() : 'Không có dữ liệu'} VND
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    📅 Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Không có dữ liệu'}
                  </Typography>

                  {/* Kiểm tra nếu có sản phẩm trong đơn hàng */}
                  <Box mt={2}>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((product, idx) => (
                        <Paper
                          key={product.id || idx}
                          elevation={0}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 2,
                            padding: 2,
                            backgroundColor: 'rgba(255, 107, 129, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 107, 129, 0.2)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 129, 0.1)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={product.image || '/default-image.png'} 
                            alt={product.name}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              marginRight: 2,
                              borderRadius: '12px',
                              border: '2px solid rgba(255, 107, 129, 0.2)',
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                              Số lượng: {product.quantity} x {product.price ? product.price.toLocaleString() : 'Không có giá'} VND
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>
                              Tổng: {product.total ? product.total.toLocaleString() : 'Không có tổng'} VND
                            </Typography>
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
                        Không có sản phẩm trong đơn hàng này.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 107, 129, 0.2)',
                }}
              >
                <FaPaw size={48} color="#ff6b81" style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600 }}>
                  Không có đơn hàng nào
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  Không có đơn hàng nào với trạng thái này hoặc từ khóa tìm kiếm.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#ff6b81',
                borderColor: 'rgba(255, 107, 129, 0.3)',
                fontWeight: 600,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 129, 0.1)',
                  borderColor: '#ff6b81',
                },
                '&.Mui-selected': {
                  backgroundColor: '#ff6b81',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ff4757',
                  },
                },
              },
            }}
            showFirstButton
            showLastButton
            renderItem={(item) => (
              <PaginationItem
                {...item}
                slots={{
                  first: NavigateBeforeIcon,
                  last: NavigateNextIcon,
                }}
              />
            )}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default OrderPage;
