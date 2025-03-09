<template>
    <div class="cart-page">
        <h1>{{ $t('cartView.yourCart') }}</h1>
        <div v-if="cart.length === 0">
            <p>{{ $t('cartView.emptyCart') }}</p>
            <button @click="redirectToStore">{{ $t('cartView.goToStore') }}</button>
        </div>
        <div v-else>
            <ul>
                <li v-for="product in cart" :key="product._id">
                    <img :src="product.imageUrls?.main" :alt="product.title" />
                    <div>
                        <p>{{ product.title }}</p>
                        <p>{{ product.price.euros.amount }} €</p>
                        <button @click="deleteFromCart(product._id)">{{ $t('cartView.remove') }}</button>
                    </div>
                </li>
            </ul>
            <div class="cart-summary">
                <p>{{ $t('cartView.total') }}: {{ totalPrice }} €</p>
                <button @click="checkout">{{ $t('cartView.checkout') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

import type { Product } from '../types/products';

import { getCart, removeFromCart, clearCart } from '../services/cartService';

const cart = ref<Product[]>([]);

const totalPrice = computed(() => {
    return cart.value.reduce((total, product) => total + product.price.euros.amount, 0);
});

onMounted(() => {
    cart.value = getCart();
    console.log(cart.value);
});

const router = useRouter();
const { t } = useI18n();

function deleteFromCart(productId: string) {
    removeFromCart(productId);
    cart.value = getCart();
}

function checkout() {
    // Implement checkout logic here
    alert(t('cartView.checkoutNotImplemented'));
    clearCart();
    cart.value = [];
}

function redirectToStore() {
    router.push('/categories');
}
</script>

<style scoped>
.cart-page {
    padding: 20px;
}

.cart-page ul {
    list-style: none;
    padding: 0;
}

.cart-page li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.cart-page img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
}

.cart-summary {
    margin-top: 20px;
    text-align: right;
}
</style>