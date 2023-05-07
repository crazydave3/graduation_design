<template>
  <div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">监视中,{{ time }}秒后拍照识别罪犯和统计人数</p>
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
      <div class="overPerson">
        <div class="overPerson1"></div>
        <button class="close" @click="close">关闭</button>
      </div>
      <div class="haveCriminal">
        <div class="haveCriminal1"></div>
        <button class="close" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import '@/assets/tracking/build/data/face-min.js'
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
        max_face_num: 10,
        match_threshold: 80
      },

      //人数
      count: 0,
      maxPerson: 0,
      monitorInterval: 0,

      // 提示
      infoFlag: 1,
      time: 0,

      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: true,

      isShow: false,

      //定时器
      timer: null,
      timer1: null,
      timer2: null
    }
  },
  mounted() {
    this.init()
    this.getmaxperson()
  },
  methods: {
    getmaxperson() {
      axios({
        url: 'http://127.0.0.1:80/getadmin',
        method: 'get'
      }).then((res) => {
        console.log(res.data[0])
        this.maxPerson = res.data[0].maxPerson
        this.monitorInterval = res.data[0].monitorInterval
        this.time = this.monitorInterval
        // this.admin = res.data[0]
      })
    },
    // 初始化设置
    init() {
      this.infoFlag = 1
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
        if (this.time === 0) _this.uploadLock && _this.screenshotAndUpload()
      }, 1000)
      this.timer1 = setInterval(() => {
        this.time--
      }, 1000)
    },

    // 上传图片
    async screenshotAndUpload() {
      clearInterval(this.timer)
      clearInterval(this.timer1)
      if (this.timer) clearTimeout(this.timer2)

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
      const time = this.getTime()

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
        const dir = 'D:/img/count/'
        const fileName = `${time}` + `${result.person_num}` + '人.png'
        // console.log(result)
        this.count = result.person_num
        //把图片存进本地
        this.putPicCount(pic.toString(), dir, fileName)
        //存数据进数据库
        this.putCountData(dir + fileName, result.person_num, `${time}`)
        if (this.count > this.maxPerson) {
          this.overPerson()
        }
        this.infoFlag = 3
        this.timer1 = setTimeout(() => {
          this.time = this.monitorInterval
          this.infoFlag = 1
          this.timer2 = setInterval(() => {
            this.time--
            if (this.time === 0) {
              this.uploadLock && this.screenshotAndUpload()
            }
          }, 1000)
        }, 3000)
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
        const dir = 'D:/img/monitor/'
        const fileName =
          `${time}` +
          `${result1.result.face_list[0].user_list[0].user_id}` +
          '.png'
        // console.log(result1)
        //把图片存进本地
        this.putPicMonitor(
          pic.toString(),
          'D:\\img\\monitor',
          `${time}` +
            `${result1.result.face_list[0].user_list[0].user_id}` +
            '.png'
        )
        //存数据进数据库
        this.putMonitorData(
          dir + fileName,
          `${result1.result.face_list[0].user_list[0].user_id}`,
          `${time}`
        )
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
        this.count = result.person_num
        if (this.count > this.maxPerson) {
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
    overPerson() {
      let overPerson = document.getElementsByClassName('overPerson')
      overPerson[0].style.display = 'block'
    },
    //查到罪犯显示haveCriminal
    haveCriminal() {
      let haveCriminal = document.getElementsByClassName('haveCriminal')
      haveCriminal[0].style.display = 'block'
      let haveCriminal1 = document.getElementsByClassName('haveCriminal1')
      haveCriminal1[0].classList.add('blink')
    },
    //隐藏节点
    close(event) {
      event.currentTarget.parentElement.style.display = 'none'
    },
    //获取当前时间
    getTime() {
      Date.prototype.Format = function (fmt) {
        var o = {
          'M+': this.getMonth() + 1, //月份
          'd+': this.getDate(), //日
          'H+': this.getHours(), //小时
          'm+': this.getMinutes(), //分
          's+': this.getSeconds(), //秒
          'q+': Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          )
        for (var k in o)
          if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            )
        return fmt
      }
      return new Date().Format('yyyy-MM-dd HH时mm分ss秒')
    },
    putPicCount(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/count',
        method: 'get',
        params: {
          pic,
          dir,
          fileName
        }
      }).then((res) => {
        console.log(res)
      })
    },
    putPicMonitor(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/monitor',
        method: 'get',
        params: {
          pic,
          dir,
          fileName
        }
      }).then((res) => {
        console.log(res)
      })
    },
    putCountData(photo, peopleNum, time) {
      axios({
        url: 'http://127.0.0.1:80/addcount',
        method: 'post',
        data: {
          photo,
          peopleNum,
          time
        }
      }).then((res) => {
        console.log(res)
      })
    },
    putMonitorData(photo, name, time) {
      axios({
        url: 'http://127.0.0.1:80/addmonitor',
        method: 'post',
        data: {
          photo,
          name,
          time
        }
      }).then((res) => {
        console.log(res)
      })
    },
    // 关闭摄像头
    destroyed() {
      clearTimeout(this.timer1)
      clearTimeout(this.timer2)
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
.overPerson {
  display: none;
}

.haveCriminal {
  display: none;
}
.overPerson1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: red;
  margin: 0 20px;
}

.haveCriminal1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: red;
  margin: 0 20px;
}
.close {
  transform: translate(55%, 10px);
}
.blink {
  animation: blink 1s linear infinite 0s normal;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
  