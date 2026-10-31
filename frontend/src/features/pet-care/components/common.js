import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { SPECIES } from '../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { pc, cardSx, iconBoxSx, tonePill } from '../petCareStyles';

// Breadcrumb + eyebrow + tiêu đề trang + mô tả, có chỗ cho nút hành động bên phải
export const PageHeader = ({ crumb, eyebrow, title, subtitle, action }) => {
  const { t } = useLanguage();
  return (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12, mb: 2 }}>
      <Box component={Link} to="/homepage" sx={{ color: pc.faint, textDecoration: 'none', '&:hover': { color: pc.primary } }}>
        {t('common.home')}
      </Box>
      <Box component="span" sx={{ color: pc.faint }}>›</Box>
      <Box component="span" sx={{ color: pc.primary, fontWeight: 700 }}>{crumb}</Box>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: pc.primary, textTransform: 'uppercase' }}>
            {eyebrow}
          </Typography>
        )}
        <Typography component="h1" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, color: pc.ink, lineHeight: 1.25, mt: 0.5 }}>
          {title}
        </Typography>
        {subtitle && <Typography sx={{ color: pc.muted, fontSize: 14, mt: 0.75 }}>{subtitle}</Typography>}
      </Box>
      {action}
    </Box>
  </Box>
  );
};

export const Card = ({ children, sx }) => <Box sx={{ ...cardSx, ...sx }}>{children}</Box>;

export const Notice = ({ children, tone = 'amber', sx }) => {
  const colors = tone === 'red'
    ? { bgcolor: pc.redSoft, border: '#ffd0cc', color: '#c2413c' }
    : { bgcolor: '#fffaf0', border: pc.amberBorder, color: '#8a6420' };
  return (
    <Box
      sx={{
        display: 'flex', gap: 1.25, alignItems: 'flex-start', p: '12px 16px', borderRadius: '14px',
        bgcolor: colors.bgcolor, border: `1px solid ${colors.border}`, color: colors.color, fontSize: 13, lineHeight: 1.6, ...sx,
      }}
    >
      <WarningAmberRoundedIcon sx={{ fontSize: 18, mt: '2px', color: tone === 'red' ? pc.red : pc.amber }} />
      <Box>{children}</Box>
    </Box>
  );
};

export const Pill = ({ tone = 'pink', children, sx }) => (
  <Box
    component="span"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 11, fontWeight: 700, px: 1.25, py: 0.5, borderRadius: '8px', whiteSpace: 'nowrap', ...tonePill[tone], ...sx }}
  >
    {children}
  </Box>
);

export const StatCard = ({ icon, value, label, bg, color }) => (
  <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={iconBoxSx(bg, color)}>{icon}</Box>
    <Box>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: pc.ink, lineHeight: 1.1 }}>{String(value).padStart(2, '0')}</Typography>
      <Typography sx={{ fontSize: 12, color: pc.muted, mt: 0.5 }}>{label}</Typography>
    </Box>
  </Card>
);

export const PetAvatar = ({ species, size = 64 }) => {
  const s = SPECIES[species] || SPECIES.other;
  return (
    <Box
      sx={{ width: size, height: size, borderRadius: `${Math.round(size * 0.28)}px`, bgcolor: s.bg, display: 'grid', placeItems: 'center', fontSize: size * 0.55, flexShrink: 0 }}
    >
      {s.emoji}
    </Box>
  );
};

export const SectionHeading = ({ title, subtitle, action }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2 }}>
    <Box>
      <Typography component="h2" sx={{ fontSize: 20, fontWeight: 800, color: pc.ink }}>{title}</Typography>
      {subtitle && <Typography sx={{ fontSize: 13, color: pc.muted, mt: 0.25 }}>{subtitle}</Typography>}
    </Box>
    {action}
  </Box>
);

export const TextLink = ({ to, onClick, children }) => (
  <Box
    component={to ? Link : 'button'}
    to={to}
    onClick={onClick}
    sx={{ p: 0, border: 0, bgcolor: 'transparent', color: pc.primary, fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' } }}
  >
    {children} →
  </Box>
);

// Hiển thị tuổi (số năm) theo ngôn ngữ hiện tại; dữ liệu trống thì hiện "Chưa rõ"
export const formatAge = (age, t) => {
  const n = Number(age);
  if (age === '' || age == null || Number.isNaN(n)) return t('petCare.unknown');
  return t(n === 1 ? 'petCare.yearOne' : 'petCare.years', { n });
};
