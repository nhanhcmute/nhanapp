import React, { useState, useEffect, useRef } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  FiberManualRecord as DotIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";
import useAuthStore from "../../store/useAuthStore"; // Assuming you have this
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Get current user
  const intervalRef = useRef(null);

  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const [listRes, countRes] = await Promise.all([
        notificationService.getNotifications(user.id, 1, 10),
        notificationService.getUnreadCount(user.id),
      ]);

      if (listRes.status === 200) {
        setNotifications(listRes.data);
      }
      if (countRes.status === 200) {
        setUnreadCount(countRes.data.count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Polling every 60 seconds
      intervalRef.current = setInterval(fetchNotifications, 60000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Refresh list when opening
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    handleClose();
    
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ORDER_STATUS":
        return <ShippingIcon color="primary" />;
      case "PROMOTION":
        return <InfoIcon color="secondary" />;
      case "SYSTEM":
        return <InfoIcon color="action" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
            mt: 1.5,
            "& .MuiList-root": {
              padding: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead}>
              Đánh dấu đã đọc
            </Button>
          )}
        </Box>

        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Không có thông báo nào
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.isRead ? "transparent" : "action.hover",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "background.paper" }}>
                      {getIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{
                            display: "block",
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {!notification.isRead && (
                    <DotIcon
                      color="primary"
                      sx={{ fontSize: 12, mt: 1, ml: 1 }}
                    />
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>

        <Box
          sx={{
            p: 1,
            textAlign: "center",
            borderTop: "1px solid #eee",
          }}
        >
          <Button size="small" fullWidth onClick={() => navigate("/notifications")}>
            Xem tất cả
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;
