export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#071b40',
        secondary: '#7585FF',
        accent: '#00B500',
        light: '#EFF1FF',
        dark: '#020C1D',
        black: '#111111',
        white: '#FEFEFE',
        'grey-background': '#F3F5F7',
        'grey-surface': '#F6F6F6',
        'grey-border': '#D8DBD8',
        'grey-placeholder': '#ABADAB',
        'grey-text': '#7E7E7E',
        success: '#459E19',
        warning: '#EDB95E',
        error: '#CA2222',
        information: '#4A90E2'
      }
    }
  },
  plugins: []
}
