<template>
  <div class="container d-flex justify-content-center">
        <loading :active.sync="isLoading"></loading>
        <form @submit.prevent="onSubmit" class="align-self-center">
            <h3>請先登入</h3>
            <div class="form-group">
                <input type="email" class="form-control" id="InputEmail1"
                  v-model="user.email" placeholder="Enter email">
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="InputPassword1"
                 v-model="user.password" placeholder="Enter Password">
              </div>
              <button type="submit" class="btn btn-primary">登入</button>
        </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      user: {
        email: '',
        password: '',
      },
      token: '',
    };
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/auth/login`;
      this.$http.post(api, this.user).then((res) => {
        this.isLoading = false;
        // console.log(res);
        const { token } = res.data;
        const { expired } = res.data;
        document.cookie = `token=${token};expires=${new Date(expired * 1000)};`;
        this.$emit('emit-token');
        this.$router.push('/cart');
        // this.$router.push('/admin');
      }).catch((err) => console.log(err));
    },
    // signout() {
    //   document.cookie = 'token=;expires=;';
    //   console.log('token 已清除');
    // },
    // getData() {
    //   this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    //   const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/products`;
    //   this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    //   this.$http.get(api).then((res) => {
    //     this.products = res.data.data;
    //     this.pagination = res.data.meta.pagination;
    //   });
    // },
  },
};
</script>
