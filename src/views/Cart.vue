<template>
<div>
  <loading :active.sync="isLoading"></loading>
  <div class="container">
    <div class="row align-items-center justify-content-center py-5">
      <h4>購物車清單</h4>
    </div>
    <div class="row align-items-center justify-content-center py-1 bgLight">
      <div class="col-3 col-md-2"><small>縮圖</small></div>
      <div class="col-5 col-md-4 d-flex justify-content-around flex-wrap">
        <small>商品名稱 / </small>
        <small>數量</small>
      </div>
      <div class="col-2 col-md-1 px-2"><small>單價</small></div>
      <div class="col-2 col-md-1 px-2"><small>刪除</small></div>
    </div>
    <div class="row align-items-center justify-content-center py-1"
    v-for="(item, index) in carts" :key="item.product.id">
      <div class="col-3 col-md-2">
        <div style="max-width:100%;">
          <img :src="item.product.imageUrl" alt="" style="width:100%; max-width:100px">
        </div>
      </div>
      <div class="col-5 col-md-4 d-flex justify-content-between flex-wrap">
        <router-link :to="`/product/${item.product.id}`">
          <h6 class="pr-2">{{ item.product.title }}</h6>
        </router-link>
        <div class="d-flex justify-content-around" style="max-width: 100px;">
            <button type="button" class="btn btn-outline-primary btn-sm countBtn"
              style="width: 30%;" @click="decreaseQuantity(index)"> - </button>
            <input type="text" class="form-control quantityInput"
              style="width: 40%; height:32px; text-align: center;" v-model="item.quantity" >
            <button type="button" class="btn btn-outline-primary btn-sm countBtn"
              style="width: 30%;" @click="increaseQuantity(index)"> + </button>
        </div>
      </div>
      <div class="col-3 col-md-1 px-2">
        <h5 style="text-align: right;">{{ item.product.price }}</h5>
      </div>
      <div class="col-1 col-md-1 px-2" @click="deleteCartItem( item.product.id )">
        <div class="deleteBtn">
          <i class="far fa-trash-alt"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-5"></div>
    <div class="col-md-2 border-top pt-3">
      <div class="pr-5">
        <h5 style="text-align: right; color: #ff6666">總價: {{cartTotal}}</h5>
        <button class="btn btn-outline-primary btn-lg mt-3 ml-5" @click="nextStep">下一步</button>
      </div>
    </div>
    <div class="col-md-1"></div>
  </div>
</div>
</template>
<script>
export default {
  name: 'Cart',
  data() {
    return {
      carts: [],
      cartTotal: 0,
    };
  },
  props: ['token'],
  created() {
    this.isLoading = false;
    this.checkLogIn();
  },
  methods: {
    checkLogIn() {
      if (this.token) {
        // console.log(this.token);
        this.getCarts();
      } else {
        this.$router.push('/login');
      }
    },
    getCarts() {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      this.isLoading = true;
      this.$http.get(url)
        .then((res) => {
          this.carts = res.data.data;
          this.isLoading = false;
          this.updateTotal();
        })
        .catch((error) => {
          console.log(error.response);
          this.isLoading = false;
        });
    },
    increaseQuantity(i) {
      if (this.carts[i].quantity < 10) {
        this.carts[i].quantity += 1;
        this.updateQuantity(i);
        this.$bus.$emit('get-cart');
      }
    },
    decreaseQuantity(i) {
      if (this.carts[i].quantity > 1) {
        this.carts[i].quantity -= 1;
        this.updateQuantity(i);
        this.$bus.$emit('get-cart');
      }
    },
    updateQuantity(i) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      const cart = {
        product: this.carts[i].product.id,
        quantity: this.carts[i].quantity,
      };
      this.$http.patch(url, cart)
        .then(() => {
          this.cartTotal = 0;
          this.getCarts();
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    updateTotal() {
      if (this.carts.length > 0) {
        this.carts.forEach((item) => {
          this.cartTotal += item.product.price * item.quantity;
        });
      } else {
        this.cartTotal = 0;
      }
    },
    deleteCartItem(id) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/${id}`;
      this.isLoading = true;
      this.$http.delete(url)
        .then(() => {
          this.isLoading = false;
          this.getCarts();
          this.$bus.$emit('get-cart');
        });
    },
    nextStep() {
      this.$router.push('/deliver');
    },
  },
};
</script>
<style>
  h4, h5 {
    margin: 0;
  }
  a:hover h5{
    color: #ff6666;
  }
  .deleteBtn {
    cursor: pointer;
  }
  .deleteBtn:hover {
    cursor: pointer;
  }
  .bgLight {
    background-color: #eee
  }
  .countBtn, .quantityInput {
    border-radius: 0 !important;
    border-color: #ccc;
  }
</style>
