<template>
  <div id="app">
    <div style="min-height: 100vh; position: relative; margin: 0; padding: 0;">
        <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <router-link class="nav-link" to="/">
            <div class="navbar-brand"></div>
          </router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse"
             data-target="#navbarToggler" aria-controls="navbarToggler"
              aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse my-lg-0" id="navbarToggler">
            <div class="d-flex justify-content-end" style="width: 100%;">
                <ul class="navbar-nav mt-2 mt-lg-0">
                  <li class="nav-item">
                    <router-link class="nav-link" to="/products">精選商品</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/about">關於我們</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/cart">
                      <i class="fas fa-shopping-cart" style="font-size:22px"></i>
                      <span class="badge badge-pill badge-primary"
                       style="transform: translateX(-8px)"
                        v-if="carts.length">{{ carts.length }}</span>
                    </router-link>
                  </li>
                  <li class="nav-item pl-2">
                    <router-link class="nav-link" to="/login" v-if="!checkSuccess">
                      <a class="nav-link" href="#"><i class="fas fa-user"></i> 登入</a>
                    </router-link>
                      <a v-if="token" @click="signout">
                        <i class="fas fa-sign-out-alt"></i> 登出</a>
                  </li>
                </ul>
                </div>
            </div>
        </div>
    </nav>

    <router-view :token="token" @emit-token="checkLogin"></router-view>
    <div style="height:200px;"></div>
    <nav class="navbar sticky-footer navbar-expand-lg navbar-light bg-light
         justify-content-center" style="position: absolute; bottom: 0; width: 100%">
        <div>
            <div class="d-flex flex-wrap justify-content-center align-items-center"
            style="width: 100%;">
                <div class="footer-brand m-3" href="#"></div>
                <div class="d-flex rounded-social-buttons m-3">
                    <a class="social-button facebook" href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a class="social-button twitter" href="https://www.twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                    <a class="social-button youtube" href="https://www.youtube.com/" target="_blank"><i class="fab fa-youtube"></i></a>
                    <a class="social-button instagram" href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="d-flex justify-content-center flex-wrap">
                <h6>本網站為練習作品，並未真正提供商品販售</h6>
            </div>
        </div>
    </nav>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: '',
      checkSuccess: false,
      carts: [],
      totalCartItems: 0,
    };
  },
  created() {
    this.checkLogin();
    this.getCarts();
    this.$bus.$on('get-cart', () => {
      this.getCarts();
    });
  },
  methods: {
    checkLogin() {
      this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (this.token) {
        this.checkSuccess = true;
      } else {
        this.checkSuccess = false;
      }
    },
    signout() {
      document.cookie = 'token=;expires=;';
      this.checkLogin();
    },
    getCarts() {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      this.$http.get(url)
        .then((res) => {
          this.carts = res.data.data;
          this.countTotalItems();
        })
        .catch((error) => {
          console.log(error.response);
          this.isLoading = false;
        });
    },
    countTotalItems() {
      if (this.carts.length > 0) {
        this.totalCartItems = 0;
        this.carts.forEach((item) => {
          this.totalCartItems += item.quantity;
        });
      } else {
        this.cartTotal = 0;
      }
    },
  },
};
</script>
<style lang="scss">
@import "./assets/main.scss";
@import "./assets/omocha.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
