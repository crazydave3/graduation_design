<template>
  <div>
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
            :src="require('D:/img/monitor' + scope.row.photo)"
            width="150px"
            height="100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
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
</template>
    
  <script>
import axios from 'axios'

export default {
  name: 'CriminalFaceHandle',
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
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getData()
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
      console.log(this.search)
      const search = this.search
      if (search) {
        this.tableData = this.filterTableData.filter((data) =>
          data.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      this.setPaginations()
    },
    handleSelectionChange(val) {
      this.batchDeleteArr = val
      console.log(val)
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
        url: 'http://127.0.0.1:80/getmonitor',
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
        url: 'http://127.0.0.1:80/deletemonitor',
        method: 'get',
        params: {
          photo: 'D:/img/monitor' + row.photo
        }
      }).then((res) => {
        console.log(res)
      })
      location.reload()
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
</style>
    