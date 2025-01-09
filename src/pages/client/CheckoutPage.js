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
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { database, ref, get, set, update } from '../../firebaseConfig';
import SelectVoucher from '../../component/SelectVoucher';
import axios from 'axios';


const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
    const [voucherType, setVoucherType] = useState(''); // Nếu bạn đang sử dụng setVoucherType để quản lý trạng thái voucher


    // State cho Dialog chỉnh sửa địa chỉ
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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Mua hàng
            </Typography>

            {/* Kiểm tra giỏ hàng có sản phẩm không */}
            {cart.length === 0 ? (
                <Alert severity="info" action={
                    <Button color="inherit" size="small" onClick={handleNoProducts}>
                        OK
                    </Button>
                }>
                    Chưa có sản phẩm, vui lòng mua hàng
                </Alert>
            ) : (
                <>
                    {/* Địa chỉ giao hàng */}
                    {defaultAddress ? (
                        <Card sx={{ marginBottom: 2, borderRadius: 0 }}>
                            <CardContent>
                                <Typography variant="h6">Địa chỉ giao hàng:</Typography>
                                {/* Hiển thị địa chỉ đầy đủ */}
                                <Typography variant="body1">
                                    {defaultAddress.fullName} - {defaultAddress.phone}
                                </Typography>
                                <Typography variant="body1">
                                    {defaultAddress.street}, {defaultAddress.wardName}, {defaultAddress.districtName}, {defaultAddress.provinceName}
                                </Typography>
                                {/* Hiển thị chi tiết địa chỉ nếu có */}
                                {defaultAddress.details && (
                                    <Typography variant="body2" color="textSecondary">
                                        {defaultAddress.details}
                                    </Typography>
                                )}
                                {/* Loại địa chỉ */}
                                <Typography variant="body2" color="textSecondary">
                                    Loại địa chỉ: {defaultAddress.addressType}
                                </Typography>
                                {/* Nút thay đổi địa chỉ */}
                                <Button variant="outlined" onClick={handleOpenDialog} sx={{ marginTop: 2 }}>
                                    Thay đổi
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography variant="body1" color="error">
                            Bạn chưa có địa chỉ mặc định!
                        </Typography>
                    )}
                    {/* Hiển thị sản phẩm và thông tin cột */}
                    {cart.map((product) => (
                        selectedItems[product.id] && (
                            <Paper sx={{ padding: 2, marginBottom: 2, borderRadius: 0 }} key={product.id}>
                                <Grid container spacing={2}>
                                    {/* Tên sản phẩm */}
                                    <Grid item xs={3} md={6}>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <img src={product.image} alt={product.name} width={50} height={50} style={{ objectFit: 'cover' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1" fontWeight="bold">Sản Phẩm</Typography>
                                                <Typography variant="body1">{product.name}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Đơn giá */}
                                    <Grid item xs={2} md={2}>
                                        <Typography variant="body1" fontWeight="bold">Đơn Giá</Typography>
                                        <Typography variant="body1">{product.price.toLocaleString()} VND</Typography>
                                    </Grid>

                                    {/* Số lượng */}
                                    <Grid item xs={2} md={2}>
                                        <Typography variant="body1" fontWeight="bold">Số Lượng</Typography>
                                        <Typography variant="body1">{product.quantity}</Typography>
                                    </Grid>

                                    {/* Thành tiền */}
                                    <Grid item xs={3} md={2}>
                                        <Typography variant="body1" fontWeight="bold">Thành Tiền</Typography>
                                        <Typography variant="body1">{(product.price * product.quantity).toLocaleString()} VND</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    ))}

                    {/* Chọn Voucher */}
                    <SelectVoucher
                        onVoucherChange={(discount) => setDiscount(discount)}
                        calculateTotalAmount={calculateTotalAmount}
                    />
                    {/* Phương thức vận chuyển */}
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Phương thức vận chuyển</InputLabel>
                        <Select
                            value={shippingMethod}
                            onChange={(e) => {
                                setShippingMethod(e.target.value);
                                // Cập nhật phí vận chuyển dựa trên phương thức chọn
                                if (e.target.value === "express") {
                                    setShippingFee(50000); // Phí giao hàng nhanh
                                } else {
                                    setShippingFee(20000); // Phí giao hàng tiêu chuẩn
                                }
                            }}
                            label="Phương thức vận chuyển"
                        >
                            <MenuItem value="standard">Giao hàng tiêu chuẩn (3-5 ngày)</MenuItem>
                            <MenuItem value="express">Giao hàng nhanh (1-2 ngày)</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ghi chú cho người bán */}
                    <TextField
                        fullWidth
                        label="Ghi chú cho người bán"
                        multiline
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* Phương thức thanh toán */}
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Phương thức thanh toán</InputLabel>
                        <Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            label="Phương thức thanh toán"
                        >
                            <MenuItem value="cash">Thanh toán khi nhận hàng</MenuItem>
                            <MenuItem value="wallet">Thanh toán qua ví điện tử Momo</MenuItem>
                            <MenuItem value="bank">Thanh toán qua ngân hàng</MenuItem>
                            <MenuItem value="credit-card">Thẻ tín dụng/Ghi nợ</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Phí vận chuyển và tổng tiền thanh toán */}
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Phí vận chuyển: {shippingFee.toLocaleString()} VND
                    </Typography>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Tổng số tiền cần thanh toán: {finalAmount.toLocaleString()} VND
                    </Typography>

                    {/* Xác nhận thanh toán */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmPayment}
                        sx={{ marginTop: 2, borderRadius: 0 }}
                    >
                        Xác nhận mua hàng
                    </Button>
                </>
            )}


            {/* Dialog chỉnh sửa địa chỉ */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{newAddress.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Họ và tên"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.fullName}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                        }
                    />
                    <TextField
                        label="Số điện thoại"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.phone}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tỉnh/Thành phố</InputLabel>
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
                        <InputLabel>Quận/Huyện</InputLabel>
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
                        <InputLabel>Phường/Xã</InputLabel>
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
                        label="Tên đường/Số nhà"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.street}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, street: e.target.value })
                        }
                    />
                    <TextField
                        label="Ghi chú thêm (nếu có)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newAddress.details}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, details: e.target.value })
                        }
                    />
                    <FormControl component="fieldset" margin="normal">
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                            Loại địa chỉ
                        </Typography>
                        <RadioGroup
                            value={newAddress.addressType}
                            onChange={(e) =>
                                setNewAddress({ ...newAddress, addressType: e.target.value })
                            }
                        >
                            <FormControlLabel
                                value="home"
                                control={<Radio />}
                                label="Nhà riêng"
                            />
                            <FormControlLabel
                                value="office"
                                control={<Radio />}
                                label="Văn phòng"
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="error">
                        Hủy
                    </Button>
                    <Button
                        onClick={newAddress.id ? handleEditAddress : handleSaveAddress}
                        color="primary"
                        variant="contained"
                    >
                        {newAddress.id ? 'Lưu thay đổi' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CheckoutPage;
