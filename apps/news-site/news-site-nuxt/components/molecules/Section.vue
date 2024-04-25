<script setup>
import styles from "news-site-css/dist/layout.module.css";

const { section } = defineProps({
    section: Object
});
</script>

<template>
  <div
    v-if="section?.name"
    :id="section.id"
    :class="styles['row-header']"
  >
    <h2>{{ section.name }}</h2>
  </div>
  <section :class="styles.row">
    <Article
      v-for="(articles, index) in section.articles"
      :key="`${section.id}-${index}`"
      :article="articles"
    />
  </section>
</template>
