<template>
    <button @click="addToCart">Add to Cart</button>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useEventBus } from '../utils/eventBus';
import { addToCart as addToCartService } from '../services/cartService';
import type { Product } from '../types/products';

const props = defineProps<{
    product: Product;
}>();

const toast = useToast();
const { emit } = useEventBus();

function addToCart() {
    addToCartService(props.product);
    toast.success(`${props.product.title} has been added to the cart`);
    emit('cart-updated');
}
</script>

<style scoped>
button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>