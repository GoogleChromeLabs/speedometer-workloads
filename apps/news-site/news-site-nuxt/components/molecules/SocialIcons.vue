<script setup>
import { inject } from "vue";
import styles from "news-site-css/dist/icons-group.module.css";

const { id } = defineProps({
    callback: Function,
    id: String
});

const { links } = inject("data");
</script>

<template>
  <div :class="styles['icons-group']">
    <ul :class="styles['icons-group-list']">
      <li :class="styles['icons-group-item']">
        <a
          :id="`${id}-facebook`"
          :href="links.social.facebook.href"
        >
          <div :class="[styles['group-icon'], styles['group-icon-small']]">
            <FacebookIcon />
          </div>
        </a>
      </li>
      <li :class="styles['icons-group-item']">
        <a
          :id="`${id}-instagram`"
          :href="links.social.instagram.href"
        >
          <div :class="[styles['group-icon'], styles['group-icon-small']]">
            <InstagramIcon />
          </div>
        </a>
      </li>
      <li :class="styles['icons-group-item']">
        <a
          :id="`${id}-twitter`"
          :href="links.social.twitter.href"
        >
          <div :class="[styles['group-icon'], styles['group-icon-small']]">
            <TwitterIcon />
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
