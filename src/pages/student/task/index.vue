<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import TextEllipsis from '@/pages/component/TextEllipsis'

export default {
  name: 'StudentTask',
  components: {
    TextEllipsis
  },
  data () {
    return {
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
      list: [],
      readyList: [],
      rejectList: [],
      pendingList: [],
      passCount: 0
    }
  },
  created () {
    this.getTaskList()
  },
  methods: {
    getTaskList (payload = { type: 'student' }) {
      request('post', 'task/list', payload).then((res) => {
        if (res.data && res.data.length) {
          this.list = res.data
          const readyList = []
          const rejectList = []
          const pendingList = []
          let passCount = 0
          res.data.map(item => {
            if (item.status === 'ready') {
              readyList.push(item)
            }
            if (item.status === 'reject') {
              rejectList.push(item)
            }
            if (item.status === 'pending') {
              pendingList.push(item)
            }
            if (item.status === 'pass') {
              passCount++
            }
          })
          this.readyList = readyList
          this.rejectList = rejectList
          this.pendingList = pendingList
          this.passCount = passCount
        } else {
          this.list = []
          this.readyList = []
          this.rejectList = []
          this.pendingList = []
          this.passCount = 0
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
        this.getTaskList()
      }
    },
    transform: transform
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="title">任务详情</span>
      <span class="title" style="color: #ccc;">{{passCount}} / {{list.length}}</span>
    </div>

      <div class="item-container" style="margin-top: 0.2rem;">
        <p class="item-title">待完成任务</p>
        <p class="item-desc">{{readyList.length}}个</p>
      </div>
      <div class="tabContainer">
        <div class="item border-bottom" v-for="item of readyList" :key="item.id">
          <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.number }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载任务说明材料
          </button>
          <el-upload
            style="display: inline-block;"
            action="/api/task/uploadStudent"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
            :data="{id: item.id}"
          >
            <button class="item-button">上传任务材料</button>
          </el-upload>
          </div>
        </div>
      </div>

      <div class="item-container" >
        <p class="item-title">待重新提交任务</p>
        <p class="item-desc">{{rejectList.length}}个</p>
      </div>
      <div class="tabContainer">
        <div class="item border-bottom" v-for="item of rejectList" :key="item.id">
          <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.number }}</p>
          <p class="item-desc">{{ item.remark }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载任务说明材料
          </button>
          <el-upload
            style="display: inline-block;"
            action="/api/task/uploadStudent"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
            :data="{id: item.id}"
          >
            <button class="item-button">上传任务材料</button>
          </el-upload>
          </div>
        </div>
      </div>

      <div class="item-container" >
        <p class="item-title">待审批任务</p>
        <p class="item-desc">{{pendingList.length}}个</p>
      </div>
      <div class="tabContainer">
        <div class="item border-bottom" v-for="item of pendingList" :key="item.id">
          <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.number }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载任务说明材料
          </button>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.student_url)"
          >
            下载任务材料
          </button>
          <el-upload
            style="display: inline-block;"
            action="/api/task/uploadStudent"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
            :data="{id: item.id}"
          >
            <button class="item-button">更改任务材料</button>
          </el-upload>
          </div>
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

.title {
  line-height: 0.8rem;
  text-indent: 0.2rem;
}

.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
  height: 1rem;
  background: #eee;

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

.tabContainer {
  padding: 0.2rem;
  overflow: auto;
  height: 2rem;
}

.tabContainer:last-child {
  flex: 1;
}
</style>
