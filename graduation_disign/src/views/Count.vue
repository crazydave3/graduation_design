<template>
  <div>
    <!-- 提示区域 start -->
    <!-- <div align="center" class="info">
        <p v-if="infoFlag === 1">请正视摄像头</p>
        <p v-else-if="infoFlag === 2">正在识别</p>
        <p v-else>识别成功</p>
      </div> -->
    <div align="center" class="info">
      <!-- <p v-if="infoFlag === 1">监视中</p> -->
      <!-- <p v-else-if="infoFlag === 2">正在识别</p>
        <p v-else>识别成功</p> -->
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
    <p>选择图片</p>
    <input type="file" id="setPic" @change="setPic($event)" />
    <button @click="destroyed()">关闭摄像头</button>
    <button @click="init()">开启摄像头</button>

  </div>
</template>
    
  <script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
// import {mapGetters,mapState} from 'vuex'
import { CountPerson } from '../api'

export default {
  name: 'Count',
  data() {
    return {
      // 人脸参数
      params: {
        image: ''
      },
      // 提示
      // infoFlag: 1,

      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: true,

      isShow: false,
      
      //定时器
      timer:null,
    }
  },
  mounted() {
    this.init()
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
    //   tracker.on('track', function (event) {
    //     // 检测出人脸 绘画人脸位置
    //     context.clearRect(0, 0, canvas.width, canvas.height)
    //     event.data.forEach(function (rect) {
    //       context.strokeStyle = '#0764B7'
    //       context.strokeRect(rect.x, rect.y, rect.width, rect.height)

    //     })
    //   })
      this.timer = setInterval(() => {
        // 上传图片
      _this.uploadLock && _this.screenshotAndUpload()
      }, 3000);
      
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

      // if (base64Img) this.infoFlag = 2
      // 使用 base64Img 请求接口即可
      this.params.image = pic
      console.log(this.params)
      // 请求接口成功以后打开锁
      let result = await CountPerson(this.params)
      this.uploadLock = true
      if (result.error_code == undefined) {
        console.log(result)
        //   this.infoFlag = 3
      } else {
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg
        )
        return Promise.reject(new Error('faile'))
      }
    },
    setPic($event) {
      this.toBase64($event.target.files[0])
        .then((res) => {
          this.params.image = res
          this.Count()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async Count() {
      let result = await CountPerson(this.params)
      if (result.error_code === undefined) {
        console.log(result)
        //   this.infoFlag = 3
      } else {
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg
        )
        return Promise.reject(new Error('faile'))
      }
    },
    toBase64(file) {
      return new Promise(function (resolve, reject) {
        let img = new FileReader()
        img.onloadend = function (e) {
          const base64Img = e.target.result
          const pic = base64Img.substring(23)
          resolve(pic)
        }
        if (file) {
          img.readAsDataURL(file)
        }
      })
    },
    // 关闭摄像头
    destroyed() {
      if (!this.mediaStreamTrack) return
      this.mediaStreamTrack.srcObject.getTracks()[0].stop()
      this.trackerTask.stop(),
      clearTimeout(this.timer)
    },
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
  visibility: hidden;
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
    