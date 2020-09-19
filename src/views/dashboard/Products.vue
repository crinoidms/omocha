<template>
  <div class="container">
      <h3 class="p-3">產品列表</h3>
      <button  type="button" class="btn btn-outline-info float-right" data-toggle="modal"
          data-target="#editModal" id="creatBtn" @click="openModal('new')">新增產品</button>
      <table class="table">
          <thead>
              <tr>
              <th scope="col">分類</th>
              <th scope="col">圖片</th>
              <th scope="col">名稱</th>
              <th scope="col">簡介</th>
              <th scope="col">售價</th>
              <th scope="col">啟用</th>
              <th scope="col">操作</th>
              </tr>
          </thead>
          <tr v-for="item in products" :Key="item.id">
              <td>{{item.category}}</td>
              <td class="pic td_height">
                  <img :src="item.imageUrl" :alt="item.title">
              </td>
              <td>{{item.title}}</td>
              <td style="max-width:150px">{{item.content}}</td>
              <td style="text-align: right; padding-right: 30px;">{{item.origin_price}}</td>
              <td :class="{grey: item.enabled}">{{item.enabled ? "已啟用" : "未啟用"}}</td>
              <td>
                  <button class="btn btn-light editBtn"
                   @click="openModal('edit', item)">編輯</button>
                  <button class="btn btn-outline-danger"
                   @click="openModal('del', item)">刪除</button>
              </td>
            </tr>
      </table>
      <pagination :pages="pagination" @emit-pages="getProducts"></pagination>

      <div class="modal fade" id="editModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header bg-info text-white">
            <h4 class="modal-title pl-3" id="exampleModalLabel">{{ isUpdate ? '修改產品' : '新增產品'}}</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label for="title">產品名稱</label>
                            <input id="title"  type="text" class="form-control"
                            v-model="tempProduct.title"
                            placeholder="請輸入產品名稱" required>
                        </div>
                        <div class="form-group col-sm-3">
                            <label for="origin_price">原價</label>
                            <input id="origin_price" class="form-control"
                            v-model="tempProduct.origin_price"
                            placeholder="請輸入產品原價" required>
                        </div>
                        <div class="form-group col-sm-3">
                            <label for="price">售價</label>
                            <input id="price" type="number" class="form-control"
                            v-model="tempProduct.price"
                            placeholder="請輸入產品售價" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label for="content">產品簡述</label>
                            <input id="content"  type="text" class="form-control"
                                v-model="tempProduct.content" placeholder="請輸入產品簡述" required>
                        </div>
                        <div class="form-group  col-sm-4">
                            <label for="category">分類</label>
                            <input id="category"  type="text" class="form-control"
                                v-model="tempProduct.category"
                                placeholder="請輸入產品分類" required>
                        </div>
                        <div class="form-group col-sm-2">
                            <label for="unit">單位</label>
                            <input id="unit"  type="text" class="form-control"
                                v-model="tempProduct.unit" placeholder="單位" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label for="description">產品描述</label>
                            <textarea id="description" v-model="tempProduct.description"
                             type="text" class="form-control"
                            placeholder="請輸入產品說明" required>
                            </textarea>
                        </div>
                        <div class="form-group col-sm-3">
                            <label for="enabled">啟用</label>
                            <div class="btn-group-toggle m-1">
                                <label class="btn btn-outline-info" for="enabled"
                                 :class="{'active' : !tempProduct.enabled}">
                                    <input type="checkbox"  id="enabled"
                                     v-model="tempProduct.enabled"> 未啟用
                                </label>
                                <label class="btn btn-outline-info" for="enabled"
                                 :class="{'active' : tempProduct.enabled}">
                                    <input type="checkbox"  id="enabled"
                                     v-model="tempProduct.enabled"> 已啟用
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-5">
                            <div v-for="i in 5" :key="i + 'img'" class="form-group">
                                <label :for="'img' + i">輸入圖片網址</label>
                                <input :id="'img' + i" v-model="tempProduct.imageUrl[i - 1]"
                                 type="text" class="form-control"
                                    placeholder="請輸入圖片連結">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="customFile">
                                    或 上傳圖片
                                    <i v-if="fileUploading" class="fas fa-spinner fa-spin"></i>
                                </label>
                                <input id="customFile" ref="file" type="file"
                                 class="form-control" @change="uploadFile">
                                </div>
                                    <img class="img-fluid" :src="tempProduct.imageUrl[0]" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                     data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary"
                     @click="updateProduct()" v-if="isUpdate">確定修改</button>
                    <button type="button" class="btn btn-primary"
                     @click="updateProduct()" v-else>確定新增</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="delModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-danger">
                <h3 class="modal-title" id="exampleModalLabel">確定刪除？</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                   <div>確定刪除 <strong>{{this.tempProduct.title}}</strong>？ 刪除後將無法復原</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger"
                     @click="deleteProduct()">刪除</button>
                </div>
            </div>
            </div>
        </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue';

