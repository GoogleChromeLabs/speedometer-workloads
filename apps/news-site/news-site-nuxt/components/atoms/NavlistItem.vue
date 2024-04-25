<script setup>
import styles from "news-site-css/dist/navbar.module.css";

const { label, url, callback, id } = defineProps({
    label: String,
    url: String,
    callback: Function,
    id: String,
});
</script>

<template>
  <NuxtLink
    :id="id"
    :active-class="styles['active']"
    :to="url"
    @click="callback"
  >
    {{ label }}
  </NuxtLink>
</template>
