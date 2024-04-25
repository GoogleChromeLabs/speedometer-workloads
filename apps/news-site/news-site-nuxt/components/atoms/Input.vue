<script setup>
import styles from "news-site-css/dist/input.module.css";

const { id, placeholder, label, containerClass, type, onChange } = defineProps({
    id: String,
    placeholder: String,
    label: String,
    containerClass: String,
    type: String,
    onChange: Function
});

function handleChange(e) {
    onChange(e);
}
</script>

<template>
  <div :class="[styles['input-container'], containerClass]">
    <label
      :class="[styles.label, 'visually-hidden']"
      :v-for="id"
    >{{ label }}</label>
    <input
      :id="id"
      :class="[styles.input, styles['input-type-text']]"
      :type="type"
      autocomplete="off"
      :placeholder="type !== 'submit' ? placeholder : undefined"
      :value="type === 'submit' ? placeholder : undefined"
      :onInput="handleChange"
    >
  </div>
</template>
