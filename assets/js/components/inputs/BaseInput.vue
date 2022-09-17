<template>
  <div
    class="base-input"
    :class="{
      'base-input_has-value': hasValue,
      'base-input_invalid': error,
      'base-input_offset-right': !clearable && !($slots.right || $scopedSlots.right),
      'base-input_no-label': !label,
      'base-input_autoheight': autoheight,
      'base-input_disabled': disabled,
      'base-input_overflowed': isOverflowed,
      'base-input_suggestions':
        ($slots.dropdown || suggestions.length) && hasValue && isVisibleDropdown,
    }"
  >
    <slot name="left" v-bind="slotPayload">
      <base-icon
        v-if="leftIcon"
        class="base-input__left-icon"
        :name="leftIcon"
        :width="16"
        :height="16"
        :color="$colors.greyIcon"
        @mousedown.prevent="focus"
      />
    </slot>

    <label class="base-input__label">
      <span v-if="label" class="base-input__label-text" v-text="label" />
      <slot name="input">
        <input
          ref="input"
          :type="type"
          :value="value"
          :readonly="readonly"
          :autofocus="autofocus"
          :disabled="disabled"
          v-bind="$attrs"
          class="base-input__field"
          @accept="onAccept"
          @input="onInput"
          @change="change($event.target.value)"
          @focus="onFocus"
          @blur="scheduleBlur"
          @keydown.esc.stop="onEsc"
          @keydown.enter.stop="onEnter"
          @keydown.up.stop="onUp"
          @keydown.down.stop="onDown"
          @keydown="$emit('keydown', $event)"
        />
      </slot>
      <div class="base-input__value">
        <slot name="value">
          <div v-text="formattedValue" />
        </slot>
      </div>
    </label>

    <slot name="right" v-bind="slotPayload" />

    <div
      v-if="$slots.dropdown || suggestions.length"
      ref="dropdown-viewport"
      class="base-input__dropdown"
    >
      <slot name="dropdown">
        <base-dropdown
          ref="dropdown"
          :items="suggestions"
          :query="value ? value.toString() : ''"
          :filter="filter"
          :not-found-text="false"
          :item-height="itemHeight"
          :max-items="results"
          @select="onSelect"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import { zipObject } from 'lodash-es';
import { OverflowMixin } from '@/js/plugins/OverflowMixin';

import BaseDropdown from '@/js/components/Dropdown/BaseDropdown';
import BaseIcon from '@/js/components/Icon/BaseIcon';
import { EMAILS_BY_LANG } from '@/js/helpers/emails';

const INPUT_TYPES = ['text', 'number', 'tel', 'email', 'password', 'url'];

