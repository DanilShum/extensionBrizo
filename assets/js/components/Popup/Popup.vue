<template>
  <div class="popup popup_brizo-inspector"></div>
</template>

<script>
export default {
  name: 'Popup',
  components: {},
  props: {},
  data: () => ({}),
  staticData: () => ({}),
  created() {
    this.createInspectorElement();
  },
  mounted() {
    document.addEventListener('mouseover', this.hoverPageElement, false);
  },
  beforeDestroy() {
    document.removeEventListener('mouseover', this.hoverPageElement);
  },
  computed: {
    inspector() {
      return document.getElementById('brizo-inspector') || null;
    },
  },
  methods: {
    hoverPageElement(e) {
      const el = e.target;
      if (el && el.className !== 'popup popup_brizo-inspector') {
        const { left, top, height, width } = el.getBoundingClientRect();
        this.inspector.style.left = left + 'px';
        this.inspector.style.top = top + 'px';
        this.inspector.style.height = height + 'px';
        this.inspector.style.width = width + 'px';
      }
    },
    createInspectorElement() {
      const body = document.querySelector('body');
      const inspector = document.createElement('div');
      inspector.setAttribute('id', 'brizo-inspector');
      inspector.classList.add('brizo-inspector');

      body.appendChild(inspector);
    },
  },
};
</script>

<style lang="scss">
.popup {
  width: 250px;
  height: 400px;
  background-color: white;
  box-shadow: 0 9px 40px 3px rgba(0, 11, 34, 0.07);
  position: fixed;
  top: 100px;
  left: 200px;
  z-index: 999;
}
</style>
