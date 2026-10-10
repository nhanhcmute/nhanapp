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
    Chip,
    Paper,
} from "@mui/material";
import { FaPaw } from 'react-icons/fa';
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
            <Box sx={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)',
                pb: 5,
                minHeight: '100vh',
            }}>

                {/* Nội dung chính */}
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                        <FaPaw size={32} color="#ff6b81" />
                        <Typography variant="h4" sx={{ color: '#ff6b81', fontWeight: 700, textAlign: 'center' }}>
                            📝 Blog Thú Cưng
                        </Typography>
                        <FaPaw size={32} color="#ff6b81" />
                    </Box>
                    <Grid container spacing={3}>
                        {/* Bài viết lớn */}
                        <Grid onClick={() => window.location.href = "https://vi.wikipedia.org/wiki/Ch%C3%B3_c%E1%BB%8F"} style={{ cursor: "pointer" }} item xs={12} md={8} >
                            <Card
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '24px',
                                    border: '2px solid rgba(255, 107, 129, 0.2)',
                                    boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(255, 107, 129, 0.25)',
                                        borderColor: 'rgba(255, 107, 129, 0.4)',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="359"
                                    image={featuredPost.image}
                                    alt={featuredPost.title}
                                    sx={{ borderRadius: '24px 24px 0 0' }}
                                />
                                <CardContent sx={{ position: "relative", p: 3 }}>
                                    <Chip
                                        label={featuredPost.category}
                                        sx={{
                                            position: "absolute",
                                            top: 16,
                                            left: 16,
                                            backgroundColor: "#ff6b81",
                                            color: "#fff",
                                            fontWeight: 700,
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                        }}
                                    />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#ff6b81", mt: 5, mb: 2 }}>
                                        {featuredPost.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                                        {featuredPost.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FaPaw size={14} color="#ff6b81" />
                                        <Typography variant="caption" sx={{ color: "#999" }}>
                                            Cập nhật {featuredPost.date}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bài viết nhỏ */}
                        <Grid item xs={12} md={4} >
                            <Grid container direction="column" spacing={2} sx={{ height: "100%" }}>
                                {sidePosts.map((post, index) => (
                                    <Grid item key={index} onClick={() => handleClick(post.link)} style={{ cursor: "pointer" }}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '20px',
                                                border: '2px solid rgba(255, 107, 129, 0.2)',
                                                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.15)',
                                                position: "relative",
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 20px rgba(255, 107, 129, 0.25)',
                                                    borderColor: 'rgba(255, 107, 129, 0.4)',
                                                },
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
                                                    background: 'linear-gradient(135deg, rgba(255, 107, 129, 0.7) 0%, rgba(255, 217, 61, 0.6) 100%)',
                                                    color: "#fff",
                                                    padding: "1rem",
                                                    textAlign: "center",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <Chip
                                                    label={post.category}
                                                    sx={{
                                                        backgroundColor: "#ff6b81",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        mb: 1,
                                                        borderRadius: '12px',
                                                        fontSize: "0.8rem",
                                                    }}
                                                />
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
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
                                        width: { xs: 'calc(100vw - 64px)', md: '760px' },
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
                                        width: { xs: 'calc(100vw - 64px)', sm: '368px' },
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
                                width: { xs: 'calc(100vw - 64px)', lg: '1152px' },
                                backgroundColor: "#F05A28",
                            }}
                        />
                    </Box>
                    <Grid container spacing={4}>
                        {trends.map((trend, index) => (
                            <Grid item xs={12} key={index}>
                                <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' } }}>
                                    {/* Hình ảnh */}
                                    <CardMedia
                                        component="img"
                                        sx={{ width: { xs: '100%', sm: '200px' }, height: { xs: '180px', sm: '150px' }, objectFit: "cover" }}
                                        image={trend.image}
                                        alt={trend.title}
                                    />
                                    {/* Nội dung */}
                                    <CardContent sx={{ minWidth: 0 }}>
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
