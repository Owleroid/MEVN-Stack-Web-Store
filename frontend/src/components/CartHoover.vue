<template>
    <div class="cart-hover">
        <h3>Cart</h3>
        <div v-if="cart.length === 0">
            <p>Your cart is empty.</p>
        </div>
        <div v-else>
            <ul>
                <li v-for="product in cart" :key="product._id">
                    <img :src="product.imageUrls?.main" :alt="product.title" />
                    <div>
                        <p>{{ product.title }}</p>
                        <p>{{ product.price.euros.amount }} €</p>
                    </div>
                </li>
            </ul>
            <router-link to="/cart">View Full Cart</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEventBus } from '../utils/eventBus';
import { getCart } from '../services/cartService';
import type { Product } from '../types/products';

const cart = ref<Product[]>([]);

const fetchCart = () => {
    cart.value = getCart();
};

const { on } = useEventBus();

onMounted(() => {
    fetchCart();
    on('cart-updated', fetchCart);
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