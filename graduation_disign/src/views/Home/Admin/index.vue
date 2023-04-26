<template>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="password" label="密码"> </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 弹框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="admin"
          label-position="left"
          label-width="60px"
          style="width: 350px; margin-left: 35px"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="admin.account" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="admin.password" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
  
          <el-button type="primary" @click="updateData()"> 确定 </el-button>
        </div>
      </el-dialog>
    </div>
  </template>
    
  <script>
  import axios from 'axios'
  
  export default {
    name: 'Admin',
    data() {
      return {
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
      this.getadmin()
    },
    methods: {
      changeadmin() {
        this.$router.push({ path: '/home' })
      },
      getadmin() {
        axios({
          url: 'http://127.0.0.1:80/getadmin',
          method: 'get'
        }).then((res) => {
          this.tableData = res.data
          // this.admin = res.data[0]
        })
      },
  
      setadmin() {
        axios({
          url: 'http://127.0.0.1:80/setadmin',
          method: 'post',
          params: {
            admin: this.admin.account
          },
          data: this.admin
        }).then((res) => {
          console.log('修改成功')
        })
      },
      //编辑
      handleEdit(index, row) {
        this.disabled = true
        this.resetStudent(), (this.dialogStatus = 'update')
        this.dialogFormVisible = true
        this.admin.account = row.account
        this.admin.password = row.password
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      //重置数据
      resetStudent() {
        this.admin = {
          account: '',
          password: ''
        }
      },
      //更新数据
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios({
              url: 'http://127.0.0.1:80/setadmin',
              method: 'post',
              params: {
                admin: this.admin.account
              },
              data: this.admin
            }).then((res) => {
              console.log('修改成功')
            })
            this.dialogFormVisible = false
            location.reload()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          }
        })
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
    