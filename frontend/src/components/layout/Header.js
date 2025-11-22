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
import { FaPaw } from 'react-icons/fa';
import { useCart } from '../../store/CartContext';
import { API_URL } from '../../config/api';

import logo from '../../assets/images/logo.png';
import NotificationBell from '../common/NotificationBell';

function Header() {
    const navigate = useNavigate();
    const { cart, getTotalQuantity } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [petsData, setPetsData] = useState([]); // Dữ liệu tổng hợp của tất cả thú cưng
    const [filteredPets, setFilteredPets] = useState([]); // Kết quả lọc
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);


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



    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalQuantity = getTotalQuantity();

    // Xử lý mở menu user

    // Xử lý mở menu user
    const handleUserClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorElUser(null);
    };

    // Lấy dữ liệu từ API backend
    useEffect(() => {
        const loadPets = async () => {
            setLoading(true);
            try {
                // Lấy dữ liệu từ API backend cho cats
                const catsResponse = await fetch(`${API_URL}/cat.ctr/get_all`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const catsResult = await catsResponse.json();

                // Lấy dữ liệu từ API backend cho dogs
                const dogsResponse = await fetch(`${API_URL}/dog.ctr/get_all`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const dogsResult = await dogsResponse.json();

                // Xử lý dữ liệu cats
                const cats = catsResult.status === 200 && catsResult.data 
                    ? catsResult.data.map((cat) => ({
                        ...cat,
                        type: "cat",
                        image: cat.imageData || cat.image_data || cat.image,
                        name: cat.name,
                        origin: cat.origin || cat.Origin,
                        description: cat.description || cat.Description
                    }))
                    : [];

                // Xử lý dữ liệu dogs
                const dogs = dogsResult.status === 200 && dogsResult.data
                    ? dogsResult.data.map((dog) => ({
                        ...dog,
                        type: "dog",
                        image: dog.image || dog.Image,
                        name: dog.name || dog.Name,
                        origin: dog.origin || dog.Origin,
                        description: dog.description || dog.Description || dog.temperament || dog.Temperament
                    }))
                    : [];

                // Hợp nhất dữ liệu mèo và chó
                const combinedData = [...cats, ...dogs];

                setPetsData(combinedData); // Lưu dữ liệu gốc
                setFilteredPets(combinedData); // Ban đầu dữ liệu đã lọc giống dữ liệu gốc
            } catch (error) {
                console.error("Error fetching pet data from API:", error);
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



    return (
        <AppBar
          position="sticky"
          sx={{
            // Theme thú cưng: trong suốt mờ mờ giống form đăng nhập
            backgroundColor: scrolled 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(255, 255, 255, 0.25)',
            
            // Backdrop blur mạnh để làm mờ nền phía sau (giống form đăng nhập)
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            
            // Màu chữ: hồng cam dễ thương (#ff6b81)
            color: '#ff6b81',
            
            // Text shadow mềm mại
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(255, 107, 129, 0.15)',
            
            // Border hồng cam nhẹ (giống form)
            borderBottom: '2px solid rgba(255, 107, 129, 0.2)',
            
            // Shadow dễ thương với màu hồng (giống form)
            boxShadow: scrolled 
              ? '0 4px 16px rgba(255, 107, 129, 0.2)' 
              : '0 8px 32px rgba(255, 107, 129, 0.15)',
            
            // Transition mượt mà
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
            {/* Logo với Paw Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaPaw size={20} color="#ff6b81" style={{ opacity: 0.7 }} />
              <Avatar
                onClick={() => navigate('/homepage')}
                src={logo}
                alt="Nhân's Pet Haven logo"
                sx={{ 
                  width: 50, 
                  height: 50, 
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 107, 129, 0.3)',
                  boxShadow: '0 2px 8px rgba(255, 107, 129, 0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
              <FaPaw size={20} color="#ff6b81" style={{ opacity: 0.7 }} />
            </Box>
      
            {/* Search Bar */}
            <TextField
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch} 
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(); 
              }}
              placeholder="Tìm kiếm thú cưng yêu..."
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(8px)',
                width: "100%",
                maxWidth: "500px",
                borderRadius: '24px',
                "& .MuiOutlinedInput-root": {
                  borderRadius: '24px',
                  "& fieldset": {
                    borderColor: 'rgba(255, 107, 129, 0.4)',
                    borderWidth: '2px',
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff6b81", 
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff4757", 
                  },
                  color: '#ff6b81',
                  fontWeight: '500',
                },
                "& input::placeholder": {
                  color: 'rgba(255, 107, 129, 0.6)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon 
                      sx={{ 
                        color: scrolled ? '#757575' : '#ff6b81',
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
                  color: '#ff6b81',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 129, 0.15)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }} 
                onClick={() => navigate('/cart')}
              >
                <Badge 
                  badgeContent={totalQuantity} 
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#ff6b81',
                      color: 'white',
                      fontWeight: 600,
                    }
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
      
              {/* Notifications */}
              <Box sx={{ mr: 2 }}>
                <NotificationBell />
              </Box>

      
              {/* User Profile Icon */}
              <IconButton onClick={handleUserClick} sx={{ marginRight: '10px', color: '#ff6b81', '&:hover': { backgroundColor: 'rgba(255, 107, 129, 0.15)', transform: 'scale(1.1)', }, transition: 'all 0.3s ease', }} > <AccountCircleIcon /> </IconButton>

{/* Custom Styled Menu */}
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
  PaperProps={{
    elevation: 4,
    sx: {
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 24px rgba(255, 107, 129, 0.2)',
      mt: 1,
      '& .MuiMenuItem-root': {
        color: '#ff6b81',
        fontWeight: 600,
        fontFamily: 'inherit',
        borderRadius: '8px',
        mx: 0.5,
        my: 0.3,
        transition: 'all 0.25s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 107, 129, 0.15)',
          transform: 'translateX(3px)',
        },
      },
    },
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
        👤 Tài khoản của tôi
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/orders');
          handleUserClose();
        }}
      >
        📦 Đơn hàng
      </MenuItem>
      <Divider sx={{ my: 0.5, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
      <MenuItem
        onClick={() => {
          handleLogout();
          handleUserClose();
        }}
      >
        🚪 Đăng xuất
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
        🔑 Đăng nhập
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/signup');
          handleUserClose();
        }}
      >
        📝 Đăng ký
      </MenuItem>
    </>
  )}
</Menu>

      
              {/* Navigation Buttons */}
              <Button 
                onClick={() => navigate('/homepage')} 
                sx={{ 
                  marginRight: '10px',
                  color: '#ff6b81',
                  fontWeight: '600',
                  textTransform: 'none',
                  borderRadius: '12px',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 129, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                🏠 Home
              </Button>
              <Button 
                onClick={() => navigate('/productlist')} 
                sx={{ 
                  marginRight: '10px',
                  color: '#ff6b81',
                  fontWeight: '600',
                  textTransform: 'none',
                  borderRadius: '12px',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 129, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                🛍️ Products
              </Button>
              <Button 
                onClick={() => navigate('/aboutus')} 
                sx={{ 
                  marginRight: '10px',
                  color: '#ff6b81',
                  fontWeight: '600',
                  textTransform: 'none',
                  borderRadius: '12px',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 129, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                ℹ️ About Us
              </Button>
              <Button 
                onClick={() => navigate('/contact')} 
                sx={{ 
                  marginRight: '10px',
                  color: '#ff6b81',
                  fontWeight: '600',
                  textTransform: 'none',
                  borderRadius: '12px',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 129, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                📞 Contact
              </Button>
      
              {!user && (
                <>
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outlined"
                    sx={{ 
                      marginRight: '8px',
                      color: '#ff6b81',
                      borderColor: 'rgba(255, 107, 129, 0.5)',
                      fontWeight: '600',
                      textTransform: 'none',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 107, 129, 0.15)',
                        borderColor: '#ff6b81',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🐾 Đăng Nhập
                  </Button>
                  <Button 
                    onClick={() => navigate('/signup')} 
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#ff6b81',
                      color: 'white',
                      fontWeight: '600',
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': { 
                        backgroundColor: '#ff4757',
                        boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🐶 Đăng Ký
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      );      
}

export default Header;


