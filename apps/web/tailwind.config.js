/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF9F0',
        canvas: '#FFFFFF',
        ink: '#2F2A2C',
        midnight: '#40101F',
        burgundy: '#681F32',
        accent: '#B8893D',
        champagne: '#DEC69A',
        surface: '#FFFFFF',
        muted: '#746A6D',
        line: '#E4D9CD',
        pearl: '#FFF9F0',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 36px rgba(47, 42, 44, 0.08)',
        lift: '0 20px 60px rgba(47, 42, 44, 0.12)',
        luxe: '0 28px 80px rgba(47, 42, 44, 0.16)',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
}
