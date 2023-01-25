/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'mainBg': '#FFE9CF',
        'subBg': '#F3D4B1',
        'dark_1': '#2F4858',
        'dark_2': '#446970',
        'light_1': '#504538',
        'light_2': '#7B9D78'
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'popup': 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
        'input': 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
      },
      backgroundImage: {
        'mainBgImg': 'url(/src/assets/backgrounds/mainBg.svg)'
      }
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}


/* Original Color Scheme
  'mainBg': '#FFE9CF',
  'subBg': '#F3D4B1',
  'dark_1': '#2F4858',
  'dark_2': '#446970',
  'light_1': '#504538',
  'light_2': '#7B9D78'
*/