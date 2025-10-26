/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f5ff',
          100: '#e2ecff',
          200: '#c5daff',
          300: '#9ab9ff',
          400: '#7094ff',
          500: '#4c6dff',
          600: '#344def',
          700: '#2838c0',
          800: '#212f94',
          900: '#1f2b76'
        }
      }
    }
  },
  plugins: []
};