export default {
  name: 'BaseInput',
  components: {
    BaseDropdown,
    BaseIcon,
  },

  mixins: [
    OverflowMixin({
      getElement: (vm) => vm.$refs['dropdown-viewport'],
      classname: 'base-input__dropdown_overflowed',
      delta: (vm) => vm.inputHeight,
    }),
  ],
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'text',
      validator: (type) => INPUT_TYPES.includes(type),
    },
    value: {
      type: [String, Number],
      default: '',
    },
    error: {
      type: [String, Boolean],
      default: '',
    },
    showErrorInfo: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    selectOnFocus: {
      type: Boolean,
      default: false,
    },
    blurOnEnter: {
      type: Boolean,
      default: false,
    },
    cancelOnEsc: {
      type: Boolean,
      default: false,
    },
    formatter: {
      type: Function,
      default: (v) => v,
    },
    leftIcon: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Function,
      default: undefined,
    },
    autoheight: {
      type: Boolean,
      default: false,
    },
    itemHeight: {
      type: Number,
      default: 50,
    },
    inputHeight: {
      type: Number,
      default: 50,
    },
    results: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isFocused: false,
    savedValue: '',
  }),
  computed: {
    formattedValue() {
      return this.formatter(this.value);
    },
    hasValue() {
      return this.value !== '';
    },
    isType() {
      return zipObject(
        INPUT_TYPES,
        INPUT_TYPES.map((type) => this.type === type)
      );
    },
    isEmailTyping() {
      return this.isType.email && this.value.includes('@');
    },
    suggestions() {
      if (this.isEmailTyping) {
        const [username] = this.value.split('@');
        return EMAILS_BY_LANG['ru'].map((domain) => ({
          id: domain,
          name: username + '@' + domain,
        }));
      } else {
        return this.options;
      }
    },
    slotPayload() {
      return {
        isFocused: this.isFocused,
        focus: this.focus,
        blur: this.blur,
        clear: this.clear,
      };
    },
    isVisibleDropdown() {
      return this.$refs.dropdown?.isVisible || this.$slots.dropdown;
    },
  },
  mounted() {
    if (this.autofocus) {
      this.focus();
    }
  },
  beforeDestroy() {
    this.cancelBlur?.();
  },
  methods: {
    onAccept(e) {
      this.input(e.target.value);
    },
    onInput(e) {
      if (!this.mask) {
        this.input(e.target.value);
      }
    },
    onFocus(e) {
      this.cancelBlur?.();
      this.isFocused = true;
      this.savedValue = this.value;
      this.startCheckOverflow();
      this.$emit('focus', e);

      if (this.selectOnFocus) {
        this.select();
      }
    },
    /**
     * Отменяем ненужный blur при автокомплите
     */
    scheduleBlur(e) {
      const timer = window.setTimeout(this.onBlur, 0, e);

      this.cancelBlur = () => {
        window.clearTimeout(timer);
        this.cancelBlur = undefined;
      };
    },
    onBlur(e) {
      this.isFocused = false;
      this.stopCheckOverflow();
      this.$emit('blur', e);
    },
    onEnter(e) {
      if (this.$refs.dropdown?.isVisible) {
        e.preventDefault();
        this.$refs.dropdown.selectItem();
      }

      if (this.blurOnEnter) {
        this.blur();
      }
    },
    onUp(e) {
      if (this.$refs.dropdown?.isVisible) {
        e.preventDefault();
        this.$refs.dropdown.moveUp();
      }
    },
    onDown(e) {
      if (this.$refs.dropdown?.isVisible) {
        e.preventDefault();
        this.$refs.dropdown.moveDown();
      }
    },
    onEsc() {
      if (this.cancelOnEsc) {
        this.input(this.savedValue);
      }
      return this.blur();
    },
    async focus() {
      await this.$nextTick();
      this.$refs.input?.focus();
    },
    async blur() {
      await this.$nextTick();
      this.$refs.input?.blur();
    },
    async select() {
      await this.$nextTick();
      this.$refs.input?.select();
    },
    input(value) {
      this.$emit('input', value);
    },
    onSelect(event) {
      this.input(event.name);
      this.$emit('select', event);
    },
    change(value) {
      this.$emit('change', value);
    },
    clear(e) {
      this.focus();
      this.$emit('clear', e);
      this.input('');
      this.change('');

      if (this.$refs.input) {
        this.$refs.input.value = '';
      }
    },
  },
};
</script>

<style lang="scss">
$primary-text-color: #353d43;
$color-border: #d5dade;
$blue: #006eff;
$fail-red: #db0042;
$white: #fff;
$font-family: system-ui, -apple-system, sans-serif;
$sub-grey5: #5f6c76;
$very-dark-blue4: #181c2019;
$popup-left-bg-color: #f8f8f9;
$grey-icon: #7a8893;
$grey-text: #5f6c76;
$main-blue-color: #0080ff;

