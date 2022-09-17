import { debounceRAF, getScrollParent } from '@/js/helpers/dom-utils';

/**
 * @param {function(Vue): HTMLElement} getElement
 * @param {number|Function} delta
 * @param {string} classname
 * @return {ComponentOptions}
 */
export const OverflowMixin = ({ getElement, delta, classname }) => ({
  data: () => ({
    isOverflowed: false,
    scrollParent: null,
    isChecking: false,
  }),

  watch: {
    isOverflowed(isOverflowed) {
      getElement(this)?.classList.toggle(classname, isOverflowed);
    },
  },
  mounted() {
    this.scrollParent = getElement(this) ? getScrollParent(this.$el) : null;
  },
  beforeDestroy() {
    this.stopCheckOverflow();
    this.scrollParent = null;
  },
  methods: {
    startCheckOverflow() {
      if (getElement(this)) {
        if (!this.scrollParent) {
          this.scrollParent = getScrollParent(this.$el);
        }

        this.checkOverflow();
        this.scrollParent.addEventListener('scroll', this.checkOverflow);
        this.isChecking = true;
      }
    },
    stopCheckOverflow() {
      if (this.isChecking) {
        this.scrollParent.removeEventListener('scroll', this.checkOverflow);
        this.isOverflowed = false;
        this.isChecking = false;
      }
    },
    checkOverflow: debounceRAF(function () {
      const el = getElement(this);
      delta = delta instanceof Function ? delta(this) : delta;

      if (!this.scrollParent || !el) return;

      const { top: parentTop, bottom: parentBottom } = this.scrollParent.getBoundingClientRect();
      const { top, bottom, height } = el.getBoundingClientRect();
      const isOverflowed = this.isOverflowed
        ? bottom + height - delta > parentBottom && top >= parentTop
        : bottom > parentBottom && top - height + delta >= parentTop;

      if (this.isOverflowed !== isOverflowed) {
        this.isOverflowed = isOverflowed;
      }
    }),
  },
});
