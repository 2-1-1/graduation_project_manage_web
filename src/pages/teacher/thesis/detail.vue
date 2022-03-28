<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import TextEllipsis from '@/pages/component/TextEllipsis'

export default {
  name: 'TeacherThesisDetail',
  components: {
    TextEllipsis
  },
  data () {
    return {
      detail: {
        number: '-'
      },
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
      gradeOption: [
        {
          label: 'S',
          value: 'S'
        },
        {
          label: 'A',
          value: 'A'
        },
        {
          label: 'B',
          value: 'B'
        },
        {
          label: 'C',
          value: 'C'
        }
      ],
      passVisible: false,
      rejectVisible: false,
      passForm: {

      },
      rejectForm: {

      },
      passRules: {
        grade: [{ required: true, message: '请评分', trigger: 'blur' }]
      },
      rejectRules: {
        reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getThesisDetail({ id: this.$route.query.id })
  },
  methods: {
    getThesisDetail (payload = {}) {
      request('post', 'thesis/detail', payload).then((res) => {
        if (res.data) {
          this.detail = res.data
        }
      })
    },
    approvalThesis (payload = {}) {
      request('post', 'thesis/approvalThesis', payload).then((res) => {
        if (res) {
          this.getThesisDetail({ id: this.$route.query.id })
          this.closePassDialog()
          this.closeRejectDialog()
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    handleClose (done) {
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
          if (formName === 'passForm') {
            const payload = {...this.passForm, ...obj}
            payload.event = 'pass'
            this.approvalThesis(payload)
          } else {
            const payload = {...this.passForm, ...obj}
            payload.event = 'reject'
            this.approvalThesis(payload)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleDownload (e, url) {
      e.stopPropagation()
      window.open(url)
    },
    closePassDialog () {
      this.passVisible = false
    },
    closeRejectDialog () {
      this.rejectVisible = false
    },
    transform: transform
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="title">论文详情</span>
    </div>
    <div class="body">
      <div class="item-container">
        <p class="item-title">论文编号</p>
        <p class="item-desc">
          <TextEllipsis :text="detail.number" :length="10" />
        </p>
      </div>
      <div class="item-container">
        <p class="item-title">提交人</p>
        <p class="item-desc">
          <TextEllipsis :text="detail.student_name" :length="10" />
        </p>
      </div>
      <div class="item-container">
        <p class="item-title">提交时间</p>
        <p class="item-desc">
          <TextEllipsis :text="detail.created_time" :length="10" />
        </p>
      </div>
      <div class="item-container">
        <p class="item-title">审批状态</p>
        <p class="item-desc">
          <TextEllipsis
            :text="transform(detail.status, statusOption)"
            :length="10"
          />
        </p>
      </div>

      <p class="p-title">流程信息</p>
      <div class="stepsContainer" style="height: 6rem">
        <el-steps direction="vertical" :active="detail.approvalList ? detail.approvalList.length : 0">
            <el-step
              v-for="(item, index) in detail.approvalList"
              :key="index"
              :title="item.title"
              :description="item.description"
            >
            </el-step>
        </el-steps>
      </div>
    </div>

    <el-dialog
      title=""
      :visible.sync="passVisible"
      width="90%"
      :before-close="closePassDialog"
    >
      <el-form
        :model="passForm"
        :rules="passRules"
        ref="passForm"
      >
        <el-form-item label="评分" prop="grade">
          <el-select
            style="width: 100%"
            v-model="passForm.grade"
            placeholder="请选择"
          >
            <el-option
              v-for="item in gradeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="rejectVisible"
      width="90%"
      :before-close="closeRejectDialog"
    >
      <el-form
        :model="rejectForm"
        :rules="rejectRules"
        ref="rejectForm"
      >
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
          <el-button type="primary" @click="submitForm('rejectForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="footer">
        <span v-if="detail.status === 'pass'" style="margin-left: 16px">已通过</span>
        <span v-if="detail.status === 'reject'" style="margin-left: 16px">已拒绝</span>
      <el-button
        v-if="detail.status !== 'pass' && detail.status !== 'reject'"
        @click="passVisible = true"
        type="text"
        style="margin-left: 16px"
      >
        通过
      </el-button>
      <el-button
        v-if="detail.status !== 'pass' && detail.status !== 'reject'"
        @click="rejectVisible = true"
        type="text"
        style="margin-left: 16px"
      >
        拒绝
      </el-button>
    </div>
  </div>
</template>

<style lang="stylus">
.el-message-box {
  width: 300px !important;
}
</style>

<style lang="stylus" scoped>
@import '~styles/mixins.styl';

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

.p-title {
    text-indent: 0.2rem;
    line-height: 0.54rem;
    font-size: 0.32rem;
    ellipsis();
}

.item-container {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;

  .item-title {
    line-height: 0.54rem;
    font-size: 0.32rem;
    ellipsis();
  }

  .item-desc {
    color: #ccc;
    line-height: 0.54rem;
    font-size: 0.32rem;
    ellipsis();
  }
}

.stepsContainer {
  padding: 0.2rem;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.2rem;
  padding-right: 0.2rem;
  text-align: right;
  height: 1rem;
  background: #eee;
}
</style>
