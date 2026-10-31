import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FaPaw } from 'react-icons/fa';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { useLanguage } from '../../i18n/LanguageContext';

const PINK = '#ff6b81';
const INK = '#2b2d42';
const HOTLINE = '0396 922 376';
const FACEBOOK_URL = 'https://www.facebook.com/thanhtroll4';

const SOCIALS = [
  { href: FACEBOOK_URL, icon: <FacebookIcon fontSize="small" />, label: 'Facebook' },
  { href: 'https://instagram.com', icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
  { href: 'https://twitter.com', icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
];

const ColumnTitle = ({ children }) => (
  <Typography sx={{ fontWeight: 800, color: INK, fontSize: 15, mb: 1.5 }}>{children}</Typography>
);

const FooterLink = ({ to, children }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{ display: 'block', color: '#6b6570', fontSize: 14, textDecoration: 'none', mb: 1, '&:hover': { color: PINK } }}
  >
    {children}
  </Box>
);

function Footer() {
  const { storeName, contactInfo } = useStoreSettings();
  const { t } = useLanguage();

  return (
    <Box component="footer" sx={{ mt: 'auto', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #fff5f7 0%, #ffe8ee 100%)', borderTop: '1px solid #ffd6de' }}>
      {/* Dấu chân trang trí */}
      <Box sx={{ position: 'absolute', left: 24, top: 24, opacity: 0.25, display: { xs: 'none', md: 'block' } }}><FaPaw size={40} color={PINK} /></Box>
      <Box sx={{ position: 'absolute', right: 40, top: 40, opacity: 0.25, display: { xs: 'none', md: 'block' } }}><FaPaw size={48} color={PINK} /></Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 3, md: 4 },
          py: { xs: 4, md: 5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.4fr 1fr 1fr 1.2fr' },
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* Thương hiệu */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaPaw size={30} color={PINK} />
            <Typography sx={{ fontWeight: 800, color: PINK, fontSize: 20, lineHeight: 1.1 }}>{storeName}</Typography>
          </Box>
          <Typography sx={{ color: '#6b6570', fontSize: 14, mt: 1.5, mb: 2 }}>{t('footer.tagline')}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {SOCIALS.map((s) => (
              <IconButton
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                size="small"
                sx={{ color: PINK, bgcolor: '#fff', border: '1px solid #ffd6de', '&:hover': { bgcolor: PINK, color: '#fff' } }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        <Box>
          <ColumnTitle>{t('footer.support')}</ColumnTitle>
          <FooterLink to="/contact">{t('footer.contactSupport')}</FooterLink>
          <FooterLink to="/orders">{t('footer.myOrders')}</FooterLink>
          <FooterLink to="/pet-care">{t('footer.smartVet')}</FooterLink>
          <FooterLink to="/pet-care/articles">{t('footer.careGuides')}</FooterLink>
        </Box>

        <Box>
          <ColumnTitle>{t('footer.about')}</ColumnTitle>
          <FooterLink to="/aboutus">{t('footer.aboutUs')}</FooterLink>
          <FooterLink to="/productlist">{t('footer.products')}</FooterLink>
          <FooterLink to="/blog">{t('footer.news')}</FooterLink>
          <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
        </Box>

        <Box>
          <ColumnTitle>{t('footer.contactTitle')}</ColumnTitle>
          <Box component="a" href="tel:0396922376" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b6570', fontSize: 14, textDecoration: 'none', mb: 1, '&:hover': { color: PINK } }}>
            <PhoneIcon sx={{ fontSize: 18, color: INK }} /> {t('footer.hotline', { phone: HOTLINE })}
          </Box>
          <Box component="a" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b6570', fontSize: 14, textDecoration: 'none', mb: 1, '&:hover': { color: PINK } }}>
            <FacebookIcon sx={{ fontSize: 18, color: INK }} /> Facebook
          </Box>
          {/* Thông tin liên hệ do admin nhập ở trang Cài đặt */}
          {contactInfo && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: '#6b6570', fontSize: 14, whiteSpace: 'pre-line' }}>
              <InfoOutlinedIcon sx={{ fontSize: 18, color: INK, mt: '2px' }} /> {contactInfo}
            </Box>
          )}
        </Box>
      </Box>

      {/* Thanh bản quyền */}
      <Box sx={{ bgcolor: PINK, color: '#fff' }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 3, md: 4 },
            py: 1.25,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            fontSize: 12,
          }}
        >
          <span>© {new Date().getFullYear()} {storeName}. {t('footer.rights')}</span>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <span>
              {t('footer.builtBy')}{' '}
              <Box component="a" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', fontWeight: 700 }}>Thiện Nhân</Box>
            </span>
            <span>|</span>
            <Box component={RouterLink} to="/privacy" sx={{ color: '#fff' }}>{t('footer.privacy')}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
