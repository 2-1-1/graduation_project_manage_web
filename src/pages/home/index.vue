<script>
import Header from './home/Header'
import Welcome from './home/welcome'

export default {
  name: 'Home',
  components: {
    Header,
    Welcome
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
<template>
  <div>
    <Header></Header>
    <Welcome></Welcome>
  </div>
</template>
