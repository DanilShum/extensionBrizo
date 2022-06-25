<template>
  <button type="button" class="brizo-base-button" v-on="$listeners">
    <slot name="left" />
    <slot name="center">
      {{ text }}
    </slot>
    <slot name="right" />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  components: {},
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.brizo-base-button {
  color: #ffffff;
  height: 30px;
  font-size: 13px;
  display: block;
  font-family: 'Brizo', Arial, sans-serif;
  line-height: 0;
  font-weight: 500;
  border-width: 0;
  border-radius: 5px;
  background-color: #0080ff;
  padding: 10px;
  background-position: center center;
  border-color: #b0b9c0;
  border-style: solid;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  &:hover {
    background-color: #006eff;
    background-image: none;
    border-color: #6e7a84;
    color: #ffffff;
  }
}
</style>
