<template>
    <nav>
        <ul class="left">
            <li><router-link to="/admin/categories">Categories</router-link></li>
            <li><router-link to="/admin/products">Products</router-link></li>
            <li><router-link to="/admin/warehouse">Warehouse</router-link></li>
            <li><router-link to="/admin/orders">Orders</router-link></li>
            <li><router-link to="/admin/clients">Clients</router-link></li>
            <li><router-link to="/admin/news">News</router-link></li>
        </ul>
        <ul class="right">
            <li><router-link to="/">Home</router-link></li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #333;
    color: white;
}

ul {
    list-style: none;
    display: flex;
    gap: 1rem;
}

a {
    color: white;
    text-decoration: none;
}
</style>