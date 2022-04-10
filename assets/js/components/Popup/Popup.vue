<template>
  <div class="popup popup_brizo-inspector" :style="{ transform: translate }">
    <div class="popup_brizo-inspector__drag" @mousedown="startDrag" />
    <img
      src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg"
      alt="Лого"
    />
    <h1 class="title">Brizo CRM</h1>
    <div class="popup__inner">
      <div>То что накликали</div>
      <div class="popup__content-item" v-for="(text, i) in contents" :key="i">
        {{ text }}
      </div>
    </div>
    <button type="button" class="link-button" @click="createDeal">Создать сделку</button>
    <button type="button" class="link-button" @click="setInspection(!isInspection)">
      {{ isInspection ? 'остановить инспекцию' : 'начать инспекцию' }}
    </button>

    <select
      v-show="false"
      id="brizo-inspector__select"
      class="brizo-inspector__select"
      size="3"
      multiple
      name="hero[]"
    >
      <option disabled>Выберите героя</option>
      <option value="Чебурашка">Чебурашка</option>
      <option selected value="Крокодил Гена">Крокодил Гена</option>
      <option value="Шапокляк">Шапокляк</option>
      <option value="Крыса Лариса">Крыса Лариса</option>
    </select>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

const POPUP_WIDTH = 300;
const POPUP_HEIGHT = 400;
const POPUP_RIGHT = 100;
const POPUP_TOP = 20;

export default {
  name: 'Popup',
  components: {},
  props: {},
  data: () => ({
    contents: [],
    y: 0,
    x: 0,
    translate: `translate3d(0px,0px,0px)`,
    isInspection: false,
  }),
  created() {
    this.createInspectorElement();
  },
  beforeDestroy() {
    this.stopInspection();
  },
  computed: {
    ...mapState('user', ['isOpenedPopup']),
    inspectorSelect() {
      return document.getElementById('brizo-inspector__select') || null;
    },
  },
  methods: {
    ...mapMutations('user', ['add']),
    setInspection(value) {
      value ? this.startInspection() : this.stopInspection();
      this.isInspection = value;
    },
    createDeal() {
      window.chrome.runtime.sendMessage(
        { contents: this.contents, isInspection: false },
        function (ret) {
          if (!ret) {
            console.log('Error send message ' + window.chrome.runtime.lastError);
            return;
          }
          if (ret.ok === 'ok') console.log(ret.info);
        }
      );
      this.setInspection(false);
    },
    startInspection() {
      this.appendInspectorElement();
      const body = document.querySelector('body');
      body.classList.add('brizo-extension');

      document.addEventListener('mouseover', this.hoverPageElement);
      document.addEventListener('click', this.clickPageElement, true);
    },
    stopInspection() {
      document.removeEventListener('mouseover', this.hoverPageElement);
      document.removeEventListener('click', this.clickPageElement, true);

      this.removeInspectorElement();
    },
    hoverPageElement(e) {
      const el = e.target;
      if (
        el &&
        el.className !== 'popup popup_brizo-inspector' &&
        el.offsetParent?.className !== 'popup popup_brizo-inspector'
      ) {
        const { left, top, height, width } = el.getBoundingClientRect();
        this.inspector.style.left = left + 'px';
        this.inspector.style.top = top + 'px';
        this.inspector.style.height = height + 'px';
        this.inspector.style.width = width + 'px';
      }
    },
    createInspectorElement() {
      const inspector = document.createElement('div');
      inspector.setAttribute('id', 'brizo-inspector');
      inspector.classList.add('brizo-inspector');

      this.inspector = inspector;
    },
    appendInspectorElement() {
      const body = document.querySelector('body');
      body.appendChild(this.inspector);
    },
    removeInspectorElement() {
      document.getElementById('brizo-inspector').remove();
    },
    clickPageElement(e) {
      if (e.target.offsetParent?.className === 'popup popup_brizo-inspector') return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target;
      if (el.textContent) {
        this.contents.push(el.textContent);

        // console.log(this.inspectorSelect);
        // e.target.appendChild(this.inspectorSelect);
        //
        // const { left, top, height, width } = el.getBoundingClientRect();
        // this.inspectorSelect.style.left = left + 'px';
        // this.inspectorSelect.style.top = top + 'px';
        // this.inspectorSelect.style.height = height + 'px';
        // this.inspectorSelect.style.width = width + 'px';
      }
      return false;
    },
    startDrag(event) {
      const { pageY, pageX, target } = event;

      if (!this.y && !this.x) {
        this.y = pageY;
        this.x = pageX;
      }

      if (target) {
        document.addEventListener('mousemove', this.dragMove);
        document.addEventListener('mouseup', this.dragFinish);

        event.preventDefault();
      }
    },
    dragMove(e) {
      const { x, y } = e;

      const { clientWidth, clientHeight } = document.documentElement;

      const dragX =
        clientWidth > x + POPUP_WIDTH / 2
          ? x < POPUP_WIDTH / 2
            ? this.x - POPUP_WIDTH / 2
            : this.x - x
          : clientWidth - (this.x + (clientWidth - this.x + POPUP_RIGHT));

      const dragY =
        clientHeight > y + POPUP_HEIGHT
          ? y < POPUP_TOP
            ? this.y - POPUP_TOP
            : this.y - y
          : -(clientHeight - this.y - POPUP_HEIGHT + POPUP_TOP);

      this.translate = `translate3d(${-dragX}px,${-dragY}px,0px)`;
    },
    dragFinish() {
      document.removeEventListener('mousemove', this.dragMove);
      document.removeEventListener('mouseup', this.dragFinish);
    },
  },
};
</script>

<style lang="scss">
.popup {
  width: 300px;
  box-sizing: border-box;
  height: 400px;
  background-color: white;
  box-shadow: 0 9px 40px 3px rgba(0, 11, 34, 0.17);
  position: fixed;
  top: 60px;
  right: 100px;
  z-index: 1000;
  padding: 10px;
}
.popup__inner {
  height: calc(100% - 140px);
  overflow: auto;
}
.popup__content-item {
  box-shadow: 0 9px 40px 3px rgba(0, 11, 34, 0.07);
  margin: 4px;
}
.popup_brizo-inspector__drag {
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: absolute;
  width: 30px;
  height: 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #e74c3c;
}
.brizo-inspector__select {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
}
</style>
