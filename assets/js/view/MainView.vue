<template>
  <div class="wrapper">
    <div class="main-view__content">
      <base-button @click="prevView">
        <img
          slot="center"
          src="images/angle-right.svg"
          alt="arrow"
          class="main-view__content__arrow-left"
        />
      </base-button>
      <component :is="viewComponent" />
      <base-button @click="nextView">
        <img slot="center" src="images/angle-right.svg" alt="arrow" />
      </base-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Profile from '../components/Profile';
import Spinner from '../components/Spinner';
import Deals from './deals/Deals';
import BaseButton from '../components/buttons/BaseButton';

export default {
  name: 'MainView',
  components: { BaseButton, Deals, Spinner, Profile },
  data: () => ({
    active: true,
    icons: {
      active: 'images/icon-48x48.png',
      inactive: 'images/icon-48x48-off.png',
    },
    activeViewIndex: 0,
    views: [Profile, Deals],
  }),
  async created() {
    await this.fetchUser();
    this.fetchUnreadNotificationsCount();
  },
  computed: {
    viewComponent() {
      return this.views[this.activeViewIndex];
    },
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'fetchUnreadNotificationsCount']),
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
.main-view__content {
  display: flex;
  justify-content: space-between;
}

.main-view__content__arrow-left {
  transform: rotate(180deg);
}
</style>
