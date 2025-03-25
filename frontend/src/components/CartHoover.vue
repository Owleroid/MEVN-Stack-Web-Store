<template>
  <div class="cart-hover">
    <h3>{{ $t("cartHoover.cart") }}</h3>
    <div v-if="cart.length === 0">
      <p>{{ $t("cartHoover.emptyCart") }}</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="item in cart" :key="item.product._id">
          <img :src="item.product.imageUrls?.main" :alt="item.product.name" />
          <div>
            <p>{{ item.product.name }}</p>
            <p>{{ item.product.price.euros.amount }} €</p>
            <p>{{ $t("cartHoover.quantity") }}: {{ item.quantity }}</p>
          </div>
        </li>
      </ul>
      <router-link to="/cart">{{ $t("cartHoover.viewFullCart") }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import type { Product } from "@/types/products";

import { useEventBus } from "@/utils/eventBus";

import { getCart } from "@/services/cartService";

interface CartItem {
  product: Product;
  quantity: number;
}

const cart = ref<CartItem[]>([]);

const fetchCart = () => {
  cart.value = getCart();
};

const { on } = useEventBus();
const { t } = useI18n();

onMounted(() => {
  fetchCart();
  on("cart-updated", fetchCart);
});
</script>

<style scoped>
.cart-hover {
  position: absolute;
  top: 50px;
  right: 0;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cart-hover ul {
  list-style: none;
  padding: 0;
}

.cart-hover li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cart-hover img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
</style>
