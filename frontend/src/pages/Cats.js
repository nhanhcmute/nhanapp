import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress, Typography, Button, Box, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Thêm hook điều hướng
import { API_URL } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 'all'];
const ALL_PAGE_SIZE = 100000; // đủ lớn để chắc chắn lấy hết khi chọn "All"

const Cats = () => {
  const { t } = useLanguage();
    const [catsData, setCatsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate(); // Sử dụng hook điều hướng

    // Hàm tạo giá ngẫu nhiên
    const generateRandomPrice = () => {
        const min = 1000000; // Giới hạn giá thấp nhất
        const max = 10000000; // Giới hạn giá cao nhất
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Lấy dữ liệu từ API backend theo trang
    useEffect(() => {
        const loadCats = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${API_URL}/cat.ctr/get_paged`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        page,
                        page_size: pageSize === 'all' ? ALL_PAGE_SIZE : pageSize,
                    }),
                });
                const result = await response.json();

                if (result.status === 200 && result.data) {
                    const data = result.data.data || [];

                    const updatedCats = data.map((cat) => ({
                        ...cat,
                        price: cat.price || generateRandomPrice(),
                        image: cat.imageData || cat.image_data || cat.image,
                        cfa_url: cat.cfaUrl || cat.cfa_url
                    }));

                    setCatsData(updatedCats);
                    setTotalPages(result.data.totalPages || 1);
                    setTotalCount(result.data.totalCount || 0);
                }
            } catch (error) {
                console.error("Error fetching cat data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCats();
    }, [page, pageSize]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    // Xử lý khi click vào card
    const handleClick = (cat) => {
        navigate(`/petdetails`, {
          state: {
            petData: cat,
            petType: 'cat' // Thêm petType để xác định đó là mèo
          }
        });
    };

    return (
        <div>
            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <Grid container spacing={2}>
                    {catsData.map((cat) => (
                        <Grid item key={cat.id} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{ display: "flex", flexDirection: "column", height: "100%", cursor: "pointer" }}
                                onClick={() => handleClick(cat)} // Thêm sự kiện click
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={cat.image || '/logo.png'}
                                    alt={cat.name}
                                    sx={{ objectFit: "cover" }}
                                    onError={(e) => { e.target.src = '/logo.png'; }}
                                />

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {cat.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>{t('content.pets.origin')}</strong> {cat.origin}
                                    </Typography>
                                    {/* Hiển thị giá ngẫu nhiên */}
                                    <Typography variant="body1" color="primary" sx={{ marginTop: "8px" }}>
                                        {cat.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </Typography>
                                </CardContent>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    href={cat.cfa_url}
                                    target="_blank"
                                    style={{
                                        marginTop: "auto",
                                        marginBottom: "10px",
                                        maxWidth: "250px",
                                        alignSelf: "center",
                                    }}
                                    onClick={(e) => e.stopPropagation()} // Ngăn xung đột với sự kiện click trên Card
                                >
                                    {t('content.pets.moreInfo')}
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Phân trang + chọn số lượng/trang */}
            {!loading && (
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    sx={{ marginTop: 4, marginBottom: 2 }}
                >
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="cats-page-size-label">{t('shop.show')}</InputLabel>
                        <Select
                            labelId="cats-page-size-label"
                            label={t('shop.show')}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            {PAGE_SIZE_OPTIONS.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt === 'all' ? t('shop.allCount', { n: totalCount }) : t('shop.perPage', { n: opt })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}
        </div>
    );
};

export default Cats;
