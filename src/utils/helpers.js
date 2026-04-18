// src/utils/helpers.js
import { format, formatDistanceToNow, differenceInDays, addDays } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') =>
  date ? format(new Date(date), fmt) : '—';

export const formatRelative = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '—';

export const daysBetween = (a, b) =>
  differenceInDays(new Date(b), new Date(a));

export const addDaysTo = (date, days) => addDays(new Date(date), days);

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const formatCurrency = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

// Cycle phase tips
export const PHASE_TIPS = {
  menstrual: [
    'Rest and prioritize gentle movement',
    'Stay warm and use a heating pad for cramps',
    'Increase iron intake — leafy greens & lentils',
    'Avoid caffeine to reduce cramp severity',
  ],
  follicular: [
    'Great time to start new projects — energy rising!',
    'Include fermented foods for gut health',
    'Try HIIT or strength training this week',
    'Focus on creative and social activities',
  ],
  ovulation: [
    'Your energy and confidence peak today',
    'Cooling foods: cucumbers, coconut water, greens',
    'Great time for important conversations',
    'Stay hydrated — temperature is naturally higher',
  ],
  luteal: [
    'Include magnesium-rich foods (dark chocolate!)',
    'Practice light yoga or walking',
    'Get 7–8 hours of sleep',
    'Reduce salt to minimize bloating',
  ],
};

export const MOOD_EMOJIS = {
  happy:       '😊',
  calm:        '😌',
  content:     '🙂',
  excited:     '🤩',
  grateful:    '🥹',
  sad:         '😢',
  anxious:     '😰',
  irritable:   '😤',
  angry:       '😠',
  lonely:      '😔',
  tired:       '😴',
  energetic:   '⚡',
  sensitive:   '🌸',
  hopeful:     '🌟',
  overwhelmed: '😵',
  romantic:    '💕',
  focused:     '🎯',
  playful:     '😜',
  moody:       '🌧️',
  neutral:     '😐',
};

export const MOOD_COLORS = {
  happy: '#F4D03F', calm: '#7FB3D3', content: '#82E0AA', excited: '#FF6B9D',
  grateful: '#C39BD3', sad: '#85C1E9', anxious: '#F0B27A', irritable: '#EC7063',
  angry: '#E74C3C', lonely: '#95A5A6', tired: '#BDC3C7', energetic: '#F1C40F',
  sensitive: '#E8A0BF', hopeful: '#52BE80', overwhelmed: '#E59866',
  romantic: '#E91E63', focused: '#5DADE2', playful: '#F39C12', moody: '#7F8C8D', neutral: '#ABB2B9',
};
