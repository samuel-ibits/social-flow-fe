/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
import 
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        moveText: {
          '0%': { transform: 'translateX(-100%)', fontWeight: '400' },
          '50%': { fontWeight: '700' }, // Bolder in the middle
          '100%': { transform: 'translateX(100%)', fontWeight: '400' },
        },
      },
      animation: {
        moveText: 'moveText 8s linear infinite',
      },
      colors: {
        primary: {
          subtle: '#CBBCE1',
          hover: '#42236F',
          lighter: '#9778C4',
          light: {
            1: '#D9CFE8',
            3: '#EEE9F5',
            4: '#F7F3FB',
            DEFAULT: '#4984E8',
          },
          purple: '#B78BF2',
          DEFAULT: '#6335A6',
        },
        "new-primary": {
          DEFAULT: "#6514DA",
        },
        "new-light": {
          DEFAULT: "#FAF9FB",
        },
        grey: {
          light: '#87838C',
          DEFAULT: '#FAFAFA',
          subtle: '#CFCED1',
        },
        heading: {
          DEFAULT: '#0F0819',
        },
        body: {
          DEFAULT: '#5F5A66',
        },
        success: {
          lighter: '#39D98A',
          darker: '#05A660',
        },
        error: {
          DEFAULT: '#FF3B3B',
        },
        info: {
          lighter: '#5B8DEF',
          darker: '#004FC4',
        },
        secondary: {
          DEFAULT: '#F72688',
        },
        white: '#FFFFFF',
        color1:
          '#6335A6' /* this has been replaced with (primary -> DEFAULT) */,
        color2:
          '#4984E8' /* this has been replaced with (primary -> light ->  DEFAULT) */,
        color3: '#F0F0F0',
        color4: '#D9CFE8',
        background: {
          1: '#080111',
          2: '#333333',
        },
      },
      borderRadius: {
        '4xl': '27px',
      },
      boxShadow: {
        small: '4px 4px 12px rgba(0, 0, 0, 0.1)',
        md: '4px 4px 12px rgba(0, 0, 0, 0.1)',
        large:
          '6px 0px 12px rgba(0, 0, 0, 0.04), 0px 6px 12px rgba(0, 0, 0, 0.04)',
      },
    },
    fontFamily: {
      satoshi: ['Satoshi', 'sans-serif'],
      sans: ['"Neue Helvetica"', 'sans-serif'],
      libre: ['"Libre Baskerville"'],
    },
  },

  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* hide scrollbar for IE and Edge */
          '-ms-overflow-style': 'none',

          /* hide scrollbar for Firefox */
          'scrollbar-width': 'none',

          /* hide scrollbar for Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
    // require("tailwind-scrollbar")
  ],
};
