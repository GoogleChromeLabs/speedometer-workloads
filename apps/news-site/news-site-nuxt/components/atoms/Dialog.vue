<script setup>
import { inject, onMounted, ref } from "vue";
import styles from "news-site-css/dist/dialog.module.css";

const { onClose } = defineProps({
    onClose: Function,
});

const { settings } = inject("data");

const reduceMotion = ref(false);
const highContrast = ref(false);

onMounted(() => {
    reduceMotion.value = document.documentElement.classList.contains("reduced-motion");
    highContrast.value = document.documentElement.classList.contains("forced-colors");
});

function toggleMotion(e) {
    reduceMotion.value = e.target.checked;

    if (e.target.checked)
        document.documentElement.classList.add("reduced-motion");
    else
        document.documentElement.classList.remove("reduced-motion");
}

function toggleContrast(e) {
    highContrast.value = e.target.checked;

    if (e.target.checked)
        document.documentElement.classList.add("forced-colors");
    else
        document.documentElement.classList.remove("forced-colors");
}
</script>

<template>
  <div
    id="settings"
    :class="[styles.dialog, styles.open]"
  >
    <button
      id="close-dialog-link"
      :class="styles['dialog-close-button']"
      title="Close Button"
      @click="onClose"
    >
      <div
        :class="[styles['dialog-close-button-icon'], 'animated-icon', 'close-icon', 'hover']"
        title="Close Icon"
      >
        <span class="animated-icon-inner">
          <span />
          <span />
        </span>
      </div>
    </button>
    <header :class="styles['dialog-header']">
      <h2>{{ settings.header }}</h2>
    </header>
    <section :class="styles['dialog-body']">
      <div :class="styles['dialog-item']">
        <Toggle
          id="motion"
          :label="settings.items.motion.label"
          :on-change="toggleMotion"
          :checked="reduceMotion"
        />
      </div>
      <div :class="styles['dialog-item']">
        <Toggle
          id="contrast"
          :label="settings.items.contrast.label"
          :on-change="toggleContrast"
          :checked="highContrast"
        />
      </div>
    </section>
  </div>
</template>
