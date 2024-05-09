/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#003045',
        'sub-primary' : '#0D4F72',
        'primary-dark' : '#002434',
        'neutral-white' : '#FEFEFE',
        'neutral-dark-grey' : '#7E7E7E',
        'light-accent' : '#D9D9D9',
      },
    },
  },
  plugins: [],
}

