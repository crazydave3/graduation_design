<template>
  <nav>
    <router-link id="toLogin" :to="{path:'/login'}">←退出登录</router-link>
    <label class="logo">铁路安防系统</label>
    <ul>
      <li><router-link class="a" to="admin">账号管理</router-link></li>
      <li><router-link class="a" to="facehandle">入闸人脸管理</router-link></li>
      <li>
        <router-link class="a" to="criminalfacehandle"
          >罪犯人脸管理</router-link
        >
      </li>
      <li><router-link class="a" to="countPeople">人流量统计</router-link></li>
    </ul>
  </nav>
</template>
  
  <script>
export default {
  name: 'Narbar',
  data() {
    return {
      path: window.location.href
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
  
  <style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
nav {
  background: #0082e6;
  height: 80px;
  width: 100%;
}

label.logo {
  padding: 0 100px;
  color: white;
  font-size: 35px;
  line-height: 80px;
  font-weight: bold;
}

nav ul {
  float: right;
  margin-right: 20px;
  list-style: none;
}

nav ul li {
  display: inline-block;
  line-height: 80px;
  margin: 0 5px;
}

nav ul li .a {
  color: white;
  font-size: 17px;
  padding: 7px 13px;
  text-transform: uppercase;
  text-decoration: none;
}

.a.active,
.a:hover {
  background: #1b9bff;
  transition: 0.5s;
}
#toLogin {
  float: left;
  text-decoration: none;
  color: white;
}
#toLogin:hover {
  color: skyblue;
}
</style>