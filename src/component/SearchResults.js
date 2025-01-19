import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Grid,
    Card,
    CardMedia,
    Typography,
    Box,
    CardContent,
} from "@mui/material";

// Hàm tạo giá ngẫu nhiên trong khoảng từ min đến max
const generateRandomPrice = (min = 500000, max = 5000000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Kết quả tìm kiếm
            </Typography>
            {results.length > 0 ? (
                <Grid container spacing={4}>
                    {results.map((petData) => ( // Dùng petData ở đây
                        <Grid item xs={12} sm={6} md={4} lg={3} key={petData.id}>
                            <Link
                                to={{
                                    pathname: `/petdetails`, // Đường dẫn tới trang chi tiết
                                    state: { petData }, // Gửi dữ liệu petData
                                }}
                                style={{ textDecoration: "none" }} // Không hiển thị underline
                            >
                                <Card sx={{ boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {/* Hình ảnh thú cưng */}
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={petData.image || `https://cdn2.thecatapi.com/images/${petData.reference_image_id}.jpg`}
                                        alt={petData.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            if (petData.reference_image_id) {
                                                e.target.src = `https://cdn2.thecatapi.com/images/${petData.reference_image_id}.png`;
                                            } else {
                                                e.target.src = petData?.imageFallback || "default_image_url.png";
                                            }
                                        }}
                                        sx={{ objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* Tên thú cưng */}
                                        <Typography variant="h6" fontWeight="bold">
                                            {petData.name}
                                        </Typography>
                                        {/* Các thông tin khác */}
                                        <Typography variant="body2" color="textSecondary">
                                            {petData.origin ? <strong>Origin:</strong> : null} {petData.origin}
                                        </Typography>
                                        {/* Giá thú cưng - sử dụng giá ngẫu nhiên */}
                                        <Typography
                                            variant="body1" color="primary" sx={{ marginTop: "8px" }}
                                        >
                                            {generateRandomPrice().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" color="textSecondary">
                    Không tìm thấy kết quả nào.
                </Typography>
            )}
        </Box>
    );
};

export default SearchResults;
