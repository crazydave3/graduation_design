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
import FaceHandle from './FaceHandle'
import CriminalFaceHandle from './CriminalFaceHandle'
export default {
  name: 'Home',
  components: {
    Navbar,
    Admin,
    FaceHandle,
    CriminalFaceHandle
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>