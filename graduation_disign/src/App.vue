<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Register from './views/Register.vue'
import Monitor from './views/Monitor.vue'
import Identify from './views/Identify.vue';
import Count from './views/Count.vue';
import Login from './views/Login.vue';
import Home from './views/Home';
export default {
  name: 'App',
  views: {
    Monitor,
    Register,
    Identify,
    Count,
    Login,
    Home
}
}
</script>

<style>
</style>
