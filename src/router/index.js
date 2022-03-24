import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Register from '@/pages/register'
import TeacherLogin from '@/pages/teacher/login'
import TeacherThesis from '@/pages/teacher/thesis'
import TeacherThesisDetail from '@/pages/teacher/thesis/detail.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/register',
      name: 'Register',
      component: Register
    }, {
      path: '/teacher/login',
      name: 'TeacherLogin',
      component: TeacherLogin
    }, {
      path: '/teacher/thesis',
      name: 'TeacherThesis',
      component: TeacherThesis
    }, {
      path: '/teacher/thesis/detail',
      name: 'TeacherThesisDetail',
      component: TeacherThesisDetail
    }
  ]
})
