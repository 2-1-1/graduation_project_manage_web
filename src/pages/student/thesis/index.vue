<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import TextEllipsis from '@/pages/component/TextEllipsis'

export default {
  name: 'StudentThesis',
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
      ]
    }
  },
  created () {
    this.getThesisDetail()
  },
  methods: {
    getThesisDetail (payload = {}) {
      request('post', 'thesis/detail', payload).then((res) => {
        if (res.data) {
          this.detail = res.data
        }
      })
    },
    handleDownload (e, url) {
      e.stopPropagation()
      window.open(`//localhost/graduation_project_manage/storage/app/${url}`)
    },
    handleUpload (file, fileList) {
      console.log('file, fileList', file, fileList)
      if (file && file.status === 'success') {
        this.getThesisDetail()
      }
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
        <p class="item-title">论文当前状态</p>
        <p class="item-desc">
          <TextEllipsis
            :text="
              detail.status ? transform(detail.status, statusOption) : '待上传'
            "
            :length="10"
          />
        </p>
      </div>
      <div v-if="detail.status === 'pass'" class="item-container">
        <p class="item-title">论文评价</p>
        <p class="item-desc">
          <TextEllipsis :text="detail.grade" :length="10" />
        </p>
      </div>
      <div class="item-container">
        <p class="item-title">您提交的论文材料</p>
        <div class="item-desc" v-if="!detail.url">
          <el-upload
            style="display: inline-block; width: 100%"
            action="/api/thesis/upload"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
          >
            <div style="color: #409eff">点击上传</div>
          </el-upload>
        </div>
        <div
          class="item-desc"
          style="color: #409eff"
          v-if="detail.url"
          @click="(e) => handleDownload(e, detail.url)"
        >
          下载
        </div>
        <div class="item-desc" v-if="detail.url">
          <el-upload
            style="display: inline-block"
            action="/api/thesis/upload"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
          >
            <div style="color: #409eff">更改</div>
          </el-upload>
        </div>
      </div>
      <div class="item-container">
        <div class="item-desc" style="color: #409eff">{{ detail.name }}</div>
      </div>
      <p class="p-title">流程信息</p>
      <div class="stepsContainer" style="height: 6rem">
        <el-steps
          direction="vertical"
          :active="detail.approvalList ? detail.approvalList.length : 0"
        >
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
