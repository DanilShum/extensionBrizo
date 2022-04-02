<template>
  <div class="spinner">
    <div class="spinner__inner">
      <svg class="spinner__circle" :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size">
        <defs>
          <clipPath :id="`header_${id}`">
            <rect x="0" y="0" width="100%" height="50%" />
          </clipPath>
          <clipPath :id="`footer_${id}`">
            <rect x="0" y="50%" width="100%" height="50%" />
          </clipPath>
          <linearGradient :id="`gradient_header_${id}`">
            <stop offset="0" stop-color="currentColor" stop-opacity="0.3" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="1" />
          </linearGradient>
          <linearGradient :id="`gradient_footer_${id}`">
            <stop offset="0" stop-color="currentColor" stop-opacity="0.3" />
            <stop offset="20%" stop-color="currentColor" stop-opacity="0.2" />
            <stop offset="80%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="size / 2 - stroke / 2"
          :stroke-width="stroke"
          :stroke="`url(#gradient_header_${id})`"
          :clip-path="`url(#header_${id})`"
          fill="none"
        />
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="size / 2 - stroke / 2"
          :stroke-width="stroke"
          :stroke="`url(#gradient_footer_${id})`"
          :clip-path="`url(#footer_${id})`"
          fill="none"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    size: {
      type: Number,
      default: 20,
    },
    stroke: {
      type: Number,
      default: 1,
    },
    clearPosition: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: () => Date.now(),
    },
  },
};
</script>

<style lang="scss">
.spinner {
  height: 100%;
  position: relative;
  width: 100%;
  color: #7a8893;
}

.spinner__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.spinner__circle {
  display: block;
  animation: preloader 1.4s linear infinite;
}

@keyframes preloader {
  to {
    transform: rotate(360deg);
  }
}
</style>
