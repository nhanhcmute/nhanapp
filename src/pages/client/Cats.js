import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Thêm hook điều hướng
import LoadMore from "../../function/LoadMore";

const Cats = () => {
    const [catsData, setCatsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate(); // Sử dụng hook điều hướng

    // Hàm tạo giá ngẫu nhiên
    const generateRandomPrice = () => {
        const min = 1000000; // Giới hạn giá thấp nhất
        const max = 10000000; // Giới hạn giá cao nhất
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Lấy dữ liệu từ file cats.json trong thư mục public
    useEffect(() => {
        const loadCats = async () => {
            setLoading(true);

            try {
                // Lấy dữ liệu từ file cats.json
                const response = await fetch("/cats.json");
                const data = await response.json();

                // Thêm giá ngẫu nhiên cho mỗi con mèo
                const updatedCats = data.map((cat) => ({
                    ...cat,
                    price: generateRandomPrice(), // Thêm giá ngẫu nhiên
                }));

                setCatsData((prev) => [...prev, ...updatedCats]);

                if (data.length < 9) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching cat data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCats();
    }, [page]);

    const loadMoreHandler = () => {
        if (hasMore) {
            setPage((prev) => prev + 1);
        }
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
                                image={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
                                alt={cat.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.png`;
                                }}
                                sx={{ objectFit: "cover" }}
                            />

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div">
                                    {cat.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Origin:</strong> {cat.origin}
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
                                More Info
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Loading indicator */}
            {loading && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
                <div style={{ textAlign: "center" }}>
                    <LoadMore onClick={loadMoreHandler} />
                </div>
            )}

            {/* If no more data */}
            {!hasMore && !loading && (
                <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
                    No more cats to load
                </Typography>
            )}
        </div>
    );
};

export default Cats;
