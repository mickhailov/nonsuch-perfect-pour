/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f6f0e5',
        parchment: '#fffaf1',
        ink: '#171512',
        charcoal: '#25221d',
        amber: '#cf8a20',
        gold: '#b98b34',
        foam: '#fff5d6',
      },
      fontFamily: {
        display: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 21, 18, 0.12)',
        gold: '0 16px 38px rgba(185, 139, 52, 0.24)',
      },
    },
  },
  plugins: [],
};
