<template>
  <div class="container">
    <ul class="nav justify-content-end navbar-light"
       style="background-color: #ff9999;" v-if="checkSuccess" >
      <li class="nav-item m-2">
        <router-link class="nav-link" to="/admin/">後台首頁</router-link>
      </li>
      <li class="nav-item m-2">
        <router-link class="nav-link" to="/admin/orders">訂單列表</router-link>
      </li>
      <li class="nav-item m-2">
        <router-link class="nav-link" to="/admin/products">產品列表</router-link>
      </li>
      <li class="nav-item m-2">
        <router-link class="nav-link" to="/">離開後台</router-link>
      </li>
    </ul>
    <router-view :token="token" v-if="checkSuccess" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: '',
      checkSuccess: false,
    };
  },
  created() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
      this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      const api = `${process.env.VUE_APP_APIPATH}/auth/check`;
      this.$http.post(api, {
        api_token: this.token,
      }).then((res) => {
        console.log(res);
        this.checkSuccess = true;
      }).catch((error) => {
        console.log(error.response);
        this.$router.push('/login');
      });
    },
    signout() {
      document.cookie = 'token=;expires=;';
      console.log('token 已清除');
      this.$router.push('/login');
    },
  },
};
</script>
