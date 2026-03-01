module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        urbano: {
          primary: '#c1292e',
          background: '#ffffff',
          active: '#c1292e',
          header: '#e2e1e1',
          red: '#c1292e',
          'red-hover': '#c1292e',
          white: '#ffffff',
          'white-hover': '#f2f2f2',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Helvetica Neue', 'Nunito Sans', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled', 'active'],
      textColor: ['disabled', 'active'],
      opacity: ['disabled', 'active'],
      scale: ['active'],
      cursor: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
