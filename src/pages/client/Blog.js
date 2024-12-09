import React from "react";
import {
    Box,
    Typography,
    Grid,
    Container,
    Card,
    CardContent,
    CardMedia,
    Button,
} from "@mui/material";
const featuredPost = {
    title: "Top 5+ cách làm cây thông Noel bằng giấy đơn giản, sáng tạo",
    description:
        "Khám phá cách làm cây thông Noel đẹp mắt bằng các nguyên liệu đơn giản.",
    image: "/giainhan1.jpg",
    category: "Sự kiện",
    date: "08/12/2024",
};

const sidePosts = [
    {
        title: "Gợi ý 33+ mẫu nail đẹp, cuốn hút, hot trend",
        image: "/anh1.jpg",
        category: "Chăm sóc cơ thể",
        link: "https://en.wikipedia.beta.wmflabs.org/wiki/Black_cat"
    },
    {
        title: "20+ mẫu nail chân đơn giản, hot trend, được ưa thích",
        image: "/anh1.jpg",
        category: "Chăm sóc cơ thể",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    },
    {
        title: "20+ mẫu nail sơn thạch đơn giản, nổi bật, tôn da",
        image: "/anh1.jpg",
        category: "Chăm sóc cơ thể",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"
    },
];

const recentUpdates = [
    {
        title: "10 cách chăm sóc thú cưng hiệu quả",
        description: "Những mẹo hay giúp bạn chăm sóc thú cưng tốt nhất.",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    },
    {
        title: "Làm sao để hiểu thú cưng hơn?",
        description: "Tìm hiểu ngôn ngữ cơ thể và cảm xúc của thú cưng.",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    },
    {
        title: "Làm sao để hiểu thú cưng hơn?",
        description: "Tìm hiểu ngôn ngữ cơ thể và cảm xúc của thú cưng.",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    }, {
        title: "Làm sao để hiểu thú cưng hơn?",
        description: "Tìm hiểu ngôn ngữ cơ thể và cảm xúc của thú cưng.",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    }, {
        title: "Làm sao để hiểu thú cưng hơn?",
        description: "Tìm hiểu ngôn ngữ cơ thể và cảm xúc của thú cưng.",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Ch%C3%B3_Corgi_Wales"
    },
];

const petAndYou = [
    {
        title: "Chăm sóc sức khỏe cho thú cưng",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"

    },
    {
        title: "Làm đẹp cho thú cưng tại nhà",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"

    },
    {
        title: "Những lưu ý khi thú cưng bị bệnh",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"

    },
    {
        title: "Những lưu ý khi thú cưng bị bệnh",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"

    },
    {
        title: "Những lưu ý khi thú cưng bị bệnh",
        image: "/anh1.jpg",
        link: "https://vi.wikipedia.org/wiki/Shiba_Inu"

    },
];

const trends = [
    {
        title: "Top 10 giống thú cưng đẹp nhất năm 2024",
        image: "/anh1.jpg",
    },
    {
        title: "Các vật dụng giúp thú cưng vui vẻ hơn",
        image: "/anh1.jpg",
    },
    {
        title: "Mẹo nuôi dạy thú cưng thông minh",
        image: "/anh1.jpg",
    },
];

const handleClick = (link) => {
    window.location.href = link;
};

