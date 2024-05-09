export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003045',
        subPrimary: '#0D4F72',
        darkPrimary: '#002434',
        lightPrimary: '#EBF2FA',
        secondary: '#48A393',
        accent: '#E83550',
        lightAccent: '#FFF1F1',
        background: '#F6F6F6',
        black: '#111111',
        White: '#FEFEFE',
        lightGrey: '#C8CDD0',
        darkGrey: '#7E7E7E',
        success: '#459E19',
        warning: '#EDB95E',
        error: '#CA2222',
        information: '#4A90E2',
      }
    },
    fontFamily: {
      custom: ['inter', '']
    }
  },
  plugins: [],
}

