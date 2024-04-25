<script setup>
import { inject, ref } from "vue";
import navStyles from "news-site-css/dist/nav.module.css";
import buttonStyles from "news-site-css/dist/button.module.css";

const { buttons } = inject("data");
const showSidebar = ref(false);
const showLogin = ref(false);

function openLogin() {
    showLogin.value = true;
}

function closeLogin() {
    showLogin.value = false;
}

function openSidebar() {
    showSidebar.value = true;
}

function closeSidebar() {
    showSidebar.value = false;
}
</script>

<template>
  <nav
    :class="navStyles['page-navigation']"
    aria-label="main menu"
  >
    <div :class="navStyles['page-navigation-row']">
      <div :class="navStyles['page-navigation-column-left']">
        <Navbar :callback="openSidebar" />
      </div>
      <div :class="navStyles['page-navigation-column-right']">
        <button
          id="login-button"
          :class="[buttonStyles.button, buttonStyles['secondary-button'], navStyles['nav-button']]"
          @click="openLogin"
        >
          {{ buttons.login.label }}
        </button>
      </div>
    </div>
  </nav>
  <Teleport to="body">
    <Sidebar
      v-show="showSidebar"
      :on-close="closeSidebar"
    />
  </Teleport>
  <Teleport to="body">
    <Modal
      v-show="showLogin"
      :on-close="closeLogin"
    />
  </Teleport>
</template>
