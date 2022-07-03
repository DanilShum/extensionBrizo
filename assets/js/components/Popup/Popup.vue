<template>
  <div
    id="brizo-extension"
    class="brizo-extension-wrapper"
    :class="{ 'brizo-extension-wrapper_hide': hideInspector }"
  >
    <div class="brizo-extension brizo-extension_inspector" :style="{ transform: translate }">
      <header class="brizo-extension__header">
        <div class="brizo-extension__drag" @mousedown="startDrag" />
        <img
          src="https://brizo.ru/images/tild6337-3637-4835-b063-383133316630__logo_shapka.svg"
          alt="Лого"
        />
        <base-button text="Close" @click="closeInspector" />
      </header>
      <section class="brizo-extension__content">
        <div v-if="deals.length" class="brizo-extension__row">
          <div class="brizo-extension__sub-title">Сделки для создания сделки:</div>
          <tags :items="deals.map((item) => item.name)" />
        </div>
        <div class="brizo-extension__row">
          <div class="brizo-extension__sub-title">Выбранные параметры сделки:</div>

          <div class="brizo-extension__tag" v-if="element.name">
            <strong>Название:</strong> {{ element.name }}
          </div>
          <div class="brizo-extension__tag" v-if="element.budget">
            <strong>Бюджет:</strong> {{ element.budget }}
          </div>
          <div class="brizo-extension__tag" v-if="element.description">
            <strong>Описание:</strong> {{ element.description }}
          </div>
        </div>

        <base-button
          v-if="element.name"
          text="Преобразовать в краточку для создания"
          @click="setDeal"
        />
      </section>
      <footer class="brizo-extension__actions">
        <base-button
          :text="isInspection ? 'остановить инспекцию' : 'начать инспекцию'"
          @click="setInspection(!isInspection)"
        />
      </footer>
    </div>
    <div id="brizo-inspector__select" class="brizo-inspector__select-wrapper" :style="selectStyle">
      <select class="brizo-inspector__select" multiple name="hero[]" @change="selectParam">
        <option value="name">Название сделки</option>
        <option value="description">Описание сделки</option>
        <option value="budget">Бюджет сделки</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import BaseButton from '../buttons/BaseButton';
import Tags from '../Tags';

const POPUP_WIDTH = 300;
const POPUP_HEIGHT = 400;
const POPUP_RIGHT = 100;
const POPUP_TOP = 20;

export default {
  name: 'Popup',
  components: { Tags, BaseButton },
  props: {},
  data: () => ({
    element: {},
    y: 0,
    x: 0,
    translate: `translate3d(0px,0px,0px)`,
    targetContent: '',
    selectStyle: {
      opacity: '0',
      left: 0,
      top: 0,
      height: 0,
      width: 0,
    },
    isInspection: false,
  }),
  created() {
    this.createInspectorElement();
  },
  beforeDestroy() {
    this.stopInspection();
  },
  computed: {
    ...mapState(['isOpenedPopup', 'hideInspector']),
    ...mapState({
      deals: (state) => state.deals.list,
    }),
    inspectorSelect() {
      return document.getElementById('brizo-inspector__select') || null;
    },
  },
  methods: {
    ...mapMutations('deals', ['add']),
    ...mapMutations(['set']),
    closeInspector() {
      this.set({ hideInspector: true });
      this.setInspection(false);
    },
    setInspection(value) {
      value ? this.startInspection() : this.stopInspection();
      this.isInspection = value;
    },
    setDeal() {
      if (this.element.name) {
        this.add(this.element);
        this.element = {};
        this.createDeal();
      }
    },
    createDeal() {
      const payload = {
        deals: this.deals,
        isOpenedPopup: false,
        isInspection: false,
      };
      this.$Extension.runtimeSendMessage(payload);
    },
    startInspection() {
      this.appendInspectorElement();
      const body = document.querySelector('body');
      body.classList.add('brizo-crm-extension');

      document.addEventListener('mouseover', this.hoverPageElement);
      document.addEventListener('click', this.clickPageElement, true);
    },
    stopInspection() {
      document.removeEventListener('mouseover', this.hoverPageElement);
      document.removeEventListener('click', this.clickPageElement, true);

      this.removeInspectorElement();
      this.selectStyle.opacity = '0';
    },
    hoverPageElement(e) {
      const el = e.target;
      if (
        !el ||
        el.className.includes('brizo-extension_inspector') ||
        el.className.includes('brizo-inspector__select-wrapper') ||
        el.className.includes('brizo-extension-wrapper') ||
        el.offsetParent?.className.includes('brizo-extension_inspector') ||
        el.offsetParent?.className.includes('brizo-extension-wrapper') ||
        el.offsetParent?.className.includes('brizo-inspector__select-wrapper')
      ) {
        return;
      }
      const { left, top, height, width } = el.getBoundingClientRect();
      this.inspector.style.left = left + 'px';
      this.inspector.style.top = top + 'px';
      this.inspector.style.height = height + 'px';
      this.inspector.style.width = width + 'px';
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
      document.getElementById('brizo-inspector')?.remove();
    },
    clickPageElement(e) {
      if (
        e.target.offsetParent?.className === 'brizo-extension brizo-extension_inspector' ||
        e.target.offsetParent?.className === 'brizo-inspector__select-wrapper'
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target;

      if (el.textContent) {
        this.targetContent = el.textContent;
        const { left, bottom } = el.getBoundingClientRect();
        this.selectStyle = {
          opacity: '1',
          left: left + 'px',
          top: bottom + 'px',
        };
      }
      return false;
    },
    selectParam(e) {
      this.element[e.target.value] = this.targetContent;
      this.selectStyle.opacity = '0';
      this.targetContent = '';
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
.brizo-extension-wrapper_hide {
  opacity: 0;
}
.brizo-extension-wrapper {
  font-size: 12px;
  color: #353d43;

  * {
    box-sizing: border-box;
  }
}
.brizo-extension {
  width: 300px;
  box-sizing: border-box;
  height: 400px;
  background-color: white;
  box-shadow: 0 9px 40px 3px rgba(0, 11, 34, 0.17);
  border-radius: 5px;
  position: fixed;
  top: 60px;
  right: 100px;
  z-index: 1000;
  padding: 10px;
}
.brizo-extension__header {
  display: flex;
  justify-content: space-between;
}
.brizo-extension__content {
  height: calc(100% - 70px);
  overflow: auto;
}
.brizo-extension__actions {
  display: flex;
}
.brizo-extension__drag {
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
.brizo-inspector__select-wrapper {
  min-width: 150px;
  min-height: 80px;
  max-height: 72px;
  opacity: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: white;
  box-shadow: 0 9px 40px 3px rgba(0, 11, 34, 0.17);
  border-radius: 5px;
}
.brizo-inspector__select {
  border: none;
  padding: 4px;
  width: 100%;

  option {
    height: 24px;
    display: flex;
    align-items: center;
  }
  option:hover {
    background-color: rgba(#5f6c76, 0.05);
  }
}

.brizo-extension__row {
  display: flex;
  flex-direction: column;
}

.brizo-extension__sub-title {
  color: #5f6c76;
  font-size: 13px;
  font-weight: 500;
}

.brizo-extension__tag {
  display: inline-block;
  min-height: 16px;
  background-color: rgba(111, 111, 234, 0.1);
  border-radius: 5px;
  margin-bottom: 4px;
  padding: 4px;
}
</style>
