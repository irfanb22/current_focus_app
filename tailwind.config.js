/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#B0D9E8',
        background: '#F9FAFB',
        'background-alt': '#EDEFF1',
        success: '#D6F5E3',
        'text-primary': '#2E3A45',
      },
    },
  },
  plugins: [],
};