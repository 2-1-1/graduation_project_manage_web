<script>
import request from '@/utils/request'
import transform from '@/utils/transform'
import TextEllipsis from '@/pages/component/TextEllipsis'
import moment from 'moment'

export default {
  name: 'StudentWeekly',
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
      unPassList: [],
      passList: []
    }
  },
  created () {
    this.getWeeklyList()
  },
  methods: {
    getWeeklyList (payload = { type: 'student' }) {
      request('post', 'weekly/list', payload).then((res) => {
        if (res.data && res.data.length) {
          this.list = res.data
          const passList = []
          const unPassList = []
          res.data.map(item => {
            if (item.status === 'pass') {
              passList.push(item)
            } else {
              unPassList.push(item)
            }
          })
          this.unPassList = unPassList
          this.passList = passList
        } else {
          this.list = []
          this.unPassList = []
          this.passList = []
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
        this.getWeeklyList()
      }
    },
    transform: transform,
    moment: moment
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <span class="title">周记数据</span>
      <span class="title" style="color: #ccc;">{{passList.length}} / {{list.length}}</span>
    </div>

      <div class="item-container" style="margin-top: 0.2rem;">
        <p class="item-title">未完成周报</p>
        <p class="item-desc">{{unPassList.length}}个</p>
      </div>
      <div class="tabContainer">
        <div class="item border-bottom" v-for="item of unPassList" :key="item.id">
          <div class="item-info">
          <p class="item-title">{{ moment(item.weekly_date.match(/(\S*) -/)[1])
            .isBetween(moment().startOf('week'),
            moment().endOf('week'), null, '[]')
            ? '本周' : item.weekly_date }}</p>
            <p class="item-desc" v-if="item.submit_time">{{ item.submit_time }}</p>
            <p class="item-desc">{{ item.status !== 'ready' ? transform(item.status, statusOption) : '待提交' }}</p>
            <p class="item-desc" v-if="item.status === 'reject' && item.remark"><TextEllipsis :text="item.remark" :length="10"/></p>
          <el-upload
            style="display: inline-block;"
            action="/api/weekly/upload"
            list-type="text"
            :on-change="handleUpload"
            :show-file-list="false"
            :data="{id: item.id}"
          >
            <button class="item-button">{{ item.status === 'ready' ? '上传周记材料' : '重新提交周记材料' }}</button>
          </el-upload>
          </div>
        </div>
      </div>

      <div class="item-container" >
        <p class="item-title">过往周报</p>
        <p class="item-desc">{{passList.length}}个</p>
      </div>
      <div class="tabContainer">
        <div class="item border-bottom" v-for="item of passList" :key="item.id">
          <div class="item-info">
          <p class="item-title">{{ item.weekly_date }}</p>
          <p class="item-desc">{{ item.created_time }}</p>
          <button
            class="item-button"
            @click="(e) => handleDownload(e, item.url)"
          >
            下载周记材料
          </button>
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
  height: 3rem;
}

.tabContainer:last-child {
  flex: 1;
}
</style>
