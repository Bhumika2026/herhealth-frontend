// src/context/CycleContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';

const CycleContext = createContext(null);

export const CycleProvider = ({ children }) => {
  const { user } = useAuth();
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.onboardingComplete) fetchCycleInfo();
  }, [user]);

  const fetchCycleInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cycle/current');
      setCycleInfo(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logPeriod = async (payload) => {
    const { data } = await api.post('/cycle/log', payload);
    await fetchCycleInfo();
    return data;
  };

  const PHASE_INFO = {
    menstrual:   { label: 'Menstrual',   color: '#E8647A', bg: '#FDE8EC', emoji: '🩸' },
    follicular:  { label: 'Follicular',  color: '#7FAF8B', bg: '#EBF4EE', emoji: '🌱' },
    ovulation:   { label: 'Ovulation',   color: '#F4A97F', bg: '#FEF0E7', emoji: '✨' },
    luteal:      { label: 'Luteal',      color: '#B8A9C9', bg: '#F0ECF7', emoji: '🌙' },
  };

  const phaseInfo = cycleInfo ? PHASE_INFO[cycleInfo.phase] : null;

  return (
    <CycleContext.Provider value={{ cycleInfo, loading, fetchCycleInfo, logPeriod, phaseInfo, PHASE_INFO }}>
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => useContext(CycleContext);
