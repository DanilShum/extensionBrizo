<template>
  <div class="deals">
    СДЕЛКИ
    <div v-for="(deal, index) in deals" :key="index" class="deals__item">
      <div class="deals__content">
        <p>Бюджет: {{ deal.budget }}</p>
        <p>Название: {{ deal.name }}</p>
        <p>Описание: {{ deal.description }}</p>
        <status-picker />
      </div>
      <base-button class="deals__item__clear-button" text="Убрать" @click="del(index)" />
    </div>

    <base-button v-if="deals.length" type="button" text="Создать сделки" @click="create" />
    <base-button type="button" text="Начать инспекцию" @click="inspection" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import BaseButton from '@/js/components/buttons/BaseButton';
import StatusPicker from '@/js/components/StatusPicker';

export default {
  name: 'Deals',
  components: { StatusPicker, BaseButton },
  computed: {
    ...mapState({
      deals: (state) => state.deals.list,
    }),
  },
  methods: {
    ...mapActions('deals', ['createDeals']),
    ...mapMutations('deals', ['del']),
    inspection() {
      const payload = {
        inspection: true,
        deals: this.deals,
        entity: 'deals',
      };
      this.$Extension.tabQuery({ active: true, currentWindow: true }, (tabs) => {
        this.$Extension.tabSendMessage({ id: tabs[0].id, payload });
      });

      window.close();
    },
    create() {
      this.createDeals();
      this.clear();
    },
  },
};
</script>

<style lang="scss">
.deals {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.deals__item {
  position: relative;
  width: 100%;
  display: flex;
  box-shadow: 0 4px 4px 1px rgba(0, 11, 34, 0.17);
  margin: 4px;
  border-radius: 5px;
  padding: 8px;
  box-sizing: border-box;
}
.deals__content {
  width: 100%;
  display: flex;
  flex-direction: column;

  .status-picker {
    height: 50px;
  }
}
.deals__item__clear-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
