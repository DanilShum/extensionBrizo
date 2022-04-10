<template>
  <div class="deals">
    СДЕЛКИ
    <div v-for="deal in deals" :key="deal.id" class="deals__item">
      <p>budget: {{ deal.budget }}</p>
      <p>currency: {{ deal.currency.code }}</p>
      <p>name: {{ deal.name }}</p>
      <p>responsible_id: {{ deal.responsible_id }}</p>
    </div>

    {{}}

    <button type="button" class="link-button" @click="createDeal">Создать сделку</button>
    <button type="button" class="link-button" @click="inspection">Начать инспекцию</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Deals',
  components: {},
  props: {},
  data: () => ({}),
  computed: {
    ...mapGetters('user', ['deals']),
  },
  methods: {
    ...mapActions('user', ['createDeal']),
    inspection() {
      console.log('inspect');
      window.chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        window.chrome.tabs.sendMessage(tabs[0].id, { inspection: true }, function (response) {
          console.log('tabs', response);
        });
      });
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
  border: 1px solid gray;
  margin-bottom: 4px;
}
</style>
