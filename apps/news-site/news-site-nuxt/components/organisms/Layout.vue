<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useRoute } from "#imports";
import styles from "news-site-css/dist/layout.module.css";

const showMessage = ref(false);
const route = useRoute();

const { content, links } = inject("data");

function updateShowMessage() {
    showMessage.value = content[route.name]?.message ? true : false;
}

onMounted(updateShowMessage);
watch(() => route.path, updateShowMessage);

const closeMessage = () => {
    showMessage.value = false;
};
</script>

<template>
  <NuxtLink
    :to="`${route.path}#content`"
    class="skip-link"
  >
    {{ links.a11y.skip.label }}
  </NuxtLink>
  <div
    id="page"
    :class="styles.page"
  >
    <Header />
    <Navigation />
    <Message
      v-if="content[route.name]?.message"
      v-show="showMessage"
      :on-close="closeMessage"
      :message="content[route.name]?.message"
    />
    <Main>
      <slot />
    </Main>
    <Footer />
  </div>
</template>
