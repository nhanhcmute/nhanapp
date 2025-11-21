import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CardActions, Grid, CircularProgress, TextField, Button, Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, Chip, InputAdornment } from '@mui/material';
import { CSVLink } from 'react-csv';
import { adminOrderService } from '../../services/adminOrderService';
import { FaPaw } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';

// Import ảnh từ thư mục
const importImages = () => {
  const context = require.context("../../assets/images/products", false, /\.(png|jpe?g|svg)$/);
  const images = {};
  context.keys().forEach((key) => {
    const imageName = key.replace("./", "");
    images[imageName] = context(key);
  });
  return images;
};

const images = importImages();

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  const orderStatuses = [
    { id: 1, status: 'Tất Cả' },
    { id: 2, status: 'Chờ xác nhận' },
    { id: 3, status: 'Chờ lấy hàng' },
    { id: 4, status: 'Chờ giao hàng' },
    { id: 5, status: 'Hoàn thành' },
    { id: 6, status: 'Đã Hủy' },
    { id: 7, status: 'Trả hàng/Hoàn tiền' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await adminOrderService.getOrders({ page: 1, pageSize: 100 });
        
        if (result.status === 200 && result.data) {
          const ordersList = result.data.data || [];
          // Map status từ enum sang tiếng Việt
          const formattedOrders = ordersList.map(order => ({
            id: order.id,
            orderCode: order.orderCode,
            customer: {
              name: order.shippingFullName,
              phone: order.shippingPhone,
              address: `${order.shippingAddressLine}, ${order.shippingWard}, ${order.shippingDistrict}, ${order.shippingCity}`,
            },
            products: [], // Sẽ load từ order items nếu cần
            totalAmount: order.totalAmount,
            status: mapOrderStatus(order.status),
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
          }));
          setOrders(formattedOrders);
          setFilteredOrders(formattedOrders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Map order status từ enum (số hoặc string) sang tiếng Việt
  const mapOrderStatus = (status) => {
    // Nếu là số (enum value), map từ số sang enum string trước
    let statusKey = status;
    if (typeof status === 'number' || (typeof status === 'string' && /^\d+$/.test(status))) {
      const enumMap = {
        0: 'PENDING_PAYMENT',
        1: 'PENDING_CONFIRM',
        2: 'PAID',
        3: 'PROCESSING',
        4: 'SHIPPING',
        5: 'COMPLETED',
        6: 'CANCELLED',
        7: 'PAYMENT_FAILED',
      };
      statusKey = enumMap[parseInt(status)] || status;
    }
    
    const statusMap = {
      'PENDING_PAYMENT': 'Chờ thanh toán',
      'PENDING_CONFIRM': 'Chờ xác nhận',
      'PAID': 'Chờ lấy hàng',
      'PROCESSING': 'Chờ lấy hàng',
      'SHIPPING': 'Chờ giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã Hủy',
      'PAYMENT_FAILED': 'Thanh toán thất bại',
    };
    return statusMap[statusKey] || status;
  };

  // Map status tiếng Việt về enum
  const mapStatusToEnum = (status) => {
    const statusMap = {
      'Chờ thanh toán': 'PENDING_PAYMENT',
      'Chờ xác nhận': 'PENDING_CONFIRM',
      'Chờ lấy hàng': 'PROCESSING',
      'Chờ giao hàng': 'SHIPPING',
      'Hoàn thành': 'COMPLETED',
      'Đã Hủy': 'CANCELLED',
      'Trả hàng/Hoàn tiền': 'CANCELLED',
    };
    return statusMap[status] || status;
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(order =>
      (order.id && order.id.toString().includes(lowercasedQuery)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredOrders(filtered);
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenDialog(true);
  };

  const handleOpenDetailDialog = async (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
    
    // Load order details nếu chưa có products
    if (!order.products || order.products.length === 0) {
      try {
        setLoadingOrderDetails(true);
        const result = await adminOrderService.getOrderDetail(order.id);
        if (result.status === 200 && result.data) {
          const items = result.data.Items || result.data.items || [];
          const orderData = result.data.Order || result.data.order || {};
          
          setSelectedOrder({
            ...order,
            ...orderData,
            products: items,
            customer: order.customer || {
              name: orderData.shippingFullName || 'N/A',
              phone: orderData.shippingPhone || 'N/A',
              address: `${orderData.shippingAddressLine || ''}, ${orderData.shippingWard || ''}, ${orderData.shippingDistrict || ''}, ${orderData.shippingCity || ''}`.trim() || 'N/A',
            },
          });
        }
      } catch (error) {
        console.error('Error loading order details:', error);
      } finally {
        setLoadingOrderDetails(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDetailDialog(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleExportInvoice = async (order) => {
    try {
      // Load order details để lấy đầy đủ thông tin
      const result = await adminOrderService.getOrderDetail(order.id);
      let orderWithDetails = order;
      
      if (result.status === 200 && result.data) {
        const orderData = result.data.Order || result.data.order || {};
        const items = result.data.Items || result.data.items || [];
        
        orderWithDetails = {
          ...order,
          ...orderData,
          products: items,
          customer: order.customer || {
            name: orderData.shippingFullName || 'N/A',
            phone: orderData.shippingPhone || 'N/A',
            address: `${orderData.shippingAddressLine || ''}, ${orderData.shippingWard || ''}, ${orderData.shippingDistrict || ''}, ${orderData.shippingCity || ''}`.trim() || 'N/A',
          },
        };
      }

      // Tạo HTML cho hóa đơn
      const invoiceHTML = generateInvoiceHTML(orderWithDetails);
      
      // Mở cửa sổ mới với hóa đơn
      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Đợi một chút để content load xong rồi mới print
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error) {
      console.error('Lỗi khi xuất hóa đơn:', error);
      alert('Đã có lỗi khi xuất hóa đơn. Vui lòng thử lại.');
    }
  };

  const generateInvoiceHTML = (order) => {
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');
    const orderCode = order.orderCode || order.id;
    
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa đơn ${orderCode}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #ff6b81;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #ff6b81;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-section {
            flex: 1;
        }
        .info-section h3 {
            color: #ff6b81;
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 2px solid #ff6b81;
            padding-bottom: 5px;
        }
        .info-section p {
            margin: 5px 0;
            color: #333;
            font-size: 14px;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .products-table th {
            background: #ff6b81;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        .products-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .products-table tr:hover {
            background: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #ff6b81;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 16px;
        }
        .total-row.final {
            font-size: 24px;
            font-weight: bold;
            color: #ff6b81;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #ff6b81;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            color: white;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .invoice-container {
                box-shadow: none;
                padding: 20px;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>📦 HÓA ĐƠN BÁN HÀNG</h1>
            <p>Mã đơn hàng: <strong>${orderCode}</strong></p>
            <p>Ngày xuất: ${new Date().toLocaleString('vi-VN')}</p>
        </div>

        <div class="invoice-info">
            <div class="info-section">
                <h3>Thông tin khách hàng</h3>
                <p><strong>Tên:</strong> ${order.customer?.name || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> ${order.customer?.phone || 'N/A'}</p>
                <p><strong>Địa chỉ:</strong> ${order.customer?.address || 'N/A'}</p>
            </div>
            <div class="info-section">
                <h3>Thông tin đơn hàng</h3>
                <p><strong>Ngày đặt:</strong> ${orderDate}</p>
                <p><strong>Trạng thái:</strong> <span class="status-badge" style="background: ${getStatusColor(order.status)};">${order.status}</span></p>
                <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod || 'N/A'}</p>
            </div>
        </div>

        <table class="products-table">
            <thead>
                <tr>
                    <th style="width: 5%;">STT</th>
                    <th style="width: 40%;">Tên sản phẩm</th>
                    <th style="width: 15%;" class="text-center">Số lượng</th>
                    <th style="width: 20%;" class="text-right">Đơn giá</th>
                    <th style="width: 20%;" class="text-right">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${(order.products && order.products.length > 0 ? order.products : []).map((product, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${product.name || product.productName || 'N/A'}</td>
                        <td class="text-center">${product.quantity || 0}</td>
                        <td class="text-right">${(product.unitPrice || product.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                        <td class="text-right">${(product.totalPrice || (product.quantity || 0) * (product.unitPrice || product.price || 0)).toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span>Tạm tính:</span>
                <span>${(order.subtotalAmount || order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</span>
            </div>
            ${order.shippingFee ? `
            <div class="total-row">
                <span>Phí vận chuyển:</span>
                <span>${order.shippingFee.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            ` : ''}
            ${order.discountAmount ? `
            <div class="total-row">
                <span>Giảm giá:</span>
                <span>-${order.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            ` : ''}
            <div class="total-row final">
                <span>TỔNG CỘNG:</span>
                <span>${(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</span>
            </div>
        </div>

        <div class="footer">
            <p>Cảm ơn quý khách đã mua hàng!</p>
            <p>Mọi thắc mắc vui lòng liên hệ hotline: 0396922376</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  const handleChangeStatus = async () => {
    if (selectedOrder && newStatus) {
      try {
        const statusEnum = mapStatusToEnum(newStatus);
        const result = await adminOrderService.updateOrder(selectedOrder.id, {
          status: statusEnum,
        });

        if (result.status === 200) {
          // Cập nhật trạng thái trong frontend
          const updatedOrders = orders.map(order =>
            order.id === selectedOrder.id ? { ...order, status: newStatus } : order
          );
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);

          alert('Cập nhật trạng thái đơn hàng thành công');
          handleCloseDialog();
        } else {
          alert(result.message || 'Đã có lỗi khi cập nhật trạng thái đơn hàng.');
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        alert('Đã có lỗi khi cập nhật trạng thái đơn hàng.');
      }
    }
  };

  const csvHeaders = [
    { label: 'Mã Đơn Hàng', key: 'id' },
    { label: 'Tên Khách Hàng', key: 'customer.name' },
    { label: 'Tổng Số Tiền', key: 'total' },
    { label: 'Trạng Thái', key: 'status' },
  ];

  const csvData = filteredOrders.map((order) => ({
    id: order.id,
    'customer.name': order.customer?.name || 'N/A',
    total: order.total || 0,
    status: order.status || 'N/A',
  }));
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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#ff6b81' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
        py: 4,
      }}
    >
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
          <FaPaw size={32} color="#ff6b81" />
          <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700, textAlign: 'center' }}>
            📦 Quản lý Đơn Hàng
          </Typography>
          <FaPaw size={32} color="#ff6b81" />
        </Box>

        {/* Tìm kiếm đơn hàng */}
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Tìm kiếm theo mã đơn hàng, tên khách hàng"
                placeholder="Nhập mã đơn hàng hoặc tên khách hàng..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                sx={{
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                sx={{
                  height: "56px",
                  backgroundColor: '#ff6b81',
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                  '&:hover': {
                    backgroundColor: '#ff4757',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                🔍 Tìm kiếm
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Danh sách đơn hàng */}
        <Grid container spacing={3}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card
                  elevation={0}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '2px solid rgba(255, 107, 129, 0.2)',
                    boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                      borderColor: 'rgba(255, 107, 129, 0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FaPaw size={16} color="#ff6b81" />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                        📦 {order.orderCode || order.id}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1, color: '#666', fontWeight: 600 }}>
                      👤 {order.customer?.name || 'Chưa có tên'}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                      📞 {order.customer?.phone || 'Chưa có số điện thoại'}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2, color: '#666', 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      📍 {order.customer?.address || 'Chưa có địa chỉ'}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={order.status}
                        sx={{
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '12px',
                          borderRadius: '12px',
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff4757' }}>
                      💰 {order.totalAmount ? order.totalAmount.toLocaleString() : '0'} VNĐ
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenDialog(order)}
                          sx={{
                            backgroundColor: '#2196f3',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '12px',
                            minHeight: '44px',
                            height: '44px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            '&:hover': {
                              backgroundColor: '#1976d2',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box component="span" sx={{ fontSize: '16px', lineHeight: 1 }}>✏️</Box>
                          <Box component="span" sx={{ fontSize: '11px', lineHeight: 1 }}>Trạng thái</Box>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenDetailDialog(order)}
                          sx={{
                            backgroundColor: '#ff6b81',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '12px',
                            minHeight: '44px',
                            height: '44px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            '&:hover': {
                              backgroundColor: '#ff4757',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box component="span" sx={{ fontSize: '16px', lineHeight: 1 }}>👁️</Box>
                          <Box component="span" sx={{ fontSize: '11px', lineHeight: 1 }}>Chi tiết</Box>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleExportInvoice(order)}
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '12px',
                            minHeight: '44px',
                            height: '44px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            '&:hover': {
                              backgroundColor: '#45a049',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box component="span" sx={{ fontSize: '16px', lineHeight: 1 }}>🧾</Box>
                          <Box component="span" sx={{ fontSize: '11px', lineHeight: 1 }}>Hóa đơn</Box>
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
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
                  Không có đơn hàng nào phù hợp với tìm kiếm của bạn.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>


        {/* Xuất dữ liệu CSV */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
          }}
        >
          <CSVLink
            data={filteredOrders}
            filename={`orders-${new Date().toLocaleDateString()}.csv`}
            className="csv-link"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                borderRadius: '16px',
                py: 1.5,
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  backgroundColor: '#45a049',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              📥 Xuất dữ liệu CSV
            </Button>
          </CSVLink>
        </Paper>

        {/* Dialog thay đổi trạng thái */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#ff6b81', fontWeight: 700 }}>
            ✏️ Thay đổi trạng thái đơn hàng
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel sx={{ color: '#ff6b81' }}>Chọn trạng thái mới</InputLabel>
              <Select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                label="Chọn trạng thái mới"
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 129, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b81',
                  },
                }}
              >
                {orderStatuses.map(status => (
                  <MenuItem key={status.id} value={status.status}>
                    {status.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                color: '#666',
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleChangeStatus}
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: '#ff4757',
                },
              }}
            >
              💾 Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog chi tiết đơn hàng */}
        <Dialog 
          open={openDetailDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#ff6b81', fontWeight: 700 }}>
            👁️ Chi tiết đơn hàng
          </DialogTitle>
          <DialogContent>
            {loadingOrderDetails ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#ff6b81' }} />
              </Box>
            ) : selectedOrder ? (
              <Box sx={{ mt: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'rgba(255, 107, 129, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 107, 129, 0.2)',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700, mb: 1 }}>
                    📦 Mã đơn hàng: {selectedOrder.orderCode || selectedOrder.id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    👤 <strong>Tên khách hàng:</strong> {selectedOrder.customer?.name || 'Chưa có tên'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📞 <strong>Số điện thoại:</strong> {selectedOrder.customer?.phone || 'Chưa có số điện thoại'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📍 <strong>Địa chỉ:</strong> {selectedOrder.customer?.address || 'Chưa có địa chỉ'}
                  </Typography>
                </Paper>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#ff6b81' }}>
                    🛍️ Sản phẩm:
                  </Typography>
                  {selectedOrder.products && selectedOrder.products.length > 0 ? (
                    <Box sx={{ pl: 2 }}>
                      {selectedOrder.products.map((product, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            backgroundColor: 'rgba(255, 107, 129, 0.03)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 107, 129, 0.1)',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            {(() => {
                              const imageName = product.image || product.Image;
                              let imageSrc = null;
                              
                              if (imageName) {
                                // Nếu là base64, dùng trực tiếp
                                if (imageName.startsWith('data:image') || imageName.startsWith('http')) {
                                  imageSrc = imageName;
                                } else {
                                  // Nếu là tên file, tìm trong images object (đã import từ assets)
                                  const imagePath = images[imageName];
                                  if (imagePath) {
                                    imageSrc = imagePath;
                                  }
                                }
                              }
                              
                              // Nếu có imageSrc, hiển thị ảnh
                              if (imageSrc) {
                                return (
                                  <Box
                                    component="img"
                                    src={imageSrc}
                                    alt={product.name || product.productName || 'Product'}
                                    onError={(e) => {
                                      // Ẩn img và hiển thị placeholder
                                      e.target.style.display = 'none';
                                    }}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      border: '2px solid rgba(255, 107, 129, 0.2)',
                                      flexShrink: 0,
                                    }}
                                  />
                                );
                              }
                              
                              // Nếu không có ảnh, hiển thị placeholder với icon
                              return (
                                <Box
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '8px',
                                    border: '2px solid rgba(255, 107, 129, 0.2)',
                                    backgroundColor: 'rgba(255, 107, 129, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <FaPaw size={32} color="#ff6b81" style={{ opacity: 0.5 }} />
                                </Box>
                              );
                            })()}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                {product.name || product.productName || 'N/A'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Số lượng: {product.quantity || 0} x {(product.unitPrice || product.price || 0).toLocaleString('vi-VN')} VNĐ
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600, mt: 0.5 }}>
                                Thành tiền: {(product.totalPrice || (product.quantity || 0) * (product.unitPrice || product.price || 0)).toLocaleString('vi-VN')} VNĐ
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#666', pl: 2 }}>
                      Không có sản phẩm
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff4757' }}>
                    💰 Tổng giá trị: {selectedOrder.totalAmount ? selectedOrder.totalAmount.toLocaleString() : '0'} VNĐ
                  </Typography>

                </Box>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: '#666' }}>
                Không có thông tin chi tiết đơn hàng.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: '#ff6b81',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: '#ff4757',
                },
              }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Orders;
