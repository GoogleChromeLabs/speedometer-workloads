<script setup>
import { inject, onMounted, ref } from "vue";

const { id } = defineProps({
    id: String
});
const { content } = inject("data");
const showPortal = ref(false);

onMounted(() => {
    showPortal.value = content[id].notification ? true : false;
});

function closePortal() {
    showPortal.value = false;
}
</script>

<template>
  <Section
    v-for="section in content[id].sections"
    :key="section.id"
    :section="section"
  />
  <Teleport to="body">
    <Toast
      v-if="content[id].notification"
      v-show="showPortal"
      :on-close="closePortal"
      :on-accept="closePortal"
      :on-reject="closePortal"
      :notification="content[id].notification"
    />
  </Teleport>
</template>
