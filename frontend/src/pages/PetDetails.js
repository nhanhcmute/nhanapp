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
import { useLanguage } from '../i18n/LanguageContext';

const PetDetails = () => {
  const { t } = useLanguage();
    const location = useLocation();
    const petData = location.state?.petData; 
    const petType = location.state?.petType; 

    if (!petData) {
        return <Typography variant="h6">{t('content.pets.notFound')}</Typography>;
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
                            {t('content.pets.breedGroup', { value: petData.breed_group || t('content.pets.unknown') })}
                        </Typography>
                        <Typography variant="body1" >
                            {t('content.pets.description', { value: petData.description || t('content.pets.unknown') })}
                        </Typography>
                        {/* Các đặc điểm khác */}
                        <Typography variant="body1">
                            {t('content.pets.weight', { value: petData.weight?.metric || t('content.pets.unknown') })}
                        </Typography>
                        <Typography variant="body1">
                            {t('content.pets.height', { value: petData.height?.metric || t('content.pets.unknown') })}
                        </Typography>
                        <Typography variant="body1">
                            {t('content.pets.lifeSpan', { value: petData.life_span || t('content.pets.unknown') })}
                        </Typography>
                        <Typography variant="body1">
                            {t('content.pets.temperament', { value: petData.temperament || t('content.pets.unknown') })}
                        </Typography>
                        <Typography variant="body1">
                            {t('content.pets.originLine', { value: petData.origin || t('content.pets.unknown') })}
                        </Typography>

                        {/* Giá thú cưng */}
                        <Typography
                            variant="h5"
                            color="primary"
                            fontWeight="bold"
                            sx={{ marginTop: 2 }}
                        >
                            {t('content.pets.price', { value: petData.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || t('content.pets.unknown') })}
                        </Typography>

                        {/* Nút hành động */}
                        <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ flex: 1 }}
                            >
                                {t('shop.addToCart')}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                sx={{ flex: 1 }}
                            >
                                {t('shop.buyNow')}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PetDetails;
