<script setup>
import { ref, onMounted } from "vue";
import styles from "news-site-css/dist/toggle.module.css";

const { id, label, onChange, checked } = defineProps({
    id: String,
    label: String,
    onChange: Function,
    checked: Boolean,
});

const isSelected = ref(false);

onMounted(() => {
    isSelected.value = checked;
});

function handleChange(e) {
    isSelected.value = e.target.checked;
    onChange(e);
}
</script>

<template>
  <div :class="styles['toggle-outer']">
    <div :class="styles['toggle-description']">
      {{ label }}
    </div>
    <div :class="styles['toggle-container']">
      <label
        :class="styles.label"
        :for="`${id}-toggle`"
      >
        <input
          :id="`${id}-toggle`"
          type="checkbox"
          :checked="isSelected"
          @change="handleChange"
        >
        <span :class="styles.switch" />
        <div class="visually-hidden">selected: {{ isSelected ? "true" : "false" }}</div>
      </label>
    </div>
  </div>
</template>
