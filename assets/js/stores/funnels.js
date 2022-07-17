import { createListStore } from '@/js/helpers/create-list-store';

export default createListStore({
  entity: 'funnels',
  getters: {
    currentFunnel(state) {
      return state.list[0];
    },
    getFunnelIdByStatusId(state) {
      return (id) => {
        const funnel = state.list.find((i) => i.statuses.some((status) => status.id === id));
        return funnel ? funnel.id : null;
      };
    },
    map(state) {
      return state.list.reduce(
        (map, funnel) => ({
          ...map,
          [funnel.id]: funnel,
        }),
        {}
      );
    },
    get_statuses_by_funnel: (state, getters) => (id) => {
      const funnel = getters.map[id];
      return funnel ? funnel.statuses : [];
    },
  },
});
