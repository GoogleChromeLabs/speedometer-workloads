<script setup>
import { useHead } from "#imports";
useHead({
    script: [
        {
            src: "./benchmark-connector.min.js",
            tagPosition: "bodyClose",
        }
    ],
});
</script>
<template>
  <Page id="home" />
</template>
