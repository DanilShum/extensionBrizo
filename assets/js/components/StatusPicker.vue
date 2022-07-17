<template>
  <div class="status-picker" :class="modifiers">
    <div v-if="name" class="status-picker__name">
      <slot name="name" />
      {{ name }}
      <!--      <close-button-->
      <!--        v-if="clearable"-->
      <!--        v-show="innerValue"-->
      <!--        class="status-picker__cancel-button"-->
      <!--        size="10"-->
      <!--        @click="setStatus(null)"-->
      <!--      />-->
    </div>
    <div class="status-picker__items">
      <div
        v-for="item in statuses"
        :key="item.id"
        class="status-picker__item"
        :class="{ 'status-picker__item_active': item.id === innerValue }"
        :style="{ color: item.color }"
        @mouseenter="hoverStatus = item"
        @mouseleave="hoverStatus = null"
        @click.stop="setStatus(item.id, $event)"
      >
        <label class="status-picker__label">
          <input
            :name="radioName"
            :checked="item.id === value"
            :disabled="disabled"
            :value="item.id"
            class="status-picker__radio"
            type="radio"
          />
          <span class="status-picker__pick">{{ item.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { debounce, uniqueId } from 'lodash-es';
// import CloseButton from '@/components/ui/Button/CloseButton';

export default {
  name: 'StatusPicker',
  components: {},
  props: {
    value: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showFunnel: {
      type: Boolean,
      default: true,
    },
    funnelId: {
      type: Number,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data: (vm) => ({
    innerValue: vm.value,
    hoverStatus: null,
    emitValue: debounce(function (value) {
      if (value !== vm.value) {
        vm.$emit('input', value);
      }
    }, 500),
  }),
  computed: {
    ...mapState({
      funnelList: (state) => state.funnels.list,
    }),
    ...mapGetters({
      colors: 'colors/list',
      colorById: 'colors/color_by_id',
      getFunnelIdByStatusId: 'funnels/getFunnelIdByStatusId',
      getStatusesByFunnel: 'funnels/get_statuses_by_funnel',
      getCurrentFunnel: 'funnels/currentFunnel',
    }),
    currentFunnelId() {
      return this.funnelId || this.getFunnelIdByStatusId(this.value) || this.getCurrentFunnel.id;
    },
    statuses() {
      const statuses = this.getStatusesByFunnel(this.currentFunnelId);
      console.log(
        statuses.map((el) => ({
          ...el,
          color: this.colorById(el.color_id),
        }))
      );
      return statuses.map((el) => ({
        ...el,
        color: this.colorById(el.color_id),
      }));
    },
    activeFunnel() {
      return this.funnelList.find((el) => el.id === this.currentFunnelId);
    },
    activeStatus() {
      return this.statuses.find((el) => el.id === this.innerValue);
    },
    name() {
      if (!this.activeStatus && !this.hoverStatus) return 'Выберите этап';
      const statusName = this.hoverStatus?.name || this.activeStatus.name;
      const funnelName = this.activeFunnel?.name || '';
      if (!this.showFunnel || !funnelName || this.funnelList.length < 2) {
        return statusName;
      }
      return `${funnelName} > ${statusName}`;
    },
    modifiers() {
      return {
        'status-picker_disabled': this.disabled,
        'status-picker_inactive': !this.activeStatus,
      };
    },
    radioName() {
      return uniqueId('status_picker_');
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
    innerValue(value) {
      this.emitValue(value);
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.emitValue.cancel();
    this.emitValue.flush(this.innerValue);
  },
  methods: {
    setStatus(id, event) {
      if (this.disabled) return;

      event?.target?.focus();
      this.innerValue = id;
      this.$emit('select', id);
    },
    async init() {
      try {
        await Promise.all([
          this.funnelList.length === 0
            ? this.$store.dispatch('funnels/load_items')
            : Promise.resolve(),
          this.colors.length === 0 ? this.$store.dispatch('colors/load_items') : Promise.resolve(),
        ]);
      } catch (e) {
        const { firstMessage } = e;
        this.$notifier.error(firstMessage);
      }
    },
  },
};
</script>

<style lang="scss">
.status-picker {
  display: block;
  width: 100%;
  box-sizing: border-box;
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
}
.status-picker_reverse {
  display: flex;
  flex-direction: column-reverse;
  .status-picker__name {
    margin-bottom: 0;
    margin-top: 11px;
  }
}
.status-picker__name {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.3;
  color: #5f6c76ff;
  margin-bottom: 0.8em;
}
.status-picker__items {
  display: flex;
  .status-picker_disabled & {
    pointer-events: none;
  }
}
.status-picker__item {
  display: block;
  flex-grow: 1;
  &:first-child {
    .status-picker__label {
      padding-left: 0;
    }
    .status-picker__pick:before {
      display: none;
    }
  }
  &:last-child {
    .status-picker__label {
      padding-right: 0;
    }
    .status-picker__pick:after {
      display: none;
    }
  }
}
.status-picker__label {
  position: relative;
  display: block;
  width: 100%;
  height: 8px;
  padding: 0 5px 0 4px;
  font-size: 0;
  cursor: pointer;
  .status-picker_small & {
    height: 4px;
    padding: 0 3px;
  }
}
.status-picker__pick {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  pointer-events: none;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    border: solid 4px currentColor;
    .status-picker_small & {
      border-width: 2px;
    }
  }
  &:before {
    right: 100%;
    border-left-color: transparent;
    margin-right: -3px;
    .status-picker_small & {
      margin-right: -1px;
    }
  }
  &:after {
    left: 100%;
    border-color: transparent;
    border-left-color: currentColor;
  }
}
.status-picker__radio {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  appearance: none;
  cursor: pointer;
}
.status-picker_inactive .status-picker__items:not(:hover) .status-picker__item,
.status-picker__items:hover .status-picker__item:hover ~ .status-picker__item,
.status-picker__items:not(:hover) .status-picker__item_active ~ .status-picker__item {
  color: #d5dadeff !important;
}
.status-picker__cancel-button {
  width: 15px;
  height: 15px;
}
</style>
