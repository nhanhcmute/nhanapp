import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Avatar } from '@mui/material';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/homepage');
    }
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(/giainhan1.jpg)',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />

            {/* Nội dung trang */}
            <Container
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'white',
                    padding: 0,
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                    Chào Mừng Đến Với Trang Web Của Chúng Tôi
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: 3 }}>
                    Khám phá các dịch vụ và sản phẩm thú cưng của chúng tôi!
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#ffeb3b',
                        color: '#333',
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        '&:hover': {
                            backgroundColor: '#fbc02d',
                        },
                    }}
                    onClick={handleClick}
                >
                    Khám Phá Ngay
                </Button>
            </Container>

            {/* Về Chúng Tôi */}
            <Box sx={{ backgroundColor: '#f4f4f9', padding: '40px 0' }}>
                <Container maxWidth="md">
                    <Paper
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: '40px',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '2.5rem',
                                marginBottom: '20px',
                            }}
                        >
                            Về Chúng Tôi
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#666',
                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                maxWidth: '80%',
                            }}
                        >
                            Chào mừng bạn đến với <strong style={{ color: '#000' }}>Nhân's Pet Haven</strong> – nơi cung cấp các sản phẩm và dịch vụ chất lượng nhất cho thú cưng của bạn. Chúng tôi cam kết mang đến cho bạn những sản phẩm uy tín, an toàn và thân thiện với môi trường, giúp chăm sóc thú cưng của bạn một cách tốt nhất.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#ffeb3b',
                                color: '#333',
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
                                '&:hover': {
                                    backgroundColor: '#fbc02d',
                                },
                            }}
                        >
                            Khám Phá Ngay
                        </Button>
                    </Paper>
                </Container>
            </Box>

            {/* Sứ Mệnh, Tầm Nhìn, Giá Trị Cốt Lõi */}
            <Box sx={{ padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: '#e3f2fd',
                                boxShadow: 3,
                                height: '100%',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: 2,
                                }}
                            >
                                Sứ Mệnh
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Chúng tôi luôn cố gắng cung cấp những sản phẩm tốt nhất, mang lại sức khỏe và niềm vui cho các thú cưng của bạn. Chăm sóc và yêu thương chúng là ưu tiên hàng đầu của chúng tôi.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: '#ffeb3b',
                                boxShadow: 3,
                                height: '100%',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: 2,
                                }}
                            >
                                Tầm Nhìn
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Trở thành một trong những cửa hàng thú cưng hàng đầu, được khách hàng yêu mến và tin tưởng nhất tại Việt Nam.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: '#c8e6c9',
                                boxShadow: 3,
                                height: '100%',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: 2,
                                }}
                            >
                                Giá Trị Cốt Lõi
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                Chất lượng, sự chăm sóc tận tâm và sự đáng tin cậy là những giá trị mà chúng tôi luôn hướng tới. Mỗi khách hàng đều là một phần quan trọng trong gia đình chúng tôi.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Các Dịch Vụ Của Chúng Tôi */}
            <Box sx={{ padding: 4, backgroundColor: '#f0f0f0' }}>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    maxWidth="md"
                >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                        Các Dịch Vụ Của Chúng Tôi
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    backgroundColor: '#fff3e0',
                                    padding: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 64,
                                        height: 64,
                                        alignSelf: 'center',
                                    }}
                                    src="/service1.jpg"
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#333',
                                        textAlign: 'center',
                                    }}
                                >
                                    Dịch Vụ Chăm Sóc Thú Cưng
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#555',
                                        textAlign: 'center',
                                    }}
                                >
                                    Chúng tôi cung cấp dịch vụ chăm sóc thú cưng chuyên nghiệp, từ cắt tỉa lông, tắm rửa đến thăm khám sức khỏe.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    backgroundColor: '#ffccbc',
                                    padding: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 64,
                                        height: 64,
                                        alignSelf: 'center',
                                    }}
                                    src="/service2.jpg"
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#333',
                                        textAlign: 'center',
                                    }}
                                >
                                    Sản Phẩm Thú Cưng
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#555',
                                        textAlign: 'center',
                                    }}
                                >
                                    Các sản phẩm thú cưng của chúng tôi đảm bảo chất lượng và an toàn tuyệt đối, từ thức ăn đến đồ chơi và phụ kiện.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    backgroundColor: '#d1c4e9',
                                    padding: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 64,
                                        height: 64,
                                        alignSelf: 'center',
                                    }}
                                    src="/service3.jpg"
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#333',
                                        textAlign: 'center',
                                    }}
                                >
                                    Tư Vấn Sức Khỏe
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#555',
                                        textAlign: 'center',
                                    }}
                                >
                                    Chúng tôi cung cấp dịch vụ tư vấn sức khỏe thú cưng, bao gồm dinh dưỡng, chăm sóc sức khỏe, và các vấn đề liên quan đến bệnh lý.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Liên Kết Xã Hội */}
            <Box
                sx={{
                    marginTop: 4,
                    textAlign: 'center',
                    padding: 2,
                    marginBottom: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 2,
                    }}
                >
                    Kết nối với chúng tôi
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        margin: 1,
                        backgroundColor: '#4267B2',
                        '&:hover': {
                            backgroundColor: '#365899',
                        },
                    }}
                >
                    Facebook
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        margin: 1,
                        backgroundColor: '#C13584',
                        '&:hover': {
                            backgroundColor: '#9B2D6D',
                        },
                    }}
                >
                    Instagram
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        margin: 1,
                        backgroundColor: '#1DA1F2',
                        '&:hover': {
                            backgroundColor: '#1A91DA',
                        },
                    }}
                >
                    Twitter
                </Button>
            </Box>
            <Footer />
        </Box>
    );
};

export default AboutUs;
