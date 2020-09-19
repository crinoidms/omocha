<template>
      <div class="container">
        <loading :active.sync="isLoading"></loading>
        <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active" data-interval="5000">
                <img src="../assets/img/silder01.png" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item" data-interval="5000">
                <img src="../assets/img/silder02.png" class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item" data-interval="4000">
                <img src="../assets/img/silder03.png" class="d-block w-100" alt="...">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleInterval"
             role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleInterval"
             role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
        </div>

        <div class="row justify-content-center align-items-center flex-wrap intro-wrap">
            <div class="col col-10 col-sm-10 col-md-5 px-0 pt-3 mx-5 intro">
                <p>日本全國各地都有代代相傳的鄉土玩具，這些玩具呈現日本傳統手工藝品的魅力；同時也體現日本的文化中，人們對於生活與孩子們的祈願。</p>
                <P>Omocha KoYoDo 精選了日本職人們手做的鄉土玩具，及鄉土玩具的模型，這些充滿故事與文化的藝品，送禮或自己收藏都非常適合。</P>
            </div>
            <div class="col col-4 col-sm-4 col-md-3 mx-5 redcowGif">
                <img src="../assets/img/101.gif" alt="">
            </div>
        </div>
        <div class="p-2 present">
            <div class="d-flex justify-content-center py-3">
                <div class="present-title justify-content-center align-items-center">
                  <router-link :to="`/products/`">
                    <h5 class="section-title" style="margin: 0;">- 精選商品 -</h5>
                  </router-link>
                </div>
            </div>
            <div class="row d-flex justify-content-center flex-wrap">
                <div class="card col-5 col-sm-5 col-md-3 m-2"
                 v-for="item in displayProducts" :key="item.id">
                    <div class="card-img-top d-flex justify-content-center py-4">
                      <router-link :to="`/product/${item.id}`">
                        <img :src="item.imageUrl[0]" :alt="item.title">
                      </router-link>
                    </div>
                    <router-link :to="`/product/${item.id}`">
                      <h5 class="card-title">{{item.title}}</h5>
                    </router-link>
                    <h5 class="card-text">NT. {{item.price}}</h5>
                </div>
            </div>
        </div>
        <div class="p-2">
            <div class="row d-flex product-line">
                <div class="col-4 col-md-2 d-flex justify-content-center py-2
                animate__animated animate__pulse animate__infinite"
                 v-for="product in gashapon" :key="product.id">
                 <router-link :to="`/product/${product.id}`">
                  <img :src="product.imageUrl[0]" alt="product.title">
                 </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  data() {
    return {
      products: [],
      gashapon: [],
      displayProducts: [],
    };
  },
  created() {
    this.isLoading = true;
    const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`;
    this.$http.get(url)
      .then((res) => {
        this.isLoading = false;
        this.products = res.data.data;
        this.gashapon = this.products.filter((item) => item.category === '轉蛋').slice(2, 8);
        this.displayProducts = [this.products[20], this.products[10], this.products[15]];
      });
  },
  methods: {
  },
  components: {
    // HelloWorld,
  },
};
</script>

<style>
  p {
    text-align: left;
    font-weight: 600;
  }
</style>
