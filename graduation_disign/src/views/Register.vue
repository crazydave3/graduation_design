<template>
  <div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">请正视摄像头</p>
      <p v-else-if="infoFlag === 2">注册成功</p>
    </div>
    <!-- 提示区域 end -->

    <!-- 摄像区域 start -->
    <div class="video-box">
      <video id="video" preload autoplay loop muted></video>
      <canvas id="canvas"></canvas>
      <canvas id="screenshotCanvas"></canvas>
      <img src="../assets/defaultImg.png" alt="" />
    </div>
    <!-- 摄像区域 end -->
  </div>
</template>
  
  <script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
import { SetFace } from '../api'

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
      // 提示
      infoFlag: 1,

      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: true,

      isShow: false
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    // ...mapState({
    //   faceDate : state => state.home.faceDate
    // }),
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

      const _this = this
      const timer = setTimeout(() => {
        tracker.on('track', function (event) {
          // 检测出人脸 绘画人脸位置
          context.clearRect(0, 0, canvas.width, canvas.height)
          event.data.forEach(function (rect) {
            context.strokeStyle = '#0764B7'
            context.strokeRect(rect.x, rect.y, rect.width, rect.height)
            // 上传图片
            _this.uploadLock && _this.screenshotAndUpload()
          })
        })
      }, 3000)
    },

    // 上传图片
    async screenshotAndUpload() {
      // 上锁避免重复发送请求
      this.uploadLock = false

      // 绘制当前帧图片转换为base64格式
      const canvas = this.screenshotCanvas
      const video = this.video
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64Img = canvas.toDataURL('image/jpeg')
      const pic = base64Img.substring(23)

      // 使用 base64Img 请求接口即可
      this.params.image = pic
      // 请求接口成功以后打开锁
      let result = await SetFace(this.params)
      if (result.error_code == 0) {
        console.log(result)
        this.infoFlag = 2
        this.uploadLock = true
      } else {
        console.log(result.error_msg)
        return Promise.reject(new Error('faile'))
      }
      // 关闭摄像头
      this.destroyed()

      // 刷信当前页面
      this.refash()
    },

    // 关闭摄像头
    destroyed() {
      if (!this.mediaStreamTrack) return
      this.mediaStreamTrack.srcObject.getTracks()[0].stop()
      this.trackerTask.stop()
    },

    //刷新当前页面
    refash() {
      this.countdown = 3
      this.isShow = true
      this.timer = setInterval(() => {
        if (this.countdown !== 0) {
          this.countdown--
        } else {
          this.$router.go(0)
        }
      }, 1000)
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
</style>
  