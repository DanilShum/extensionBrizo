<template>
  <div
    v-if="isVisible || (isNotFound && notFoundText) || $scopedSlots.footer"
    class="base-dropdown"
  >
    <div v-if="$scopedSlots.header" class="base-dropdown__header">
      <slot name="header" v-bind="slotPayload" />
    </div>
    <div
      v-if="isVisible"
      ref="viewport"
      class="base-dropdown__viewport"
      tabindex="-1"
      :style="viewportStyle"
      @scroll="calcScrollIndex"
      @mousedown.prevent
    >
      <ul ref="list" :style="listStyle">
        <li
          v-for="i in renderedIndexes"
          :key="filteredItems[i].id"
          class="base-dropdown__list-item"
          :class="{
            'base-dropdown__list-item_focused': focusIndex === i,
            'base-dropdown__list-item_disabled': isIndexDisabled(i),
            'base-dropdown__list-item_selected': value === filteredItems[i].id,
          }"
          :style="itemStyle"
          @mouseover="!isIndexDisabled(i) && focusItem(i, false)"
          @mouseout="focusItem(-1, false)"
          @click="!isIndexDisabled(i) && selectItem(i)"
        >
          <slot name="item" :item="filteredItems[i]" :nameHtml="markMatches(filteredItems[i].name)">
            <div
              class="base-dropdown__list-item-text"
              v-html="markMatches(filteredItems[i].name)"
            />
          </slot>
        </li>
      </ul>
      <div class="base-dropdown__spacer" :style="spacerStyle" />
    </div>

    <div
      v-else-if="isNotFound && notFoundText"
      class="base-dropdown__list-item base-dropdown__list-item_not-found"
      :style="itemStyle"
      v-text="notFoundTextInner"
    />

    <div v-if="$scopedSlots.footer" class="base-dropdown__footer">
      <slot name="footer" v-bind="slotPayload" />
    </div>
  </div>
</template>

<script>
import { debounceRAF } from '@/js/helpers/dom-utils';
import { debounce, flatMap, isArray, isObject, isString, pick, pickBy, reduce } from 'lodash-es';

/**
 * @typedef DropdownItem
 * @prop {number|string} id
 * @prop {string} name
 */

