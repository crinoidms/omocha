<template>
<div class="container">
  <div class="d-flex justify-content-center p-5">
    <div style="width:90vw; max-width:500px;">
      <img src="../assets/img/fin.jpg" alt="訂購完成" style="max-width:100%">
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="btn btn-outline-primary" @click="goHome">回首頁</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Finish',
  // props: ['token'],
  methods: {
    goHome() {
      this.$router.push('/');
    },
  },
};
</script>
