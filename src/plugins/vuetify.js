import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#FABF28',
        primary_usdt: '#FABF28',
        primary_tbt: '#FABF28',
        secondary: '#181921',
        "light-secondary": '#474952',
        warning: '#D41010',
        purple: '#991594',
        darkPurple: '#4F138A',
        lightGrey: '#D8D8D8',
        pink: 'FF008A',
        darkGreen: '#0C5951',
        green: '#2FA38E',
      },
    },
  },
});
