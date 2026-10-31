import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Card, Notice, PetAvatar, SectionHeading, TextLink, formatAge } from '../components/common';
import { PetFormDialog } from '../components/dialogs';
import { pc, cardSx, iconBoxSx, primaryBtnSx, outlineBtnSx } from '../petCareStyles';

// key trỏ tới petCare.dashboard.quick.* = [tiêu đề, mô tả]
const quickActions = [
  { key: 'ai', path: '/pet-care/ai-consultation', icon: <ChatBubbleOutlineIcon />, bg: pc.primarySoft, color: pc.primary },
  { key: 'pets', path: '/pet-care/pets', icon: <PetsOutlinedIcon />, bg: pc.blueSoft, color: pc.blue },
  { key: 'health', path: '/pet-care/health', icon: <FavoriteBorderIcon />, bg: pc.greenSoft, color: pc.green },
  { key: 'booking', path: '/pet-care/appointments', icon: <CalendarMonthOutlinedIcon />, bg: pc.amberSoft, color: pc.amber },
];

const reminderIcon = {
  shield: <ShieldOutlinedIcon fontSize="small" />,
  heart: <FavoriteBorderIcon fontSize="small" />,
  calendar: <CalendarMonthOutlinedIcon fontSize="small" />,
};
const reminderTone = {
  pink: [pc.primarySoft, pc.primary],
  green: [pc.greenSoft, pc.green],
  blue: [pc.blueSoft, pc.blue],
};

