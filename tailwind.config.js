module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        averta: ['AvertaStd'],
      },
      colors: {
        primary: {
          light: '#025159',
          dark: '#011c26'
        },
        nearblack: '#030608',
        green: '#17bf50',
        red: '#ef4444'
      },
      height: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      width: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      scale: {
        '102': '1.02'
      }
    }
  },
  variants: {
    extend: {
      brightness: ['hover'],
    }
  },
  plugins: []
};
