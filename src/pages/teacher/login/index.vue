<script>
import Header from '@/pages/home/home/Header'
import request from '@/utils/request'

export default {
  name: 'TeacherLogin',
  components: {
    Header
  },
  data () {
    return {
      ruleForm: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = this.ruleForm
          request('post', 'login', payload).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<template>
  <div>
    <Header></Header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="container">
      <el-form-item label="用户名" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item class="center">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang='stylus' scoped>
.container {
  padding: 0.32rem;
}

.center {
  display: flex;
  justify-content: center;
}
</style>
