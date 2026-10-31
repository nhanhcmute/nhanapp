import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PetCareProvider } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { pc } from '../petCareStyles';

// labelKey trỏ tới petCare.nav.* trong từ điển i18n
export const PET_CARE_NAV = [
  { labelKey: 'dashboard', path: '/pet-care', icon: <HomeOutlinedIcon fontSize="small" />, end: true },
  { labelKey: 'ai', path: '/pet-care/ai-consultation', icon: <AutoAwesomeOutlinedIcon fontSize="small" />, badge: 'AI' },
  { labelKey: 'pets', path: '/pet-care/pets', icon: <PetsOutlinedIcon fontSize="small" /> },
  { labelKey: 'health', path: '/pet-care/health', icon: <FavoriteBorderIcon fontSize="small" /> },
  { labelKey: 'booking', path: '/pet-care/appointments', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
  { labelKey: 'articles', path: '/pet-care/articles', icon: <MenuBookOutlinedIcon fontSize="small" /> },
];

const VET_NAV = { labelKey: 'vet', path: '/pet-care/vet', icon: <GroupsOutlinedIcon fontSize="small" /> };

const isAdminUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))?.role === 1;
  } catch {
    return false;
  }
};

const navItemSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  px: 1.75,
  py: 1.25,
  borderRadius: '12px',
  color: pc.muted,
  fontWeight: 600,
  fontSize: 14,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  borderLeft: '3px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': { bgcolor: pc.primarySoft, color: pc.primary },
  '&.active': { bgcolor: '#ffe8ed', color: pc.primary, borderLeftColor: pc.primary },
};

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: pc.faint, px: 1.75, mb: 1, mt: 1 }}>
    {children}
  </Typography>
);

const NavItem = ({ item, label }) => (
  <Box component={NavLink} to={item.path} end={item.end} sx={navItemSx}>
    {item.icon}
    <Box component="span" sx={{ flex: 1 }}>{label}</Box>
    {item.badge && (
      <Box component="span" sx={{ fontSize: 10, fontWeight: 800, color: pc.primary, bgcolor: '#fff', borderRadius: '6px', px: 0.75, py: 0.25 }}>
        {item.badge}
      </Box>
    )}
  </Box>
);

const PetCareLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = isAdminUser();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <PetCareProvider>
      <Box sx={{ display: 'flex', gap: { md: 3, lg: 4 }, alignItems: 'flex-start', py: { xs: 1, md: 2 } }}>
        {/* Sidebar - desktop */}
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: 236,
            flexShrink: 0,
            position: 'sticky',
            top: 88,
            gap: 0.5,
          }}
        >
          <SectionLabel>{t('petCare.nav.section')}</SectionLabel>
          {PET_CARE_NAV.map((item) => <NavItem key={item.path} item={item} label={t(`petCare.nav.${item.labelKey}`)} />)}
          {isAdmin && (
            <>
              <Box sx={{ mt: 2 }} />
              <SectionLabel>{t('petCare.nav.manage')}</SectionLabel>
              <NavItem item={VET_NAV} label={t('petCare.nav.vet')} />
            </>
          )}

          <Box sx={{ mt: 3, p: 2.25, borderRadius: '18px', bgcolor: pc.primarySoft, border: `1px solid ${pc.primaryBorder}` }}>
            <Typography sx={{ fontSize: 28, lineHeight: 1 }}>🩺</Typography>
            <Typography sx={{ fontWeight: 800, color: pc.ink, mt: 1, fontSize: 14 }}>{t('petCare.nav.promoTitle')}</Typography>
            <Typography sx={{ color: pc.muted, fontSize: 12, mt: 0.5, lineHeight: 1.6 }}>
              {t('petCare.nav.promoText')}
            </Typography>
            <Box
              component="button"
              onClick={() => navigate('/pet-care/ai-consultation')}
              sx={{ mt: 1.25, p: 0, border: 0, bgcolor: 'transparent', color: pc.primary, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {t('petCare.nav.promoCta')} <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </Box>

        {/* Nội dung + tab cuộn ngang trên mobile */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="nav"
            sx={{
              display: { xs: 'flex', md: 'none' },
              gap: 1,
              overflowX: 'auto',
              pb: 1.5,
              mb: 1,
              mx: -2,
              px: 2,
              borderBottom: `1px solid ${pc.border}`,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {[...PET_CARE_NAV, ...(isAdmin ? [VET_NAV] : [])].map((item) => (
              <Box key={item.path} component={NavLink} to={item.path} end={item.end} sx={{ ...navItemSx, py: 1, flexShrink: 0 }}>
                {item.icon}
                {t(`petCare.nav.${item.labelKey}`)}
              </Box>
            ))}
          </Box>

          <Outlet />
        </Box>
      </Box>
    </PetCareProvider>
  );
};

export default PetCareLayout;
