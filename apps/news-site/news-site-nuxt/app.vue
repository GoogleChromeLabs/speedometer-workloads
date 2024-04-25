<script setup>
import { provideLocale } from "./composables/provide-locale";
import { scrollOnNavigation } from "./composables/scroll-behavior";

provideLocale();
scrollOnNavigation();
</script>

<template>
  <Layout>
    <NuxtPage />
  </Layout>
</template>
