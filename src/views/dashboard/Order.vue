<template>
<div>
    <loading :active.sync="isLoading" />
    <h4>訂單內容</h4>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>訂購項目</th>
          <th>付款方式</th>
          <th>訂單總額</th>
          <th>支付狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ order.created.datetime }}</td>
          <td>
            <ul class="list-unstyled">
              <li v-for="item in order.products" :key="item">
                {{ item.product.title }} × {{ item.quantity }}
              </li>
            </ul>
          </td>
          <td>{{ order.payment }}</td>
          <td class="text-right"> {{ order.amount }}</td>
          <td>{{ order.paid ? '已付款' : '未付款' }}</td>
        </tr>
      </tbody>
    </table>
    <h4>收件資訊</h4>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>收件姓名</th>
          <th>收件地址</th>
          <th>收件電話</th>
          <th>收件人E-mail</th>
          <th>備註</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ order.user.name }}</td>
          <td>{{ order.user.address }}</td>
          <td>{{ order.user.tel }}</td>
          <td>{{ order.user.email }}</td>
          <td v-if="order.user.message">{{ order.user.message }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <div>
    <h2>單一產品</h2>
    <h5>產品名稱： {{ order.title }}</h5>
    <h5>產品價格： {{ order.price }}</h5>
    <h5>產品說明： {{ order.description }}</h5>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      order: {},
    };
  },
  created() {
    const { id } = this.$route.params;
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/orders/${id}`;
    this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    this.$http.get(url).then((res) => {
      this.order = res.data.data;
      console.log(this.order);
    });
  },
};
</script>
