<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import TextEllipsis from '@/pages/component/TextEllipsis'

export default {
  name: 'TeacherTaskDetail',
  components: {
    TextEllipsis
  },
  data () {
    return {
      list: [],
      filterVisible: false,
      statusOption: [
        {
          label: '待审批',
          value: 'pending'
        },
        {
          label: '已拒绝',
          value: 'reject'
        },
        {
          label: '已通过',
          value: 'pass'
        }
      ],
      studentOption: [],
      rejectVisible: false,
      rejectForm: {},
      rejectRules: {
        reason: [
          { required: true, message: '请输入拒绝原因', trigger: 'blur' }
        ]
      },
      ruleForm: {},
      rules: {},
      itemId: undefined
    }
  },
  created () {
    this.getTaskDetail({ id: this.$route.query.id })
    this.getStudentList({})
  },
  methods: {
    getStudentList (payload = {}) {
      request('get', 'user/getStudentList', payload).then((res) => {
        if (res.data && res.data.length) {
          this.studentOption = res.data
        } else {
          this.studentOption = []
        }
      })
    },
    getTaskDetail (payload = {}) {
      request('post', 'task/detail', payload).then((res) => {
        this.filterVisible = false
        if (res.data && res.data.length) {
          this.list = res.data
        } else {
          this.list = []
        }
      })
    },
    approvalTask (payload = {}) {
      request('post', 'task/approvalTask', payload).then((res) => {
        if (res) {
          this.getTaskDetail({ id: this.$route.query.id })
          this.rejectVisible = false
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    handlefilterClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleRejectClose (done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {}
          obj.id = Number(this.$route.query.id)
          const payload = { ...this.ruleForm, ...obj }
          this.getTaskDetail(payload)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitRejectForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {}
          obj.task_id = Number(this.$route.query.id)
          obj.id = Number(this.itemId)
          const payload = { ...this.rejectForm, ...obj }
          payload.event = 'reject'
          this.approvalTask(payload)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAgree (id) {
      const payload = {
        task_id: Number(this.$route.query.id),
        id: Number(id),
        event: 'pass'
      }
      this.approvalTask(payload)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleDownload (e, url) {
      e.stopPropagation()
      window.open(`//localhost/graduation_project_manage/public/storage/${url}`)
    },
    transform: transform
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="title">任务详情</span>

      <el-button
        @click="filterVisible = true"
        type="text"
        style="margin-left: 16px"
      >
        筛选
      </el-button>
    </div>
    <div class="body">
      <div class="item border-bottom" v-for="item of list" :key="item.id">
        <div class="item-info">
          <p class="item-title">{{ item.student_name }}</p>
          <p class="item-desc">{{ transform(item.status, statusOption) }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载任务提交材料
          </button>
          <button class="item-button" v-if="item.status === 'pending'" @click="(e) => handleAgree(item.id)">
            审批通过
          </button>
          <button
            class="item-button"
            v-if="item.status === 'pending'"
            @click="
              rejectVisible = true;
              itemId = item.id;
            "
          >
            审批拒绝
          </button>
        </div>
      </div>
    </div>

    <el-dialog
      title=""
      :visible.sync="rejectVisible"
      width="90%"
      :before-close="handleRejectClose"
    >
      <el-form :model="rejectForm" :rules="rejectRules" ref="rejectForm">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="rejectForm.reason"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRejectForm('rejectForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer
      title="筛选"
      size="90%"
      :visible.sync="filterVisible"
      :direction="'rtl'"
      :before-close="handlefilterClose"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="审批状态" prop="status">
          <el-select
            style="width: 100%"
            v-model="ruleForm.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交人" prop="student_id">
          <el-select
            style="width: 100%"
            v-model="ruleForm.student_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in studentOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="filterFooter">
          <el-form-item>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-drawer>
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

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2rem;
  padding-right: 0.2rem;
  height: 1rem;
  background: #eee;
}

.body {
  flex: 1;
  overflow: auto;
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

.filterFooter {
  position: absolute;
  bottom: 0.2rem;
}

</style>
