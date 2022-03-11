<script>
import Header from '@/pages/home/home/Header'
import request from '@/utils/request'

export default {
  name: 'TeacherLogin',
  components: {
    Header
  },
  created () {
    request('get', 'facutly/list', {}).then((res) => {
      if (res.code !== 200) {
        this.$message({
          message: res.message,
          type: 'error'
        })
        return
      }
      this.facutlyOption =
        res && res.data
          ? this.mapDeptData(res.data).filter((item) => item.level === 1)
          : []
    })
  },
  data () {
    const validatePass = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.passwordAgain !== '') {
          this.$refs.ruleForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    const validatePass2 = (_rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      typeOption: [
        {
          label: '教师',
          value: 'teacher'
        },
        {
          label: '学生',
          value: 'student'
        }
      ],
      facutlyOption: [],
      classOption: [],
      ruleForm: {
        phone: '',
        password: '',
        class: ''
      },
      rules: {
        phone: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordAgain: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    mapDeptData (arr) {
      const newArr = arr.map((item) => {
        item.value = item.facutlyId
        item.label = item.facutlyName
        item.leaf = item.isLeaf
        if (!item.isLeaf) {
          item.children = this.mapDeptData(
            arr.filter((child) => child.parentId === item.facutlyId)
          )
        }
        return item
      })
      return newArr
    },
    handleFacultyChange (value) {
      this.$refs['class'].resetField()
      const payload = {
        facutlyId: value || ''
      }
      request('get', 'facutly/classList', payload).then((res) => {
        if (res.code !== 200) {
          this.$message({
            message: res.message,
            type: 'error'
          })
          return
        }
        this.classOption = res && res.data ? res.data : []
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = { ...this.ruleForm }
          delete payload.passwordAgain
          request('post', 'register', payload).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$refs[formName].resetFields()
              return
            }
            this.$message({
              message: res.message,
              type: 'error'
            })
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
      <el-form-item label="身份选择" prop="type">
        <el-select
          style="width: 100%"
          v-model="ruleForm.type"
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院系" prop="faculty">
        <el-cascader
          style="width: 100%"
          v-model="ruleForm.faculty"
          :options="facutlyOption"
          @change="handleFacultyChange"
          :show-all-levels="false"
          :props="{ checkStrictly: true, emitPath: false }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="班级" prop="class" ref="class">
        <el-select
          style="width: 100%"
          v-model="ruleForm.class"
          placeholder="请选择"
        >
          <el-option
            v-for="item in classOption"
            :key="item.classId"
            :label="item.classId"
            :value="item.classId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group style="width: 100%" v-model="ruleForm.sex">
          <el-radio label="man">男</el-radio>
          <el-radio label="woman">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" placeholder="请输入密码" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        placeholder="请再次输入密码"
        prop="passwordAgain"
      >
        <el-input v-model="ruleForm.passwordAgain" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang='stylus' scoped>
.container {
  padding: 0.32rem;
}
</style>
