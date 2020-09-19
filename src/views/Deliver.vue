<template>
<div>
    <div class="container">

    <div class="row justify-content-center">
      <h4>購物車清單</h4>
    </div>
    <div class="row justify-content-center">
      <table class="table table-borderless col-md-6 col-10">
      <thead>
        <tr>
          <th scope="col">縮圖</th>
          <th scope="col">商品名稱</th>
          <th scope="col">數量</th>
          <th scope="col">單價</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in carts" :key="item.product.id">
          <td style="padding:0;">
            <img :src="item.product.imageUrl" alt="" style="max-width:50px">
            </td>
          <td>{{ item.product.title }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.product.price }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>總價: {{cartTotal}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
   <div class="row mt-5">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6 col-10">
          <h3 style="text-align:center; padding-bottom: 10px">請填寫收件人資料</h3>
          <form @submit.prevent="submitOrder">
            <div class="form-group row">
                <label for="username">收件人姓名</label>
                <input type="text" class="form-control" name="name" id="username"
                 :class="{'is-invalid':errors.has('name')}"
                  v-model="user.name" placeholder="請輸入收件人姓名" v-validate="'required'">
                <span class="text-danger" v-if="errors.has('name')">請輸入收件人姓名</span>
            </div>
            <div class="form-group row">
              <label for="email">Email</label>
              <input type="email" class="form-control" name="email" id="email"
               :class="{'is-invalid':errors.has('email')}"
                v-model="user.email" placeholder="請輸入收件人Email" v-validate="'required'">
              <span class="text-danger" v-if="errors.has('email')">請輸入收件人Email</span>
            </div>
            <div class="form-group row">
              <label for="tel">電話</label>
              <input type="tel" class="form-control" name="phone" id="phone"
               :class="{'is-invalid':errors.has('phone')}"
                v-model="user.tel" placeholder="請輸入收件人電話" v-validate="'required'">
              <span class="text-danger" v-if="errors.has('tel')">請輸入收件人電話</span>
            </div>
            <div class="form-group row">
              <label for="address">地址</label>
              <input type="text" class="form-control" name="address" id="address"
               :class="{'is-invalid':errors.has('address')}"
                v-model="user.address" placeholder="請輸入收件人地址" v-validate="'required'">
              <span class="text-danger" v-if="errors.has('address')">請輸入收件人地址</span>
            </div>
            <div class="form-group row">
              <label for="payment">請選擇付款方式</label>
              <select class="form-control" id="payment" v-model="user.payment">
                <option value="" disabled>請選擇付款方式</option>
                <option value="WebATM">WebATM</option>
                <option value="ATM">ATM</option>
                <option value="CVS">CVS</option>
                <option value="Barcode">Barcode</option>
                <option value="Credit">Credit</option>
                <option value="ApplePay">ApplePay</option>
                <option value="GooglePay">GooglePay</option>
              </select>
            </div>
            <div class="form-group row">
              <label for="message">備註資訊</label>
              <textarea name="message" id="message" cols="30" rows="3" v-model="user.message"
                  class="form-control"></textarea>
            </div>
            <div class="text-right mb-5">
              <button type="submit" class="btn btn-primary">確定訂購</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Deliver',
  data() {
    return {
      isLoading: false,
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
        payment: '',
        message: '',
      },
      carts: [],
      cartTotal: 0,
    };
  },
  created() {
    this.isLoading = false;
    this.checkLogIn();
  },
  props: ['token'],
  methods: {
    submitOrder() {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders`;
      const order = { ...this.user };
      this.isLoading = true;
      this.$http.post(url, order)
        .then((res) => {
          this.isLoading = false;
          if (res.data.data.id) {
            this.$router.push('/finish');
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
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
          // console.log(this.carts);
          this.isLoading = false;
          this.updateTotal();
        })
        .catch((error) => {
          console.log(error.response);
          this.isLoading = false;
        });
    },
    updateTotal() {
      this.carts.forEach((item) => {
        this.cartTotal += item.product.price * item.quantity;
      });
    },
  },
};
</script>
