<template>
  <div class="profile">
    <div class="profile__row profile__user">
      <img class="profile__avatar-user" :src="avatar" alt="аватар" />
      <div class="profile__user-info">
        <div>{{ currentUser.name }}</div>
        <div>{{ currentUser.email }}</div>
      </div>
      <base-button text="logout" @click="logout" />
    </div>

    <base-input
      :options="projects"
      v-model="selectedProject"
      label="project"
      @select="setProject"
    />

    <div class="profile__row">
      <div>Проект: {{ project.name }}</div>
      <button type="button" class="profile__notifiaction">
        <span
          v-if="notificationsCount"
          class="profile__notifiaction__unread_counter"
          v-text="notificationsCount"
        />
        <img src="images/bell.svg" alt="bell" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import BaseButton from '@/js/components/buttons/BaseButton';
import BaseInput from '@/js/components/inputs/BaseInput';

export default {
  name: 'Profile',
  components: { BaseInput, BaseButton },
  data: (vm) => ({
    selectedProject: vm.$store.getters['user/project'].name,
  }),
  computed: {
    ...mapState('user', ['currentUser', 'unread_notifications_count']),
    ...mapGetters('user', ['avatar', 'project', 'projects']),
    notificationsCount() {
      if (this.unread_notifications_count > 999) return '999+';
      if (this.unread_notifications_count <= 0) return 0;
      return this.unread_notifications_count;
    },
  },
  methods: {
    ...mapActions('user', ['logout', 'setUser']),
    ...mapActions(['initialFetch']),
    async setProject(e) {
      console.log(e);
      await this.setUser(e);
      this.initialFetch();
    },
  },
};
</script>

<style lang="scss">
.profile {
  padding: 20px;
}

.profile__user {
  padding-bottom: 10px;
}

.profile__row {
  display: flex;
  justify-content: space-between;
}

.profile__avatar-user {
  border-radius: 50%;
}

.profile__user-info {
  margin-left: 20px;
}

.profile__notifiaction {
  min-height: 60px;
  width: 60px;
  height: 60px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: pointer;
  background-color: initial;
  margin: 0;
  padding: 0;
  color: #fff;
  outline: 0;
  border: 0;
}

.profile__notifiaction__unread_counter {
  display: block;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-10px, -100%);
  box-sizing: border-box;
  min-width: 15px;
  padding: 1px 3px 2px 3px;
  font-size: 10px;
  line-height: 1;
  color: #fff;
  box-shadow: 0 2px 4px 0 rgba(#000, 0.5);
  border: solid 1px rgba(#fff, 0.8);
  border-radius: 20px;
  background-color: #e74c3c;
  font-weight: bold;
  text-align: center;
}
</style>
