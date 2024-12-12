import React, { useState } from 'react';
import { TextField, InputAdornment, ListItemText, Menu, IconButton, Divider, MenuItem, Avatar, AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from './asset/images/logo.png';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const [openUser, setOpenUser] = useState(false);

    const notifications = [
        { id: 1, message: "Bạn có đơn hàng mới." },
        { id: 2, message: "Cập nhật tài khoản thành công." },
        { id: 3, message: "Khách hàng đã đánh giá sản phẩm." },
    ];

    const openNotificationMenu = Boolean(anchorElNotification);
    const openUserMenu = Boolean(anchorElUser);

    const handleClickNotification = (event) => {
        setAnchorElNotification(event.currentTarget);
        setOpenNotification(true);
    };

    const handleCloseNotification = () => {
        setAnchorElNotification(null);
        setOpenNotification(false);
    };

    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
        setOpenUser(true);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
        setOpenUser(false);
    };

    const handleSearch = () => {
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        setOpenUser(false); // Đóng menu khi chọn mục
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#001f3d', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Avatar onClick={() => navigate('/homepage')} src={logo} alt="Nhân's Pet Haven logo" sx={{ width: '50px', height: '50px', cursor: 'pointer' }} />

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

                {/* Right side buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Cart */}
                    <IconButton color="inherit" sx={{ marginRight: '10px' }} onClick={() => navigate('/cart')}>
                        <Badge badgeContent={4} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    {/* Notifications */}
                    <IconButton aria-label="notifications" onClick={handleClickNotification} color="inherit" sx={{ marginRight: '10px' }}>
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorElNotification}
                        open={openNotificationMenu}
                        onClose={handleCloseNotification}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        {notifications.map((notification) => (
                            <MenuItem key={notification.id} onClick={handleCloseNotification}>
                                <ListItemText primary={notification.message} />
                            </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem onClick={handleCloseNotification}>
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
                        sx={{
                            zIndex: 1301, 
                            marginTop: '5px',
                        }}
                    >
                        <MenuItem onClick={() => handleNavigate('/profile')}>Tài khoản của tôi</MenuItem>
                        <MenuItem onClick={() => handleNavigate('/orders')}>Đơn Hàng</MenuItem>
                        <MenuItem onClick={() => handleNavigate('/logout')}>Đăng xuất</MenuItem>
                        <MenuItem onClick={() => handleNavigate('/admin')}>Admin</MenuItem>

                    </Menu>

                    {/* Navigation Buttons */}
                    <Button onClick={() => navigate('/homepage')} color="inherit" sx={{ marginRight: '10px' }}>Home</Button>
                    <Button onClick={() => navigate('/productlist')} color="inherit" sx={{ marginRight: '10px' }}>Products</Button>
                    <Button onClick={() => navigate('/aboutus')} color="inherit" sx={{ marginRight: '10px' }}>About Us</Button>
                    <Button onClick={() => navigate('/contact')} color="inherit" sx={{ marginRight: '10px' }}>Contact</Button>

                    {/* Auth Buttons */}
                    {user ? (
                        <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')} color="inherit" sx={{ marginRight: '10px' }}>Đăng nhập</Button>
                            <Button onClick={() => navigate('/signup')} color="inherit">Đăng ký</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
