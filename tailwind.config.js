/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose:    { DEFAULT: '#E8647A', light: '#FDE8EC', dark: '#C04060' },
        lilac:   { DEFAULT: '#B8A9C9', light: '#F0ECF7', dark: '#8B7AAA' },
        sage:    { DEFAULT: '#7FAF8B', light: '#EBF4EE', dark: '#5A8B68' },
        peach:   { DEFAULT: '#F4A97F', light: '#FEF0E7', dark: '#D07C50' },
        cream:   { DEFAULT: '#FDF8F4' },
        charcoal:{ DEFAULT: '#2D2D35' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        soft: '0 4px 24px rgba(232,100,122,0.10)',
        card: '0 2px 16px rgba(45,45,53,0.07)',
        glow: '0 0 30px rgba(232,100,122,0.25)',
      },
    },
  },
  plugins: [],
};
