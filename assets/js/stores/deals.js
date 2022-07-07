import { createListStore } from '@/js/helpers/create-list-store';
import Vue from 'vue';

export default createListStore({
  entity: 'deals',
  actions: {
    createDeals({ state, rootGetters }) {
      state.list.forEach(async (item) => {
        try {
          const { data } = await Vue.http.post(`deals`, {
            budget: Number(item.budget?.replace(/\D/g, '')),
            description: item.description,
            currency_id: rootGetters['user/project'].default_currency.id,
            members: [rootGetters['user/user'].id],
            name: item.name,
            responsible_id: rootGetters['user/user'].id,
            status_id: rootGetters['funnels/currentFunnel'].statuses[1].id,
          });

          state.deals.push(data);

          return data;
        } catch (e) {
          console.log(e);
        }
      });
    },
  },
});
