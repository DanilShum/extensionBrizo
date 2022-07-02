<template>
  <div id="app" class="brizo-view">
    <img
      class="brizo-extension__logo"
      src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg"
      alt="Лого"
      @click="linkTo"
    />

    <h1 class="title">Brizo CRM</h1>

    <spinner v-if="!user && pending" :size="50" style="padding: 25px" />

    <main-view v-if="user" />
    <div v-else>Вы не авторизированны</div>
  </div>
</template>

<script>
import MainView from './view/MainView';
import { mapGetters, mapState } from 'vuex';
import Spinner from './components/Spinner';
export default {
  name: 'app',
  components: { Spinner, MainView },
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
