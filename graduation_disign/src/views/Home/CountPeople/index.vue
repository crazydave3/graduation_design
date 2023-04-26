<template>
  <div>
    <el-table :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      " style="width: 100%">
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
        :current-page="currentPage"
        :page-size="pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="total, sizes, prev, pager, next ,jumper"
        :total="tableData.length"
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
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      tableData: [],
      tableData1: [],
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
      textMap: {
        update: '编辑'
      },

      dialogStatus: '',
      dialogFormVisible: false,
      disabled: false,

      downloadLoading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    changeadmin() {
      this.$router.push({ path: '/home' })
    },
    handleSizeChange(size) {
      console.log(size, 'size')
      this.pagesize = size
      console.log(this.pagesize) //每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage, 'currentPage')
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
    getData() {
      axios({
        url: 'http://127.0.0.1:80/getcount',
        method: 'get'
      }).then((res) => {
        this.tableData = res.data
        // this.admin = res.data[0]
        for (let i = 0; i < this.tableData.length; i++) {
          const a = this.tableData[i].photo.lastIndexOf('/')
          const imgName = this.tableData[i].photo.slice(
            a,
            this.tableData[i].photo.length
          )
          this.tableData[i].photo = imgName
          this.total = this.tableData.length
        }
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
    