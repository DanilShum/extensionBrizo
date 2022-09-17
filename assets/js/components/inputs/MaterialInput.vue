<template>
  <div class="material-input">
    <label
      :class="{
        'material-input__label_focus': value.length,
        'material-input__label_error': error,
      }"
      class="material-input__label"
    >
      <input
        ref="input"
        :value="value"
        v-bind="$attrs"
        :type="type"
        :placeholder="isFocused ? placeholder : ''"
        class="material-input__field"
        @input="onInput"
        @focus="isFocused = true"
        @blur="onBlur"
        @keydown.up.stop="onUp"
        @keydown.down.stop="onDown"
        @keydown.enter.stop="onEnter"
      />
      <span class="material-input__action"> {{ label }} <sub v-if="required">*</sub> </span>
      <slot name="right" />
      <base-dropdown
        ref="dropdown"
        class="material-input__dropdown"
        :items="suggestions"
        :query="value.toString()"
        :not-found-text="false"
        @select="input($event.name)"
      />
    </label>
    <div v-if="!error && hint" class="material-input__hint">
      {{ hint }}
    </div>
    <div v-if="error" class="material-input__error">{{ error }}</div>
  </div>
</template>

<script>
import BaseDropdown from '@/js/components/Dropdown/BaseDropdown';
import { EMAILS_BY_LANG } from '@/js/helpers/emails';

export default {
  name: 'MaterialInput',
  components: { BaseDropdown },
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    error: {
      type: [String, Boolean],
      default: '',
    },
    value: {
      type: [String, Number],
      required: true,
    },
    hint: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isFocused: false,
  }),
  computed: {
    isEmailTyping() {
      return this.type === 'email' && this.value.includes('@') && this.isFocused;
    },
    suggestions() {
      if (this.isEmailTyping) {
        const [username] = this.value.split('@');
        return EMAILS_BY_LANG['ru'].map((domain) => ({
          id: domain,
          name: username + '@' + domain,
        }));
      } else {
        return [];
      }
    },
  },
  methods: {
    onInput(e) {
      this.input(e.target.value);
    },
    input(value) {
      this.$emit('input', value.trim());
    },
    focus() {
      this.$refs.input.focus();
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
    onEnter(e) {
      if (this.$refs.dropdown?.isVisible) {
        e.preventDefault();
        this.$refs.dropdown.selectItem();
      }
    },
    onBlur(e) {
      this.isFocused = false;
      this.$emit('blur', e);
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
.material-input {
  width: 100%;
  margin-bottom: 10px;

  &:not(:focus-within) {
    .material-input__hint {
      opacity: 0;
    }
  }
  .material-input__label_focus + .material-input__hint {
    opacity: 1;
  }
}
.material-input__label {
  color: $primary-text-color;
  position: relative;
  display: flex;
  align-items: center;
  cursor: text;
  border-radius: 2px;
  box-shadow: 0 1px 0 0 $color-border;
  font-size: 15px;
  padding: 12px 0;
  &.material-input__label_focus,
  &:focus-within {
    box-shadow: 0 1px 0 0 $blue;
  }
  &.material-input__label_error {
    box-shadow: 0 1px 0 0 $fail-red;
  }
}
.material-input__field {
  font-size: 15px;
  padding: 5px 0 0 0;
  margin: 0;
  border: none;
  outline: none;
  background-color: transparent;
  width: 100%;

  &:focus {
    background-color: $white;
  }
  &:-webkit-autofill {
    transition: background-color 1ms 9999s;

    &:first-line {
      font-family: $font-family !important;
      font-size: 15px !important;
      color: $primary-text-color !important;
    }
    & + .material-input__action {
      transform: translate(0, -10px) scale(0.8);
    }
  }
}
.material-input__action {
  position: absolute;
  z-index: 1;
  bottom: 15px;
  cursor: text;
  color: $sub-grey5;
  transform-origin: top left;
  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.material-input__label:focus-within .material-input__action,
.material-input__label_focus .material-input__action {
  transform: translate(0, -14px) scale(0.8);
}
.material-input__error {
  font-size: 12px;
  margin-top: 10px;
  color: $fail-red;
}
.material-input__hint {
  font-size: 12px;
  margin-top: 10px;
  color: $sub-grey5;
}

.material-input__dropdown {
  border-radius: 2px;
  border: 1px solid $color-border;
  height: auto;
  line-height: inherit;
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  box-shadow: 0 6px 20px 0 rgba($very-dark-blue4, 0.2);
  overflow: hidden;
  z-index: 2;
  box-sizing: border-box;

  &:empty {
    display: none;
  }
}
</style>
