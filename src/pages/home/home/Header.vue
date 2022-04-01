<script>
export default {
  name: 'Header',
  data () {
    return {
      formSelectData: false,
      routerLink: window.location.href
    }
  },
  methods: {
    formSelect () {
      this.formSelectData = !this.formSelectData
    },
    handleClose () {
      this.formSelectData = false
    }
  }
}
</script>

<template>
  <div class="header">
    <div class="headleft">
      <div class="iconfont back-icon">&#xe624;</div>
    </div>
    <input type="text" class="inputhead" />
    <div class="right" v-on:click="this.formSelect">
      <span v-if="routerLink.includes('teacher')">教师端</span>
      <span v-else-if="routerLink.includes('student')">学生端</span>
      <span v-else>登录</span>
    </div>
    <el-dialog
      title="登录端选择"
      :visible.sync="formSelectData"
      width="90%"
      :before-close="handleClose"
    >
      <router-link :to="'/teacher/login'">
        <div class="selectButton">
          <el-button @click="formSelectData = false">教师端</el-button>
        </div>
      </router-link>
      <router-link :to="'/student/login'">
        <div class="selectButton">
          <el-button @click="formSelectData = false">学生端</el-button>
        </div>
      </router-link>
      <router-link :to="'/register'">
        <div class="selectButton">
          <el-button @click="formSelectData = false">注册</el-button>
        </div>
      </router-link>
    </el-dialog>
  </div>
</template>

<style lang='stylus' scoped>
.selectButton {
  display: flex;
  justify-content: center;
  margin-bottom: 0.32rem;

  .el-button {
    width: 50%;
  }
}

.header {
  display: flex;
  line-height: 0.86rem;
  background: #00bcd4;
  color: #fff;

  .headleft {
    width: 0.64rem;
    float: left;

    .back-icon {
      text-align: center;
      font-size: 0.4rem;
    }
  }

  .inputhead {
    flex: 1;
    height: 0.64rem;
    line-height: 0.64rem;
    margin-top: 0.12rem;
    margin-left: 0.2rem;
    padding-left: 0.2rem;
    background-color: #fff;
    border-radius: 0.1rem;
    color: #ccc;
    text-align: center;
  }

  .right {
    min-width: 1.04rem;
    padding: 0 0.1rem;
    float: right;
    text-align: center;
    color: #fff;

    .arrow-icon {
      margin-left: -0.04rem;
      font-size: 0.24rem;
    }
  }
}
</style>
