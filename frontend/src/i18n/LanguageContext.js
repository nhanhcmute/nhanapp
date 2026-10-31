import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import vi from './translations/vi';
import en from './translations/en';
import pageNamespaces from './pages';

// Bộ chuyển ngôn ngữ Việt/Anh cho toàn site. Ngôn ngữ được nhớ trong localStorage.
// Từ điển chung nằm ở translations/{vi,en}.js; mỗi trang có thêm 1 file trong i18n/pages/
// dạng { vi: {...}, en: {...} }, được gộp vào theo tên namespace (vd: t('checkout.title')).
const withPages = (base, lang) => ({
  ...base,
  ...Object.fromEntries(Object.entries(pageNamespaces).map(([name, dict]) => [name, dict[lang]])),
});
const dictionaries = { vi: withPages(vi, 'vi'), en: withPages(en, 'en') };
export const LANGUAGES = ['vi', 'en'];
const STORAGE_KEY = 'lang';

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // localStorage bị chặn - dùng mặc định
  }
  return 'vi';
};

const lookup = (dict, key) => key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);

const interpolate = (value, vars) =>
  typeof value === 'string' && vars
    ? value.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined && vars[name] !== null ? vars[name] : ''))
    : value;

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // bỏ qua
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (LANGUAGES.includes(next)) setLangState(next);
  }, []);

  // t('nav.home') hoặc t('petCare.toast.added', { name: 'Milo' }).
  // Thiếu bản dịch tiếng Anh thì rơi về tiếng Việt, thiếu nữa thì trả về chính key.
  const t = useCallback((key, vars) => {
    const value = lookup(dictionaries[lang], key) ?? lookup(dictionaries.vi, key);
    return value === undefined ? key : interpolate(value, vars);
  }, [lang]);

  // Chọn đúng ngôn ngữ cho dữ liệu song ngữ dạng { vi, en }; chuỗi thường trả về nguyên vẹn.
  const pick = useCallback((value) => {
    if (value && typeof value === 'object' && ('vi' in value || 'en' in value)) return value[lang] ?? value.vi;
    return value;
  }, [lang]);

  const formatDate = useCallback((iso, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', options);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick, formatDate }), [lang, setLang, t, pick, formatDate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage phải được dùng bên trong LanguageProvider');
  return ctx;
};
