<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "#imports";
import navStyles from "news-site-css/dist/nav.module.css";
import navbarStyles from "news-site-css/dist/navbar.module.css";

const { callback } = defineProps({
    callback: Function
});

const { content } = inject("data");
const route = useRoute();

const isOpen = ref(false);

function handleClick() {
    isOpen.value = false;
}

function handleChange(e) {
    isOpen.value = e.target.checked;
}

function calculateViewportHeight() {
    // Since the navbar is supposed to appear below the menu, we can't use position: fixed, height: 100%.
    // Therefore we are using 100vh for the height. This function fixes the challenge on mobile, where
    // 100vh might include the addressbar, ect.

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

onMounted(() => {
    calculateViewportHeight();
    window.addEventListener("resize", calculateViewportHeight);
});

onUnmounted(() => {
    window.removeEventListener("resize", calculateViewportHeight);
});
</script>

<template>
  <div :class="navbarStyles.navbar">
    <input
      :id="navbarStyles['navbar-toggle']"
      type="checkbox"
      :checked="isOpen"
      @change="handleChange"
    >
    <label
      :for="navbarStyles['navbar-toggle']"
      :class="navbarStyles['navbar-label']"
    >
      <span class="visually-hidden">Navbar Toggle</span>
      <div
        :class="[navbarStyles['navbar-label-icon'], 'animated-icon', 'hamburger-icon']"
        title="Hamburger Icon"
      >
        <span class="animated-icon-inner">
          <span />
          <span />
          <span />
        </span>
      </div>
    </label>
    <button
      id="home-link"
      :class="navStyles['page-navigation-logo']"
      @click="callback"
    >
      <LogoIcon />
    </button>
    <div :class="navbarStyles['navbar-active-path']">
      {{ content[route.path.split("/")[1]]?.name ?? "" }}
    </div>
    <div :class="navbarStyles['navbar-content']">
      <Navlist
        id="navbar-navlist"
        :callback="handleClick"
      />
      <div :class="navbarStyles['navbar-icons']">
        <SocialIcons id="navbar-social-icons" />
      </div>
    </div>
  </div>
</template>
