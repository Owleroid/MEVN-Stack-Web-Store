<template>
    <nav>
        <ul class="left">
            <li><router-link to="/admin/categories">{{ $t('adminNavbar.categories') }}</router-link></li>
            <li><router-link to="/admin/products">{{ $t('adminNavbar.products') }}</router-link></li>
            <li><router-link to="/admin/warehouse">{{ $t('adminNavbar.warehouse') }}</router-link></li>
            <li><router-link to="/admin/orders">{{ $t('adminNavbar.orders') }}</router-link></li>
            <li><router-link to="/admin/clients">{{ $t('adminNavbar.clients') }}</router-link></li>
            <li><router-link to="/admin/news">{{ $t('adminNavbar.news') }}</router-link></li>
        </ul>
        <ul class="right">
            <li><router-link to="/">{{ $t('adminNavbar.home') }}</router-link></li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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