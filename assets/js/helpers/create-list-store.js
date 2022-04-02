import Vue from 'vue';
import { denormalize, normalize } from 'normalizr';
import { get, identity, isEmpty, isEqual, mapValues, pickBy } from 'lodash-es';
import { withLastAction } from '@/helpers/with-last-action';
import { Analytics } from '@/plugins/Analytics';
import { ENTITIES } from '@/helpers/constants/entities';

export const DEFAULT_REQUEST_LIMIT = 20;

export const cleanUpQuery = (query) => pickBy(query, identity);

export const isSpinnerNeeded = ({ state, getters }, query) =>
  !isEqual(query, state.query) || (!getters.loaded && !getters.noData);

/**
 * @param {Object<string, import('vuex').Module>} modules
 * @param {string} entity
 * @param {import('normalizr').Schema} schema
 * @param {function} sorter
 * @param {function} adapter
 * @param {number} limit
 * @param {Object} defaultQuery
 * @param {Object} state
 * @param {Object} getters
 * @param {Object} mutations
 * @param {Object} actions
 * @returns {import('vuex').Module}
 */
export const createListStore = ({
  modules,
  entity,
  schema,
  sorter = (list) => list,
  adapter = (item) => item,
  limit = DEFAULT_REQUEST_LIMIT,
  defaultQuery = {},
  state = {},
  getters = {},
  mutations = {},
  actions = {},
}) => ({
  modules,
  namespaced: true,
  state: {
    ids: [],
    loading: true,
    query: {},
    totalCount: 0,
    loadingMore: false,
    wasLoaded: false,
    byEntity: {
      [ENTITIES.COMPANIES]: {},
      [ENTITIES.CONTRAGENTS]: {},
      [ENTITIES.DEALS]: {},
      [ENTITIES.TASKS]: {},
      [ENTITIES.TRANSACTIONS]: {},
    },
    ...state,
  },
  getters: {
    list: (state, getters) => sorter(state.ids.map((id) => getters.byId[id]).filter(Boolean)),
    byId: (state, getters, rootState) => rootState.entities[entity],
    searching: (state) => Boolean(state.query && state.query.sentence),
    loading: (state) => state.loading,
    hasMore: (state, getters) => getters.loaded && state.ids.length < state.totalCount,
    loaded: (state, getters) => !getters.isEmpty && !state.loading,
    noData: (state, getters) => !getters.searching && !state.loading && getters.isEmpty,
    notFound: (state, getters) => getters.searching && !state.loading && getters.isEmpty,
    isEmpty: (state) => !state.wasLoaded || !state.ids.length,
    isQueryEmpty: (state) => isEmpty(state.query),
    byEntity: (state, getters) =>
      mapValues(state.byEntity, (byId) =>
        mapValues(byId, (ids) => sorter(ids.map((id) => getters.byId[id]).filter(Boolean)))
      ),
    ...getters,
  },
  mutations: {
    add(state, id) {
      if (!state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    past(state, { item, index }) {
      if (!state.ids.includes(item.id)) {
        state.ids.splice(index, 0, item.id);
      }
    },
    set(state, updatedState) {
      for (const key in updatedState) {
        if (!isEqual(state[key], updatedState[key])) {
          state[key] = updatedState[key];
        }
      }
    },
    del(state, id) {
      const i = state.ids.indexOf(id);
      if (i >= 0) {
        state.ids.splice(i, 1);
      }
    },
    ...mutations,
  },
  actions: {
    async fetchAll({ getters, commit }, query = {}) {
      commit('set', { loading: !getters.loaded });

      const { data } = await Vue.http.get(entity, {
        params: { ...defaultQuery, ...query },
      });
      const items = data.data || data || [];
      const { result: ids, entities } = normalize(items, [schema]);

      commit('entities/set', entities, { root: true });
      commit('set', {
        ids,
        loading: false,
        totalCount: get(data, 'meta.overal_count', 0),
        wasLoaded: true,
      });

      return ids;
    },
    async search({ state, getters, commit }, query = state.query) {
      query = cleanUpQuery(query);

      commit('set', {
        query,
        loading: isSpinnerNeeded({ state, getters }, query),
        totalCount: 0,
        wasLoaded: true,
      });

      const { data } = await Vue.http.get(entity, {
        params: { ...defaultQuery, limit, ...query },
      });
      const items = data.data || data || [];
      const { result: ids, entities } = normalize(items, [schema]);

      commit('entities/set', entities, { root: true });
      commit('set', {
        ids,
        loading: false,
        totalCount: get(data, 'meta.overal_count', 0),
      });

      return ids;
    },
    async fetchMore({ state, commit }) {
      if (state.loadingMore) {
        return;
      }

      const params = {
        limit,
        ...defaultQuery,
        ...state.query,
        offset: state.ids.length,
      };

      commit('set', { loadingMore: true });

      const { data } = await Vue.http.get(entity, { params });
      const items = data.data || data || [];
      const { result: ids, entities } = normalize(items, [schema]);

      commit('entities/set', entities, { root: true });
      for (const id of ids) {
        commit('add', id);
      }

      commit('set', {
        loadingMore: false,
        totalCount: get(data, 'meta.overal_count', 0),
      });

      return ids;
    },
    async fetchOne({ commit }, id) {
      const { data } = await Vue.http.get(`${entity}/${id}`);
      const { entities } = normalize(data, schema);

      commit('entities/set', entities, { root: true });

      return id;
    },
    async fetchFor({ state, commit }, { entity: srcEntity, id }) {
      const { data } = await Vue.http.get(`${srcEntity}/${id}/${entity}`, {
        params: { limit: 0 },
      });
      const { result: ids, entities } = normalize(data.data, [schema]);

      commit('entities/set', entities, { root: true });

      Vue.set(state.byEntity[srcEntity], id, ids);
    },
    async create({ commit }, model) {
      const { data } = await Vue.http.post(entity, adapter(model));
      const { result: id, entities } = normalize(data, schema);

      commit('entities/set', entities, { root: true });
      commit('add', id);

      Analytics.createEntity(entity);

      return id;
    },
    update: withLastAction(async ({ getters, commit, cancelToken, lastAction }, item) => {
      if (lastAction && lastAction.payload.id === item.id) {
        await lastAction.promise;

        if (isEqual(lastAction.payload, item)) {
          return;
        }
      }

      const { data } = await Vue.http.put(`${entity}/${item.id}`, adapter(item), { cancelToken });
      const { entities } = normalize({ ...getters.byId[item.id], ...data }, schema);

      commit('entities/set', entities, { root: true });
    }),
    async delete({ commit }, id) {
      await Vue.http.delete(`${entity}/${id}`);
      commit('entities/del', { entity, id }, { root: true });
      commit('del', id);
    },
    async clone({ getters, dispatch, commit }, id) {
      const { data } = await Vue.http.post(`${entity}/group/duplicate`, {
        ids: [id],
      });
      const [clonedItem] = data.data;
      await dispatch('fetchOne', clonedItem.id);

      if (getters.loaded) {
        commit('add', clonedItem.id);
      }

      return clonedItem.id;
    },
    mark({ getters }, id) {
      const item = getters.byId[id];

      Vue.set(item, 'is_marked', true);

      return Vue.http.post(`marked-${entity}`, { id });
    },
    unmark({ getters }, id) {
      const item = getters.byId[id];

      Vue.set(item, 'is_marked', false);

      return Vue.http.delete(`marked-${entity}/${id}`);
    },
    ...actions,
  },
});

export { normalize, denormalize };
