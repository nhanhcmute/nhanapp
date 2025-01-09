import React, { useState, useEffect } from 'react';
import {
    TextField, InputAdornment, Menu, IconButton, Divider, MenuItem, Avatar,
    AppBar, Toolbar, Button, Box, Badge, ListItemText, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useCart } from './function/CartContext';
import { database, ref, get, query, orderByChild } from './firebaseConfig';
import { update } from "firebase/database";


import axios from 'axios';
import logo from './asset/images/logo.png';

function Header() {
    const navigate = useNavigate();
    const { cart, getTotalQuantity } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const openNotificationMenu = Boolean(anchorElNotification);
    const openUserMenu = Boolean(anchorElUser);

    // Lấy thông tin user từ localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Lấy dữ liệu thông báo từ API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Tham chiếu đến đường dẫn 'notifications' trong Realtime Database
                const notificationsRef = ref(database, 'notifications');
                const q = query(notificationsRef, orderByChild('timestamp')); // Sắp xếp theo timestamp

                // Lấy dữ liệu từ Realtime Database
                const snapshot = await get(q);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const notificationsData = Object.keys(data).map((key) => ({
                        id: key, // Lấy ID của mỗi thông báo
                        ...data[key],
                        isRead: data[key].isRead || false, // Đảm bảo có trường isRead
                    }));

                    // Sắp xếp dữ liệu theo timestamp giảm dần (mới đến cũ)
                    const sortedNotifications = notificationsData.sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    );

                    setAlerts(sortedNotifications);
                } else {
                    console.log('Không có thông báo nào.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông báo từ Realtime Database:', error);
            }
        };

        fetchNotifications();
    }, []);

    // Tính số lượng thông báo chưa đọc
    const unreadCount = alerts.filter((alert) => !alert.isRead).length;
    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalQuantity = getTotalQuantity();
    // Xử lý mở menu thông báo
    const handleClickNotification = (event) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNotification = () => {
        setAnchorElNotification(null);
    };

    // Xử lý mở menu user
    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };

    // Điều hướng khi tìm kiếm
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    // Đăng xuất người dùng
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Hàm cập nhật trạng thái thông báo là đã đọc
    const handleMarkAsRead = (alertId) => {
        // Cập nhật trong state trước
        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
                alert.id === alertId ? { ...alert, isRead: true } : alert
            )
        );

        // Tạo tham chiếu đến thông báo trong Realtime Database
        const alertRef = ref(database, `notifications/${alertId}`);

        // Cập nhật trạng thái `isRead` thành `true`
        update(alertRef, { isRead: true })
            .then(() => {
                console.log(`Thông báo ${alertId} đã được đánh dấu là đã đọc.`);
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật thông báo:", error);
            });
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#001f3d', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Avatar
                    onClick={() => navigate('/homepage')}
                    src={logo}
                    alt="Nhân's Pet Haven logo"
                    sx={{ width: 50, height: 50, cursor: 'pointer' }}
                />

                {/* Search Bar */}
                <TextField
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Tìm kiếm thú cưng..."
                    sx={{
                        backgroundColor: '#f0f0f0',
                        borderRadius: '20px',
                        width: '500px',
                        maxWidth: '600px',
                        marginLeft: '20px',
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#888' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Right-side buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Cart */}
                    <IconButton color="inherit" sx={{ marginRight: '10px' }} onClick={() => navigate('/cart')}>
                        <Badge badgeContent={totalQuantity} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    {/* Notifications */}
                    <IconButton
                        aria-label="notifications"
                        onClick={handleClickNotification}
                        color="inherit"
                        sx={{ marginRight: '10px' }}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Menu
                        anchorEl={anchorElNotification}
                        open={openNotificationMenu}
                        onClose={handleCloseNotification}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {alerts.length > 0 ? (
                            alerts.slice(0, 5).map((alert) => (
                                <MenuItem
                                    key={alert.id}
                                    onClick={() => {
                                        handleMarkAsRead(alert.id);
                                        handleCloseNotification();
                                    }}
                                    sx={{
                                        display: 'flex',
                                        padding: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'black',
                                                    marginTop: '5px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '230px',
                                                }}
                                            >
                                                {alert.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#888', marginTop: '5px', display: 'block' }}
                                            >
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {!alert.isRead && (
                                        <Box
                                            sx={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FF6F61',
                                                marginLeft: '10px',
                                            }}
                                        />
                                    )}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleCloseNotification}>
                                <ListItemText primary="Không có thông báo" />
                            </MenuItem>
                        )}
                        <Divider />
                        <MenuItem onClick={() => navigate('/alerts')}>
                            <ListItemText primary="Xem tất cả thông báo" />
                        </MenuItem>
                    </Menu>

                    {/* User Profile */}
                    <IconButton onClick={handleUserClick} color="inherit" sx={{ marginRight: '10px' }}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        open={openUserMenu}
                        onClose={handleUserClose}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {user ? (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/profile');
                                        handleUserClose();
                                    }}
                                >
                                    Tài khoản của tôi
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/orders');
                                        handleUserClose();
                                    }}
                                >
                                    Đơn hàng
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleLogout();
                                        handleUserClose();
                                    }}
                                >
                                    Đăng xuất
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/login');
                                        handleUserClose();
                                    }}
                                >
                                    Đăng nhập
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate('/signup');
                                        handleUserClose();
                                    }}
                                >
                                    Đăng ký
                                </MenuItem>
                            </>
                        )}
                    </Menu>

                    {/* Navigation Buttons */}
                    <Button onClick={() => navigate('/homepage')} color="inherit" sx={{ marginRight: '10px' }}>Home</Button>
                    <Button onClick={() => navigate('/productlist')} color="inherit" sx={{ marginRight: '10px' }}>Products</Button>
                    <Button onClick={() => navigate('/aboutus')} color="inherit" sx={{ marginRight: '10px' }}>About Us</Button>
                    <Button onClick={() => navigate('/contact')} color="inherit" sx={{ marginRight: '10px' }}>Contact</Button>

                    {!user && (
                        <>
                            <Button onClick={() => navigate('/login')} color="inherit">Đăng Nhập</Button>
                            <Button onClick={() => navigate('/signup')} color="inherit">Đăng Ký</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
