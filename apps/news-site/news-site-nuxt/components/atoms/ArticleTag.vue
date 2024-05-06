<script setup>
import styles from "news-site-css/dist/article.module.css";

const { tag } = defineProps({
    tag: Object,
});
</script>

<template>
  <div
    v-if="tag"
    :class="[styles['article-image-tag'], styles[tag.type]]"
  >
    <LightningIcon v-if="tag.type === 'breaking'" />
    <PlayIcon v-if="tag.type === 'watch'" />
    <FireIcon v-if="tag.type === 'new'" />
    <ArticleText :text="tag.label" />
  </div>
</template>
