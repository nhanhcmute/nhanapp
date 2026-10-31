import React from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Card, Notice, PageHeader, Pill, StatCard } from '../components/common';
import { pc, fieldSx } from '../petCareStyles';

const COLUMNS = [
  { state: 'pending', tone: 'amber' },
  { state: 'processing', tone: 'blue' },
  { state: 'done', tone: 'green' },
];

const VetCasesPage = () => {
  const { t, pick } = useLanguage();
  const { cases, setCaseState, notify } = usePetCare();
  const count = (state) => cases.filter((c) => c.state === state).length;
  const caseTitle = (c) => `${c.petName} · ${t(`petCare.species.${c.species}`)}`;

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.vet.crumb')}
        eyebrow={t('petCare.vet.eyebrow')}
        title={t('petCare.vet.title')}
        subtitle={t('petCare.vet.subtitle')}
        action={<Pill tone="amber">{t('petCare.vet.role')}</Pill>}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard icon={<ChatBubbleOutlineIcon />} value={count('pending')} label={t('petCare.vet.stats.pending')} bg={pc.primarySoft} color={pc.primary} />
        <StatCard icon={<MonitorHeartOutlinedIcon />} value={count('processing')} label={t('petCare.vet.stats.processing')} bg={pc.blueSoft} color={pc.blue} />
        <StatCard icon={<CheckCircleOutlineIcon />} value={count('done')} label={t('petCare.vet.stats.done')} bg={pc.greenSoft} color={pc.green} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {COLUMNS.map((col) => (
          <Card key={col.state} sx={{ p: 2, minHeight: { md: 300 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 800, color: pc.ink }}>{t(`petCare.vet.columns.${col.state}`)}</Typography>
              <Pill tone={col.tone}>{count(col.state)}</Pill>
            </Box>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {cases.filter((c) => c.state === col.state).map((c) => (
                <Box key={c.id} sx={{ p: 2, borderRadius: '14px', border: `1px solid ${pc.border}`, bgcolor: '#fff' }}>
                  <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 14 }}>{caseTitle(c)}</Typography>
                  <Typography sx={{ fontSize: 12, color: pc.muted, mt: 0.5 }}>{pick(c.description)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.5 }}>
                    <Typography sx={{ fontSize: 11, color: pc.faint }}>{pick(c.time)}</Typography>
                    <TextField
                      select size="small" value={c.state}
                      onChange={(e) => { setCaseState(c.id, e.target.value); notify(t('petCare.vet.updated', { title: caseTitle(c) })); }}
                      sx={{ ...fieldSx, '& .MuiSelect-select': { fontSize: 12, py: 0.75 } }}
                    >
                      {COLUMNS.map((o) => <MenuItem key={o.state} value={o.state} sx={{ fontSize: 13 }}>{t(`petCare.vet.options.${o.state}`)}</MenuItem>)}
                    </TextField>
                  </Box>
                </Box>
              ))}
              {!count(col.state) && (
                <Typography sx={{ fontSize: 12, color: pc.faint, textAlign: 'center', py: 4 }}>{t('petCare.vet.empty')}</Typography>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      <Notice sx={{ mt: 2.5 }}>{t('petCare.vet.notice')}</Notice>
    </Box>
  );
};

export default VetCasesPage;
