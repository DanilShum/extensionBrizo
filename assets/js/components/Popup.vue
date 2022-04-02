<template>
  <div class="wrapper">
    <img src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg" alt="Лого"/>
    <h1 class="title">Brizo CRM</h1>

    <spinner v-if="pending" :size="50" style="padding: 50px"/>
    <div v-if="!isAuth">Вы не авторизированны</div>
    <profile v-else-if="!pending"/>

    <button type="button" class="link-button" @click="linkTo">Перейти в Brizo</button>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import Profile from './Profile';
import Spinner from './Spinner';

export default {
  components: {Spinner, Profile},
  data() {
    return {
      active: true,
      list: 'example.com',
      icons: {
        active: 'images/icon-48x48.png',
        inactive: 'images/icon-48x48-off.png',
      },
      newlink: {},
    };
  },
  created() {
    chrome.storage.sync.get(['toggleSitesActive', 'toggleSitesList'], (result) => {
      this.active = result.toggleSitesActive;
      this.list = result.toggleSitesList;
    });
    this.fetchUser();
    this.fetchUnreadNotificationsCount();
  },
  computed: {
    ...mapState('user', ['pending', 'isAuth']),
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'fetchUnreadNotificationsCount']),
    setActive(active) {
      this.active = active;
      chrome.storage.sync.set({
        toggleSitesActive: active,
      }, () => {});

      chrome.browserAction.setIcon({
        path: this.icons[active ? 'active' : 'inactive'],
      });
    },
    linkTo() {
      chrome.tabs.create({url: 'https://brizo.ru/cabinet/login'});
    },
    saveList() {
      chrome.storage.sync.set({
        toggleSitesList: this.list,
      }, () => {});
    },
  },
};
</script>
