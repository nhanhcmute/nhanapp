import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Avatar } from '@mui/material';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/homepage');
    }
    
    return (
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '70vh',
                    backgroundImage: 'url(/giainhan1.jpg)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        background: 'linear-gradient(135deg, rgba(255, 107, 129, 0.7) 0%, rgba(255, 217, 61, 0.6) 100%)',
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
                        color: 'white',
                        textAlign: 'center',
                        py: 8,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <FaPaw size={40} color="white" />
                        <Typography variant="h3" sx={{ fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            {`🐾 ${t('content.about.welcome')}`}
                        </Typography>
                        <FaPaw size={40} color="white" />
                    </Box>
                    <Typography variant="h5" sx={{ marginBottom: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {t('content.about.tagline')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        sx={{
                            backgroundColor: '#ff6b81',
                            color: 'white',
                            padding: '14px 32px',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            borderRadius: '24px',
                            boxShadow: '0 4px 16px rgba(255, 107, 129, 0.4)',
                            '&:hover': {
                                backgroundColor: '#ff4757',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 107, 129, 0.5)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {`🐾 ${t('content.about.explore')}`}
                    </Button>
                </Container>
            </Box>

            {/* Về Chúng Tôi */}
            <Box sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #ffe8ec 100%)', padding: '60px 0' }}>
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            padding: 5,
                            borderRadius: '24px',
                            border: '2px solid rgba(255, 107, 129, 0.2)',
                            boxShadow: '0 8px 24px rgba(255, 107, 129, 0.15)',
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <FaPaw size={32} color="#ff6b81" />
                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#ff6b81',
                                    fontWeight: 700,
                                    fontSize: '2.5rem',
                                }}
                            >
                                {t('content.about.aboutUs')}
                            </Typography>
                            <FaPaw size={32} color="#ff6b81" />
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#666',
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                marginBottom: 4,
                                maxWidth: '90%',
                            }}
                        >
                            {t('content.about.introBefore')} <strong style={{ color: '#ff6b81' }}>Nhân's Pet Haven</strong> {t('content.about.introAfter')}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleClick}
                            sx={{
                                backgroundColor: '#ff6b81',
                                color: 'white',
                                padding: '12px 32px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: '20px',
                                boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#ff4757',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(255, 107, 129, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {`🐾 ${t('content.about.explore')}`}
                        </Button>
                    </Paper>
                </Container>
            </Box>

            {/* Sứ Mệnh, Tầm Nhìn, Giá Trị Cốt Lõi */}
            <Box sx={{ padding: 6, background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 100%)' }}>
                <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 5 }}>
                        <FaPaw size={28} color="#ff6b81" />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81', textAlign: 'center' }}>
                            {`🎯 ${t('content.about.coreValues')}`}
                        </Typography>
                        <FaPaw size={28} color="#ff6b81" />
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: 4,
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                    borderRadius: '24px',
                                    border: '2px solid rgba(33, 150, 243, 0.2)',
                                    boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(33, 150, 243, 0.25)',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FaPaw size={20} color="#1976d2" />
                                    {`💙 ${t('content.about.mission')}`}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                                    {t('content.about.missionText')}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: 4,
                                    background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
                                    borderRadius: '24px',
                                    border: '2px solid rgba(255, 193, 7, 0.3)',
                                    boxShadow: '0 8px 24px rgba(255, 193, 7, 0.15)',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(255, 193, 7, 0.25)',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FaPaw size={20} color="#f57c00" />
                                    {`💛 ${t('content.about.vision')}`}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                                    {t('content.about.visionText')}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    padding: 4,
                                    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
                                    borderRadius: '24px',
                                    border: '2px solid rgba(76, 175, 80, 0.2)',
                                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(76, 175, 80, 0.25)',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#388e3c', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FaPaw size={20} color="#388e3c" />
                                    {`💚 ${t('content.about.values')}`}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                                    {t('content.about.valuesText')}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Các Dịch Vụ Của Chúng Tôi */}
            <Box sx={{ padding: 6, background: 'linear-gradient(135deg, #ffe8ec 0%, #ffd3d9 100%)' }}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 5 }}>
                        <FaPaw size={32} color="#ff6b81" />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b81', textAlign: 'center' }}>
                            {`🛠️ ${t('content.about.services')}`}
                        </Typography>
                        <FaPaw size={32} color="#ff6b81" />
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                    padding: 3,
                                    borderRadius: '24px',
                                    border: '2px solid rgba(255, 152, 0, 0.2)',
                                    boxShadow: '0 8px 24px rgba(255, 152, 0, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(255, 152, 0, 0.25)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 80,
                                        height: 80,
                                        alignSelf: 'center',
                                        backgroundColor: '#ff6b81',
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    🐕
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', textAlign: 'center', mb: 1 }}>
                                    {t('content.about.care')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', lineHeight: 1.8 }}>
                                    {t('content.about.careText')}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #ffccbc 0%, #ffab91 100%)',
                                    padding: 3,
                                    borderRadius: '24px',
                                    border: '2px solid rgba(255, 87, 34, 0.2)',
                                    boxShadow: '0 8px 24px rgba(255, 87, 34, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(255, 87, 34, 0.25)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 80,
                                        height: 80,
                                        alignSelf: 'center',
                                        backgroundColor: '#ff6b81',
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    🛍️
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', textAlign: 'center', mb: 1 }}>
                                    {t('content.about.products')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', lineHeight: 1.8 }}>
                                    {t('content.about.productsText')}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #d1c4e9 0%, #b39ddb 100%)',
                                    padding: 3,
                                    borderRadius: '24px',
                                    border: '2px solid rgba(156, 39, 176, 0.2)',
                                    boxShadow: '0 8px 24px rgba(156, 39, 176, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(156, 39, 176, 0.25)',
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        marginBottom: 2,
                                        width: 80,
                                        height: 80,
                                        alignSelf: 'center',
                                        backgroundColor: '#ff6b81',
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    💊
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b81', textAlign: 'center', mb: 1 }}>
                                    {t('content.about.health')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', lineHeight: 1.8 }}>
                                    {t('content.about.healthText')}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Liên Kết Xã Hội */}
            <Box sx={{ padding: 6, textAlign: 'center', background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 100%)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                    <FaPaw size={24} color="#ff6b81" />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff6b81' }}>
                        {`📱 ${t('content.about.connect')}`}
                    </Typography>
                    <FaPaw size={24} color="#ff6b81" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#4267B2',
                            color: 'white',
                            borderRadius: '16px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#365899',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(66, 103, 178, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        📘 Facebook
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#C13584',
                            color: 'white',
                            borderRadius: '16px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#9B2D6D',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(193, 53, 132, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        📷 Instagram
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#1DA1F2',
                            color: 'white',
                            borderRadius: '16px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#1A91DA',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(29, 161, 242, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        🐦 Twitter
                    </Button>
                </Box>
            </Box>
            
            <Footer />
        </Box>
    );
};

export default AboutUs;
