<template>
  <div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">请正视摄像头</p>
      <p v-else-if="infoFlag === 2">正在识别</p>
      <p v-else>识别{{ flag }}</p>
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
    <div class="alert">
      <div class="haveCriminal"><div class="haveCriminal1"></div><button class="close" @click="close">关闭</button></div>
    </div>
  </div>
</template>
    
<script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
import { IdentifyFace, FindCriminal } from '../api'


export default {
  name: 'Identify',
  data() {
    return {
      // 人脸参数
      params: {
        image: '',
        image_type: 'BASE64',
        group_id_list: 'hjm',
        match_threshold:80
      },
      params1: {
        image: '',
        image_type: 'BASE64',
        group_id_list: 'hjm',
        max_face_num: 10
      },
      // 提示
      infoFlag: 1,
      flag : '',

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
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 初始化设置
    init() {
      let haveCriminal = localStorage.getItem('haveCriminal')
      if(haveCriminal === 'true') {
        this.haveCriminal()
      }

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
      console.log('ing')

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
      this.params1.image = pic

      this.infoFlag = 2
      // 请求接口成功以后打开锁
      let result = await IdentifyFace(this.params)
      let result1 = await FindCriminal(this.params1)
      this.uploadLock = true


      if (result.error_code == 0) {
        let time = this.getTime()
        console.log(result)
        this.flag = '成功'
      } else {
        this.flag = '失败,请摘下口罩和眼睛重新识别'

        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg,
          'result'
        )
      }
      this.infoFlag = 3
      //FindCriminal
      if (result1.error_code == 0) {
        console.log(result1)
        this.haveCriminal()
      } else {
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg,
          'result1'
        )
      }

      // 关闭摄像头
      this.destroyed()

      // 刷信当前页面
      this.refash()
    },

    //查到罪犯显示haveCriminal
    haveCriminal() {
      let haveCriminal = document.getElementsByClassName('haveCriminal')
      haveCriminal[0].style.display = 'block'
      let haveCriminal1 = document.getElementsByClassName('haveCriminal1')
      haveCriminal1[0].classList.add('blink')
      localStorage.setItem('haveCriminal','true')
    },
    //隐藏节点
    close(event){
      localStorage.removeItem("haveCriminal")
      event.currentTarget.parentElement.style.display = "none"
    },
    //获取当前时间
    getTime() {
      Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    return new Date().Format("yyyy-MM-dd HH时mm分ss秒");
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
.alert {
  display: flex;
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translate(-50%, 0);
}

.haveCriminal{
  display: none;
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
    