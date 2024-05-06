<script setup>
import styles from "news-site-css/dist/article.module.css";

const { image, imageClass, meta } = defineProps({
    image: Object,
    imageClass: String,
    meta: Object,
});
</script>

<template>
  <div
    v-if="image"
    :class="imageClass"
  >
    <img
      :class="styles['article-image']"
      :src="image.src"
      :width="image.width"
      :height="image.height"
      :alt="image.alt"
    >
    <ArticleTag :tag="meta?.tag" />
  </div>
  <ArticleText
    :text-class="styles['article-image-captions']"
    :text="meta?.captions"
  />
</template>
