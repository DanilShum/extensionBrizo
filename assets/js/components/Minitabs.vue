<template>
  <div class="minitabs">
    <button
      v-for="item in tabs"
      :key="item.id"
      class="minitabs__tab"
      type="button"
      ref="tabs"
      :class="{ minitabs__tab_active: item.active || activeId === item.id }"
      :disabled="disabled"
      @click="$listeners.click(item.id)"
    >
      <span class="minitabs__tab-text" v-text="item.name" />
    </button>
    <span class="minitabs__line" :style="style" />
  </div>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    activeId: {
      type: [Number, String],
      default: '',
    },
  },
  data: () => ({
    style: {},
    tabSizesCache: [],
  }),
  computed: {
    activeIndex() {
      const indexActiveId = this.tabs.findIndex((item) => item.id === this.activeId);
      return indexActiveId >= 0 ? indexActiveId : this.tabs.findIndex((item) => item.active);
    },
  },
  watch: {
    activeIndex: {
      immediate: true,
      handler() {
        this.$nextTick(this.moveLine);
      },
    },
    tabs() {
      this.tabSizesCache = [];
    },
  },
  methods: {
    moveLine() {
      if (!this.tabSizesCache[this.activeIndex]) {
        const activeElement = this.$refs.tabs[this.activeIndex];
        if (!activeElement) return;
        const { offsetLeft, offsetWidth } = activeElement.children[0];
        this.tabSizesCache[this.activeIndex] = { offsetLeft, offsetWidth };
      }

      const { offsetLeft, offsetWidth } = this.tabSizesCache[this.activeIndex];

      this.style = {
        transform: `
          translate3d(${offsetLeft}px, 0, 0)
          scaleX(${offsetWidth / 10})
        `,
      };
    },
  },
};
</script>
<style lang="scss">
.minitabs {
  display: flex;
  position: relative;
}

.minitabs__tab {
  padding: 14px 10px 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  &.minitabs__tab_active {
    cursor: default;
  }
}

.minitabs__tab-text {
  display: block;
  padding-bottom: 16px;
  font-size: 13px;
  line-height: 15px;
  color: #353d43ff;
}
.minitabs__line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 10px;
  pointer-events: none;
  background: #0080ffff;
  transition: transform 0.2s ease-in-out;
  transform-origin: 0 100%;
}

.minitabs-wrapper {
  border-bottom: 2px solid #e0e0e0ff;

  .minitabs {
    margin: 0 0 -2px -10px;
  }

  .minitabs__tab {
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
  }

  .minitabs__tab-text {
    border-width: 3px;
  }
}

.wrapper-minitabs {
  border-bottom: 2px solid rgba(#5f6c76, 0.1);
  margin: 12px 0 20px;

  .minitabs {
    margin: 0 0 -2px -10px;
  }
}
</style>
