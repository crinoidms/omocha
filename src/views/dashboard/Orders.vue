<template>
  <div>
    <loading :active.sync="isLoading" />
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
      <tbody v-if="orders.length">
        <tr v-for="(item, key) in orders" :key="key">
          <td>
            <router-link :to="`/admin/order/${item.id}`">
              {{ item.created.datetime }}
            </router-link>
          </td>
          <td>
            <router-link :to="`/admin/order/${item.id}`">
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} × {{ product.quantity }}
              </li>
            </ul>
            </router-link>
          </td>
          <td>{{ item.payment }}</td>
          <td class="text-right"> {{ item.amount }}</td>
          <td>{{ item.paid ? '已付款' : '未付款' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      pagination: {},
      orders: {
        user: {},
      },
      isLoading: false,
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders(pages = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/orders?paged=50&page=${pages}`;
      this.$http.get(url).then((res) => {
        this.orders = res.data.data;
        // console.log(this.orders);
        this.pagination = res.data.meta.pagination;
        this.isLoading = false;
      });
    },
  },
};
</script>
<style>
  td {
    text-align: left;
  }
</style>