export default {
  name: 'BaseDropdown',
  props: {
    /** @type {DropdownItem[]} */
    items: {
      type: Array,
      required: true,
    },
    query: {
      type: String,
      default: '',
    },
    itemHeight: {
      type: Number,
      default: 50,
    },
    maxItems: {
      type: Number,
      default: 5,
    },
    filter: {
      type: Function,
      default: null,
    },
    notFoundText: {
      type: [String, Boolean],
      default: 'Not found',
    },
    disabledIds: {
      type: Array,
      default: () => [],
    },
    searchKeys: {
      type: Array,
      default: () => ['name'],
    },
    notFound: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data: (vm) => ({
    scrollIndex: 0,
    focusIndex: -1,
    debouncedQuery: '',
    setDebouncedQuery: debounce(function (query) {
      vm.debouncedQuery = query;
    }, 200),
    mouseIndex: -1,
  }),
  computed: {
    stringifiedItems() {
      return this.items.map((item) => this.stringifyItem(item, this.searchKeys));
    },
    searchedWords() {
      return this.debouncedQuery
        .replace(/[|\\{}()[\]^$+*?]/g, '')
        .replace(/\./, '\\.')
        .split(' ')
        .filter(Boolean);
    },
    searchRegExp() {
      return new RegExp(
        this.searchedWords.reduce((str, word) => `${str}(?=.*${word})`, ''),
        'gi'
      );
    },
    wordRegExps() {
      return this.searchedWords.map((word) => new RegExp(word, 'gi'));
    },
    /**
     * @type {DropdownItem[]}
     */
    filteredItems() {
      if (this.filter instanceof Function) {
        return this.items.filter(this.filter);
      } else if (this.query.trim()) {
        const searchRegExp = this.searchRegExp;
        const stringifiedItems = this.stringifiedItems;
        return this.items.filter(
          (item, index) => stringifiedItems[index] && searchRegExp.test(stringifiedItems[index])
        );
      } else {
        return this.items;
      }
    },

    filteredItemsCount() {
      return this.filteredItems?.length || 0;
    },

    renderedRange() {
      const startIndex = Math.max(this.scrollIndex - this.maxItems, 0);
      const endIndex = Math.min(startIndex + this.maxItems * 3, this.filteredItemsCount);

      return [startIndex > endIndex ? 0 : startIndex, endIndex];
    },

    renderedIndexes() {
      const [startIndex, endIndex] = this.renderedRange;
      return this.filteredItems
        .slice(startIndex, endIndex)
        .map((item, index) => index + startIndex);
    },

    offsetTop() {
      const [startIndex] = this.renderedRange;
      return startIndex * this.itemHeight;
    },

    listHeight() {
      return Math.min(this.maxItems, this.filteredItemsCount) * this.itemHeight;
    },

    itemsHeight() {
      return this.filteredItemsCount * this.itemHeight;
    },

    spacerStyle() {
      return {
        transform: `scaleY(${this.itemsHeight})`,
      };
    },

    listStyle() {
      return {
        transform: `translate3d(0, ${this.offsetTop}px, 0)`,
      };
    },

    itemStyle() {
      return {
        height: `${this.itemHeight}px`,
        lineHeight: `${this.itemHeight}px`,
      };
    },

    viewportStyle() {
      return {
        height: `${this.listHeight}px`,
      };
    },

    isVisible() {
      return this.filteredItemsCount > 0;
    },

    isNotFound() {
      return this.notFound || (this.items.length > 0 && this.filteredItemsCount === 0);
    },
    notFoundTextInner() {
      return this.notFoundText
        ? this.notFoundText.replace('{query}', `«${this.$format.truncate(this.query, 30)}»`)
        : '';
    },

    slotPayload() {
      return {
        isVisible: this.isVisible,
        isNotFound: this.isNotFound,
      };
    },
  },
  watch: {
    query(query) {
      this.setDebouncedQuery(query);
    },
    'items.length': 'calcScrollIndex',
    debouncedQuery: {
      handler() {
        if (this.query) {
          this.$emit('select:all', this.filteredItems);
        }
      },
    },
  },
  beforeDestroy() {
    this.setDebouncedQuery.cancel();
    this.$refs.list?.removeEventListener('mousemove', this.focusMouseIndex);
  },
  methods: {
    moveUp() {
      const i = this.focusIndex;
      const l = this.filteredItemsCount;
      this.focusItem(i <= 0 || i >= l ? l - 1 : i - 1);

      if (this.isIndexDisabled(this.focusIndex)) {
        this.moveUp();
      }
    },
    moveDown() {
      const i = this.focusIndex;
      const l = this.filteredItemsCount;
      this.focusItem(i < 0 || i + 1 >= l ? 0 : i + 1);

      if (this.isIndexDisabled(this.focusIndex)) {
        this.moveDown();
      }
    },
    scrollToTop() {
      if (this.$refs.viewport) {
        this.$refs.viewport.scrollTop = 0;
      }
    },
    focusMouseIndex() {
      this.focusItem(this.mouseIndex, false);
      this.mouseIndex = -1;
    },
    focusItem(index, scroll = true) {
      if (!scroll) {
        this.$refs.list?.removeEventListener('mousemove', this.focusMouseIndex);
        this.mouseIndex = index;
      } else if (this.mouseIndex >= 0) {
        this.$refs.list?.addEventListener('mousemove', this.focusMouseIndex, { once: true });
      }

      const { viewport } = this.$refs;

      if (!this.isVisible || index === this.focusIndex || !viewport) return;

      this.focusIndex = index;

      if (!scroll) return;

      const { scrollTop } = viewport;
      const { itemHeight, listHeight } = this;
      const itemTop = index * itemHeight;

      if (itemTop < scrollTop) {
        viewport.scrollTop = itemTop;
      } else {
        const listBottom = scrollTop + listHeight;
        const itemBottom = itemTop + itemHeight;

        if (itemBottom > listBottom) {
          viewport.scrollTop = itemBottom - listHeight;
        }
      }
    },
    selectItem(index = this.focusIndex) {
      if (!this.isVisible) return;
      const item = this.filteredItems[index];

      if (item) {
        this.$emit('select', item);
      }

      return item;
    },
    isIndexDisabled(i) {
      const item = this.filteredItems[i];
      return Boolean(item) && this.disabledIds.includes(item.id);
    },
    calcScrollIndex: debounceRAF(function () {
      if (this.$refs.viewport) {
        const scrollTop = this.$refs.viewport.scrollTop;
        this.scrollIndex = Math.floor(scrollTop / this.itemHeight);
        this.$emit('scroll', { detail: { scrollTop } });
      }
    }),
    markMatches(name) {
      return this.wordRegExps.reduce(
        (html, regExp) => html.replace(regExp, this.markWord),
        name || ''
      );
    },
    markWord(word) {
      return `<mark>${word}</mark>`;
    },
    stringifyItem(item, predicate) {
      return reduce(
        isArray(predicate) ? pick(item, predicate) : pickBy(item, isString),
        (string, value) =>
          string +
          ' ' +
          (isArray(value)
            ? flatMap(value, this.stringifyItem)
            : isObject(value)
            ? this.stringifyItem(value)
            : value || ''),
        ''
      );
    },
  },
};
</script>

<style lang="scss">
$white: #fff;
$sub-grey5: #5f6c76;
$blue: #006eff;
$medium: 500;

$scrollbar-width: 11px;
$scrollbar-color: rgba(103, 111, 117, 0.4);

@mixin scrollbar($y: true, $x: false, $onlyOnHover: true, $width: $scrollbar-width) {
  @if $y {
    overflow-y: auto;
  }

  @if $x {
    overflow-x: auto;
  }

  $initial-color: if($onlyOnHover, transparent, $scrollbar-color);

  scrollbar-color: $initial-color transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    background-color: transparent;
    width: $width;
    height: $width;
  }

  &::-webkit-scrollbar-thumb {
    border-style: solid;
    border-color: transparent;
    border-width: floor($width / 3.5);
    background-color: $initial-color;
    background-clip: padding-box;
    border-radius: ($width / 2);
  }

  @if $onlyOnHover {
    &:hover {
      scrollbar-color: $scrollbar-color transparent;
      &::-webkit-scrollbar-thumb {
        background-color: $scrollbar-color;
      }
    }
  }
}

