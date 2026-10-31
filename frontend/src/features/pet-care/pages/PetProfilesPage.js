import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Card, PageHeader, PetAvatar, Pill, formatAge } from '../components/common';
import { PetFormDialog } from '../components/dialogs';
import { pc, primaryBtnSx, outlineBtnSx } from '../petCareStyles';

const STATUS_TONE = { healthy: 'green', reminder: 'amber' };

const Meta = ({ label, value }) => (
  <Box>
    <Typography sx={{ fontSize: 11, color: pc.faint }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 800, color: pc.ink, mt: 0.5 }}>{value}</Typography>
  </Box>
);

const PetProfilesPage = () => {
  const navigate = useNavigate();
  const { t, pick } = useLanguage();
  const { pets, savePet, notify } = usePetCare();
  const [dialog, setDialog] = useState({ open: false, pet: null });

  const openNew = () => setDialog({ open: true, pet: null });

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.pets.crumb')}
        eyebrow={t('petCare.pets.eyebrow')}
        title={t('petCare.pets.title')}
        subtitle={t('petCare.pets.subtitle')}
        action={<Button startIcon={<AddIcon />} sx={primaryBtnSx} onClick={openNew}>{t('petCare.pets.add')}</Button>}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        {pets.map((p) => {
          const status = STATUS_TONE[p.status] ? p.status : 'healthy';
          return (
            <Card key={p.id} sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pb: 2.5, borderBottom: `1px solid ${pc.border}` }}>
                <PetAvatar species={p.species} size={88} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: pc.ink }}>{p.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: pc.muted, mb: 1 }}>{t(`petCare.species.${p.species}`)} · {pick(p.breed)}</Typography>
                  <Pill tone={STATUS_TONE[status]}>{t(`petCare.pets.status.${status}`)}</Pill>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, py: 2.5 }}>
                <Meta label={t('petCare.pets.sex')} value={t(`petCare.sex.${p.sex}`)} />
                <Meta label={t('petCare.pets.age')} value={formatAge(p.age, t)} />
                <Meta label={t('petCare.pets.weight')} value={`${p.weight} kg`} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Button
                  size="small" startIcon={<FavoriteBorderIcon />} onClick={() => navigate('/pet-care/health')}
                  sx={{ color: pc.primary, bgcolor: pc.primarySoft, borderRadius: '10px', px: 1.5, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#ffe3e9' } }}
                >
                  {t('petCare.pets.healthBook')}
                </Button>
                <Button size="small" startIcon={<EditOutlinedIcon />} sx={{ ...outlineBtnSx, py: 0.75, px: 1.75 }} onClick={() => setDialog({ open: true, pet: p })}>
                  {t('petCare.pets.edit')}
                </Button>
              </Box>
            </Card>
          );
        })}

        <Box
          component="button"
          onClick={openNew}
          sx={{
            minHeight: 240, borderRadius: '20px', border: `1.5px dashed ${pc.primaryBorder}`, bgcolor: '#fffafb', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, transition: 'all 0.2s ease',
            '&:hover': { bgcolor: pc.primarySoft, borderColor: pc.primary },
          }}
        >
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#ffe3e9', color: pc.primary, display: 'grid', placeItems: 'center' }}>
            <AddIcon />
          </Box>
          <Typography sx={{ fontWeight: 800, color: pc.ink, mt: 1 }}>{t('petCare.pets.addNewTitle')}</Typography>
          <Typography sx={{ fontSize: 12, color: pc.muted }}>{t('petCare.pets.addNewText')}</Typography>
        </Box>
      </Box>

      <PetFormDialog
        open={dialog.open}
        pet={dialog.pet}
        onClose={() => setDialog({ open: false, pet: null })}
        onSave={(pet) => {
          savePet(pet);
          setDialog({ open: false, pet: null });
          notify(t(pet.id ? 'petCare.pets.updated' : 'petCare.pets.added', { name: pet.name }));
        }}
      />
    </Box>
  );
};

export default PetProfilesPage;
