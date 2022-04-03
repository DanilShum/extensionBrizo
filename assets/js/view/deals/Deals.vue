<template>
  <div class="deals">
    СДЕЛКИ
    <div v-for="deal in deals" :key="deal.id" class="deals__item">
      <p>budget: {{ deal.budget }}</p>
      <p>currency: {{ deal.currency.code }}</p>
      <p>name: {{ deal.name }}</p>
      <p>responsible_id: {{ deal.responsible_id }}</p>
    </div>

    <button type="button" class="link-button" @click="createDeal">Создать сделку</button>
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