export default {
  components: {
    pagination,
  },
  data() {
    return {
      products: [],
      pagination: {},
      isUpdate: false,
      fileUploading: false,
      tempProduct: {
        imageUrl: [],
      },
    };
  },
  props: ['token'],
  created() {
    this.isLoading = true;
    // this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/products`;
    this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    this.$http.get(url).then((res) => {
      this.isLoading = false;
      this.products = res.data.data;
      this.pagination = res.data.meta.pagination;
    });
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/products&page=${page}`;
      this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      this.$http.get(url).then((res) => {
        this.isLoading = false;
        this.products = res.data.data;
        this.pagination = res.data.meta.pagination;
      });
    },
    openModal(operate, item) {
      switch (operate) {
        case 'new':
          this.isUpdate = false;
          window.$('#editModal').modal('show');
          break;
        case 'edit':
          this.isNew = false;
          this.tempProduct = JSON.parse(JSON.stringify(item));
          this.isUpdate = true;
          this.getProduct(this.tempProduct.id);
          window.$('#editModal').modal('show');
          // this.$refs.editModel.getProduct(this.tempProduct.id);
          break;
        case 'del':
          this.tempProduct = { ...item };
          window.$('#delModal').modal('show');
          break;
        default:
          break;
      }
    },
    getProduct(id) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${id}`;
      this.$http.get(url).then((res) => {
        window.$('#editModal').modal('show');
        this.tempProduct = res.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    uploadFile() {
      const uploadedFile = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/storage`;
      this.fileUploading = true;
      this.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        this.fileUploading = false;
        if (res.status === 200) {
          this.tempProduct.imageUrl.push(res.data.data.path);
        }
      }).catch(() => {
        console.log('上傳不可超過 2 MB');
        this.fileUploading = false;
      });
    },
    updateProduct() {
      this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      if (this.isUpdate) {
        const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`;
        this.$http.patch(url, this.tempProduct).then(() => {
          window.$('#editModal').modal('hide');
          this.$emit('update');
        }).catch((err) => {
          console.log(err);
        });
      } else {
        const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product`;
        this.$http.post(url, this.tempProduct).then(() => {
          window.$('#editModal').modal('hide');
          this.$emit('update');
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    deleteProduct() {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`;
      this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      this.$http.delete(url).then(() => {
        window.$('#delModal').modal('hide');
        this.$emit('update');
      });
    },
  },
};
</script>

<style>
  .grey {
      color: #ccc;
  }
  .td_height {
    height: 180px;
  }
  .overflow_hidden {
      overflow: hidden;
  }
  .pic {
      width: 200px;
      /* padding: 0 20px; */
  }
  img {
      height: 100%;
      box-sizing: border-box;
      max-width: 100%;
      max-height: 100%;
      /* width: 100%; */
  }
</style>
