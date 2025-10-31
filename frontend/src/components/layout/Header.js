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
import { useCart } from '../../store/CartContext';
import { database, ref, get, query, orderByChild } from '../../firebaseConfig';
import { update } from "firebase/database";


import logo from '../../assets/images/logo.png';

function Header() {
    const navigate = useNavigate();
    const { cart, getTotalQuantity } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [petsData, setPetsData] = useState([]); // Dữ liệu tổng hợp của tất cả thú cưng
    const [filteredPets, setFilteredPets] = useState([]); // Kết quả lọc
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);


    const openNotificationMenu = Boolean(anchorElNotification);
    const openUserMenu = Boolean(anchorElUser);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    // Lấy dữ liệu từ các file JSON
    useEffect(() => {
        const loadPets = async () => {
            setLoading(true);
            try {
                // Lấy dữ liệu từ file cats.json
                const catsResponse = await fetch("/cats.json");
                const cats = await catsResponse.json();

                // Lấy dữ liệu từ file dogs.json (nếu có)
                const dogsResponse = await fetch("/dogs.json");
                const dogs = await dogsResponse.json();

                // Hợp nhất dữ liệu mèo và chó
                const combinedData = [
                    ...cats.map((cat) => ({ ...cat, type: "cat" })), // Thêm thuộc tính 'type' để phân biệt
                    ...dogs.map((dog) => ({ ...dog, type: "dog" })), // Thêm thuộc tính 'type' để phân biệt
                ];

                setPetsData(combinedData); // Lưu dữ liệu gốc
                setFilteredPets(combinedData); // Ban đầu dữ liệu đã lọc giống dữ liệu gốc
            } catch (error) {
                console.error("Error fetching pet data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPets();
    }, []);

    // Xử lý khi gõ từ khóa tìm kiếm
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase().trim(); // Loại bỏ khoảng trắng thừa và chuyển chữ thường
        setSearchQuery(query);

        if (query) {
            // Lọc kết quả dựa trên từ khóa
            const filtered = petsData.filter((pet) => {
                return (
                    pet.name.toLowerCase().includes(query) || // Tìm theo tên
                    (pet.origin && pet.origin.toLowerCase().includes(query)) || // Tìm theo nguồn gốc
                    (pet.description && pet.description.toLowerCase().includes(query)) // Tìm theo mô tả
                );
            });

            setFilteredPets(filtered); // Cập nhật danh sách lọc
        } else {
            setFilteredPets(petsData); // Nếu không có từ khóa, hiển thị toàn bộ
        }
    };

    // Điều hướng khi nhấn Enter hoặc bấm tìm kiếm
    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`, { state: { results: filteredPets } });
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
        <AppBar
          position="sticky"
          sx={{
            // Khi chưa cuộn: nền mờ trắng nhẹ để chữ nhìn rõ trên cả nền sáng và tối
            // Khi đã cuộn: nền trắng đậm
            backgroundColor: scrolled ? '#fff' : 'rgba(245, 245, 245, 0.4)',
            
            // Backdrop blur để làm mờ nền phía sau, tăng độ tương phản
            backdropFilter: scrolled ? 'none' : 'blur(10px) saturate(180%)',
            WebkitBackdropFilter: scrolled ? 'none' : 'blur(10px) saturate(180%)',
            
            // Màu chữ: đen khi cuộn, dùng primary color (#42A5F5) khi ở đầu trang để nổi bật trên mọi nền
            color: scrolled ? '#212121' : '#42A5F5',
            
            // Text shadow mạnh hơn cho chữ primary color khi ở đầu trang
            textShadow: scrolled 
              ? 'none' 
              : '0 1px 2px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)',
            
            // Border nhẹ khi ở đầu trang
            borderBottom: scrolled 
              ? 'none' 
              : '1px solid rgba(66, 165, 245, 0.2)',
            
            // Shadow khi cuộn
            boxShadow: scrolled 
              ? '0 2px 5px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            
            // Transition mượt mà
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, text-shadow 0.3s ease',
          }}
        >
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
              onChange={handleSearch} 
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(); 
              }}
              placeholder="Tìm kiếm thú cưng..."
              sx={{
                backgroundColor: scrolled ? '#fff' : 'rgba(255, 255, 255, 0.6)', 
                width: "100%",
                maxWidth: "500px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: scrolled ? '#E0E0E0' : 'rgba(66, 165, 245, 0.3)',
                  },
                  "&:hover fieldset": {
                    borderColor: "#42A5F5", 
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#42A5F5", 
                  },
                  color: scrolled ? '#212121' : '#42A5F5',
                  fontWeight: scrolled ? 'normal' : '500',
                },
                "& input::placeholder": {
                  color: scrolled ? '#999' : 'rgba(66, 165, 245, 0.6)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon 
                      sx={{ 
                        color: scrolled ? '#757575' : '#42A5F5',
                      }} 
                    />
                  </InputAdornment>
                ),
              }}
            />
      
            {/* Right-side buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Cart */}
              <IconButton 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }} 
                onClick={() => navigate('/cart')}
              >
                <Badge badgeContent={totalQuantity} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
      
              {/* Notifications */}
              <IconButton
                aria-label="notifications"
                onClick={handleClickNotification}
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
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
              <IconButton 
                onClick={handleUserClick} 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
              >
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
              <Button 
                onClick={() => navigate('/homepage')} 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  fontWeight: scrolled ? 'normal' : '600',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
              >
                Home
              </Button>
              <Button 
                onClick={() => navigate('/productlist')} 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  fontWeight: scrolled ? 'normal' : '600',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
              >
                Products
              </Button>
              <Button 
                onClick={() => navigate('/aboutus')} 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  fontWeight: scrolled ? 'normal' : '600',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
              >
                About Us
              </Button>
              <Button 
                onClick={() => navigate('/contact')} 
                sx={{ 
                  marginRight: '10px',
                  color: scrolled ? '#212121' : '#42A5F5',
                  fontWeight: scrolled ? 'normal' : '600',
                  '&:hover': { 
                    backgroundColor: scrolled 
                      ? 'rgba(66, 165, 245, 0.1)' 
                      : 'rgba(66, 165, 245, 0.15)' 
                  }
                }}
              >
                Contact
              </Button>
      
              {!user && (
                <>
                  <Button 
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      color: scrolled ? '#212121' : '#42A5F5',
                      fontWeight: scrolled ? 'normal' : '600',
                      '&:hover': { 
                        backgroundColor: scrolled 
                          ? 'rgba(66, 165, 245, 0.1)' 
                          : 'rgba(66, 165, 245, 0.15)' 
                      }
                    }}
                  >
                    Đăng Nhập
                  </Button>
                  <Button 
                    onClick={() => navigate('/signup')} 
                    sx={{ 
                      color: scrolled ? '#212121' : '#42A5F5',
                      fontWeight: scrolled ? 'normal' : '600',
                      '&:hover': { 
                        backgroundColor: scrolled 
                          ? 'rgba(66, 165, 245, 0.1)' 
                          : 'rgba(66, 165, 245, 0.15)' 
                      }
                    }}
                  >
                    Đăng Ký
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      );      
}

export default Header;

