<template>
  <div id="app" class="brizo-view">
    <img
      class="brizo-extension__logo"
      src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg"
      alt="Лого"
      @click="linkTo"
    />

    <spinner v-if="!user && pending" :size="50" style="padding: 25px" />

    <main-view v-else-if="user" />

    <login v-else />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import MainView from '@/js/view/MainView';
import Spinner from '@/js/components/Spinner';
import Login from '@/js/view/auth/Login';
export default {
  name: 'app',
  components: { Login, Spinner, MainView },
  computed: {
    ...mapGetters('user', ['user', 'isActive']),
    ...mapState('user', ['pending']),
  },
  methods: {
    linkTo() {
      this.$Extension.tabCreate({ url: 'https://brizo.ru/cabinet/' });
    },
  },
};
</script>

<style lang="scss">
.brizo-extension__logo {
  cursor: pointer;
}
</style>