const CareDashboardPage = () => {
  const navigate = useNavigate();
  const { t, pick, formatDate } = useLanguage();
  const { pets, reminders, savePet, notify } = usePetCare();
  const [petDialogOpen, setPetDialogOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12, mb: 2 }}>
        <Box component={Link} to="/homepage" sx={{ color: pc.faint, textDecoration: 'none' }}>{t('common.home')}</Box>
        <Box component="span" sx={{ color: pc.faint }}>›</Box>
        <Box component="span" sx={{ color: pc.primary, fontWeight: 700 }}>{t('petCare.title')}</Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          position: 'relative', overflow: 'hidden', borderRadius: '24px', p: { xs: 3, md: 5 },
          background: 'linear-gradient(120deg, #fff5f7 0%, #ffe6ec 100%)', border: `1px solid ${pc.primaryBorder}`,
          display: 'flex', alignItems: 'center', gap: 3,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: pc.primary }}>
            {t('petCare.dashboard.eyebrow')}
          </Typography>
          <Typography component="h1" sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 800, color: pc.ink, lineHeight: 1.2, mt: 1.5 }}>
            {t('petCare.dashboard.titleLine1')}
            <Box component="span" sx={{ display: 'block', color: pc.primary }}>{t('petCare.dashboard.titleLine2')} 🐾</Box>
          </Typography>
          <Typography sx={{ color: pc.muted, fontSize: 15, mt: 2, maxWidth: 480, lineHeight: 1.7 }}>
            {t('petCare.dashboard.intro')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
            <Button startIcon={<AutoAwesomeOutlinedIcon />} endIcon={<ArrowForwardIcon />} sx={primaryBtnSx} onClick={() => navigate('/pet-care/ai-consultation')}>
              {t('petCare.dashboard.askAi')}
            </Button>
            <Button startIcon={<CalendarMonthOutlinedIcon />} sx={outlineBtnSx} onClick={() => navigate('/pet-care/appointments')}>
              {t('petCare.dashboard.bookVet')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', width: 260, height: 220, flexShrink: 0 }}>
          <Box sx={{ position: 'absolute', inset: 10, borderRadius: '50%', bgcolor: '#ffc9d4', boxShadow: '0 0 0 16px rgba(255,201,212,0.35)' }} />
          <Box sx={{ position: 'absolute', left: 50, top: 40, fontSize: 110, lineHeight: 1 }}>🐶</Box>
          <Box sx={{ position: 'absolute', right: 0, top: 80, fontSize: 70, lineHeight: 1 }}>🐱</Box>
          <Box
            sx={{
              position: 'absolute', right: 0, bottom: 0, bgcolor: '#fff', borderRadius: '12px', px: 1.5, py: 0.75,
              fontSize: 12, fontWeight: 700, color: pc.ink, boxShadow: '0 6px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 0.75,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: pc.green }} /> {t('petCare.dashboard.aiBadge')}
          </Box>
        </Box>
      </Box>

      <Notice sx={{ mt: 2.5 }}>
        <b>{t('petCare.dashboard.noticeLabel')}</b> {t('petCare.dashboard.notice')}
      </Notice>

      {/* Thao tác nhanh */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mt: 2.5 }}>
        {quickActions.map((a) => {
          const [title, desc] = t(`petCare.dashboard.quick.${a.key}`);
          return (
            <Box
              key={a.path}
              component={Link}
              to={a.path}
              sx={{
                ...cardSx, p: { xs: 1.75, sm: 2.25 }, display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none',
                transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', borderColor: pc.primaryBorder },
              }}
            >
              <Box sx={iconBoxSx(a.bg, a.color)}>{a.icon}</Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: { xs: 13, sm: 15 } }}>{title}</Typography>
                <Typography sx={{ color: pc.faint, fontSize: 12 }}>{desc}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mt: 4 }}>
        {/* Gia đình nhỏ */}
        <Box>
          <SectionHeading
            title={t('petCare.dashboard.familyTitle')}
            subtitle={t('petCare.dashboard.familySubtitle')}
            action={<TextLink to="/pet-care/pets">{t('petCare.dashboard.viewAll')}</TextLink>}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {pets.slice(0, 2).map((p) => (
              <Card key={p.id} sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <PetAvatar species={p.species} size={64} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 17 }}>
                    {p.name}{' '}
                    <Box component="span" sx={{ fontSize: 11, fontWeight: 500, color: pc.faint }}>· {t(`petCare.species.${p.species}`)}</Box>
                  </Typography>
                  <Typography sx={{ color: pc.muted, fontSize: 12, mt: 0.5, lineHeight: 1.7 }}>
                    {pick(p.breed)} · {formatAge(p.age, t)}<br />{p.weight} kg
                  </Typography>
                  <Box sx={{ mt: 1 }}><TextLink to="/pet-care/pets">{t('petCare.dashboard.viewProfile')}</TextLink></Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Lịch chăm sóc */}
        <Box>
          <SectionHeading
            title={t('petCare.dashboard.scheduleTitle')}
            subtitle={t('petCare.dashboard.scheduleSubtitle')}
            action={<TextLink to="/pet-care/health">{t('petCare.dashboard.viewSchedule')}</TextLink>}
          />
          <Card sx={{ p: { xs: 1, sm: 1.5 } }}>
            {reminders.map((r) => {
              const [bg, color] = reminderTone[r.tone] || reminderTone.pink;
              return (
                <Box key={r.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 1.5 }}>
                  <Box sx={{ ...iconBoxSx(bg, color), width: 38, height: 38, borderRadius: '12px' }}>{reminderIcon[r.icon]}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: pc.ink, fontSize: 14 }}>{pick(r.title)}</Typography>
                    <Typography sx={{ color: pc.faint, fontSize: 12, mt: 0.25 }}>{pick(r.note)}</Typography>
                  </Box>
                  <Typography sx={{ color: pc.faint, fontSize: 11, whiteSpace: 'nowrap' }}>
                    {formatDate(r.date, { day: '2-digit', month: 'short' })}
                  </Typography>
                </Box>
              );
            })}
          </Card>
        </Box>
      </Box>

      {/* CTA thêm thú cưng */}
      <Card sx={{ mt: 3, p: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <Box sx={{ ...iconBoxSx(pc.primarySoft, pc.primary), borderRadius: '50%' }}>💌</Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 14 }}>{t('petCare.dashboard.newPetTitle')}</Typography>
          <Typography sx={{ color: pc.muted, fontSize: 12 }}>{t('petCare.dashboard.newPetText')}</Typography>
        </Box>
        <Button startIcon={<AddIcon />} sx={outlineBtnSx} onClick={() => setPetDialogOpen(true)}>{t('petCare.dashboard.addPet')}</Button>
      </Card>

      <PetFormDialog
        open={petDialogOpen}
        onClose={() => setPetDialogOpen(false)}
        onSave={(pet) => {
          savePet(pet);
          setPetDialogOpen(false);
          notify(t('petCare.pets.added', { name: pet.name }));
        }}
      />
    </Box>
  );
};

export default CareDashboardPage;
