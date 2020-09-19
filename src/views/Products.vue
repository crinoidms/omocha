<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container">
      <nav aria-label="breadcrumb">
          <ol class="breadcrumb"
          style="margin: 0; background-color: rgba(255, 255, 255, 0);text-align: left;">
            <li class="breadcrumb-item"><router-link :to="`/`">首頁</router-link></li>
            <li class="breadcrumb-item"><router-link :to="`/products/`">所有商品</router-link></li>
            <li class="breadcrumb-item" v-if="selectCat">{{selectCat}}</li>
          </ol>
      </nav>
        <div class="row" style="min-height:800px">
            <div class="col-md-3 sidebar pt-2">

              <div class="sideBtn" @click="selectCategories('all')"
                :class="{ active : !selectCat }"
              ><h5>全部商品</h5></div>
              <div><h5>- 商品類型 -</h5></div>
              <div class="sideBtn" v-for="cat in categories" :key="cat"
              @click="selectCategories(cat)" :class="{ active : selectCat===cat}">
                <h6> - {{cat}}</h6>
              </div>
            </div>
            <div class="col-md-9" style="padding: 0; min-height: 100%; position:relative;">
                <div class="section-banner d-flex justify-content-center align-items-center">
                    <h5 class="section-title"> - {{ selectCat ? selectCat : '全部商品' }} - </h5>
                </div>
                <div class="row" style="margin:0; width: 100%;">
                    <div class="p-2 d-flex flex-wrap">
                        <div class="p-3 col-6 col-md-4" v-for="item in products" :Key="item.id">
                            <div class="card">
                                <div class="card-img-top d-flex justify-content-center py-4">
                                  <router-link :to="`/product/${item.id}`">
                                    <img :src="item.imageUrl" alt="item.title">
                                  </router-link>
                                </div>
                                <h5 class="card-title pl-2">
                                  <router-link :to="`/product/${item.id}`">{{item.title}}
                                  </router-link>
                                </h5>
                                <h5 class="card-text pl-2">
                                  <span style="font-size:16px;">NT. </span>{{item.price}}
                                </h5>
                                <div class="d-flex justify-content-center pt-1" style="width:100%">
                                  <div class="cartBtn py-2" style="width:50%">
                                    <router-link :to="`/product/${item.id}`">查看商品</router-link>
                                  </div>
                                  <div class="cartBtn py-2" style="width:50%"
                                  @click="addToCart(item)">放入購物車</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page d-flex justify-content-center">
                  <pagination :pages="pagination" @emit-pages="getProducts"></pagination>
                </div>
          </div>
        </div>
    </div>
    <!-- <h2>產品列表</h2>
    <div class="d-flex flex-wrap">
      <div class="card" style="width: 18rem; margin: 1rem"  v-for="item in products" :Key="item.id">
        <img class="card-img-top" :src="item.imageUrl" alt="item.title">
        <div class="card-body">
          <h5 class="card-title">
            <router-link :to="`/product/${item.id}`">{{ item.title }}</router-link>
            </h5>
          <p class="card-text">{{item.content}}</p>
          <h5>{{item.origin_price}}</h5>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue';

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      pagination: {},
      categories: ['紅牛', '達摩', '犬張子', '轉蛋'],
      selectCat: '',
      filteProducts: [],
      quantity: 1,
    };
  },
  created() {
    this.isLoading = true;
    this.getProducts();
  },
  methods: {
    getProducts(page = 1) {
      if (!this.selectCat) {
        this.isLoading = true;
        const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products?paged=6&page=${page}`;

        this.$http.get(url)
          .then((res) => {
            this.isLoading = false;
            this.products = res.data.data;
            this.pagination = res.data.meta.pagination;
          });
      } else {
        // API 沒有 filter，以每類型最多兩頁的情況自製
        // 頁碼 active 失敗
        this.isLoading = true;
        const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products?paged=50&page=1`;

        this.$http.get(url)
          .then((res) => {
            this.isLoading = false;
            this.filteProducts = res.data.data.filter((item) => item.category === this.selectCat);
            const tempPagination = res.data.meta.pagination;
            const totalLength = this.filteProducts.length;
            tempPagination.total = totalLength;
            tempPagination.count = totalLength;
            tempPagination.per_page = 6;
            tempPagination.total_pages = Math.ceil(totalLength / 6);
            tempPagination.current_pag = page;
            this.pagination = tempPagination;
            if (totalLength < 7) {
              this.products = this.filteProducts;
            } else if (page === 1) {
              this.products = this.filteProducts.slice(0, 6);
            } else {
              this.filteProducts.splice(0, 6);
              this.products = this.filteProducts;
            }
          });
      }
    },
    selectCategories(cat) {
      if (cat === 'all') {
        this.selectCat = '';
        this.getProducts();
      } else {
        this.selectCat = cat;
        this.getProducts();
      }
    },
    addToCart(item) {
      const cart = {
        product: item.id,
        quantity: this.quantity,
      };
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      this.$http.post(url, cart).then(() => {
        this.isLoading = false;
        this.$bus.$emit('get-cart');
      }).catch((error) => {
        this.isLoading = false;
        console.log(error);
      });
    },
  },
  components: {
    pagination,
  },
};
</script>
<style>
  .card:hover {
  transform: translateY(0);
  box-shadow: none;
}
.cartBtn {
  border: 1px solid #eee;
  transition: 0.5s;
}
.cartBtn:hover {
  opacity: 0.5;
  color: #ff6666;
  border-color: #ff6666;
}
a {
  color: #555;
}
.cartBtn:hover a {
  color: #ff6666;
}
.sideBtn.active h6, .sideBtn.active h5{
  /* color: #ff9966; */
  font-weight: 800;
}
.card-title a{
  font-size: 18px;
  font-weight: 600;
  transition: 0.5s;
}
.card-title a:hover {
  color: #ff6666;
}
</style>
