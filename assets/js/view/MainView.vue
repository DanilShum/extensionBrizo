<template>
  <div class="wrapper">
    <div class="main-view__content">
      <div class="wrapper-minitabs">
        <minitabs :tabs="tabs" :active-id="activeTabId" @click="activeTabId = $event" />
      </div>
      <component :is="viewComponent" />
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import BaseButton from '@/js/components/buttons/BaseButton';
import BaseIcon from '@/js/components/Icon/BaseIcon';
import Profile from '@/js/components/Profile';
import Deals from '@/js/view/deals/Deals';
import Minitabs from '@/js/components/Minitabs';

export default {
  name: 'MainView',
  components: { Minitabs, BaseIcon, BaseButton },
  data: () => ({
    active: true,
    icons: {
      active: 'images/icon-48x48.png',
      inactive: 'images/icon-48x48-off.png',
    },
    activeTabId: 'profile',
    views: {
      profile: Profile,
      deals: Deals,
    },
    tabs: [
      { id: 'profile', name: 'Проект' },
      { id: 'deals', name: 'Сделки' },
    ],
  }),
  created() {
    this.initialFetch();
  },
  computed: {
    viewComponent() {
      return this.views[this.activeTabId];
    },
  },
  methods: {
    ...mapActions(['initialFetch']),
  },
};
</script>
<style lang="scss">
.main-view__content__arrow-left {
  transform: rotate(180deg);
}
</style>
