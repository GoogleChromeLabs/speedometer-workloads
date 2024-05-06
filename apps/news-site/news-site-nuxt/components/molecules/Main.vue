<script setup>
import styles from "news-site-css/dist/layout.module.css";
</script>

<template>
  <main :class="styles['page-main']">
    <slot />
  </main>
</template>
