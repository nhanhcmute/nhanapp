import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogContent, IconButton, MenuItem, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SPECIES } from '../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { pc, fieldSx, primaryBtnSx, outlineBtnSx } from '../petCareStyles';
import { Notice } from './common';

const PetCareDialog = ({ open, onClose, title, children }) => {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '22px', m: 2, width: 'calc(100% - 32px)' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5 }}>
        <Typography sx={{ fontSize: 19, fontWeight: 800, color: pc.ink }}>{title}</Typography>
        <IconButton onClick={onClose} aria-label={t('common.close')} size="small"><CloseIcon /></IconButton>
      </Box>
      <DialogContent sx={{ px: 3, pb: 3 }}>{children}</DialogContent>
    </Dialog>
  );
};

const DialogActions = ({ onClose, submitLabel }) => {
  const { t } = useLanguage();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
      <Button onClick={onClose} sx={outlineBtnSx}>{t('common.cancel')}</Button>
      <Button type="submit" sx={primaryBtnSx}>{submitLabel}</Button>
    </Box>
  );
};

const emptyPet = { name: '', species: 'dog', breed: '', sex: 'male', age: '', weight: '' };

export const PetFormDialog = ({ open, onClose, onSave, pet }) => {
  const { t, pick } = useLanguage();
  const [form, setForm] = useState(emptyPet);

  useEffect(() => {
    if (open) {
      setForm(pet
        ? { ...pet, breed: pick(pet.breed) || '', age: String(pet.age ?? ''), weight: String(pet.weight ?? '') }
        : emptyPet);
    }
  }, [open, pet, pick]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      name: form.name.trim(),
      breed: form.breed.trim() || t('petCare.unknownBreed'),
      age: form.age === '' ? '' : Number(form.age),
      weight: parseFloat(form.weight) || 0,
    });
  };

  return (
    <PetCareDialog open={open} onClose={onClose} title={t(pet ? 'petCare.pets.form.editTitle' : 'petCare.pets.form.addTitle')}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
        <TextField label={t('petCare.pets.form.name')} required value={form.name} onChange={set('name')} sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }} />
        <TextField select label={t('petCare.pets.form.species')} value={form.species} onChange={set('species')} sx={fieldSx}>
          {Object.entries(SPECIES).map(([key, s]) => <MenuItem key={key} value={key}>{s.emoji} {t(`petCare.species.${key}`)}</MenuItem>)}
        </TextField>
        <TextField label={t('petCare.pets.form.breed')} value={form.breed} onChange={set('breed')} sx={fieldSx} />
        <TextField select label={t('petCare.pets.form.sex')} value={form.sex} onChange={set('sex')} sx={fieldSx}>
          <MenuItem value="male">{t('petCare.sex.male')}</MenuItem>
          <MenuItem value="female">{t('petCare.sex.female')}</MenuItem>
        </TextField>
        <TextField
          label={t('petCare.pets.form.age')} type="number" inputProps={{ min: 0, step: 1 }}
          value={form.age} onChange={set('age')} sx={fieldSx}
        />
        <TextField
          label={t('petCare.pets.form.weight')} type="number" inputProps={{ min: 0, step: 0.1 }}
          value={form.weight} onChange={set('weight')} sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }}
        />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <DialogActions onClose={onClose} submitLabel={t(pet ? 'petCare.pets.form.submitEdit' : 'petCare.pets.form.submitAdd')} />
        </Box>
      </Box>
    </PetCareDialog>
  );
};

export const HealthNoteDialog = ({ open, onClose, onSave, pets }) => {
  const { t } = useLanguage();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ petId: '', date: today, detail: '' });

  useEffect(() => {
    if (open) setForm({ petId: pets[0]?.id || '', date: today, detail: '' });
  }, [open, pets, today]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.petId || !form.detail.trim()) return;
    // Loại ghi nhận lưu dạng song ngữ để hiển thị đúng khi đổi ngôn ngữ
    onSave({ ...form, detail: form.detail.trim(), type: { vi: 'Ghi chú của chủ nuôi', en: "Owner's note" } });
  };

  return (
    <PetCareDialog open={open} onClose={onClose} title={t('petCare.health.noteForm.title')}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, pt: 1 }}>
        <TextField select label={t('petCare.health.noteForm.pet')} value={form.petId} onChange={set('petId')} sx={fieldSx}>
          {pets.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
        <TextField label={t('petCare.health.noteForm.date')} type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} sx={fieldSx} />
        <TextField
          label={t('petCare.health.noteForm.content')} required multiline minRows={3} value={form.detail} onChange={set('detail')}
          placeholder={t('petCare.health.noteForm.placeholder')} sx={fieldSx}
        />
        <DialogActions onClose={onClose} submitLabel={t('petCare.health.noteForm.submit')} />
      </Box>
    </PetCareDialog>
  );
};

export const ArticleDialog = ({ article, onClose }) => {
  const { t, pick } = useLanguage();
  return (
    <PetCareDialog open={Boolean(article)} onClose={onClose} title={article ? pick(article.title) : ''}>
      {article && (
        <>
          <Box sx={{ height: 120, borderRadius: '16px', background: article.gradient, display: 'grid', placeItems: 'center', fontSize: 56, mb: 2 }}>
            {article.emoji}
          </Box>
          <Typography sx={{ color: pc.muted, fontSize: 14, lineHeight: 1.9 }}>{pick(article.body)}</Typography>
          <Notice sx={{ mt: 2.5 }}>{t('petCare.articles.disclaimer')}</Notice>
        </>
      )}
    </PetCareDialog>
  );
};
