<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Register from './views/Register.vue'
import Monitor from './views/Monitor.vue'
import Identify from './views/Identify.vue';
import Login from './views/Login.vue';
import Home from './views/Home';
import Criminal from './views/Criminal.vue';
export default {
  name: 'App',
  views: {
    Monitor,
    Register,
    Identify,
    Login,
    Home,
    Criminal
}
}
</script>

<style>
</style>
