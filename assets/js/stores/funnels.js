import { createListStore } from '@/js/helpers/create-list-store';

export default createListStore({
  entity: 'funnels',
  getters: {
    currentFunnel(state) {
      return state.list[0];
    },
  },
});
