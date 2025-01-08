import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, List, ListItem, ListItemText, IconButton, Paper, Divider, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../../function/Sidebar';
import { ref, onValue, update, remove } from "firebase/database";
import { database } from '../../firebaseConfig'; // Đường dẫn file cấu hình Firebase

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
    <Box display="flex">
      <Sidebar />
      <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto', flexGrow: 1 }}>
        <Box sx={{ width: '100%', padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Thông Báo
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {unreadCount} thông báo chưa đọc
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
            {error}
          </Typography>
        ) : (
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            {alerts.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#888', marginTop: 2 }}>
                Không có thông báo nào.
              </Typography>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMarkAllAsRead}
                  sx={{ marginBottom: 2 }}
                >
                  Đánh dấu tất cả là đã đọc
                </Button>

                <List>
                  {alerts.map((alert) => (
                    <ListItem
                      key={alert.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alert.isRead ? '#f5f5f5' : '#e8f5e9',
                        marginBottom: 2,
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    >
                      <Checkbox
                        checked={alert.isRead}
                        onChange={() => handleMarkAsRead(alert.id, alert.isRead)} // Cập nhật trạng thái checkbox khi thay đổi
                        sx={{ marginRight: 2 }}
                      />
                      <ListItemText
                        primary={alert.title}
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ color: alert.isRead ? 'text.secondary' : 'text.primary' }}>
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888', marginTop: 1 }}>
                              {formatTimestamp(alert.timestamp)} {/* Sử dụng hàm formatTimestamp */}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{
                          fontWeight: alert.isRead ? 'normal' : 'bold',
                          color: alert.isRead ? 'text.secondary' : 'text.primary',
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteAlert(alert.id)} // Gọi hàm xóa theo ID
                        sx={{ marginLeft: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ margin: '16px 0' }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton color="error" onClick={handleDeleteReadAlerts}>
                    <DeleteIcon />
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                      Xóa thông báo đã đọc
                    </Typography>
                  </IconButton>
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
