<template>
  <div class="brizo-tags">
    <div v-for="(tag, i) in items" :key="i" class="brizo-tags__tag">
      {{ tag }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  components: {},
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.brizo-tags__tag {
  display: inline-block;
  min-height: 16px;
  background-color: rgba(111, 111, 234, 0.1);
  border-radius: 5px;
  margin: 0 4px 4px 0;
  padding: 4px;
}
</style>
