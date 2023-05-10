<template>
  <div>
    <div style="height: 20px;"><router-link id="toAddCriminal" to="criminal">←录入罪犯人脸</router-link><router-link id="toMonitor" to="monitor">监控统计人数→</router-link></div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">请摘下眼镜和口罩正视摄像头刷身份证进闸</p>
      <p v-else-if="infoFlag === 2">正在识别</p>
      <p v-else-if="infoFlag === 3">
        识别成功,{{ this.filterData[0].name }}请过闸门
      </p>
      <p v-else-if="infoFlag === 4">识别失败，请重新识别</p>
    </div>
    <!-- 提示区域 end -->

    <!-- 摄像区域 start -->
    <div class="video-box">
      <video id="video" preload autoplay loop muted></video>
      <canvas id="canvas"></canvas>
      <canvas id="screenshotCanvas"></canvas>
      <img src="../assets/defaultImg.png" alt="" />
      <p>
        输入身份证号<input type="text" v-model="cardno" /><button
          @click="confirm()"
        >
          确定
        </button>
      </p>
    </div>
    <!-- 摄像区域 end -->
    <div class="alert">
      <div class="haveCriminal">
        <div class="haveCriminal1"></div>
        <button class="close" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>
    
<script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
import { CompareFace, IdentifyFace, FindCriminal } from '../api'
import axios from 'axios'
export default {
  name: 'Identify',
  data() {
    return {
      paramsArr: [],
      paramsArr1: [],

      // 人脸参数
      params: {
        image: '',
        image_type: 'BASE64'
      },
      params1: {
        image: '',
        image_type: 'BASE64',
        group_id_list: 'hjm'
      },
      params2: {
        image: '',
        image_type: 'BASE64'
      },
      params3: {
        image: '',
        image_type: 'BASE64'
      },
      tableData: [],
      tableData1: [],
      filterData: [],
      filterData1: [],

      // 提示
      infoFlag: 1,
      flag: '',

      cardno: '',
      // 摄像
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: false,

      isShow: false,

      //定时器
      timer: null
    }
  },
  mounted() {
    this.getRegister()
    this.getCriminal()
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 初始化设置
    init() {
      let haveCriminal = localStorage.getItem('haveCriminal')
      if (haveCriminal === 'true') {
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
    },

    // 上传图片
    async screenshotAndUpload() {
      // 上锁避免重复发送请求
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

      // 使用 base64Img 请求接口即可
      this.params1.image = pic
      this.params3.image = pic
      this.paramsArr.push(this.params)
      this.paramsArr.push(this.params1)
      this.paramsArr1.push(this.params2)
      this.paramsArr1.push(this.params3)

      this.infoFlag = 2
      // 请求接口成功以后打开锁
      // let result = await IdentifyFace(this.params)
      // let result1 = await FindCriminal(this.params1)
      let result = await CompareFace(this.paramsArr)
      let result1 = await CompareFace(this.paramsArr1)

      if (result.error_code === 0 && result.result.score > 80) {
        this.infoFlag = 3

        const dir = 'D:/img/identify/'
        const fileName = `${time}` + `${this.filterData[0].name}` + '.png'
        console.log(result)
        //把图片存进本地
        this.putPicIdentify(pic.toString(), dir, fileName)
        //存数据进数据库
        this.putIdentifyData(
          dir + fileName,
          this.filterData[0].cardno,
          `${this.filterData[0].name}`,
          `${time}`
        )
      } else {
        this.infoFlag = 4
        console.log(
          'error_code:',
          result.error_code,
          'error_msg:',
          result.error_msg,
          'result'
        )
      }
      if (result1.error_code == 0 && result1.result.score > 80) {
        const dir = 'D:/img/monitor/'
        const fileName = `${time}` + `${this.filterData1[0].name}` + '.png'
        //把图片存进本地
        this.putPicMonitor(pic.toString(), dir, fileName)
        //存数据进数据库
        this.putMonitorData(
          dir + fileName,
          this.filterData1[0].cardno,
          `${this.filterData1[0].name}`,
          `${time}`
        )
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
      localStorage.setItem('haveCriminal', 'true')
    },
    //隐藏节点
    close(event) {
      localStorage.removeItem('haveCriminal')
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
    putPicIdentify(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/identify',
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
    putPicMonitor(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/monitor',
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
    putIdentifyData(photo, cardno, name, time) {
      axios({
        url: 'http://127.0.0.1:80/addidentify',
        method: 'post',
        data: {
          photo,
          cardno,
          name,
          time
        }
      }).then((res) => {
        console.log(res)
      })
    },
    putMonitorData(photo, cardno, name, time) {
      axios({
        url: 'http://127.0.0.1:80/addmonitor',
        method: 'post',
        data: {
          photo,
          cardno,
          name,
          time
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
      this.countdown = 5
      this.isShow = true
      this.timer = setInterval(() => {
        if (this.countdown !== 0) {
          this.countdown--
        } else {
          this.$router.go(0)
        }
      }, 1000)
    },

    getRegister() {
      axios({
        url: 'http://127.0.0.1:80/getregister',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
      })
    },

    getCriminal() {
      axios({
        url: 'http://127.0.0.1:80/getcriminal',
        method: 'get'
      }).then((res) => {
        this.tableData1 = res.data
      })
    },

    confirm() {
      this.filterData = this.tableData.filter((t) => this.cardno === t.cardno)
      this.filterData1 = this.tableData1.filter((t) => this.cardno === t.cardno)

      const base64Img = this.filterData[0].photo
      if (this.filterData1.length > 0) {
        const base64Img1 = this.filterData1[0].photo
        this.params2.image = base64Img1
      }

      this.params.image = base64Img
      this.screenshotAndUpload()
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

.haveCriminal {
  display: none;
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
#toAddCriminal {
  float: left;
  text-decoration: none;
  color: black;
}
#toAddCriminal:hover {
  color: gray;
}
#toMonitor {
  float: right;
  text-decoration: none;
  color: black;
}
#toMonitor:hover {
  color: gray;
}
</style>
    