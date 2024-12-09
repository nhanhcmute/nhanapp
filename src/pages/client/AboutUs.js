import React from 'react';
import { Box, Typography, Grid, Button, Paper, Avatar, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Tạo kiểu cho ảnh nền
const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: 'url(/giainhan1.jpg)',  // Thay URL này bằng đường dẫn đến ảnh nền của bạn
        backgroundSize: 'cover',  // Đảm bảo hình ảnh bao phủ toàn bộ phần tử
        backgroundRepeat: 'no-repeat',  // Đảm bảo không có sự lặp lại của hình ảnh
        backgroundPosition: 'center',  // Đặt hình ảnh ở giữa phần tử
        height: '100vh',  // Chiều cao phần tử chiếm toàn bộ màn hình
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    servicePaper: {
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        borderRadius: '10px',
    },
    avatar: {
        width: 60,
        height: 60,
        marginBottom: 15,
    },
    socialButton: {
        margin: '8px',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
    },
    bodyText: {
        color: '#555',
        fontSize: '1rem',
    },
}));

const AboutUs = () => {
    const classes = useStyles();

    return (
        <Box>
            {/* Section with background */}
            <Box className={classes.background} sx={{ backgroundColor: '#f4f4f9', padding: '40px 0' }}>
                <Container maxWidth="md">
                    <Paper
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff', // Paper với nền trắng
                            borderRadius: '20px', // Bo góc để tạo cảm giác mềm mại
                            padding: '40px',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Bóng đổ nhẹ để tạo chiều sâu
                            textAlign: 'center',
                            zIndex: 1, // Đảm bảo phần Paper nằm trên background cũ
                        }}
                        className={classes.paper}
                    >
                        {/* Tiêu đề */}
                        <Typography
                            variant="h3"
                            className={classes.sectionTitle}
                            sx={{
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '2.5rem',
                                marginBottom: '20px', // Khoảng cách dưới tiêu đề
                            }}
                        >
                            Về Chúng Tôi
                        </Typography>

                        {/* Nội dung mô tả */}
                        <Typography
                            variant="body1"
                            className={classes.bodyText}
                            sx={{
                                color: '#666',
                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                maxWidth: '80%', // Giới hạn độ rộng của đoạn văn để dễ đọc
                            }}
                        >
                            Chào mừng bạn đến với <strong style={{ color: '#000' }}>Nhân's Pet Haven</strong> – nơi cung cấp các sản phẩm và dịch vụ chất lượng nhất cho thú cưng của bạn. Chúng tôi cam kết mang đến cho bạn những sản phẩm uy tín, an toàn và thân thiện với môi trường, giúp chăm sóc thú cưng của bạn một cách tốt nhất.
                        </Typography>

                        {/* Nút CTA (Call to Action) */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#ffeb3b',
                                color: '#333',
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                borderRadius: '30px', // Bo góc nút
                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
                                '&:hover': {
                                    backgroundColor: '#fbc02d', // Màu nền thay đổi khi hover
                                },
                            }}
                        >
                            Khám Phá Ngay
                        </Button>
                    </Paper>
                </Container>
            </Box>


            {/* Section about Mission, Vision, and Values */}
            <Box sx={{ padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ padding: 3, backgroundColor: '#e3f2fd', boxShadow: 3, borderRadius: 5, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}>
                                Sứ Mệnh
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Chúng tôi luôn cố gắng cung cấp những sản phẩm tốt nhất, mang lại sức khỏe và niềm vui cho các thú cưng của bạn. Chăm sóc và yêu thương chúng là ưu tiên hàng đầu của chúng tôi.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ padding: 3, backgroundColor: '#ffeb3b', boxShadow: 3, borderRadius: 5, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}>
                                Tầm Nhìn
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Trở thành một trong những cửa hàng thú cưng hàng đầu, được khách hàng yêu mến và tin tưởng nhất tại Việt Nam.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ padding: 3, backgroundColor: '#c8e6c9', boxShadow: 3, borderRadius: 5, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}>
                                Giá Trị Cốt Lõi
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Chất lượng, sự chăm sóc tận tâm và sự đáng tin cậy là những giá trị mà chúng tôi luôn hướng tới. Mỗi khách hàng đều là một phần quan trọng trong gia đình chúng tôi.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Additional Info Section */}
            <Box sx={{ padding: 4, backgroundColor: '#f0f0f0' }}>
                <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} maxWidth="md">
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                        Các Dịch Vụ Của Chúng Tôi
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.servicePaper} sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff3e0', borderRadius: 5 }}>
                                <Avatar className={classes.avatar} src="/service1.jpg" sx={{ marginBottom: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    Dịch Vụ Chăm Sóc Thú Cưng
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Chúng tôi cung cấp dịch vụ chăm sóc thú cưng chuyên nghiệp, từ cắt tỉa lông, tắm rửa đến thăm khám sức khỏe.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.servicePaper} sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffccbc', borderRadius: 5 }}>
                                <Avatar className={classes.avatar} src="/service2.jpg" sx={{ marginBottom: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    Sản Phẩm Thú Cưng
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Các sản phẩm thú cưng của chúng tôi đảm bảo chất lượng và an toàn tuyệt đối, từ thức ăn đến đồ chơi và phụ kiện.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper className={classes.servicePaper} sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#d1c4e9', borderRadius: 5 }}>
                                <Avatar className={classes.avatar} src="/service3.jpg" sx={{ marginBottom: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    Tư Vấn Sức Khỏe
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Chúng tôi cung cấp dịch vụ tư vấn sức khỏe thú cưng, bao gồm dinh dưỡng, chăm sóc sức khỏe, và các vấn đề liên quan đến bệnh lý.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Liên kết xã hội */}
            <Box sx={{ marginTop: 4, textAlign: 'center', backgroundColor: '#333', padding: 2, borderRadius: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', marginBottom: 2 }}>
                    Kết nối với chúng tôi
                </Typography>
                <Button variant="contained" sx={{ margin: 1, backgroundColor: '#4267B2', '&:hover': { backgroundColor: '#365899' } }}>
                    Facebook
                </Button>
                <Button variant="contained" sx={{ margin: 1, backgroundColor: '#C13584', '&:hover': { backgroundColor: '#9B2D6D' } }}>
                    Instagram
                </Button>
                <Button variant="contained" sx={{ margin: 1, backgroundColor: '#1DA1F2', '&:hover': { backgroundColor: '#1A91DA' } }}>
                    Twitter
                </Button>
            </Box>
        </Box>

    );
};

export default AboutUs;
