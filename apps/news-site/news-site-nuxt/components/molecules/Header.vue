<script setup>
import styles from "news-site-css/dist/header.module.css";
</script>

<template>
  <header :class="styles['page-header']">
    <NuxtLink
      to="/"
      :class="styles['page-header-title']"
    >
      <TitleIcon />
    </NuxtLink>
  </header>
</template>
