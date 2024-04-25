<script setup>

const { text, textClass, type } = defineProps({
    text: String,
    textClass: [String, Array],
    type: String,
});
</script>

<template>
  <component
    :is="type || 'p'"
    v-if="text"
    :class="textClass"
  >
    {{ text }}
  </component>
</template>
