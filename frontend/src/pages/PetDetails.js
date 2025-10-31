import React from "react";
import { useLocation } from "react-router-dom";
import {
    Grid,
    Card,
    CardMedia,
    Typography,
    Button,
    Box,
} from "@mui/material";

const PetDetails = () => {
    const location = useLocation();
    const petData = location.state?.petData; 
    const petType = location.state?.petType; 

    if (!petData) {
        return <Typography variant="h6">Không tìm thấy thông tin thú cưng.</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={4}>
                {/* Hình ảnh thú cưng */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardMedia
                            component="img"
                            height="450"
                            // Kiểm tra loại thú cưng và hiển thị ảnh phù hợp
                            image={petType === "cat"
                                ? `https://cdn2.thecatapi.com/images/${petData.reference_image_id}.jpg` // Ảnh mèo
                                : petData.image // Ảnh chó (dành cho trường hợp chó)
                            }
                            alt={petData.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                if (petType === "cat") {
                                    // Nếu là mèo, thử ảnh định dạng PNG khi có lỗi
                                    e.target.src = `https://cdn2.thecatapi.com/images/${petData.reference_image_id}.png`;
                                } else {
                                    // Nếu không phải mèo, không cần xử lý fallback, chỉ sử dụng ảnh chó
                                    e.target.src = petData?.imageFallback || "default_image_url.png"; // Đặt ảnh mặc định cho chó
                                }
                            }}
                            sx={{ objectFit: "cover" }}
                        />
                    </Card>
                </Grid>

                {/* Thông tin thú cưng */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* Tên thú cưng */}
                        <Typography variant="h4" fontWeight="bold">
                            {petData.name}
                        </Typography>

                        {/* Nhóm giống (tùy thuộc vào petType) */}
                        <Typography variant="subtitle1" color="textSecondary">
                            Nhóm giống: {petData.breed_group || "Không có thông tin"}
                        </Typography>
                        <Typography variant="body1" >
                            Mô tả: {petData.description || "Không có thông tin"}
                        </Typography>
                        {/* Các đặc điểm khác */}
                        <Typography variant="body1">
                            Cân nặng: {petData.weight?.metric || "Không có thông tin"} kg
                        </Typography>
                        <Typography variant="body1">
                            Chiều cao: {petData.height?.metric || "Không có thông tin"} cm
                        </Typography>
                        <Typography variant="body1">
                            Tuổi thọ: {petData.life_span || "Không có thông tin"}
                        </Typography>
                        <Typography variant="body1">
                            Tính cách: {petData.temperament || "Không có thông tin"}
                        </Typography>
                        <Typography variant="body1">
                            Nguồn gốc: {petData.origin || "Không có thông tin"}
                        </Typography>

                        {/* Giá thú cưng */}
                        <Typography
                            variant="h5"
                            color="primary"
                            fontWeight="bold"
                            sx={{ marginTop: 2 }}
                        >
                            Giá: {petData.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "Không có thông tin"}
                        </Typography>

                        {/* Nút hành động */}
                        <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ flex: 1 }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                sx={{ flex: 1 }}
                            >
                                Mua ngay
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PetDetails;
