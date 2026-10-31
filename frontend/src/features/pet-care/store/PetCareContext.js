import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  initialPets, initialVaccines, initialWeights, initialVisits,
  initialReminders, initialCases,
} from '../data/mockData';

// Tạm lưu dữ liệu Thú y thông minh trong localStorage cho tới khi có API backend.
// Đổi version khi cấu trúc dữ liệu thay đổi để không đọc nhầm dữ liệu cũ.
const STORAGE_KEY = 'petCareData.v2';

const defaultState = {
  pets: initialPets,
  vaccines: initialVaccines,
  weights: initialWeights,
  visits: initialVisits,
  reminders: initialReminders,
  appointments: [],
  cases: initialCases,
};

const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved } : defaultState;
  } catch {
    return defaultState;
  }
};

const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const PetCareContext = createContext(null);

export const PetCareProvider = ({ children }) => {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Bộ nhớ trình duyệt bị chặn/đầy - vẫn dùng được trong phiên hiện tại
    }
  }, [state]);

  const actions = useMemo(() => ({
    notify: (message, severity = 'success') => setToast({ message, severity, key: Date.now() }),
    savePet: (pet) =>
      setState((s) => ({
        ...s,
        pets: pet.id
          ? s.pets.map((p) => (p.id === pet.id ? { ...p, ...pet } : p))
          : [...s.pets, { ...pet, id: newId('p'), status: 'healthy' }],
      })),
    addVisit: (visit) =>
      setState((s) => ({ ...s, visits: [{ ...visit, id: newId('h') }, ...s.visits] })),
    addAppointment: (appointment) =>
      setState((s) => ({
        ...s,
        appointments: [{ ...appointment, id: newId('ap'), status: 'pending' }, ...s.appointments],
      })),
    setCaseState: (id, nextState) =>
      setState((s) => ({ ...s, cases: s.cases.map((c) => (c.id === id ? { ...c, state: nextState } : c)) })),
  }), []);

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return (
    <PetCareContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert onClose={() => setToast(null)} severity={toast.severity} variant="filled" sx={{ borderRadius: '12px' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </PetCareContext.Provider>
  );
};

export const usePetCare = () => {
  const ctx = useContext(PetCareContext);
  if (!ctx) throw new Error('usePetCare phải được dùng bên trong PetCareProvider');
  return ctx;
};
