import React, { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";  
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Grid } from "@mui/material";
import { useLanguage } from '../../i18n/LanguageContext';

const NotificationsPage = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationRole, setNotificationRole] = useState("admin");
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [roles] = useState(["admin", "staff"]);

  // Fetch notifications from Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "notifications"));
        const notificationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort notifications by timestamp
        notificationsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(notificationsList);
      } catch (error) {
        toast.error(t('admin.notifications.loadFailed'));
        console.error("Error fetching notifications:", error);
      }
    };
    
    fetchNotifications();
  }, []);

  // Open/Close Modal
  const handleOpenModal = (notification = null) => {
    if (notification) {
      // If editing an existing notification
      setEditingNotificationId(notification.id);
      setNotificationTitle(notification.title);
      setNotificationMessage(notification.message);
      setNotificationRole(notification.role);
    } else {
      // If adding a new notification
      setEditingNotificationId(null);
      resetForm();
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationRole("admin");
  };

  // Add or Update notification in Firestore
  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error(t('admin.notifications.needFields'));
      return;
    }

    const newNotification = {
      title: notificationTitle,
      message: notificationMessage,
      role: notificationRole,
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    try {
      if (editingNotificationId) {
        // Update notification
        const notificationRef = doc(database, "notifications", editingNotificationId);
        await updateDoc(notificationRef, newNotification);
        setNotifications(
          notifications.map((notif) =>
            notif.id === editingNotificationId ? { ...notif, ...newNotification } : notif
          )
        );
        toast.success(t('admin.notifications.updated'));
        handleCloseModal();
      } else {
        // Add new notification
        const docRef = await addDoc(collection(database, "notifications"), newNotification);
        setNotifications([
          { id: docRef.id, ...newNotification },
          ...notifications,
        ]);
        toast.success(t('admin.notifications.sent'));
        handleCloseModal();
      }
    } catch (error) {
      toast.error(t('admin.notifications.sendFailed'));
      console.error("Error sending notification:", error);
    }
  };

  // Delete notification from Firestore
  const handleDeleteNotification = async (id) => {
    try {
      await deleteDoc(doc(database, "notifications", id));
      setNotifications(notifications.filter((notif) => notif.id !== id));
      toast.success(t('admin.notifications.deleted'));
    } catch (error) {
      toast.error(t('admin.notifications.deleteFailed'));
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        {t('admin.notifications.title')}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenModal()}
        sx={{
          marginBottom: 3,
          boxShadow: 3,
          borderRadius: 2,
          fontSize: 16,
          padding: "10px 20px",
        }}
      >
        {t('admin.notifications.send')}
      </Button>

      <TableContainer sx={{ marginTop: 3, boxShadow: 3, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.notifications.cols.title')}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.notifications.cols.message')}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.notifications.cols.role')}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.notifications.cols.time')}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.notifications.cols.status')}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t('admin.common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notification.title}</TableCell>
                <TableCell sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notification.message}</TableCell>
                <TableCell>{t('admin.notifications.roles')[notification.role] || notification.role}</TableCell>
                <TableCell>
                  {notification.timestamp
                    ? new Date(notification.timestamp).toLocaleString()
                    : t('admin.notifications.noTimestamp')}
                </TableCell>
                <TableCell>
                  {notification.isRead ? t('admin.notifications.read') : t('admin.notifications.unread')}
                </TableCell>
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(notification)}
                      >
                        <Edit />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for adding/editing notification */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="responsive-modal"
          sx={{
            padding: 3,
            backgroundColor: "white",
            boxShadow: 5,
            borderRadius: 2,
          }}
        >
          <Card variant="outlined" sx={{ padding: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingNotificationId ? t('admin.notifications.editTitle') : t('admin.notifications.newTitle')}
              </Typography>
              <TextField
                fullWidth
                label={t('admin.notifications.titleLabel')}
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label={t('admin.notifications.message')}
                multiline
                rows={4}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>{t('admin.notifications.role')}</InputLabel>
                <Select
                  value={notificationRole}
                  onChange={(e) => setNotificationRole(e.target.value)}
                  label={t('admin.notifications.role')}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {t('admin.notifications.roles')[role] || role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  {t('admin.common.cancel')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendNotification}
                >
                  {editingNotificationId ? t('admin.notifications.update') : t('admin.notifications.sendShort')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default NotificationsPage;
