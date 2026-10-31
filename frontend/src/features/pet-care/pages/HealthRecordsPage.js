import React, { useMemo, useState } from 'react';
import {
  Box, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { usePetCare } from '../store/PetCareContext';
import { useLanguage } from '../../../i18n/LanguageContext';
import { SPECIES } from '../data/mockData';
import { Card, Notice, PageHeader, Pill, StatCard } from '../components/common';
import { HealthNoteDialog } from '../components/dialogs';
import { pc, fieldSx, outlineBtnSx } from '../petCareStyles';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const TABS = ['vaccines', 'weights', 'visits'];

const headCellSx = { color: pc.faint, fontSize: 12, fontWeight: 700, borderColor: pc.border, whiteSpace: 'nowrap', bgcolor: '#fffafb' };
const cellSx = { fontSize: 13, color: pc.ink, borderColor: pc.border, py: 2 };

const HealthRecordsPage = () => {
  const { t, pick, lang, formatDate } = useLanguage();
  const { pets, vaccines, weights, visits, addVisit, notify } = usePetCare();
  const [tab, setTab] = useState('vaccines');
  const [chartPetId, setChartPetId] = useState(pets[0]?.id || '');
  const [noteOpen, setNoteOpen] = useState(false);

  const petById = useMemo(() => Object.fromEntries(pets.map((p) => [p.id, p])), [pets]);
  const petLabel = (id) => {
    const p = petById[id];
    return p ? `${SPECIES[p.species]?.emoji || ''} ${p.name}` : t('petCare.unknown');
  };

  // Tiếng Việt: T6, T7...; tiếng Anh: Jun, Jul...
  const monthLabel = (m) => (lang === 'vi' ? `T${m}` : new Date(2026, m - 1, 1).toLocaleDateString('en-US', { month: 'short' }));

  const chartPoints = weights.filter((w) => w.petId === chartPetId);
  const chartData = {
    labels: chartPoints.map((w) => monthLabel(w.month)),
    datasets: [{
      label: t('petCare.health.chartLabel'),
      data: chartPoints.map((w) => w.kg),
      backgroundColor: chartPoints.map((_, i) => (i === chartPoints.length - 1 ? pc.primary : '#ffc2cd')),
      borderRadius: 10,
      maxBarThickness: 48,
    }],
  };

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.health.crumb')}
        eyebrow={t('petCare.health.eyebrow')}
        title={t('petCare.health.title')}
        subtitle={t('petCare.health.subtitle')}
        action={<Button startIcon={<AddIcon />} sx={outlineBtnSx} onClick={() => setNoteOpen(true)}>{t('petCare.health.addNote')}</Button>}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard icon={<ShieldOutlinedIcon />} value={vaccines.length} label={t('petCare.health.stats.vaccines')} bg={pc.primarySoft} color={pc.primary} />
        <StatCard icon={<CheckCircleOutlineIcon />} value={pets.length} label={t('petCare.health.stats.pets')} bg={pc.greenSoft} color={pc.green} />
        <StatCard icon={<CalendarMonthOutlinedIcon />} value={vaccines.filter((v) => v.status === 'upcoming').length} label={t('petCare.health.stats.reminders')} bg={pc.blueSoft} color={pc.blue} />
      </Box>

      <Box role="tablist" sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
        {TABS.map((key) => (
          <Box
            key={key} component="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            sx={{
              border: `1px solid ${tab === key ? pc.primaryBorder : 'transparent'}`, bgcolor: tab === key ? pc.primarySoft : 'transparent', fontFamily: 'inherit',
              color: tab === key ? pc.primary : pc.muted, borderRadius: '12px', px: 2, py: 1.1, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {t(`petCare.health.tabs.${key}`)}
          </Box>
        ))}
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        {tab === 'vaccines' && (
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.pet')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.vaccine')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.date')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccines.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell sx={{ ...cellSx, fontWeight: 700 }}>{petLabel(v.petId)}</TableCell>
                    <TableCell sx={cellSx}>{pick(v.name)}</TableCell>
                    <TableCell sx={cellSx}>{formatDate(v.date)}</TableCell>
                    <TableCell sx={cellSx}>
                      {v.status === 'upcoming'
                        ? <Pill tone="amber">{t('petCare.health.upcoming')}</Pill>
                        : <Pill tone="green">{t('petCare.health.done')}</Pill>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 'weights' && (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: pc.ink }}>{t('petCare.health.chartTitle', { name: petById[chartPetId]?.name || '' })}</Typography>
                <Typography sx={{ fontSize: 12, color: pc.faint }}>{t('petCare.health.chartSubtitle')}</Typography>
              </Box>
              <TextField select size="small" value={chartPetId} onChange={(e) => setChartPetId(e.target.value)} sx={{ ...fieldSx, minWidth: 160 }}>
                {pets.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </TextField>
            </Box>
            {chartPoints.length ? (
              <Box sx={{ height: 280 }}>
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: pc.faint } },
                      y: { beginAtZero: true, grid: { color: '#f6eef1' }, ticks: { color: pc.faint } },
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography sx={{ color: pc.muted, fontSize: 14, py: 6, textAlign: 'center' }}>{t('petCare.health.chartEmpty')}</Typography>
            )}
          </Box>
        )}

        {tab === 'visits' && (
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.visitDate')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.pet')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.type')}</TableCell>
                  <TableCell sx={headCellSx}>{t('petCare.health.cols.detail')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell sx={{ ...cellSx, whiteSpace: 'nowrap' }}>{formatDate(v.date)}</TableCell>
                    <TableCell sx={{ ...cellSx, fontWeight: 700 }}>{petLabel(v.petId)}</TableCell>
                    <TableCell sx={cellSx}>{pick(v.type)}</TableCell>
                    <TableCell sx={{ ...cellSx, color: pc.muted }}>{pick(v.detail)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Notice sx={{ mt: 2.5 }}>{t('petCare.health.notice')}</Notice>

      <HealthNoteDialog
        open={noteOpen}
        pets={pets}
        onClose={() => setNoteOpen(false)}
        onSave={(visit) => {
          addVisit(visit);
          setNoteOpen(false);
          setTab('visits');
          notify(t('petCare.health.noteAdded'));
        }}
      />
    </Box>
  );
};

export default HealthRecordsPage;
