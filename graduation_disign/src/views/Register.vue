<template>
  <div>
    <!-- 提示区域 start -->
    <div style="height: 20px;"><router-link id="toAddCriminal" to="criminal">录入罪犯人脸→</router-link></div>
    <div align="center" class="info">
      <p v-if="infoFlag === 1">输入姓名和身份证号后请正视摄像头点击录入</p>
      <p v-else-if="infoFlag === 2">录入成功</p>
      <p v-else-if="infoFlag === 3">录入失败,请检查是否输入姓名</p>
      <p v-else-if="infoFlag === 4">录入失败,请检查身份证长度是否为18位</p>
      <p v-else-if="infoFlag === 5">录入失败,请检查身份证是否正确（重复）</p>
    </div>
    <!-- 提示区域 end -->

    <!-- 摄像区域 start -->
    <div class="video-box">
      <video id="video" preload autoplay loop muted></video>
      <canvas id="canvas"></canvas>
      <canvas id="screenshotCanvas"></canvas>
      <img src="../assets/defaultImg.png" alt="" />
      <p>输入姓名<input type="text" v-model="name" /></p>
      <p>
        输入身份证号<input type="text" v-model="cardno" /><button
          @click="confirm()"
        >
          录入
        </button>
      </p>
    </div>
    <!-- 摄像区域 end -->
  </div>
</template>
  
  <script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      // 人脸参数
      params: {
        image: '',
        image_type: 'BASE64',
        group_id: 'hjm',
        user_id: 'hjm'
      },
      name: '',
      cardno: '',
      tableData: [],
      // 提示
      infoFlag: 1,

      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: false,

      isShow: false,

      timer: null
    }
  },
  mounted() {
    this.getRegister()
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 初始化设置
    init() {
      this.video = this.mediaStreamTrack = document.getElementById('video')
      this.screenshotCanvas = document.getElementById('screenshotCanvas')

      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')

      // 固定写法
      const tracker = new window.tracking.ObjectTracker('face')
      tracker.setInitialScale(4)
      tracker.setStepSize(2)
      tracker.setEdgesDensity(0.1)
      this.trackerTask = window.tracking.track('#video', tracker, {
        camera: true
      })
    },

    // 上传图片
    confirm() {
      const canvas = this.screenshotCanvas
      const video = this.video
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64Img = canvas.toDataURL('image/jpeg')
      const pic = base64Img.substring(23)
      const dir = 'D:/img/people/'
      const fileName = `${this.name}-${this.cardno}` + '.png'
      console.log(this.name)
      const table = this.tableData.filter((t) => this.cardno === t.cardno)
      console.log(table)

      if (table.length > 0 || this.cardno.length !== 18 || this.name === '') {
        if (this.name === '') {
          this.infoFlag = 3
        } else if (this.cardno.length !== 18) {
          this.infoFlag = 4
        } else {
          this.infoFlag = 5
        }
      } else {
        this.putPicRegister(
          pic,
          'D:\\img\\people',
          `${this.name}` + '-' + `${this.cardno}` + '.png'
        )
        this.putRegisterData(this.name, this.cardno, dir + fileName)
        this.infoFlag = 2
        console.log(this.screenshotCanvas)
        this.screenshotCanvas.style.display = 'block'
        this.refash()
      }
    },
    getRegister() {
      axios({
        url: 'http://127.0.0.1:80/getregister',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
      })
    },
    putPicRegister(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/register',
        method: 'post',
        data: {
          pic,
          dir,
          fileName
        }
      }).then((res) => {
        console.log(res)
      })
    },
    putRegisterData(name, cardno, photo) {
      axios({
        url: 'http://127.0.0.1:80/addregister',
        method: 'post',
        data: {
          name,
          cardno,
          photo
        }
      }).then((res) => {
        console.log(res)
      })
    },

    // 关闭摄像头
    destroyed() {
      if (!this.mediaStreamTrack) return
      this.mediaStreamTrack.srcObject.getTracks()[0].stop()
      this.trackerTask.stop()
    },

    //刷新当前页面
    refash() {
      this.isShow = true
      this.timer = setInterval(() => {
        this.$router.go(0)
      }, 3000)
    },
    toAddCriminal(){
      this.$route.go('/criminal')
    }
  }
}
</script>
  
  <style scoped>
/* 提示 */
.info {
  font-size: 20px;
}

/* 摄像 */
.video-box {
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%, 0);
  width: 600px;
  height: 450px;
}
#video,
#canvas,
#screenshotCanvas {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#screenshotCanvas {
  display: none;
}
.el-avatar {
  position: absolute;
  margin-left: 75px;
  /* z-index: 999; */
}

/* 用户信息 */
.el-form {
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, -5%);
  width: 600px;
}
#toAddCriminal {
  float: right;
  text-decoration: none;
  color: black;
}
#toAddCriminal:hover {
  color: gray;
}
</style>
  