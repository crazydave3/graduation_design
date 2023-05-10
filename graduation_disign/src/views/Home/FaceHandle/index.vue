<template>
  <div>
    <div id="table">
      <p @click="showchart()" id="showchart">←查看图</p>
      <el-form>
        <el-form-item>
          <el-col :span="16" class="left">
            选择时间
            <el-date-picker
              v-model="search_data.startTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            --
            <el-date-picker
              v-model="search_data.endTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-button
              type="primary"
              size="small"
              icon="search"
              @click="imtScreen()"
              >筛选</el-button
            >
          </el-col>
          <el-col :span="3" class="left">
            <el-button
              size="small"
              type="primary"
              @click="batchDelete"
              :disabled="batchDeleteArr.length === 0"
              >批量删除</el-button
            >
          </el-col>
          <el-col :span="3" class="grid">
            <el-input
              v-model="search"
              placeholder="请输入查询内容"
              size="mini"
            ></el-input>
          </el-col>
          <el-col :span="1" class="grid">
            <el-button type="primary" size="small" icon="search" @click="find()"
              >筛选</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
      <el-table
        :data="showTableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="photo" label="人脸">
          <template slot-scope="scope">
            <img
              :src="require('D:/img/identify' + scope.row.photo)"
              width="150px"
              height="100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="cardno" label="身份证号码"> </el-table-column>
        <el-table-column prop="time" label="时间"> </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paginations.page_index"
          :page-size="paginations.page_size"
          :page-sizes="[1, 2, 5, 10, 1000]"
          layout="total, sizes, prev, pager, next ,jumper"
          :total="paginations.total"
        >
        </el-pagination>
      </div>
    </div>
    <div id="chart">
      <p @click="showtable()" id="showtable">←查看表格</p>
      <div id="main"></div>
    </div>
  </div>
</template>
    
  <script>
import axios from 'axios'
import * as echarts from 'echarts'
export default {
  name: 'FaceHandle',
  data() {
    return {
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
      },
      tableData: [],
      filterTableData: [],
      showTableData: [],
      batchDeleteArr: [],
      search_data: {
        startTime: '',
        endTime: ''
      },
      search: '',
      admin: {
        account: '',
        password: ''
      },
      dayNum: 7,
      dayData: [],
      peopleNumData: []
    }
  },
  mounted() {
    this.getData()
  },
  beforeUpdate() {
    this.setDayData()
  },
  methods: {
    changeadmin() {
      this.$router.push({ path: '/home' })
    },
    handleCurrentChange(page) {
      let sortnum = this.paginations.page_size * (page - 1)
      let table = this.tableData.filter((item, index) => {
        return index >= sortnum
      })
      this.showTableData = table.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.showTableData = this.tableData.filter((item, index) => {
        return index < page_size
      })
    },
    setPaginations() {
      this.paginations.total = this.tableData.length
      this.paginations.page_index = 1
      this.paginations.page_size = 5
      console.log(this.tableData)
      this.showTableData = this.tableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    imtScreen() {
      //判断是否输入时间区间
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间区间！'
        })
      }
      const stime = new Date(this.search_data.startTime).getTime()
      const etime = new Date(this.search_data.endTime).getTime()
      if (!stime || !etime) {
        this.tableData = this.filterTableData
      } else {
        this.tableData = this.filterTableData.filter((item) => {
          let date = new Date(item.date)
          let time = date.getTime()

          return time >= stime && time <= etime
        })
      }
      this.setPaginations()
    },
    find() {
      const search = this.search
      if (search) {
        this.tableData = this.filterTableData.filter((data) =>
          data.name.toLowerCase().includes(search.toLowerCase())
        )
      } 
      else this.tableData = this.filterTableData
      this.setPaginations()
    },
    handleSelectionChange(val) {
      this.batchDeleteArr = val
    },
    // 批量删除
    batchDelete() {
      console.log(this.batchDeleteArr)
      this.batchDeleteArr.map(async (item) => {
        await this.handleDelete(0, item)
      })
    },
    //获取数据
    getData() {
      axios({
        url: 'http://127.0.0.1:80/getidentify',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          const a = this.tableData[i].photo.lastIndexOf('/')
          const imgName = this.tableData[i].photo.slice(
            a,
            this.tableData[i].photo.length
          )
          this.tableData[i].date = this.tableData[i].time
            .replace('时', ':')
            .replace('分', ':')
            .replace('秒', '')
          this.tableData[i].photo = imgName
          this.paginations.total = this.tableData.length
        }
        this.filterTableData = this.tableData
        this.showTableData = this.tableData
        this.setPaginations()
      })
    },
    //删除
    handleDelete(index, row) {
      axios({
        url: 'http://127.0.0.1:80/deleteidentify',
        method: 'get',
        params: {
          photo: 'D:/img/identify' + row.photo
        }
      }).then((res) => {
        console.log(res)
      })
      location.reload()
    },

    chart() {
      var chartDom = document.getElementById('main')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          data: this.dayData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.peopleNumData,
            type: 'line'
          }
        ]
      }

      option && myChart.setOption(option)
    },
    showtable() {
      let table = document.getElementById('table')
      let chart = document.getElementById('chart')
      table.style.display = 'block'
      chart.style.display = 'none'
    },
    showchart() {
      let table = document.getElementById('table')
      let chart = document.getElementById('chart')
      table.style.display = 'none'
      chart.style.display = 'block'
      this.chart()
    },
    getDayBefore(day) {
      day = 0 - day
      var date = new Date()
      var timeBefore = date.getTime() + 1000 * 60 * 60 * 24 * day
      date = new Date(timeBefore)
      var year = date.getFullYear().toString().padStart(4, '0')
      var month = (date.getMonth() + 1).toString().padStart(2, '0')
      var day = (date.getDate() + 1).toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    setDayData() {
      for (let i = this.dayNum; i > 0; i--) {
        this.peopleNumData[this.dayNum - i] = 0
        let date = this.getDayBefore(i)
        let date1 = this.getDayBefore(i - 1)
        this.dayData.push(date)
        let time = new Date(date).getTime()
        let time1 = new Date(date1).getTime()
        let peopleTable = this.filterTableData.filter((i) => {
          let date2 = new Date(i.date)
          let time2 = date2.getTime()
          return time2 < time1 && time2 > time
        })
        this.peopleNumData[this.dayNum - i] = peopleTable.length
      }
    }
  }
}
</script>
    
    <style>
.admin-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
#chart {
  display: none;
}
#main {
  height: 500px;
}
#showtable {
  width: 80px;
  cursor: pointer;
}
#showchart {
  width: 65px;
  cursor: pointer;
}
#showtable:hover {
  color: gray;
}
#showchart:hover {
  color: gray;
}
</style>
    