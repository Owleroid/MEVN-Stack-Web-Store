<template>
    <div class="cart-page">
        <h1>{{ $t('cartView.yourCart') }}</h1>
        <div v-if="cart.length === 0">
            <p>{{ $t('cartView.emptyCart') }}</p>
            <button @click="redirectToStore">{{ $t('cartView.goToStore') }}</button>
        </div>
        <div v-else>
            <ul>
                <li v-for="item in cart" :key="item.product._id">
                    <img :src="item.product.imageUrls?.main" :alt="item.product.name" />
                    <div>
                        <p>{{ item.product.name }}</p>
                        <p>{{ item.product.price.euros.amount }} €</p>
                        <input type="number" v-model.number="item.quantity"
                            @change="updateQuantity(item.product._id, item.quantity)" min="1" />
                        <button @click="deleteFromCart(item.product._id)">{{ $t('cartView.remove') }}</button>
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

import type { CartItem } from '../types/cart';

import { getCart, removeFromCart, updateCartQuantity } from '../services/cartService';

const cart = ref<CartItem[]>([]);

const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => total + item.product.price.euros.amount * item.quantity, 0);
});

onMounted(() => {
    cart.value = getCart();
});

const router = useRouter();
const { t } = useI18n();

function deleteFromCart(productId: string) {
    removeFromCart(productId);
    cart.value = getCart();
}

function updateQuantity(productId: string, quantity: number) {
    updateCartQuantity(productId, quantity);
    cart.value = getCart();
}

function checkout() {
    router.push('/checkout');
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