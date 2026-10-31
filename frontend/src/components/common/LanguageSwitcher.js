import React from 'react';
import { Box } from '@mui/material';
import { useLanguage, LANGUAGES } from '../../i18n/LanguageContext';

// Nút gạt VI | EN dùng trên Header (desktop và drawer mobile)
const LanguageSwitcher = ({ sx }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <Box
      role="group"
      aria-label={t('lang.label')}
      sx={{
        display: 'inline-flex',
        p: '3px',
        borderRadius: '12px',
        border: '2px solid rgba(255, 107, 129, 0.35)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        flexShrink: 0,
        ...sx,
      }}
    >
      {LANGUAGES.map((code) => {
        const active = code === lang;
        return (
          <Box
            key={code}
            component="button"
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            title={t(`lang.${code}`)}
            sx={{
              border: 0,
              cursor: 'pointer',
              borderRadius: '9px',
              px: 1.1,
              py: 0.4,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
              color: active ? '#fff' : '#ff6b81',
              backgroundColor: active ? '#ff6b81' : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: active ? '#ff4757' : 'rgba(255, 107, 129, 0.12)' },
            }}
          >
            {code.toUpperCase()}
          </Box>
        );
      })}
    </Box>
  );
};

export default LanguageSwitcher;
