/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease-in-out infinite',
        'rainbow-text': 'rainbow-text 3s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'rainbow-text': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': '0% center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% center'
          },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};
