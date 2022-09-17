<template>
  <div class="login">
    Авторизация
    <material-input v-model="form.email" label="Email" type="email" name="email" />
    <material-input
      v-model="form.password"
      label="Password"
      :type="'password'"
      name="current-password"
    />
    <base-button text="login" @click="submit" />
  </div>
</template>

<script>
import MaterialInput from '@/js/components/inputs/MaterialInput';
import BaseButton from '@/js/components/buttons/BaseButton';
import { mapActions } from 'vuex';
export default {
  name: 'Login',
  components: { BaseButton, MaterialInput },
  props: {},
  data: () => ({
    form: {
      email: '',
      password: '',
    },
  }),
  methods: {
    ...mapActions('user', ['login']),
    async submit() {
      await this.login({
        email: this.form.email,
        password: this.form.password,
      });
    },
  },
};
</script>

<style lang="scss">
.login {
}
</style>
