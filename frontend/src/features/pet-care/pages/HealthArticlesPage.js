import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { articles } from '../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { PageHeader } from '../components/common';
import { ArticleDialog } from '../components/dialogs';
import { pc, cardSx } from '../petCareStyles';

const HealthArticlesPage = () => {
  const { t, pick } = useLanguage();
  const [openArticle, setOpenArticle] = useState(null);

  return (
    <Box>
      <PageHeader
        crumb={t('petCare.articles.crumb')}
        eyebrow={t('petCare.articles.eyebrow')}
        title={t('petCare.articles.title')}
        subtitle={t('petCare.articles.subtitle')}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        {articles.map((a) => (
          <Box
            key={a.id} component="button" onClick={() => setOpenArticle(a)}
            sx={{
              ...cardSx, p: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', font: 'inherit', transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(255, 107, 129, 0.14)' },
            }}
          >
            <Box sx={{ position: 'relative', height: 130, background: a.gradient, display: 'grid', placeItems: 'center', fontSize: 64 }}>
              <Box component="span" sx={{ position: 'absolute', top: 14, left: 14, bgcolor: '#fff', color: pc.primary, fontSize: 11, fontWeight: 700, borderRadius: '8px', px: 1.25, py: 0.5 }}>
                {pick(a.tag)}
              </Box>
              {a.emoji}
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 800, color: pc.ink, fontSize: 16, lineHeight: 1.4 }}>{pick(a.title)}</Typography>
              <Typography sx={{ fontSize: 12, color: pc.muted, mt: 1, lineHeight: 1.6 }}>{pick(a.summary)}</Typography>
              <Typography sx={{ fontSize: 13, color: pc.primary, fontWeight: 700, mt: 1.5 }}>{t('petCare.articles.read')}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <ArticleDialog article={openArticle} onClose={() => setOpenArticle(null)} />
    </Box>
  );
};

export default HealthArticlesPage;
