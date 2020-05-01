<template>
  <router-link tag="a" to="/friend" target="_blank">xxx
  </router-link>
</template>
<script>
export default {
  created: function () {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'http://localhost:8080/photo/jquery.js'
    document.body.appendChild(s)

    const s1 = document.createElement('script')
    s1.type = 'text/javascript'
    s1.src = 'http://localhost:8080/photo/test.js'
    document.body.appendChild(s1)
  }
}
</script>
