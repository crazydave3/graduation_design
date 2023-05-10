<template>
  <div>
    <div style="height: 20px;"><router-link id="toAddPeople" to="register">←录入人脸</router-link><router-link id="toIdentify" to="identify">扫脸进闸→</router-link></div>
    <!-- 提示区域 start -->
    <div align="center" class="info">
      <p v-if="infoFlag === 1">请输入信息后点击录入</p>
      <p v-else-if="infoFlag === 2">录入成功</p>
      <p v-else-if="infoFlag === 3">录入失败,请检查是否输入姓名</p>
      <p v-else-if="infoFlag === 4">录入失败,请检查身份证长度是否为18位</p>
      <p v-else-if="infoFlag === 5">录入失败,请检查身份证是否正确（重复）</p>
    </div>
    <!-- 提示区域 end -->

    <p>选择图片</p>
    <input type="file" id="setPic" @change="setPic($event)" />
    <div id="main"></div>
    <p>输入姓名<input type="text" v-model="name" /></p>
    <p>
      输入身份证号<input type="text" v-model="cardno" /><button
        @click="confirm()"
      >
        录入
      </button>
    </p>
  </div>
</template>
  
  <script>
import tracking from '@/assets/tracking/build/tracking-min.js'
import '@/assets/tracking/build/data/face-min.js'
import { SetFace } from '../api'
import axios from 'axios'

export default {
  name: 'Criminal',
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
      base64Img: '',
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
    this.getCriminal()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 上传图片
    setPic($event) {
      this.toBase64($event.target.files[0])
        .then((res) => {
          this.params.image = res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toBase64(file) {
      let _this = this
      return new Promise(function (resolve, reject) {
        let img = new FileReader()
        img.onloadend = function (e) {
          _this.base64Img = e.target.result
          _this.Base64ToImage(_this.base64Img, function (img) {
            document.getElementById('main').appendChild(img)
          })
        }

        if (file) {
          img.readAsDataURL(file)
        }
      })
    },
    Base64ToImage(base64Img, callback) {
      var img = new Image()
      img.onload = function () {
        callback(img)
      }
      img.src = base64Img
    },
    confirm() {
      const dir = 'D:/img/criminal/'
      const fileName = `${this.name}-${this.cardno}` + '.png'
      const table = this.tableData.filter((t) => this.cardno === t.cardno)

      if (table.length > 0 || this.cardno.length !== 18 || this.name === '') {
        if (this.name === '') {
          this.infoFlag = 3
        } else if (this.cardno.length !== 18) {
          this.infoFlag = 4
        } else {
          this.infoFlag = 5
        }
      } else {
        const pic = this.base64Img.substring(22)
        this.putPicCriminal(
          pic,
          'D:\\img\\criminal',
          `${this.name}` + '-' + `${this.cardno}` + '.png'
        )
        this.putCriminalData(this.name, this.cardno, dir + fileName)
        this.infoFlag = 2
        this.refash()
      }
    },
    getCriminal() {
      axios({
        url: 'http://127.0.0.1:80/getcriminal',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
      })
    },
    putPicCriminal(pic, dir, fileName) {
      axios({
        url: 'http://127.0.0.1:80/criminal',
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
    putCriminalData(name, cardno, photo) {
      axios({
        url: 'http://127.0.0.1:80/addcriminal',
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

    //刷新当前页面
    refash() {
      this.isShow = true
      this.timer = setInterval(() => {
        this.$router.go(0)
      }, 3000)
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
#main {
  height: auto;
}
#toAddPeople {
  float: left;
  text-decoration: none;
  color: black;
}
#toAddPeople:hover {
  color: gray;
}
#toIdentify {
  float: right;
  text-decoration: none;
  color: black;
}
#toIdentify:hover {
  color: gray;
}
</style>
  