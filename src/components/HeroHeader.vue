<script setup lang="ts">
import logoUrl from '@/assets/logo.png'
</script>

<template>
  <header class="header fade-up">
    <img :src="logoUrl" alt="小竹熊" class="logo" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  padding: 28px 0 20px;
}
.logo {
  height: 44px;
  filter: drop-shadow(0 2px 8px rgba(99,102,241,0.2));
}
</style>
