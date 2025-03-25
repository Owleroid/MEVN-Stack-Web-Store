<template>
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
h1 {
  color: #333;
}

p {
  margin: 1rem 0;
}

a {
  color: #42b983;
  text-decoration: none;
}
</style>
