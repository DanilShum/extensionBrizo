<template>
  <div class="wrapper">
    <img
      src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg"
      alt="Лого"
    />
    <h1 class="title">Brizo CRM</h1>

    <spinner v-if="pending" :size="50" style="padding: 25px" />
    <div v-if="!isAuth">Вы не авторизированны</div>

    <div v-else-if="!pending" class="tool-bar__content">
      <button @click="prevView">
        <img src="images/angle-right.svg" alt="arrow" class="tool-bar__content__arrow-left" />
      </button>
      <component :is="viewComponent" />
      <button @click="nextView">
        <img src="images/angle-right.svg" alt="arrow" />
      </button>
    </div>

    <button type="button" class="link-button" @click="linkTo">Перейти в Brizo</button>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Profile from './Profile';
import Spinner from './Spinner';
import Deals from '../view/deals/Deals';

export default {
  name: 'ToolBar',
  components: { Deals, Spinner, Profile },
  data: () => ({
    active: true,
    list: 'example.com',
    icons: {
      active: 'images/icon-48x48.png',
      inactive: 'images/icon-48x48-off.png',
    },
    activeViewIndex: 0,
    views: [Profile, Deals],
  }),
  async created() {
    window.chrome.storage.sync.get(['toggleSitesActive', 'toggleSitesList'], (result) => {
      this.active = result.toggleSitesActive;
      this.list = result.toggleSitesList;
    });
    await this.fetchUser();
    this.fetchUnreadNotificationsCount();
  },
  computed: {
    ...mapState('user', ['pending', 'isAuth']),
    viewComponent() {
      return this.views[this.activeViewIndex];
    },
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'fetchUnreadNotificationsCount']),
    setActive(active) {
      this.active = active;
      window.chrome.storage.sync.set(
        {
          toggleSitesActive: active,
        },
        () => {}
      );

      window.chrome.browserAction.setIcon({
        path: this.icons[active ? 'active' : 'inactive'],
      });
    },
    linkTo() {
      window.chrome.tabs.create({ url: 'https://brizo.ru/cabinet/login' });
    },
    saveList() {
      window.chrome.storage.sync.set(
        {
          toggleSitesList: this.list,
        },
        () => {}
      );
    },
    prevView() {
      const index = this.views.length - 1;
      if (!this.activeViewIndex) {
        this.activeViewIndex = index;
      } else {
        this.activeViewIndex = this.activeViewIndex - 1;
      }
    },
    nextView() {
      const index = this.views.length - 1;
      if (index === this.activeViewIndex) {
        this.activeViewIndex = 0;
      } else {
        this.activeViewIndex = this.activeViewIndex + 1;
      }
    },
  },
};
</script>
<style lang="scss">
.tool-bar__content {
  display: flex;
  justify-content: space-between;
}

.tool-bar__content__arrow-left {
  transform: rotate(180deg);
}
</style>
