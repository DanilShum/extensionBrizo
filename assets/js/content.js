import Vue from 'vue';
import '@/sass/styles.scss';
import Popup from '@/js/components/Popup/Popup';
import { prototypeExtension } from '@/js/plugins/extension';
import store from '@/js/stores/content/store';

prototypeExtension.runtimeOnMessage(function (req, sender, response) {
  store.commit(`${req.entity}/set`, {
    list: req[req.entity],
  });

  store.commit('set', { isOpenedPopup: req.inspection });

  const extension = document.getElementById('brizo-extension');

  if (store.state.isOpenedPopup && extension) {
    store.commit('set', { hideInspector: !store.state.hideInspector });
  }

  if (store.state.isOpenedPopup && !extension) {
    const body = document.querySelector('body');
    const brizoInner = document.createElement('div');
    brizoInner.setAttribute('id', 'brizo-extension');

    body.appendChild(brizoInner);

    Vue.prototype.$Extension = prototypeExtension;

    new Vue({
      el: '#brizo-extension',
      store,
      render: (createElement) => createElement(Popup),
    });
  }

  return true;
});
