<template>
  <div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">监视中</p>
      <p v-else-if="infoFlag === 2">正在识别罪犯和统计人流</p>
      <p v-else>统计完毕:共有:{{ count }}人</p>
    </div>
    <!-- 提示区域 end -->

    <!-- 选择图片 -->
    <p>选择图片</p>
    <input type="file" id="setPic" @change="setPic($event)" />
    <button @click="destroyed()">关闭摄像头</button>
    <button @click="init()">开启摄像头</button>
    <!-- 选择图片 -->

    <!-- 摄像区域 start -->
    <div class="video-box">
      <video id="video" preload autoplay loop muted></video>
      <canvas id="canvas"></canvas>
      <canvas id="screenshotCanvas"></canvas>
      <img src="../assets/defaultImg.png" alt="" />
    </div>
    <!-- 摄像区域 end -->
    <div class="alert">
      <div class="overPerson"><div class="overPerson1"></div><button class="close" @click="close">关闭</button></div>
      <div class="haveCriminal"><div class="haveCriminal1"></div><button class="close" @click="close">关闭</button></div>
    </div>
    

  </div>
</template>
  
<script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
// import {mapGetters,mapState} from 'vuex'
import { FindCriminal, CountPerson } from '../api'
import axios from 'axios'


export default {
  name: 'Monitor',
  data() {
    return {
      // 人脸参数
      params: {
        image: ''
      },
      params1: {
        image: '',
        image_type: 'BASE64',
        group_id_list: 'hjm',
        max_face_num: 10
      },
      
      //人数
      count: 0,
      maxPerson:0,

      // 提示
      infoFlag: 1,

      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: true,

      isShow: false,

      //定时器
      timer: null,
      timer1: null
    }
  },
  mounted() {
    this.init(),
    this.getmaxperson()
  },
  computed: {
    // ...mapState({
    //   faceDate: (state) => state.home.faceDate
    // })
  },
  // beforeDestroy() {
  //   clearInterval(this.timer)
  // },
  methods: {
    getmaxperson() {
      axios({
        url: 'http://127.0.0.1:80/getadmin',
        method: 'get'
      }).then((res) => {
        console.log( res.data[0]);
        this.maxPerson = res.data[0].maxPerson
        // this.admin = res.data[0]
      })
    },
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
      this.timer = setInterval(() => {
        _this.uploadLock && _this.screenshotAndUpload()
      }, 3000)
    },

    // 上传图片
    async screenshotAndUpload() {
      // 上锁避免重复发送请求
      this.uploadLock = false
      console.log('ing');
      // 绘制当前帧图片转换为base64格式
      const canvas = this.screenshotCanvas
      const video = this.video
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64Img = canvas.toDataURL('image/jpeg')
      const pic = base64Img.substring(23)

      if (base64Img) this.infoFlag = 2
      // 使用 base64Img 请求接口即可
      this.params.image = pic
      this.params1.image = pic

      // 请求接口成功以后打开锁
      
      let result = await CountPerson(this.params)
      let result1 = await FindCriminal(this.params1)
      this.uploadLock = true

      //CountPerson
      if (result.error_code == undefined) {
        console.log(result)
        this.count = result.person_num
        if(this.count > this.maxPerson) {
          this.overPerson()
        }
        this.infoFlag = 3
      } else {
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg,
          'result'
        )
        return Promise.reject(new Error('faile'))
      }
      //FindCriminal
      if (result1.error_code == 0) {
        console.log(result1)
        this.haveCriminal()
        this.infoFlag = 3
      } else {
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg,
          'result1'
        )
        return Promise.reject(new Error('faile'))
      }

      // 关闭摄像头
      // this.destroyed()

      // 刷信当前页面
      // this.refash()
    },

    //上传图片base64计算人数
    setPic($event) {
      this.infoFlag = 2
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
        this.count = result.person_num
        if(this.count > this.maxPerson) {
          this.overPerson()
        }
        this.infoFlag = 3
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
    //超过人数overPerson
    overPerson(){
      let overPerson = document.getElementsByClassName("overPerson")
      console.log(overPerson);
      overPerson[0].style.display = 'block'

    },
    //查到罪犯显示haveCriminal
    haveCriminal(){
      let haveCriminal = document.getElementsByClassName("haveCriminal")
      haveCriminal[0].style.display = 'block'
      let haveCriminal1 = document.getElementsByClassName('haveCriminal1')
      console.log(haveCriminal1);
      haveCriminal1[0].classList.add('blink')

    },
    //隐藏节点
    close(event){
      console.log(event.currentTarget.parentElement.style);
      event.currentTarget.parentElement.style.display = "none"
      console.log(event.currentTarget.parentElement.style);

    },

    // 关闭摄像头
    destroyed() {
      if (!this.mediaStreamTrack) return
      this.mediaStreamTrack.srcObject.getTracks()[0].stop()
      this.trackerTask.stop(), clearTimeout(this.timer)
    }

    //刷新当前页面
    // refash() {
    //   this.countdown = 3
    //   this.isShow = true
    //   this.timer = setInterval(() => {
    //     if (this.countdown !== 0) {
    //       this.countdown--
    //     } else {
    //       this.$router.go(0)
    //     }
    //   }, 1000)
    // }
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
  top: 20%;
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

.alert {
  display: flex;
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, 0);
}
.overPerson{
  display: none;
}

.haveCriminal{
  display: none;
}
.overPerson1{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: red;
  margin: 0 20px;
}

.haveCriminal1{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: red;
  margin: 0 20px;
}
.close {
  transform: translate(55%,10px);
}
.blink {
  animation : blink 1s linear infinite 0s normal;
}
@keyframes blink {
  0% { opacity: 1; }
  25% { opacity: 0; }
  50% { opacity: 1; }
  75% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
  