import React, { useState } from 'react';
import { Box, Button, MenuItem, Radio, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { doctors, timeSlots } from '../data/mockData';
import { Card, PageHeader, Pill } from '../components/common';
import { pc, fieldSx, primaryBtnSx, outlineBtnSx } from '../petCareStyles';

const StepTitle = ({ icon, children }) => (
  <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 16, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <Box component="span" sx={{ color: pc.primary, display: 'flex' }}>{icon}</Box>
    {children}
  </Typography>
);

const SummaryRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.9, fontSize: 13 }}>
    <Box component="span" sx={{ color: pc.faint }}>{label}</Box>
    <Box component="span" sx={{ color: pc.ink, fontWeight: 800, textAlign: 'right' }}>{value}</Box>
  </Box>
);

const todayIso = () => new Date().toISOString().slice(0, 10);

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { t, pick, formatDate } = useLanguage();
  const { pets, addAppointment, notify } = usePetCare();
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [reason, setReason] = useState('');
  // Lưu mã lỗi (không lưu chữ) để thông báo lỗi đổi theo ngôn ngữ
  const [errors, setErrors] = useState({});

  const doctor = doctors.find((d) => d.id === doctorId);
  const pet = pets.find((p) => p.id === petId);
  const errorText = (field) => (errors[field] ? t(`petCare.booking.errors.${errors[field]}`) : undefined);

  const submit = () => {
    const nextErrors = {};
    if (!date) nextErrors.date = 'date';
    else if (date < todayIso()) nextErrors.date = 'pastDate';
    if (!reason.trim()) nextErrors.reason = 'reason';
    if (!petId) nextErrors.pet = 'pet';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    addAppointment({ doctorId, petId, date, time, reason: reason.trim(), mode: 'in-clinic' });
    notify(t('petCare.booking.sent', { pet: pet.name, time, date: formatDate(date) }));
    setReason('');
  };

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.booking.crumb')}
        eyebrow={t('petCare.booking.eyebrow')}
        title={t('petCare.booking.title')}
        subtitle={t('petCare.booking.subtitle')}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.25fr) minmax(300px, 1fr)' }, gap: 2.5, alignItems: 'start' }}>
        <Card sx={{ p: { xs: 2.5, md: 3 } }}>
          <StepTitle icon={<GroupsOutlinedIcon fontSize="small" />}>{t('petCare.booking.step1')}</StepTitle>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            {doctors.map((d) => {
              const selected = d.id === doctorId;
              return (
                <Box
                  key={d.id} component="label"
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '16px', cursor: 'pointer',
                    border: `1px solid ${selected ? pc.primary : pc.border}`, bgcolor: selected ? pc.primarySoft : '#fff', transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: selected ? '#fff' : pc.blueSoft, display: 'grid', placeItems: 'center', fontSize: 30, flexShrink: 0 }}>
                    {d.avatar}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: pc.ink }}>{pick(d.name)}</Typography>
                      {d.available && <Pill tone="green">{t('petCare.booking.accepting')}</Pill>}
                    </Box>
                    <Typography sx={{ fontSize: 12, color: pc.muted, mt: 0.25 }}>{pick(d.specialty)}</Typography>
                    <Typography sx={{ fontSize: 12, color: pc.amber, mt: 0.25 }}>★ {d.rating}</Typography>
                  </Box>
                  <Radio checked={selected} onChange={() => setDoctorId(d.id)} value={d.id} sx={{ color: pc.primaryBorder, '&.Mui-checked': { color: pc.primary } }} />
                </Box>
              );
            })}
          </Box>

          <Box sx={{ borderTop: `1px solid ${pc.border}`, my: 3 }} />

          <StepTitle icon={<CalendarMonthOutlinedIcon fontSize="small" />}>{t('petCare.booking.step2')}</StepTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label={t('petCare.booking.date')} type="date" value={date} onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }} inputProps={{ min: todayIso() }}
              error={Boolean(errors.date)} helperText={errorText('date')} sx={fieldSx}
            />
            <TextField select label={t('petCare.booking.pet')} value={petId} onChange={(e) => setPetId(e.target.value)} error={Boolean(errors.pet)} helperText={errorText('pet')} sx={fieldSx}>
              {pets.map((p) => <MenuItem key={p.id} value={p.id}>{p.name} · {t(`petCare.species.${p.species}`)}</MenuItem>)}
            </TextField>
          </Box>

          <Typography sx={{ fontSize: 13, fontWeight: 700, color: pc.ink, mt: 2.5, mb: 1 }}>{t('petCare.booking.slots')}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {timeSlots.map((slot) => {
              const selected = slot === time;
              return (
                <Box
                  key={slot} component="button" type="button" onClick={() => setTime(slot)} aria-pressed={selected}
                  sx={{
                    py: 1.1, borderRadius: '10px', cursor: 'pointer', fontSize: 13, fontWeight: selected ? 800 : 500, fontFamily: 'inherit',
                    border: `1px solid ${selected ? pc.primary : pc.border}`, bgcolor: selected ? pc.primarySoft : '#fff', color: selected ? pc.primary : pc.muted,
                    '&:hover': { borderColor: pc.primaryBorder },
                  }}
                >
                  {slot}
                </Box>
              );
            })}
          </Box>

          <TextField
            label={t('petCare.booking.reason')} multiline minRows={4} fullWidth value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder={t('petCare.booking.reasonPlaceholder')} error={Boolean(errors.reason)} helperText={errorText('reason')}
            sx={{ ...fieldSx, mt: 2.5 }}
          />
        </Card>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card sx={{ p: { xs: 2.5, md: 3 } }}>
            <StepTitle icon={<AssignmentOutlinedIcon fontSize="small" />}>{t('petCare.booking.step3')}</StepTitle>
            <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#fffafb', border: `1px solid ${pc.primaryBorder}` }}>
              <Typography sx={{ fontWeight: 800, color: pc.ink, mb: 1 }}>{t('petCare.booking.summaryTitle')}</Typography>
              <SummaryRow label={t('petCare.booking.summary.pet')} value={pet?.name || t('petCare.booking.notChosen')} />
              <SummaryRow label={t('petCare.booking.summary.doctor')} value={pick(doctor?.name)} />
              <SummaryRow label={t('petCare.booking.summary.date')} value={date ? formatDate(date) : t('petCare.booking.notChosen')} />
              <SummaryRow label={t('petCare.booking.summary.time')} value={time} />
              <SummaryRow label={t('petCare.booking.summary.mode')} value={t('petCare.booking.inClinic')} />
              <Typography sx={{ fontSize: 11, color: pc.faint, mt: 1.5, pt: 1.5, borderTop: `1px solid ${pc.border}` }}>
                {t('petCare.booking.confirmNote')}
              </Typography>
            </Box>
            <Button fullWidth startIcon={<CheckCircleOutlineIcon />} sx={{ ...primaryBtnSx, mt: 2.5, py: 1.4 }} onClick={submit}>
              {t('petCare.booking.submit')}
            </Button>
          </Card>

          <Card sx={{ p: 2.5 }}>
            <Typography sx={{ fontWeight: 800, color: pc.ink }}>{t('petCare.booking.emergencyTitle')}</Typography>
            <Typography sx={{ fontSize: 13, color: pc.muted, mt: 0.5, mb: 1.5 }}>
              {t('petCare.booking.emergencyText')}
            </Typography>
            <Button size="small" sx={{ ...outlineBtnSx, py: 0.75 }} onClick={() => navigate('/pet-care/articles')}>
              {t('petCare.booking.emergencyBtn')}
            </Button>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default BookAppointmentPage;