.base-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid transparent;
  background-color: rgba($sub-grey5, 0.05);
  border-radius: 5px;
  box-sizing: border-box;
  appearance: none;
  transition: background-color 200ms ease-in;

  &.base-input_invalid {
    border-color: $fail-red;

    .base-input__dropdown {
      border-color: $fail-red;
    }
  }

  &.base-input_no-corners {
    border-radius: 0;
  }

  &:hover:not(:focus-within) {
    transition: background-color 50ms ease-in;
    background-color: rgba($sub-grey5, 0.04);
  }
  &:focus-within {
    transition: background-color 50ms ease-in;
    background-color: $white;
    border-color: $color-border;
    &.base-input_overflowed {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
    }

    .base-input__dropdown:not(:empty) {
      display: block;
    }
  }

  &.base-input_suggestions {
    &:focus-within:not(.base-input_overflowed) {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  &.base-input_pair {
    border-right-width: 0;
    border-radius: 2px 0 0 2px;

    & + .base-input {
      border-radius: 0 2px 2px 0;
    }
  }

  &.base-input_disabled {
    background-color: $popup-left-bg-color;
  }

  .list-item__right-btn,
  .edit-button {
    &:hover {
      color: $grey-icon;
    }
  }
}

.base-input__label {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: text;
  min-width: 0;

  ~ * {
    flex-shrink: 0;
    height: 48px;
    line-height: 48px;
  }
}

.base-input__label-text {
  position: absolute;
  left: 15px;
  right: 0;
  top: 17px;
  bottom: 0;
  max-width: 100%;
  height: 14px;
  border-radius: 2px;
  line-height: 14px;
  color: $primary-text-color;
  user-select: none;
  z-index: 1;
  transform: translate3d(0, 0, 0) scale(1);
  transform-origin: 0 0;
  transition: transform 0.2s ease-in-out;
  pointer-events: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .base-input:focus-within &,
  .base-input_has-value & {
    color: $grey-text;
    transform: translate3d(0, -8px, 0) scale(0.94);
  }

  .base-input_no-corners & {
    border-radius: 0;
  }
}

.base-input__field {
  display: block;
  width: 100%;
  border: 0;
  outline: 0;
  margin: 0;
  padding: 22px 0 8px 15px;
  box-sizing: border-box;
  border-radius: 2px;
  font: inherit;
  font-size: 13px;
  line-height: 16px;
  background: none;
  appearance: none;
  opacity: 0;

  &:focus,
  &[type='password'],
  .base-input_no-label:not(.base-input_has-value) & {
    opacity: 1;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /*
    Хаки для нормального отображения
    после автозаполнения
  */
  &:-webkit-autofill {
    transition: background-color 1ms 9999s;

    &:first-line {
      font-family: $font-family !important;
      font-size: 13px !important;
      color: $primary-text-color !important;
    }
  }

  .base-input_no-corners & {
    border-radius: 0;
  }

  .base-input_no-label & {
    padding-top: 16px;
  }

  .base-input_offset-right & {
    padding-right: 19px;
  }
}

.base-input__value {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 22px 0 8px 15px;
  box-sizing: border-box;
  border-radius: 2px;
  font-size: 13px;
  line-height: 16px;
  opacity: 1;
  pointer-events: none;

  .base-input_no-corners & {
    border-radius: 0;
  }

  .base-input_no-label & {
    display: flex;
    align-items: center;
    padding-top: 9px;
  }

  & > * {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .base-input_offset-right & {
      max-width: calc(100% - 19px);
    }
  }
}

.base-input__field:focus + .base-input__value,
.base-input__field[type='password'] + .base-input__value,
.base-input_no-label:not(.base-input_has-value) .base-input__field + .base-input__value {
  opacity: 0;

  & * {
    pointer-events: none;
  }
}

.base-input_autoheight {
  align-items: flex-start;
  height: auto !important;

  .base-input__value {
    position: static;
    margin-top: -46px;

    & > * {
      text-overflow: unset;
      white-space: pre-line;
      overflow: unset;
    }
  }

  .base-input__field:focus + .base-input__value {
    position: absolute;
    margin: unset;
  }
}

.base-input__clear-btn {
  width: 42px;

  &:hover {
    color: $grey-icon;
  }

  &.base-input__clear-btn_error,
  &.base-input__clear-btn_error:hover {
    color: $fail-red;
  }
}

.base-input__right-btn {
  width: 48px;
  color: $grey-icon;

  &:hover,
  &:focus {
    color: $main-blue-color;
  }
}

.base-input__left-btn {
  width: 48px;
  color: $grey-icon;
  margin-right: -19px;
  flex-shrink: 0;

  &:hover,
  &:focus {
    color: $main-blue-color;
  }
}

.base-input__left-icon {
  padding: 16px 0 16px 19px;
  box-sizing: content-box;
  cursor: pointer;
}

.base-input__dropdown {
  display: none;
  border-radius: 5px;
  border: 1px solid $color-border;
  padding-top: 49px;
  height: auto;
  line-height: inherit;
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  box-shadow: 0 4px 25px 0 rgba(0, 15, 30, 0.3);
  overflow: hidden;
  z-index: 2;
  box-sizing: border-box;
  pointer-events: none;
}

.base-input__dropdown_overflowed {
  padding-top: 0;
  padding-bottom: 49px;
  top: unset;
  bottom: -1px;
}

.spinner.base-input__spinner {
  width: 48px;
  color: $main-blue-color;
  margin-left: auto;
}
</style>
