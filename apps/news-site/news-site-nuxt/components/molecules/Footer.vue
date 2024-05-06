<script setup>
import { inject, ref } from "vue";
import styles from "news-site-css/dist/footer.module.css";

const { footer, links } = inject("data");
const showPortal = ref(false);

function openPortal() {
    showPortal.value = true;
}

function closePortal() {
    showPortal.value = false;
}
</script>

<template>
  <footer :class="styles['page-footer']">
    <div :class="styles['footer-row']">
      <div :class="styles['footer-column-center']">
        <Sitemap />
      </div>
    </div>
    <div :class="styles['footer-row']">
      <div :class="styles['footer-column-center']">
        <div :class="styles['footer-links']">
          <ul :class="styles['footer-links-list']">
            <li
              v-for="(item, key) in links.legal"
              :key="`footer-links-item-${key}`"
              :class="styles['footer-links-item']"
            >
              <a
                :id="`footer-link-${key}`"
                :href="item.href"
                :class="styles['footer-link']"
              > {{ item.label }} </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="styles['footer-row']">
      <div :class="styles['footer-column-left']">
        <SocialIcons id="footer-social-icons" />
      </div>
      <div :class="styles['footer-column-center']">
        © {{ new Date().getFullYear() }} {{ footer.copyright.label }}
      </div>
      <div :class="styles['footer-column-right']">
        <SettingsIcons
          id="footer-settings-icons"
          :callback="openPortal"
        />
      </div>
    </div>
  </footer>
  <Teleport to="body">
    <Dialog
      v-show="showPortal"
      :on-close="closePortal"
    />
  </Teleport>
</template>
