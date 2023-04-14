<template>
  <div>
    <Navbar/>
    <router-view />
    <div class="down"></div>
  </div>
</template>

<script>
import Navbar from '@/components/Narbar'
import Admin from './Admin'
export default {
  name: 'Home',
  components: {
    Navbar,
    Admin
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>