<template>
  <div class="wrapper">
    <div class="main-view__content">
      <base-button @click="prevView">
        <base-icon slot="center" name="angle-right" flip-x />
      </base-button>
      <component :is="viewComponent" />
      <base-button @click="nextView">
        <base-icon slot="center" name="angle-right" />/>
      </base-button>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import BaseButton from '@/js/components/buttons/BaseButton';
import BaseIcon from '@/js/components/Icon/BaseIcon';
import Profile from '@/js/components/Profile';
import Deals from '@/js/view/deals/Deals';

export default {
  name: 'MainView',
  components: { BaseIcon, BaseButton },
  data: () => ({
    active: true,
    icons: {
      active: 'images/icon-48x48.png',
      inactive: 'images/icon-48x48-off.png',
    },
    activeViewIndex: 0,
    views: [Profile, Deals],
  }),
  created() {
    this.initialFetch();
  },
  computed: {
    viewComponent() {
      return this.views[this.activeViewIndex];
    },
  },
  methods: {
    ...mapActions(['initialFetch']),
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