.base-dropdown__viewport {
  position: relative;
  background-color: $white;
  pointer-events: auto;
  contain: strict;
  @include scrollbar();
}

.base-dropdown__list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 13px;
  background-color: $white;

  & > *:not(:first-child):not(.base-dropdown__list-item-right) {
    margin-left: 16px;
  }
}

.base-dropdown__list-item_focused {
  background-color: rgba($sub-grey5, 0.05);
}

.base-dropdown__list-item_disabled,
.base-dropdown__list-item_disabled:hover {
  background-color: $white;
  cursor: default;
}

.base-dropdown__list-item_selected {
  background-color: rgba($blue, 0.05);
  color: $blue;

  .base-dropdown__list-item-text {
    font-weight: $medium;
  }
}

.base-dropdown__list-item-text {
  line-height: 18px;
  overflow: hidden;
  overflow-wrap: break-word;
  //@include line-clamp(2);

  mark {
    color: $blue;
    background-color: transparent;
  }
}

.base-dropdown__list-item-right {
  margin-left: auto;
  padding-left: 16px;
  font-size: 12px;
  white-space: nowrap;
}

.base-dropdown__spacer {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 1px;
  transform-origin: 0 0;
}

.base-dropdown__footer:not(:empty) {
  pointer-events: auto;
}
.base-dropdown__header {
  position: absolute;
  top: 0;
  &:not(:empty) {
    pointer-events: auto;
  }
}
.base-dropdown__list-item_not-found {
  line-height: 18px !important;
}
</style>