const Blog = () => {
    return (
        <div>
            <Box sx={{ backgroundColor: "#fff", pb: 5 }}>

                {/* Nội dung chính */}
                <Container maxWidth="lg" sx={{ mt: 3 }}>
                    <Grid container spacing={0.5}>
                        {/* Bài viết lớn */}
                        <Grid onClick={() => window.location.href = "https://vi.wikipedia.org/wiki/Ch%C3%B3_c%E1%BB%8F"} style={{ cursor: "pointer" }} item xs={12} md={8} >
                            <Card sx={{
                                display: "flex", flexDirection: "column", height: "100%", boxShadow: 3, transition: 'opacity 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    opacity: 0.7,  // Giảm độ mờ khi hover
                                },
                            }}>
                                <CardMedia
                                    component="img"
                                    height="359"
                                    image={featuredPost.image}
                                    alt={featuredPost.title}
                                />
                                <CardContent sx={{ position: "relative" }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            left: 10,
                                            backgroundColor: "#ff7043",
                                            color: "#fff",
                                            px: 1,
                                            py: 0.5,
                                            fontWeight: "bold",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {featuredPost.category}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mt: 5 }}>
                                        {featuredPost.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                                        {featuredPost.description}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#999", mt: 1, display: "block" }}>
                                        Cập nhật {featuredPost.date}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bài viết nhỏ */}
                        <Grid item xs={12} md={4} >
                            <Grid container direction="column" spacing={0.5} sx={{ height: "100%" }}>
                                {sidePosts.map((post, index) => (
                                    <Grid item key={index} onClick={() => handleClick(post.link)} style={{ cursor: "pointer" }} sx={{
                                        transition: 'opacity 0.3s ease, background-color 0.3s ease',
                                        '&:hover': {
                                            opacity: 0.8,  // Giảm độ mờ khi hover
                                            backgroundColor: '#45a049',  // Thay đổi màu sắc khi hover
                                        },
                                    }} >
                                        <Card
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                                boxShadow: 1,
                                                "&:hover": { boxShadow: 3 },
                                                position: "relative",
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    width: "100%",
                                                    height: 171.5,
                                                    objectFit: "cover",
                                                }}
                                                image={post.image}
                                                alt={post.title}
                                            />
                                            <CardContent
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                                                    color: "#fff",
                                                    padding: "1rem",
                                                    textAlign: "center",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color: "#ff7043",
                                                        fontWeight: "bold",
                                                        mb: 1,
                                                        textTransform: "uppercase",
                                                        fontSize: "0.8rem",
                                                    }}
                                                >
                                                    {post.category}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: "#fff",
                                                        lineHeight: 1.4,
                                                        overflow: "hidden",
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient: "vertical",
                                                        WebkitLineClamp: 2,
                                                    }}
                                                >
                                                    {post.title}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            {/* Tiêu đề "Thú Cưng & Bạn" */}
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    backgroundColor: "#F05A28",
                                    color: "#FFFFFF",
                                    padding: "4px 8px",
                                    fontWeight: "bold", mt: 5, mb: 3,
                                    fontSize: "14px",
                                    position: "relative",
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Thú Cưng & Bạn
                                </Typography>
                                <Box

                                    sx={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: "0",
                                        height: "2px",
                                        width: "760px",
                                        backgroundColor: "#F05A28",
                                    }}
                                />
                            </Box>

                            {/* Grid container chia hai bên */}
                            <Grid container spacing={4}>
                                {/* Bên trái (các bài viết lớn) */}
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={4}>
                                        {petAndYou.map((post, index) => (
                                            <Grid item xs={12} key={index} onClick={() => handleClick(post.link)} style={{ cursor: "pointer" }}>
                                                <Card sx={{ boxShadow: 3 }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={post.image}
                                                        alt={post.title}
                                                    />
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                            {post.title}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>

                                {/* Bên phải (các bài viết nhỏ) */}
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        {recentUpdates.map((update, index) => (
                                            <Grid item xs={12} key={index} onClick={() => handleClick(update.link)} style={{ cursor: "pointer" }}>
                                                <Card sx={{ boxShadow: 3, display: "flex", height: "100px" }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{
                                                            width: "100px",
                                                            objectFit: "cover",
                                                        }}
                                                        image={update.image}
                                                        alt={update.title}
                                                    />
                                                    <CardContent
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            padding: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                                                            {update.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: "#666", fontSize: "0.75rem", mt: 1 }}>
                                                            {update.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Thông tin vừa cập nhật (chiếm 4 cột) */}
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    backgroundColor: "#F05A28",
                                    color: "#FFFFFF",
                                    padding: "4px 8px",
                                    fontWeight: "bold", mt: 5, mb: 3,
                                    fontSize: "14px",
                                    position: "relative",
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    ⭐ Mới Cập Nhật
                                </Typography>
                                <Box

                                    sx={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: "0",
                                        height: "2px",
                                        width: "368px",
                                        backgroundColor: "#F05A28",
                                    }}
                                />
                            </Box>
                            <Grid container spacing={3}>
                                {recentUpdates.map((post, index) => (
                                    <Grid item xs={12} key={index} onClick={() => handleClick(post.link)} style={{ cursor: "pointer" }}>
                                        <Card sx={{ boxShadow: 3, display: "flex", height: 100 }}> {/* Đặt display flex để chia các phần */}
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    width: "33%",
                                                    objectFit: "cover",
                                                    height: 100,
                                                }}
                                                image={post.image}
                                                alt={post.title}
                                            />
                                            <CardContent sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                height: "100%",
                                                padding: 2
                                            }}> {/* Phần còn lại chiếm 2/3 chiều rộng */}
                                                <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "#666", mt: 1, fontSize: "0.75rem" }}>
                                                    {post.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Cái này là cái gạch ngang */}
                    <Box
                        sx={{
                            width: "100%", // Chiều rộng của gạch
                            height: "2px", // Độ dày của gạch
                            backgroundColor: "#F05A28", // Màu gạch
                            marginY: 4, // Khoảng cách phía trên và dưới
                        }}
                    />
                    <Grid container spacing={4} sx={{ mt: 5 }}>
                        {/* Box Thú Cưng */}
                        <Grid item xs={12} md={4}>
                            <Card onClick={() => window.location.href = "https://vi.wikipedia.org/wiki/Ch%C3%B3_c%E1%BB%8F"} style={{ cursor: "pointer" }} sx={{ position: "relative", boxShadow: 3, "&:hover": { boxShadow: 6 } }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="/anh1.jpg"
                                    alt="Thú Cưng"
                                    sx={{
                                        transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động cho ảnh
                                        "&:hover": {
                                            transform: "scale(1.05)", // Phóng to ảnh khi hover
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute", // Đặt Box lên trên ảnh
                                        top: "50%", // Đặt Box ở giữa ảnh
                                        left: "50%",
                                        transform: "translate(-50%, -50%)", // Căn giữa Box
                                        backgroundColor: "#F05A28",
                                        color: "#FFFFFF",
                                        padding: "16px",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px", // Bo góc cho Box
                                        zIndex: 1, // Đảm bảo Box luôn ở trên ảnh
                                    }}
                                >
                                    <Typography variant="h6">Thú Cưng</Typography>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Box Phụ Kiện */}
                        <Grid item xs={12} md={4}>
                            <Card onClick={() => window.location.href = "https://vi.wikipedia.org/wiki/Ch%C3%B3_c%E1%BB%8F"} style={{ cursor: "pointer" }} sx={{ position: "relative", boxShadow: 3, "&:hover": { boxShadow: 6 } }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="/dochoi1.jpg"
                                    alt="Phụ Kiện"
                                    sx={{
                                        transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động cho ảnh
                                        "&:hover": {
                                            transform: "scale(1.05)", // Phóng to ảnh khi hover
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute", // Đặt Box lên trên ảnh
                                        top: "50%", // Đặt Box ở giữa ảnh
                                        left: "50%",
                                        transform: "translate(-50%, -50%)", // Căn giữa Box
                                        backgroundColor: "#28A745",
                                        color: "#FFFFFF",
                                        padding: "16px",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px", // Bo góc cho Box

                                    }}
                                >
                                    <Typography variant="h6">Phụ Kiện</Typography>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Box Chăm Sóc */}
                        <Grid item xs={12} md={4}>
                            <Card onClick={() => window.location.href = "https://vi.wikipedia.org/wiki/Ch%C3%B3_c%E1%BB%8F"} style={{ cursor: "pointer" }} sx={{ position: "relative", boxShadow: 3, "&:hover": { boxShadow: 6 } }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="/dochoi1.jpg" // Thay thế với URL của ảnh Chăm Sóc
                                    alt="Chăm Sóc"
                                    sx={{
                                        transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động cho ảnh
                                        "&:hover": {
                                            transform: "scale(1.05)", // Phóng to ảnh khi hover
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute", // Đặt Box lên trên ảnh
                                        top: "50%", // Đặt Box ở giữa ảnh
                                        left: "50%",
                                        transform: "translate(-50%, -50%)", // Căn giữa Box
                                        backgroundColor: "#007BFF",
                                        color: "#FFFFFF",
                                        padding: "16px",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px", // Bo góc cho Box
                                    }}
                                >
                                    <Typography variant="h6">Chăm Sóc</Typography>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>



                    {/* Xu hướng mới */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: "#F05A28",
                            color: "#FFFFFF",
                            padding: "4px 8px",
                            fontWeight: "bold", mt: 5, mb: 3,
                            fontSize: "14px",
                            position: "relative",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                            }}
                        >
                            Xu Hướng Mới
                        </Typography>
                        <Box

                            sx={{
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                height: "2px",
                                width: "1152px",
                                backgroundColor: "#F05A28",
                            }}
                        />
                    </Box>
                    <Grid container spacing={4}>
                        {trends.map((trend, index) => (
                            <Grid item xs={12} key={index}>
                                <Box sx={{ display: "flex", flexDirection: "row" }}>
                                    {/* Hình ảnh */}
                                    <CardMedia
                                        component="img"
                                        sx={{ width: "200px", height: "150px", objectFit: "cover" }}
                                        image={trend.image}
                                        alt={trend.title}
                                    />
                                    {/* Nội dung */}
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                                            {trend.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "gray", marginBottom: "8px" }}>
                                            CẬP NHẬT {trend.date} · {trend.comments} bình luận
                                        </Typography>
                                        <Typography variant="body2">{trend.description}</Typography>
                                    </CardContent>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default Blog;
