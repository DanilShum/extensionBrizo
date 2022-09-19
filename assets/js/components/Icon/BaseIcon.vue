<template>
  <div>
    <div
      class="brizo-base-icon"
      :class="{
        'brizo-base-icon_default-color': !color,
        'brizo-base-icon_flip-x': flipX,
        'brizo-base-icon_flip-y': flipY,
      }"
      :style="{ backgroundImage: `url(${url})`, color: color || null }"
      v-on="$listeners"
    />
    <component
      :is="iconComponent"
      class="base-icon"
      :class="{
        'base-icon_default-color': !color,
        'base-icon_flip-x': flipX,
        'base-icon_flip-y': flipY,
      }"
      :style="{ color: color || null }"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { instanceExtension } from '@/js/plugins/extension';

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
    url() {
      const file = `${this.name}.svg`;
      return this.getUrl(`/images/${file}`);
    },
    iconComponent() {
      const file = `${this.name}.svg`;
      // console.log(require(`/images/${file}`).default);
      // return require(`/images/${file}`).default;
    },
  },
  methods: {
    getUrl(url) {
      return instanceExtension.getUrl(url);
    },
  },
};
</script>

<style lang="scss">
.brizo-base-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;

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
