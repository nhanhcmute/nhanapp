// Bảng màu & style dùng chung cho module Thú y thông minh.
// Màu chủ đạo #ff6b81 trùng với Header/HomePage hiện tại của website.
export const pc = {
  primary: '#ff6b81',
  primaryDark: '#ff4757',
  primarySoft: '#fff0f3',
  primaryBorder: '#ffd3dc',
  ink: '#2b2d42',
  muted: '#77727f',
  faint: '#a39fac',
  border: '#f3e4e9',
  pageBg: '#fffafb',
  green: '#22a06b',
  greenSoft: '#e7f7ef',
  blue: '#4a86f0',
  blueSoft: '#edf3ff',
  amber: '#d98a1c',
  amberSoft: '#fff5e4',
  amberBorder: '#f6e2bd',
  red: '#e5484d',
  redSoft: '#fff1f0',
  purpleSoft: '#f5edff',
};

export const cardSx = {
  bgcolor: '#fff',
  border: `1px solid ${pc.border}`,
  borderRadius: '20px',
  boxShadow: '0 6px 24px rgba(255, 107, 129, 0.06)',
};

export const primaryBtnSx = {
  bgcolor: pc.primary,
  color: '#fff',
  borderRadius: '12px',
  px: 2.5,
  py: 1.1,
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 6px 16px rgba(255, 107, 129, 0.3)',
  '&:hover': { bgcolor: pc.primaryDark, boxShadow: '0 8px 20px rgba(255, 107, 129, 0.4)' },
};

export const outlineBtnSx = {
  color: pc.primary,
  bgcolor: '#fff',
  border: `1px solid ${pc.primaryBorder}`,
  borderRadius: '12px',
  px: 2.5,
  py: 1.1,
  fontWeight: 700,
  textTransform: 'none',
  '&:hover': { bgcolor: pc.primarySoft, borderColor: pc.primary },
};

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#fff',
    '& fieldset': { borderColor: pc.border },
    '&:hover fieldset': { borderColor: pc.primaryBorder },
    '&.Mui-focused fieldset': { borderColor: pc.primary },
  },
  '& label.Mui-focused': { color: pc.primary },
};

// Ô icon tròn góc có nền nhạt (dùng cho thẻ thống kê, thao tác nhanh...)
export const iconBoxSx = (bg, color) => ({
  width: 46,
  height: 46,
  borderRadius: '14px',
  bgcolor: bg,
  color,
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  fontSize: 22,
});

export const tonePill = {
  green: { bgcolor: pc.greenSoft, color: pc.green },
  amber: { bgcolor: pc.amberSoft, color: pc.amber },
  blue: { bgcolor: pc.blueSoft, color: pc.blue },
  pink: { bgcolor: pc.primarySoft, color: pc.primary },
};
