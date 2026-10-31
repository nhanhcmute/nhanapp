import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const DEFAULT_STORE_NAME = "Nhân's Pet Haven";

// Cache đơn giản trong bộ nhớ (module-level) để nhiều component dùng hook này trên
// cùng 1 lượt tải trang không phải gọi API lặp lại nhiều lần.
let cachedSettings = null;
let pendingFetch = null;

const fetchSettings = async () => {
  if (cachedSettings) return cachedSettings;
  if (!pendingFetch) {
    pendingFetch = fetch(`${API_URL}/settings.ctr/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((result) => {
        cachedSettings = result?.status === 200 ? result.data : {};
        return cachedSettings;
      })
      .catch(() => {
        cachedSettings = {};
        return cachedSettings;
      });
  }
  return pendingFetch;
};

// Lấy tên/logo cửa hàng đã lưu ở trang Cài đặt admin, có fallback về tên mặc định
// nếu admin chưa cấu hình (storeName rỗng) hoặc API lỗi.
export const useStoreSettings = () => {
  const [storeName, setStoreName] = useState(DEFAULT_STORE_NAME);
  const [storeLogo, setStoreLogo] = useState(null);
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((settings) => {
      if (!mounted) return;
      if (settings?.storeName) setStoreName(settings.storeName);
      if (settings?.storeLogo) setStoreLogo(settings.storeLogo);
      if (settings?.contactInfo) setContactInfo(settings.contactInfo);
    });
    return () => { mounted = false; };
  }, []);

  return { storeName, storeLogo, contactInfo };
};
