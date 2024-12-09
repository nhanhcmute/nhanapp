import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationRole, setNotificationRole] = useState("admin");
  const [roles] = useState(["admin", "staff"]);
  const [editNotification, setEditNotification] = useState(null);
  const baseUrl = "http://localhost:5000"; // Đảm bảo URL API chính xác

  // Lấy danh sách thông báo
  useEffect(() => {
    axios.get(`${baseUrl}/notifications`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  // Mở modal gửi thông báo
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Đóng modal gửi thông báo
  const handleCloseModal = () => {
    setOpenModal(false);
    setNotificationMessage("");
    setNotificationRole("admin");
  };

  // Mở modal sửa thông báo
  const handleOpenEditDialog = (notification) => {
    setEditNotification(notification);
    setNotificationMessage(notification.message);
    setNotificationRole(notification.role);
    setOpenEditDialog(true);
  };

  // Đóng modal sửa thông báo
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditNotification(null);
  };

  // Gửi thông báo mới
  const handleSendNotification = () => {
    if (!notificationMessage) {
      toast.error("Nội dung thông báo không được để trống!");
      return;
    }

    axios.post(`${baseUrl}/notifications`, {
      message: notificationMessage,
      role: notificationRole,
    })
    .then((response) => {
      setNotifications([...notifications, response.data]);
      toast.success("Thông báo đã được gửi thành công!");
      handleCloseModal();
    })
    .catch((error) => {
      toast.error("Gửi thông báo thất bại!");
      console.error("Error sending notification:", error);
    });
  };

  // Sửa thông báo
  const handleEditNotification = () => {
    if (!notificationMessage) {
      toast.error("Nội dung thông báo không được để trống!");
      return;
    }

    axios.put(`${baseUrl}/notifications/${editNotification.id}`, {
      message: notificationMessage,
      role: notificationRole,
    })
    .then((response) => {
      const updatedNotifications = notifications.map((notif) => 
        notif.id === editNotification.id ? response.data : notif
      );
      setNotifications(updatedNotifications);
      toast.success("Thông báo đã được sửa thành công!");
      handleCloseEditDialog();
    })
    .catch((error) => {
      toast.error("Sửa thông báo thất bại!");
      console.error("Error editing notification:", error);
    });
  };

  // Xóa thông báo
  const handleDeleteNotification = (id) => {
    axios.delete(`${baseUrl}/notifications/${id}`)
      .then(() => {
        setNotifications(notifications.filter((notif) => notif.id !== id));
        toast.success("Thông báo đã được xóa thành công!");
      })
      .catch((error) => {
        toast.error("Xóa thông báo thất bại!");
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Quản lý Thông báo
      </Typography>

      {/* Nút gửi thông báo */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpenModal}
        sx={{ marginBottom: 3 }}
      >
        Gửi thông báo
      </Button>

      {/* Danh sách thông báo */}
      <TableContainer sx={{ marginTop: 3, boxShadow: 3, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Thông báo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vai trò nhận thông báo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{notification.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenEditDialog(notification)}
                    startIcon={<Edit />}
                    sx={{ marginRight: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteNotification(notification.id)}
                    startIcon={<Delete />}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal để gửi thông báo */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ padding: 3, margin: "auto", maxWidth: 400, backgroundColor: "white", marginTop: 5, boxShadow: 5, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gửi thông báo mới
          </Typography>

          <TextField
            fullWidth
            label="Nội dung thông báo"
            multiline
            rows={4}
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Vai trò nhận thông báo</InputLabel>
            <Select
              value={notificationRole}
              onChange={(e) => setNotificationRole(e.target.value)}
              label="Vai trò"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="contained" color="primary" onClick={handleSendNotification}>Gửi</Button>
          </Box>
        </Box>
      </Modal>

      {/* Dialog để sửa thông báo */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Sửa Thông Báo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nội dung thông báo"
            multiline
            rows={4}
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Vai trò nhận thông báo</InputLabel>
            <Select
              value={notificationRole}
              onChange={(e) => setNotificationRole(e.target.value)}
              label="Vai trò"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">Hủy</Button>
          <Button onClick={handleEditNotification} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;
