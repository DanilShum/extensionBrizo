import axios from 'axios';
import Vue from 'vue';

const api = axios.create({
  crossDomain: true,
  withCredentials: true,
});

Vue.http = api;

export default api;
