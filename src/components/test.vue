
<template>
  <div id='app' style='width:100px;height:100px'>
    <span v-for="(e,index) in arr" :key="index">{{index}}</span>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      arr: [
        1,
        2,
        3,
        4
      ]
    }
  }
}
</script>
