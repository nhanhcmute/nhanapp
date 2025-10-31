import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { database, ref, get } from '../../firebaseConfig';

const SelectVoucher = ({ onVoucherChange, calculateTotalAmount }) => {
  const [vouchers, setVouchers] = useState([]); // Lưu danh sách voucher
  const [voucher, setVoucher] = useState(''); // Voucher đã chọn
  const [discount, setDiscount] = useState(0); // Giá trị giảm giá

  // Lấy dữ liệu voucher từ Firebase
  useEffect(() => {
    fetchVouchersFromDatabase();
  }, []);

  const fetchVouchersFromDatabase = async () => {
    try {
      const promotionsRef = ref(database, 'promotions');
      const snapshot = await get(promotionsRef);
      if (snapshot.exists()) {
        const voucherData = Object.values(snapshot.val());
        setVouchers(voucherData); // Lưu voucher vào state
      } else {
        console.warn('Không có voucher nào trong cơ sở dữ liệu.');
        setVouchers([]); // Xử lý trường hợp không có dữ liệu
      }
    } catch (error) {
      console.error('Error fetching vouchers: ', error);
    }
  };

  // Hàm khi người dùng thay đổi voucher
  const handleVoucherChange = (voucherCode) => {
    setVoucher(voucherCode);
    console.log('Voucher selected: ', voucherCode);

    const foundVoucher = vouchers.find(v => v.code === voucherCode);
    if (foundVoucher) {
      // Chỉ cần voucher có trong danh sách promotions là hợp lệ
      const totalAmount = calculateTotalAmount(); // Lấy tổng số tiền giỏ hàng

      let discountAmount = 0;

      // Tính toán giảm giá theo loại voucher
      if (foundVoucher.discountType === 'percentage') {
        // Nếu discountType là "percentage", tính giảm giá theo phần trăm
        discountAmount = (foundVoucher.discountValue / 100) * totalAmount;
      } else if (foundVoucher.discountType === 'amount') {
        // Nếu discountType là "amount", giảm giá là số tiền cố định
        discountAmount = foundVoucher.discountValue;
      }

      // Nếu discount lớn hơn tổng số tiền giỏ hàng, đặt discount = totalAmount
      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }

      setDiscount(discountAmount); // Cập nhật discount
      onVoucherChange(discountAmount); // Thông báo thay đổi giảm giá cho parent component
    } else {
      setDiscount(0); // Nếu voucher không hợp lệ, đặt discount = 0
      onVoucherChange(0);
      alert('Voucher không hợp lệ');
    }
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
  <InputLabel>Chọn Voucher</InputLabel>
  <Select
    value={voucher}
    onChange={(e) => handleVoucherChange(e.target.value)}
    label="Voucher"
  >
    {vouchers.length > 0 ? (
      vouchers.map((voucherItem) => (
        <MenuItem key={voucherItem.id} value={voucherItem.code}>
          {voucherItem.code} - 
          {voucherItem.discountType === 'percentage' 
            ? `${voucherItem.discountValue}%` 
            : `${voucherItem.discountValue} VND`}
          {/* Hiển thị voucher code và tỷ lệ giảm giá hoặc số tiền giảm giá */}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>Không có voucher</MenuItem>
    )}
  </Select>
</FormControl>
  );
};

export default SelectVoucher;
