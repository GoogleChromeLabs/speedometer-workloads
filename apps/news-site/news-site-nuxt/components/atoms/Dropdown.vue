<script setup>
import { inject, ref } from "vue";
import styles from "news-site-css/dist/dropdown.module.css";

const { buttons } = inject("data");

const { animatedIconClass } = defineProps({
    animatedIconClass: String,
});

const isOpen = ref(false);

function closeDropdown() {
    isOpen.value = false;
}

function handleChange(e) {
    isOpen.value = e.target.checked;
}
</script>

<template>
  <div :class="styles.dropdown">
    <input
      id="navbar-dropdown-toggle"
      type="checkbox"
      :class="styles['dropdown-toggle']"
      :checked="isOpen"
      @change="handleChange"
    >
    <label
      for="navbar-dropdown-toggle"
      :class="styles['dropdown-label']"
    >
      <span :class="styles['dropdown-label-text']">{{ buttons.more.label }}</span>
      <div :class="['animated-icon', 'arrow-icon', 'arrow', animatedIconClass]">
        <span
          class="animated-icon-inner"
          title="Arrow Icon"
        >
          <span />
          <span />
        </span>
      </div>
    </label>
    <ul
      :class="styles['dropdown-content']"
      @click="closeDropdown"
    >
      <slot />
    </ul>
  </div>
</template>
