<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import moment from 'moment'

export default {
  name: 'TeacherThesis',
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
        if (moment(value).valueOf() < moment(this.ruleForm.startTime).valueOf()) {
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
      ruleForm: {},
      rules: {
        number: [{ validator: checkNumber, trigger: 'blur' }],
        startTime: [
          { validator: checkStartTime }
        ],
        endTime: [
          { validator: checkEndTime }
        ]
      }
    }
  },
  watch: {
    ruleForm: function () {
      if (this.ruleForm.startTime && this.ruleForm.endTime &&
      moment(this.ruleForm.endTime).valueOf() < moment(this.ruleForm.startTime).valueOf()) {
        this.$refs.ruleForm.validateField('startTime')
        this.$refs.ruleForm.validateField('endTime')
      } else {
        this.$refs.ruleForm.validateField('startTime')
        this.$refs.ruleForm.validateField('endTime')
      }
    }
  },
  created () {
    this.getThesisList()
  },
  methods: {
    getThesisList (payload = {}) {
      request('post', 'thesis/list', payload).then((res) => {
        this.filterVisible = false
        if (res.data && res.data.length) {
          this.list = res.data
        } else {
          this.list = []
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
          const payload = this.ruleForm
          this.getThesisList(payload)
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
    transform: transform
  }
}
</script>

<template>
  <div>
    <div class="header">
      <span class="title">论文列表</span>
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
        :to="'thesis/detail?id=' + item.id"
      >
        <!-- <img class="item-img" :src="item.imgUrl" /> -->
        <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.student_name }}</p>
          <p class="item-desc">{{ transform(item.status, statusOption) }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载论文
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
        <el-form-item label="编号" prop="number">
          <el-input v-model.number="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="提交开始时间" prop="startTime">
          <el-calendar v-model="ruleForm.startTime"> </el-calendar>
        </el-form-item>
        <el-form-item label="提交结束时间" prop="endTime">
          <el-calendar v-model="ruleForm.endTime"> </el-calendar>
        </el-form-item>
        <el-form-item class="center">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
        </el-form-item>
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
