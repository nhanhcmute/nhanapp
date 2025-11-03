import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, List, ListItem, ListItemText, IconButton, Paper, Divider, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from '../components/layout/Sidebar';
import { ref, onValue, update, remove } from "firebase/database";
import { database } from '../firebaseConfig';
import { FaPaw } from 'react-icons/fa'; 

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy dữ liệu từ Firebase
  useEffect(() => {
    const notificationsRef = ref(database, "notifications");

    onValue(
      notificationsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Chuyển dữ liệu từ object thành array
          const alertsArray = Object.entries(data).map(([id, value]) => ({
            id, // Thêm id từ key của Firebase
            ...value,
          }));
          
          // Kiểm tra và chuyển đổi timestamp thành số hợp lệ
          const alertsWithValidTimestamp = alertsArray.map((alert) => {
            const timestamp = alert.timestamp;
            // Kiểm tra xem timestamp có phải là số hợp lệ không
            const validTimestamp = isNaN(new Date(timestamp).getTime()) ? 0 : new Date(timestamp).getTime(); // Nếu không hợp lệ thì đặt thành 0
            return { ...alert, timestamp: validTimestamp };
          });

          // Sắp xếp thông báo theo thời gian
          const sortedAlerts = alertsWithValidTimestamp.sort(
            (a, b) => b.timestamp - a.timestamp
          );
          setAlerts(sortedAlerts);
        } else {
          setAlerts([]);
        }
        setLoading(false);
      },
      (error) => {
        setError("Không thể tải thông báo, vui lòng thử lại sau.");
        setLoading(false);
        console.error("Lỗi khi lấy dữ liệu Firebase:", error);
      }
    );
  }, []);

  // Đánh dấu đã đọc hoặc chưa đọc
  const handleMarkAsRead = (id, isRead) => {
    // Cập nhật trạng thái trong UI
    const updatedAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, isRead: !isRead } : alert
    );
    setAlerts(updatedAlerts);

    // Cập nhật trong Firebase
    const notificationRef = ref(database, `notifications/${id}`);
    update(notificationRef, { isRead: !isRead })
      .then(() => {
        console.log(`Thông báo ${id} đã cập nhật trạng thái.`);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
      });
  };

  // Xóa thông báo theo ID
  const handleDeleteAlert = (id) => {
    // Cập nhật giao diện (loại bỏ thông báo đã xóa)
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));

    // Xóa thông báo từ Firebase
    const notificationRef = ref(database, `notifications/${id}`);
    remove(notificationRef)
      .then(() => {
        console.log(`Thông báo ${id} đã được xóa khỏi Firebase`);
      })
      .catch((error) => {
        console.error(`Lỗi khi xóa thông báo ${id} từ Firebase:`, error);
      });
  };

  // Xóa tất cả thông báo đã đọc
  const handleDeleteReadAlerts = () => {
    const readAlerts = alerts.filter(alert => alert.isRead);
    readAlerts.forEach(alert => {
      const notificationRef = ref(database, `notifications/${alert.id}`);
      remove(notificationRef)
        .then(() => {
          console.log(`Thông báo ${alert.id} đã được xóa`);
        })
        .catch((error) => {
          console.error(`Lỗi khi xóa thông báo ${alert.id}:`, error);
        });
    });

    // Cập nhật UI sau khi xóa thông báo đã đọc
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => !alert.isRead));
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllAsRead = () => {
    const updates = {};
    alerts.forEach((alert) => {
      if (!alert.isRead) {
        updates[`notifications/${alert.id}/isRead`] = true;
      }
    });

    const updatedAlerts = alerts.map((alert) => ({ ...alert, isRead: true }));
    setAlerts(updatedAlerts);

    update(ref(database), updates).catch((error) => {
      console.error("Lỗi khi đánh dấu tất cả là đã đọc:", error);
    });
  };

  // Cập nhật số lượng thông báo chưa đọc
  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  // Hàm xử lý hiển thị thời gian hợp lệ
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Ngày không hợp lệ' : date.toLocaleString();
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
      <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FaPaw size={32} color="#ff6b81" />
            <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
              🔔 Thông Báo
            </Typography>
            <FaPaw size={32} color="#ff6b81" />
          </Box>
          <Typography variant="body1" sx={{ color: '#666', fontWeight: 600 }}>
            {unreadCount} thông báo chưa đọc 🐾
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <FaPaw size={32} color="#ff6b81" />
              <CircularProgress sx={{ color: '#ff6b81' }} />
              <FaPaw size={32} color="#ff6b81" />
            </Box>
            <Typography sx={{ color: '#ff6b81', fontWeight: 600, mt: 2 }}>
              Đang tải thông báo...
            </Typography>
          </Box>
        ) : error ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 71, 87, 0.1)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 71, 87, 0.2)',
            }}
          >
            <Typography variant="body1" sx={{ color: '#ff4757', fontWeight: 600 }}>
              {error}
            </Typography>
          </Paper>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              padding: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '2px solid rgba(255, 107, 129, 0.2)',
              boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
            }}
          >
            {alerts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <FaPaw size={64} color="#ff6b81" style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 1 }}>
                  Không có thông báo nào
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Bạn chưa có thông báo nào. 🐾
                </Typography>
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={handleMarkAllAsRead}
                  startIcon={<NotificationsIcon />}
                  sx={{
                    marginBottom: 3,
                    backgroundColor: '#ff6b81',
                    color: 'white',
                    borderRadius: '16px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                    '&:hover': {
                      backgroundColor: '#ff4757',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  🐾 Đánh dấu tất cả là đã đọc
                </Button>

                <List>
                  {alerts.map((alert) => (
                    <ListItem
                      key={alert.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alert.isRead 
                          ? 'rgba(255, 255, 255, 0.5)' 
                          : 'rgba(255, 107, 129, 0.1)',
                        marginBottom: 2,
                        borderRadius: '16px',
                        border: '2px solid rgba(255, 107, 129, 0.2)',
                        boxShadow: alert.isRead 
                          ? '0 2px 8px rgba(255, 107, 129, 0.1)' 
                          : '0 4px 12px rgba(255, 107, 129, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: '0 6px 16px rgba(255, 107, 129, 0.3)',
                          borderColor: 'rgba(255, 107, 129, 0.4)',
                        },
                      }}
                    >
                      <Checkbox
                        checked={alert.isRead}
                        onChange={() => handleMarkAsRead(alert.id, alert.isRead)}
                        sx={{
                          marginRight: 2,
                          color: '#ff6b81',
                          '&.Mui-checked': {
                            color: '#ff6b81',
                          },
                        }}
                      />
                      <ListItemText
                        primary={alert.title}
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ color: alert.isRead ? '#666' : '#333', mb: 0.5, lineHeight: 1.6 }}>
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FaPaw size={12} color="#ff6b81" />
                              {formatTimestamp(alert.timestamp)}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{
                          fontWeight: alert.isRead ? 500 : 700,
                          color: alert.isRead ? '#666' : '#ff6b81',
                        }}
                      />
                      <IconButton
                        onClick={() => handleDeleteAlert(alert.id)}
                        sx={{
                          marginLeft: 'auto',
                          color: '#ff4757',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 71, 87, 0.1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ margin: '24px 0', borderColor: 'rgba(255, 107, 129, 0.2)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteReadAlerts}
                    sx={{
                      borderColor: '#ff4757',
                      color: '#ff4757',
                      borderRadius: '16px',
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#ff4757',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🗑️ Xóa thông báo đã đọc
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Alerts;
