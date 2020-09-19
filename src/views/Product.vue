<template>
<div>
  <loading :active.sync="isLoading"></loading>
  <div class="container">
      <nav aria-label="breadcrumb">
          <ol class="breadcrumb"
          style="margin: 0; background-color: rgba(255, 255, 255, 0);text-align: left;">
            <li class="breadcrumb-item"><router-link :to="`/`">首頁</router-link></li>
            <li class="breadcrumb-item">
              <router-link :to="`/products/`">所有商品</router-link></li>
            <li class="breadcrumb-item">{{product.title}}</li>
          </ol>
      </nav>
      <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="product-img d-flex justify-content-center p-3"
                style="max-width: 100vw;">
                    <img :src="product.imageUrl" alt="product.title" style="max-width: 100%">
                </div>
            </div>
            <div class="col-md-5 px-3 py-3">
                <div class="pt-3" style="border-bottom: 1px solid #eee;">
                    <h3>{{ product.title }}</h3>
                    <h3 class="pr-4" style="text-align: right; color: #ff6666">
                      <span style="font-size: 16px;">NT.</span> {{ product.price }}
                    </h3>
                </div>
                <div class="py-3">
                    <h6>【商品介紹】</h6>
                    <p style="margin: 0;">
                      {{product.description}}
                    </p>
                </div>
                <div class="d-flex justify-content-end pr-3">
                    <div style="max-width: 200px;">
                        <div class="d-flex justify-content-between" style="max-width: 100%;">
                            <button type="button" class="btn btn-outline-primary"
                            style="width: 25%;" @click="decreaseQuantity"> - </button>
                            <input type="text" class="form-control"
                            style="width: 50%; text-align: center;" v-model="quantity" >
                            <button type="button" class="btn btn-outline-primary"
                            style="width: 25%;" @click="increaseQuantity"> + </button>
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-block my-3"
                        style="width:100%" @click="addToCart()">放入購物車</button>
                    </div>
                </div>
            </div>
        </div>
  </div>
</div>

  <!-- <div>
    <h2>單一產品</h2>
    <h5>產品名稱： {{ product.title }}</h5>
    <h5>產品價格： {{ product.price }}</h5>
    <h5>產品說明： {{ product.description }}</h5>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      quantity: 1,
      product: {},
    };
  },
  created() {
    this.isLoading = true;
    const { id } = this.$route.params;
    const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/product/${id}`;
    this.$http.get(url).then((res) => {
      this.isLoading = false;
      this.product = res.data.data;
    });
  },
  methods: {
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity += 1;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    addToCart() {
      const cart = {
        product: this.product.id,
        quantity: this.quantity,
      };
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      this.$http.post(url, cart).then((res) => {
        this.isLoading = false;
        this.$bus.$emit('get-cart');
        console.log(res);
        // this.getCart();
      }).catch((error) => {
        this.isLoading = false;
        console.log(error);
      });
    },
  },
};
</script>
