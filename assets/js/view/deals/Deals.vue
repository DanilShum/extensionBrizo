<template>
  <div class="deals">
    СДЕЛКИ
    <div v-for="(deal, index) in contents" :key="index" class="deals__item">
      <div>
        <p>Бюджет: {{ deal.budget }}</p>
        <p>Название: {{ deal.name }}</p>
        <p>Описание: {{ deal.description }}</p>
      </div>
      <base-button text="Убрать" @click="removeContents(index)" />
    </div>

    <base-button v-if="contents.length" type="button" text="Создать сделки" @click="createDeals" />
    <base-button type="button" text="Начать инспекцию" @click="inspection" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import BaseButton from '../../components/buttons/BaseButton';

export default {
  name: 'Deals',
  components: { BaseButton },
  computed: {
    ...mapGetters('user', ['deals']),
    ...mapState('user', ['contents']),
  },
  methods: {
    ...mapActions('user', ['createDeals']),
    ...mapMutations('user', ['removeContents']),
    inspection() {
      const payload = {
        inspection: true,
        contents: this.contents,
      };
      this.$Extension.tabQuery({ active: true, currentWindow: true }, (tabs) => {
        this.$Extension.tabSendMessage({ id: tabs[0].id, payload });
      });

      window.close();
    },
  },
};
</script>

<style lang="scss">
.deals {
  display: flex;
  flex-direction: column;
}
.deals__item {
  display: flex;
  box-shadow: 0 4px 4px 1px rgba(0, 11, 34, 0.17);
  margin: 4px;
  border-radius: 5px;
  padding: 8px;
}
</style>
