import React, { useState, useEffect } from 'react';
import {
    Box,
    RadioGroup,
    Radio,
    FormControlLabel,
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Paper,
    Card,
    CardContent,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Container,
    Chip,
    Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { database, ref, get, set, update } from '../firebaseConfig';
import SelectVoucher from '../components/common/SelectVoucher';
import axios from 'axios';
import { FaPaw } from 'react-icons/fa';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';


const CheckoutPage = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const product = location.state?.product || null; 

    const [cart, setCart] = useState([]);  
    const [selectedItems, setSelectedItems] = useState({});
    const [voucher, setVoucher] = useState('');  
    const [vouchers, setVouchers] = useState([]);  
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(20000); 
    const [paymentMethod, setPaymentMethod] = useState('cash'); 
    const [defaultAddress, setDefaultAddress] = useState(null); 
    const [shippingMethod, setShippingMethod] = useState('standard'); 
    const [note, setNote] = useState(''); 
    const [addresses, setAddresses] = useState([]); 
    const [finalAmount, setFinalAmount] = useState(0);
    const [voucherType, setVoucherType] = useState('');

    const [openDialog, setOpenDialog] = useState(false); 
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        details: '',
        addressType: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const voucherList = await fetchVouchersFromDatabase();
            setVouchers(voucherList);
        };
        fetchData();
    }, []);


    // Tính tổng số tiền (không bao gồm giảm giá)
    const calculateTotalAmount = () => {
        return cart.reduce((total, product) => {
            if (selectedItems[product.id]) {
                return total + product.price * product.quantity;
            }
            return total;
        }, 0);
    };

    // Lọc và áp dụng voucher hợp lệ
    const applyVoucherDiscount = (voucher) => {
        const totalAmount = calculateTotalAmount(); // Tổng số tiền giỏ hàng trước giảm giá
        let discountAmount = 0;

        // Kiểm tra điều kiện sử dụng voucher
        const isValidDate = new Date(voucher.expirationDate) >= new Date(); // Kiểm tra ngày hết hạn
        const isValidAmount = totalAmount >= parseInt(voucher.minOrderAmount); // Kiểm tra điều kiện minOrderAmount
        const isNotUsedUp = voucher.usedCount < voucher.quantity; // Kiểm tra số lần sử dụng chưa hết

        if (isValidDate && isValidAmount && isNotUsedUp) {
            if (voucher.discountType === 'percentage') {
                // Nếu discountType là "percentage", tính discount theo phần trăm
                discountAmount = (totalAmount * parseFloat(voucher.discountValue)) / 100;
            } else if (voucher.discountType === 'amount') {
                // Nếu discountType là "amount", discount là một giá trị cố định
                discountAmount = parseFloat(voucher.discountValue);
            }

            // Nếu discount lớn hơn tổng số tiền giỏ hàng, đặt discount bằng totalAmount
            if (discountAmount > totalAmount) {
                discountAmount = totalAmount;
            }

            setDiscount(discountAmount); // Cập nhật discount
        } else {
            // Nếu không hợp lệ, đặt discount = 0
            setDiscount(0);
        }
    };

    // Khi voucher thay đổi
    const handleVoucherChange = (voucherCode) => {
        const voucher = vouchers.find((voucher) => voucher.code === voucherCode);
        if (voucher) {
            applyVoucherDiscount(voucher); // Áp dụng giảm giá nếu voucher hợp lệ
        } else {
            setDiscount(0); // Nếu không tìm thấy voucher, đặt discount về 0
        }
    };

    // Cập nhật finalAmount mỗi khi có sự thay đổi trong giỏ hàng, giảm giá, phí vận chuyển
    useEffect(() => {
        const totalAmount = calculateTotalAmount() + shippingFee - discount;
        setFinalAmount(totalAmount < 0 ? 0 : totalAmount); // Đảm bảo finalAmount không âm
    }, [cart, discount, shippingFee, selectedItems]);

    // Lấy dữ liệu voucher từ Firebase
    const fetchVouchersFromDatabase = async () => {
        try {
            const promotionsRef = ref(database, 'promotions');
            const snapshot = await get(promotionsRef);
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            }
            return [];
        } catch (error) {
            console.error('Error fetching vouchers: ', error);
            return [];
        }
    };



    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
                if (response.status === 200 && Array.isArray(response.data)) {
                    setProvinces(response.data);
                } else {
                    setError('Không có dữ liệu tỉnh/thành phố');
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
                setError('Lỗi khi tải dữ liệu tỉnh/thành phố');
            } finally {
                setLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố
    useEffect(() => {
        if (newAddress.province) {
            const fetchDistricts = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`https://provinces.open-api.vn/api/p/${newAddress.province}?depth=2`);
                    if (response.status === 200 && response.data.districts) {
                        setDistricts(response.data.districts);
                    } else {
                        setDistricts([]);
                        setError('Không có dữ liệu quận/huyện cho tỉnh này.');
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách quận/huyện:', error);
                    setDistricts([]);
                    setError('Lỗi khi tải dữ liệu quận/huyện');
                } finally {
                    setLoading(false);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [newAddress.province]);

    // Lấy danh sách phường/xã dựa trên quận/huyện
    useEffect(() => {
        if (newAddress.district) {
            const fetchWards = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`https://provinces.open-api.vn/api/d/${newAddress.district}?depth=2`);
                    if (response.status === 200 && response.data.wards) {
                        setWards(response.data.wards);
                    } else {
                        setWards([]);
                        setError('Không có dữ liệu phường/xã.');
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách phường/xã:', error);
                    setWards([]);
                    setError('Lỗi khi tải dữ liệu phường/xã');
                } finally {
                    setLoading(false);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [newAddress.district]);
    // Đóng dialog
    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewAddress({
            id: '',
            fullName: '',
            phone: '',
            province: '',
            provinceName: '',
            district: '',
            districtName: '',
            ward: '',
            wardName: '',
            street: '',
            details: '',
            addressType: '',
        });
    };

    // Cập nhật địa chỉ
    const handleEditAddress = () => {
        // Kiểm tra dữ liệu địa chỉ có đầy đủ thông tin không
        if (!newAddress.fullName || !newAddress.phone || !newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.addressType || !newAddress.street) {
            alert('Vui lòng điền đầy đủ thông tin địa chỉ');
            return;
        }
        const updatedAddress = { ...newAddress };
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const updatedAddresses = addresses.map(address =>
            address.id === newAddress.id ? updatedAddress : address
        );
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        setDefaultAddress(updatedAddress);
        setOpenDialog(false);
    };


    useEffect(() => {
        if (location.state) {
            setCart(location.state.cart);
            setSelectedItems(location.state.selectedItems);
        }

        // Lấy địa chỉ mặc định từ localStorage
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const defaultAddr = addresses.find(address => address.isDefault);
        setDefaultAddress(defaultAddr);
    }, [location.state]);

    const handleVoucherTypeChange = (e) => {
        setVoucherType(e.target.value);
        setVoucher('');
        setDiscount(0);
    };

    const handleConfirmPayment = async () => {
        if (!cart || cart.length === 0) {
            alert('Không có sản phẩm nào trong giỏ hàng để thanh toán.');
            navigate('/cart');
            return;
        }

        if (!defaultAddress) {
            alert('Vui lòng thêm địa chỉ giao hàng trước khi thanh toán.');
            return;
        }

        const selectedProducts = cart.filter((product) => selectedItems[product.id]);
        if (selectedProducts.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }

        const shippingFeeValue = Number(shippingFee) || 0;
        const discountValue = Number(discount) || 0;

        const newOrder = {
            id: String(Date.now()), // Lấy ID đơn hàng từ timestamp
            customer: {
                name: defaultAddress.fullName,
                phone: defaultAddress.phone,
                address: `${defaultAddress.street}, ${defaultAddress.provinceName}, ${defaultAddress.districtName}, ${defaultAddress.wardName}`,
                addressType: defaultAddress.addressType,
            },
            products: selectedProducts.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                image: product.image,
                total: product.price * product.quantity,
            })),
            status: 'Chờ xác nhận',
            totalAmount: selectedProducts.reduce(
                (total, product) => total + product.price * product.quantity,
                0
            ) + shippingFeeValue - discountValue,
            createdAt: new Date().toISOString(),
        };

        try {
            // Gửi đơn hàng vào Firebase (thêm đơn hàng vào node orders/{orderId})
            const orderRef = ref(database, 'orders/' + newOrder.id);
            await set(orderRef, newOrder);

            alert('Mua hàng thành công!');

            // Cập nhật giỏ hàng sau khi thanh toán
            const updatedCart = cart.filter((product) => !selectedItems[product.id]);

            // Cập nhật giỏ hàng trong Firebase sử dụng product.id làm ID
            const cartRef = ref(database, 'cart/' + selectedProducts[0].id); // Sử dụng id sản phẩm đầu tiên trong giỏ hàng
            await update(cartRef, { items: updatedCart });

            // Cập nhật lại giỏ hàng cục bộ
            setCart(updatedCart);

            // Chuyển hướng đến trang danh sách đơn hàng
            navigate('/orders');
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error.response?.data || error.message);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    // Mở và đóng dialog chỉnh sửa địa chỉ
    const handleOpenDialog = () => {
        if (defaultAddress) {
            setNewAddress({
                fullName: defaultAddress.fullName,
                phone: defaultAddress.phone,
                province: defaultAddress.province,
                district: defaultAddress.district,
                ward: defaultAddress.ward,
                details: defaultAddress.details || '',
                addressType: defaultAddress.addressType,
            });
        }
        setOpenDialog(true);
    };


    const handleSaveAddress = () => {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

        const updatedAddresses = addresses.map(address =>
            address.isDefault ? { ...address, ...newAddress } : address
        );

        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));

        setDefaultAddress(newAddress);

        setOpenDialog(false);
    };

    const handleNoProducts = () => {
        navigate('/cart'); // Điều hướng người dùng về trang giỏ hàng
    };

    return (
        <Container sx={{ 
            py: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
            minHeight: '100vh',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <FaPaw size={32} color="#ff6b81" />
                <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                    🛒 Thanh Toán
                </Typography>
                <FaPaw size={32} color="#ff6b81" />
            </Box>

            {/* Kiểm tra giỏ hàng có sản phẩm không */}
            {cart.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        border: '2px solid rgba(255, 107, 129, 0.2)',
                        boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                    }}
                >
                    <FaPaw size={64} color="#ff6b81" style={{ opacity: 0.3, marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 600, mb: 2 }}>
                        Chưa có sản phẩm trong giỏ hàng
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán! 🐾
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleNoProducts}
                        sx={{
                            backgroundColor: '#ff6b81',
                            color: 'white',
                            borderRadius: '16px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                            '&:hover': {
                                backgroundColor: '#ff4757',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        🛍️ Mua ngay
                    </Button>
                </Paper>
            ) : (
                <>
                    {/* Địa chỉ giao hàng */}
                    {defaultAddress ? (
                        <Paper
                            elevation={0}
                            sx={{
                                marginBottom: 3,
                                p: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                border: '2px solid rgba(255, 107, 129, 0.2)',
                                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 20px rgba(255, 107, 129, 0.25)',
                                    borderColor: 'rgba(255, 107, 129, 0.4)',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <HomeIcon sx={{ color: '#ff6b81' }} />
                                <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                                    📍 Địa chỉ giao hàng
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
                            {/* Hiển thị địa chỉ đầy đủ */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                    👤 {defaultAddress.fullName} - 📞 {defaultAddress.phone}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8 }}>
                                    🏠 {defaultAddress.street}, {defaultAddress.wardName}, {defaultAddress.districtName}, {defaultAddress.provinceName}
                                </Typography>
                                {/* Hiển thị chi tiết địa chỉ nếu có */}
                                {defaultAddress.details && (
                                    <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                                        📝 {defaultAddress.details}
                                    </Typography>
                                )}
                                {/* Loại địa chỉ */}
                                <Chip
                                    label={defaultAddress.addressType === 'home' ? '🏠 Nhà riêng' : '🏢 Văn phòng'}
                                    sx={{
                                        mt: 1,
                                        backgroundColor: '#ff6b81',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                            {/* Nút thay đổi địa chỉ */}
                            <Button
                                variant="outlined"
                                onClick={handleOpenDialog}
                                startIcon={<EditIcon />}
                                sx={{
                                    borderColor: '#ff6b81',
                                    color: '#ff6b81',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#ff4757',
                                        backgroundColor: 'rgba(255, 107, 129, 0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                ✏️ Thay đổi địa chỉ
                            </Button>
                        </Paper>
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                                borderRadius: '16px',
                                border: '2px solid rgba(255, 71, 87, 0.3)',
                            }}
                        >
                            <Typography variant="body1" sx={{ color: '#ff4757', fontWeight: 600 }}>
                                ⚠️ Bạn chưa có địa chỉ mặc định! Vui lòng thêm địa chỉ trước khi thanh toán.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleOpenDialog}
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#ff6b81',
                                    color: 'white',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: '#ff4757',
                                    },
                                }}
                            >
                                ➕ Thêm địa chỉ
                            </Button>
                        </Paper>
                    )}
                    {/* Hiển thị sản phẩm */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <FaPaw size={20} color="#ff6b81" />
                            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                                🛍️ Sản phẩm đã chọn
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
                        {cart.map((product) => (
                            selectedItems[product.id] && (
                                <Paper
                                    key={product.id}
                                    elevation={0}
                                    sx={{
                                        padding: 3,
                                        marginBottom: 2,
                                        borderRadius: '16px',
                                        backgroundColor: 'rgba(255, 107, 129, 0.05)',
                                        border: '1px solid rgba(255, 107, 129, 0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 107, 129, 0.1)',
                                            transform: 'translateX(4px)',
                                        },
                                    }}
                                >
                                    <Grid container spacing={3} alignItems="center">
                                        {/* Tên sản phẩm */}
                                        <Grid item xs={12} md={5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    component="img"
                                                    src={product.image}
                                                    alt={product.name}
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        border: '2px solid rgba(255, 107, 129, 0.2)',
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                                        Sản Phẩm
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#666' }}>
                                                        {product.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Đơn giá */}
                                        <Grid item xs={6} md={2}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                                Đơn Giá
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#666' }}>
                                                💰 {typeof product.price === 'string' 
                                                    ? parseFloat(product.price.replace(/[^\d.]/g, '') || 0).toLocaleString() 
                                                    : (product.price || 0).toLocaleString()} VND
                                            </Typography>
                                        </Grid>

                                        {/* Số lượng */}
                                        <Grid item xs={6} md={2}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                                Số Lượng
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#ff6b81', fontSize: '18px' }}>
                                                {product.quantity}
                                            </Typography>
                                        </Grid>

                                        {/* Thành tiền */}
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b81', mb: 0.5 }}>
                                                Thành Tiền
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff4757' }}>
                                                💵 {((typeof product.price === 'string' 
                                                    ? parseFloat(product.price.replace(/[^\d.]/g, '') || 0) 
                                                    : (product.price || 0)) * product.quantity).toLocaleString()} VND
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )
                        ))}
                    </Paper>

                    {/* Chọn Voucher */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FaPaw size={20} color="#ff6b81" />
                            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                                🎟️ Chọn Voucher
                            </Typography>
                        </Box>
                        <SelectVoucher
                            onVoucherChange={(discount) => setDiscount(discount)}
                            calculateTotalAmount={calculateTotalAmount}
                        />
                    </Paper>

                    {/* Phương thức vận chuyển & thanh toán */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <LocalShippingIcon sx={{ color: '#ff6b81' }} />
                            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                                🚚 Phương thức vận chuyển
                            </Typography>
                        </Box>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: '#ff6b81' }}>Phương thức vận chuyển</InputLabel>
                            <Select
                                value={shippingMethod}
                                onChange={(e) => {
                                    setShippingMethod(e.target.value);
                                    if (e.target.value === "express") {
                                        setShippingFee(50000);
                                    } else {
                                        setShippingFee(20000);
                                    }
                                }}
                                label="Phương thức vận chuyển"
                                sx={{
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 107, 129, 0.3)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 107, 129, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ff6b81',
                                    },
                                }}
                            >
                                <MenuItem value="standard">🚚 Giao hàng tiêu chuẩn (3-5 ngày) - 20,000 VND</MenuItem>
                                <MenuItem value="express">⚡ Giao hàng nhanh (1-2 ngày) - 50,000 VND</MenuItem>
                            </Select>
                        </FormControl>

                        <Divider sx={{ my: 3, borderColor: 'rgba(255, 107, 129, 0.2)' }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PaymentIcon sx={{ color: '#ff6b81' }} />
                            <Typography variant="h6" sx={{ color: '#ff6b81', fontWeight: 700 }}>
                                💳 Phương thức thanh toán
                            </Typography>
                        </Box>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel sx={{ color: '#ff6b81' }}>Phương thức thanh toán</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                label="Phương thức thanh toán"
                                sx={{
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 107, 129, 0.3)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 107, 129, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ff6b81',
                                    },
                                }}
                            >
                                <MenuItem value="cash">💰 Thanh toán khi nhận hàng</MenuItem>
                                <MenuItem value="wallet">📱 Thanh toán qua ví điện tử Momo</MenuItem>
                                <MenuItem value="bank">🏦 Thanh toán qua ngân hàng</MenuItem>
                                <MenuItem value="credit-card">💳 Thẻ tín dụng/Ghi nợ</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Ghi chú cho người bán */}
                        <TextField
                            fullWidth
                            label="📝 Ghi chú cho người bán"
                            multiline
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú (nếu có)..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 107, 129, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 107, 129, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6b81',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6b81',
                                },
                            }}
                        />
                    </Paper>

                    {/* Tổng tiền thanh toán */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    Phí vận chuyển:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#666' }}>
                                    💰 {shippingFee.toLocaleString()} VND
                                </Typography>
                            </Box>
                            {discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1" sx={{ color: '#4caf50' }}>
                                        Giảm giá:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                        - 💵 {discount.toLocaleString()} VND
                                    </Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 2, borderColor: 'rgba(255, 107, 129, 0.2)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                                    Tổng cần thanh toán:
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff4757' }}>
                                    💵 {finalAmount.toLocaleString()} VND
                                </Typography>
                            </Box>
                        </Box>

                        {/* Xác nhận thanh toán */}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleConfirmPayment}
                            startIcon={<ShoppingCartCheckoutIcon />}
                            sx={{
                                backgroundColor: '#ff6b81',
                                color: 'white',
                                borderRadius: '16px',
                                py: 2,
                                fontWeight: 700,
                                fontSize: '18px',
                                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#ff4757',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            🐾 Xác nhận mua hàng
                        </Button>
                    </Paper>
                </>
            )}


            {/* Dialog chỉnh sửa địa chỉ */}
            <Dialog 
                open={openDialog} 
                onClose={handleDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 107, 129, 0.2)',
                    }
                }}
            >
                <DialogTitle sx={{ color: '#ff6b81', fontWeight: 700 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeIcon sx={{ color: '#ff6b81' }} />
                        {newAddress.id ? '✏️ Chỉnh sửa địa chỉ' : '➕ Thêm địa chỉ mới'}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="👤 Họ và tên"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.fullName}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff6b81',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff6b81',
                            },
                        }}
                    />
                    <TextField
                        label="📞 Số điện thoại"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.phone}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff6b81',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff6b81',
                            },
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color: '#ff6b81' }}>🏙️ Tỉnh/Thành phố</InputLabel>
                        <Select
                            value={newAddress.province}
                            onChange={(e) => {
                                const selectedProvince = provinces.find(
                                    (p) => p.code === e.target.value
                                );
                                setNewAddress({
                                    ...newAddress,
                                    province: e.target.value,
                                    provinceName: selectedProvince ? selectedProvince.name : '',
                                    district: '',
                                    districtName: '',
                                    ward: '',
                                    wardName: '',
                                });
                                setDistricts([]);
                            }}
                        >
                            {provinces.map((province) => (
                                <MenuItem key={province.code} value={province.code}>
                                    {province.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled={!newAddress.province}>
                        <InputLabel sx={{ color: '#ff6b81' }}>🏘️ Quận/Huyện</InputLabel>
                        <Select
                            value={newAddress.district}
                            onChange={(e) => {
                                const selectedDistrict = districts.find(
                                    (d) => d.code === e.target.value
                                );
                                setNewAddress({
                                    ...newAddress,
                                    district: e.target.value,
                                    districtName: selectedDistrict ? selectedDistrict.name : '',
                                    ward: '',
                                    wardName: '',
                                });
                                setWards([]);
                            }}
                        >
                            {districts.map((district) => (
                                <MenuItem key={district.code} value={district.code}>
                                    {district.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled={!newAddress.district}>
                        <InputLabel sx={{ color: '#ff6b81' }}>🏠 Phường/Xã</InputLabel>
                        <Select
                            value={newAddress.ward}
                            onChange={(e) => {
                                const selectedWard = wards.find((w) => w.code === e.target.value);
                                setNewAddress({
                                    ...newAddress,
                                    ward: e.target.value,
                                    wardName: selectedWard ? selectedWard.name : '',
                                });
                            }}
                        >
                            {wards.map((ward) => (
                                <MenuItem key={ward.code} value={ward.code}>
                                    {ward.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="🛣️ Tên đường/Số nhà"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.street}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff6b81',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff6b81',
                            },
                        }}
                    />
                    <TextField
                        label="📝 Ghi chú thêm (nếu có)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        value={newAddress.details}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, details: e.target.value })
                        }
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 107, 129, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff6b81',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff6b81',
                            },
                        }}
                    />
                    <FormControl component="fieldset" margin="normal">
                        <Typography variant="body1" sx={{ marginBottom: 2, fontWeight: 600, color: '#ff6b81' }}>
                            🏡 Loại địa chỉ
                        </Typography>
                        <RadioGroup
                            value={newAddress.addressType}
                            onChange={(e) =>
                                setNewAddress({ ...newAddress, addressType: e.target.value })
                            }
                            sx={{
                                '& .MuiRadio-root': {
                                    color: '#ff6b81',
                                    '&.Mui-checked': {
                                        color: '#ff6b81',
                                    },
                                },
                            }}
                        >
                            <FormControlLabel
                                value="home"
                                control={<Radio />}
                                label="🏠 Nhà riêng"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontWeight: 600,
                                        color: '#666',
                                    },
                                }}
                            />
                            <FormControlLabel
                                value="office"
                                control={<Radio />}
                                label="🏢 Văn phòng"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontWeight: 600,
                                        color: '#666',
                                    },
                                }}
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={handleDialogClose}
                        variant="outlined"
                        sx={{
                            borderColor: '#ff4757',
                            color: '#ff4757',
                            borderRadius: '12px',
                            px: 3,
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: '#ff4757',
                                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                            },
                        }}
                    >
                        ❌ Hủy
                    </Button>
                    <Button
                        onClick={newAddress.id ? handleEditAddress : handleSaveAddress}
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff6b81',
                            color: 'white',
                            borderRadius: '12px',
                            px: 3,
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
                        💾 {newAddress.id ? 'Lưu thay đổi' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CheckoutPage;
