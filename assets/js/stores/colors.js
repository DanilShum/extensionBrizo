import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    list: [],
  },
  mutations: {
    set_list(state, v) {
      state.list = v;
    },
  },
  getters: {
    list(state) {
      return state.list;
    },
    color_by_id(state) {
      return (colorId) => {
        const colorObj = state.list.find((colorObject) => colorObject.id === colorId);
        return colorObj ? colorObj.value : '';
      };
    },
  },
  actions: {
    load_items(context) {
      return Vue.http.get('colors').then((res) => {
        context.commit('set_list', res.data.data);
        return res.data.data;
      });
    },
  },
};
