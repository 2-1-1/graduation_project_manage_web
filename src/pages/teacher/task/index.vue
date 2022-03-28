<script>
import request from '@/utils/request'
import moment from 'moment'

export default {
  name: 'TeacherTask',
  data () {
    const checkNumber = (_rule, value, callback) => {
      if (value) {
        if (!Number.isInteger(value) || String(value).includes('-')) {
          callback(new Error('请输入数字，不能包含-'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkStartTime = (_rule, value, callback) => {
      if (value && this.ruleForm.endTime) {
        if (moment(value).valueOf() > moment(this.ruleForm.endTime).valueOf()) {
          callback(new Error('开始时间不能大于结束时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkEndTime = (_rule, value, callback) => {
      if (value && this.ruleForm.startTime) {
        if (
          moment(value).valueOf() < moment(this.ruleForm.startTime).valueOf()
        ) {
          callback(new Error('开始时间不能大于结束时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: [],
      releaseVisible: false,
      fileList: [],
      filterVisible: false,
      ruleForm: {},
      rules: {
        number: [{ validator: checkNumber, trigger: 'blur' }],
        startTime: [{ validator: checkStartTime }],
        endTime: [{ validator: checkEndTime }]
      },
      releaseForm: {},
      releaseRules: {
        title: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        file: [{ required: true, message: '请上传任务材料', trigger: 'blur' }]
      }
    }
  },
  watch: {
    ruleForm: function () {
      if (
        this.ruleForm.startTime &&
        this.ruleForm.endTime &&
        moment(this.ruleForm.endTime).valueOf() <
          moment(this.ruleForm.startTime).valueOf()
      ) {
        this.$refs.ruleForm.validateField('startTime')
        this.$refs.ruleForm.validateField('endTime')
      } else {
        this.$refs.ruleForm.validateField('startTime')
        this.$refs.ruleForm.validateField('endTime')
      }
    }
  },
  created () {
    this.getTaskList()
  },
  methods: {
    getTaskList (payload = {}) {
      request('post', 'task/list', payload).then((res) => {
        this.filterVisible = false
        if (res.data && res.data.length) {
          this.list = res.data
        } else {
          this.list = []
        }
      })
    },
    releaseTask (payload = {}) {
      request('post', 'task/release', payload).then((res) => {
        this.releaseVisible = false
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.releaseForm = {}
        this.fileList = []
        this.ruleForm = {}
        this.getTaskList({})
      })
    },
    handlefilterClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    closeReleaseDialog (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = this.ruleForm
          this.getTaskList(payload)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitReleaseForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = this.releaseForm
          this.releaseTask(payload)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleDownload (e, name, url) {
      e.stopPropagation()
      const downloadFetch = async () => {
        const payload = {
          url: url
        }
        let blob = await request('post', 'download', payload, {
          responseType: 'blob'
        })
        let URL = window.URL || window.webkitURL
        let href = URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = href
        a.download = name
        a.click()
        a.remove()
      }
      downloadFetch()
    },
    handleUpload (file, fileList) {
      console.log('file, fileList', file, fileList)
      if (file && file.status === 'success') {
        this.releaseForm.file = {
          uid: file.uid,
          name: file.name,
          url: file.response.data
        }
        this.fileList = [
          {
            uid: file.uid,
            name: file.name,
            url: file.response.data
          }
        ]
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="header">
      <span class="title">任务列表</span>

      <el-button size="small" type="primary" @click="releaseVisible = true"
        >发布任务</el-button
      >

      <el-button
        @click="filterVisible = true"
        type="text"
        style="margin-left: 16px"
      >
        筛选
      </el-button>
    </div>
    <ul>
      <router-link
        tag="li"
        class="item border-bottom"
        v-for="item of list"
        :key="item.id"
        :to="'task/detail?id=' + item.id"
      >
        <!-- <img class="item-img" :src="item.imgUrl" /> -->
        <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.number }}</p>
          <p class="item-desc">{{ item.status + "%" }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.name, item.url)"
          >
            下载任务说明材料
          </button>
          <button class="item-button">查看详情</button>
        </div>
      </router-link>
    </ul>

    <el-drawer
      title="筛选"
      size="90%"
      :visible.sync="filterVisible"
      :direction="'rtl'"
      :before-close="handlefilterClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="formContainer"
      >
        <el-form-item label="任务名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model.number="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="发布开始时间" prop="startTime">
          <el-calendar v-model="ruleForm.startTime"> </el-calendar>
        </el-form-item>
        <el-form-item label="发布结束时间" prop="endTime">
          <el-calendar v-model="ruleForm.endTime"> </el-calendar>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog
      title="发布任务"
      :visible.sync="releaseVisible"
      width="90%"
      :before-close="closeReleaseDialog"
    >
      <el-form :model="releaseForm" :rules="releaseRules" ref="releaseForm">
        <el-form-item label="任务名称" prop="title">
          <el-input placeholder="请输入内容" v-model="releaseForm.title" />
        </el-form-item>
        <el-form-item label="任务说明材料" prop="file">
          <el-upload
            style="display: inline-block; width: 100%"
            action="/api/task/upload"
            list-type="text"
            :file-list="fileList"
            :on-change="handleUpload"
            v-model="releaseForm.file"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReleaseForm('releaseForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="stylus">
.el-message-box {
  width: 300px !important;
}
</style>

<style lang="stylus" scoped>
@import '~styles/mixins.styl';

/deep/ .el-drawer__body {
  padding: 0.2rem;
  width: 90%;
}

/deep/ .el-calendar__body {
  padding: 0;
}

/deep/ .el-calendar {
  display: inline-block;
}

/deep/ .el-calendar__header {
  flex-wrap: wrap;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
  background: #eee;
  padding-right: 0.2rem;
}

.title {
  line-height: 0.8rem;
  text-indent: 0.2rem;
}

.item {
  overflow: hidden;
  display: flex;

  .item-img {
    width: 1.7rem;
    height: 1.7rem;
    padding: 0.1rem;
  }

  .item-info {
    flex: 1;
    padding: 0.1rem;
    min-width: 0;

    .item-title {
      line-height: 0.54rem;
      font-size: 0.32rem;
      ellipsis();
    }

    .item-desc {
      line-height: 0.4rem;
      color: #ccc;
      ellipsis();
    }

    .item-button {
      line-height: 0.44rem;
      margin-top: 0.16rem;
      background: #ff9300;
      padding: 0 0.2rem;
      border-radius: 0.06rem;
      color: #fff;
    }
  }
}

.formContainer {
  .el-calendar__body {
    padding: 0;
  }
}
</style>
