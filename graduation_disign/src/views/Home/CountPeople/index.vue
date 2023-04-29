<template>
  <div>
    <el-form>
      <el-form-item>
        <el-col :span="18" class="left">
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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="photo" label="照片">
        <template slot-scope="scope">
          <!-- {{ scope.row.photo }} -->
          <img
            :src="require('D:/img/count' + scope.row.photo)"
            width="150px"
            height="100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="peopleNum" label="人数"> </el-table-column>
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
        :page-sizes="[1, 2, 5, 10]"
        layout="total, sizes, prev, pager, next ,jumper"
        :total="paginations.total"
      >
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="admin"
        label-position="left"
        label-width="60px"
        style="width: 350px; margin-left: 35px"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="admin.account" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="admin.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>

        <el-button type="primary" @click="updateData()"> 确定 </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
    
  <script>
import axios from 'axios'

export default {
  name: 'CountPeople',
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
      filterTableData: [], //经过时间筛选后得到的数据
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
      },
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
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1)
      let table = this.filterTableData.filter((item, index) => {
        return index >= sortnum
      })
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.tableData = this.filterTableData.filter((item, index) => {
        return index < page_size
      })
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.tableData.length
      this.paginations.page_index = 1
      this.paginations.page_size = 5
      // 设置默认分页数据
      console.log(this.paginations.total);
      console.log(this.tableData,'tab')
      console.log(this.filterTableData,'fil');
      this.tableData = this.tableData.filter((item, index) => {
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
      //获取全部表格数据
      // this.getData()
      const stime = new Date(this.search_data.startTime).getTime()
      const etime = new Date(this.search_data.endTime).getTime()
      //将筛选后的数据赋值给 allTableDate
      this.tableData = this.filterTableData.filter((item) => {
        //筛选后得到的数据 item 中包含数据日期 date
        //创建一个数组 date，存储得到的item.date
        let date = new Date(item.date)
        let time = date.getTime()

        return time >= stime && time <= etime
      })
      //重新分页
      this.setPaginations()
    },
    find() {
      //在你的数据表格中定义tabels
      console.log(this.search)
      const search = this.search
      if (search) {
        // console.log("input输入的搜索内容：" + this.input)
        this.tableData = this.filterTableData.filter((data) =>
          data.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      this.setPaginations()
    },

    //获取数据
    getData() {
      axios({
        url: 'http://127.0.0.1:80/getcount',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
        console.log(this.tableData);
        // this.admin = res.data[0]
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
        this.setPaginations()
      })
    },
    //删除
    handleDelete(index, row) {
      axios({
        url: 'http://127.0.0.1:80/deletecount',
        method: 'get',
        params: {
          photo: 'D:/img/count' + row.photo
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
    