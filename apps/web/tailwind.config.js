/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF9F0',
        canvas: '#FFFFFF',
        ink: '#2C2023',
        midnight: '#40101F',
        burgundy: '#681F32',
        accent: '#B8893D',
        champagne: '#DEC69A',
        surface: '#FFFFFF',
        muted: '#75676A',
        line: '#E9DDD2',
        pearl: '#FFF9F0',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 35, 71, 0.08)',
        lift: '0 20px 60px rgba(15, 35, 71, 0.13)',
        luxe: '0 26px 80px rgba(9, 22, 45, 0.16)',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
}
