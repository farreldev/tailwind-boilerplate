module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    container: {
      center: true
    },
    screens: {
      '2xl': {'min': '1280px'},
      'xl': {'max': '1279px'},
      'lg': {'max': '1023px'},
      'md': {'max': '767px'},
      'sm': {'max': '575px'}
    },
    extend: {},
  },
  plugins: [],
}
