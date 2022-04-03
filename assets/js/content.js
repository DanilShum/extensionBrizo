import Vue from 'vue';
import store from './store';
import Popup from './components/Popup/Popup';

const body = document.querySelector('body');
const brizoInner = document.createElement('div');
brizoInner.setAttribute('id', 'brizo-extension');

body.appendChild(brizoInner);

new Vue({
  el: '#brizo-extension',
  store,
  render: (createElement) => createElement(Popup),
});
