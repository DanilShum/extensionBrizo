import Vue from 'vue';
import store from './store';
import Popup from './components/Popup/Popup';
import '../sass/styles.scss';

window.chrome.runtime.onMessage.addListener(function (req, sender, response) {
  store.commit('user/set', { isOpenedPopup: req.inspection });

  if (store.state.user.isOpenedPopup && !document.getElementById('brizo-extension')) {
    const body = document.querySelector('body');
    const brizoInner = document.createElement('div');
    brizoInner.setAttribute('id', 'brizo-extension');

    body.appendChild(brizoInner);

    new Vue({
      el: '#brizo-extension',
      store,
      render: (createElement) => createElement(Popup),
    });
  }
});
