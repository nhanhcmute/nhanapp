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

const NotificationsPage = () => {
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
        toast.error("Failed to load notifications!");
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
      toast.error("Please enter a title and message!");
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
        toast.success("Notification updated successfully!");
        handleCloseModal();
      } else {
        // Add new notification
        const docRef = await addDoc(collection(database, "notifications"), newNotification);
        setNotifications([
          { id: docRef.id, ...newNotification },
          ...notifications,
        ]);
        toast.success("Notification sent successfully!");
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Failed to send notification!");
      console.error("Error sending notification:", error);
    }
  };

  // Delete notification from Firestore
  const handleDeleteNotification = async (id) => {
    try {
      await deleteDoc(doc(database, "notifications", id));
      setNotifications(notifications.filter((notif) => notif.id !== id));
      toast.success("Notification deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete notification!");
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Manage Notifications
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
        Send Notification
      </Button>

      <TableContainer sx={{ marginTop: 3, boxShadow: 3, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{notification.role}</TableCell>
                <TableCell>
                  {notification.timestamp
                    ? new Date(notification.timestamp).toLocaleString()
                    : "No timestamp"}
                </TableCell>
                <TableCell>
                  {notification.isRead ? "Read" : "Unread"}
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
          sx={{
            padding: 3,
            margin: "auto",
            maxWidth: 500,
            backgroundColor: "white",
            marginTop: 5,
            boxShadow: 5,
            borderRadius: 2,
          }}
        >
          <Card variant="outlined" sx={{ padding: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingNotificationId ? "Edit Notification" : "Send New Notification"}
              </Typography>
              <TextField
                fullWidth
                label="Title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={notificationRole}
                  onChange={(e) => setNotificationRole(e.target.value)}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendNotification}
                >
                  {editingNotificationId ? "Update" : "Send"}
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
