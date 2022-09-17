<template>
  <component
    :is="iconComponent"
    class="brizo-base-icon"
    :class="{
      'brizo-base-icon_default-color': !color,
      'brizo-base-icon_flip-x': flipX,
      'brizo-base-icon_flip-y': flipY,
    }"
    :style="{ color: color || null }"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    flipX: {
      type: Boolean,
      default: false,
    },
    flipY: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconComponent() {
      const file = `${this.name}.svg`;
      // console.log(require(`@images/${file}`).default);
      // return require(`@images/${file}`).default;
    },
  },
};
</script>

<style lang="scss">
.brizo-base-icon {
  flex-shrink: 0;

  &.brizo-base-icon_default-color {
    color: inherit;
  }

  &.brizo-base-icon_flip-x {
    transform: scaleX(-1);
  }

  &.brizo-base-icon_flip-y {
    transform: scaleY(-1);
  }
}
</style>
