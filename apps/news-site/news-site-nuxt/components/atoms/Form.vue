<script setup>
import { inject } from "vue";
import formStyles from "news-site-css/dist/form.module.css";
import buttonStyles from "news-site-css/dist/button.module.css";

const { onCancel, onSubmit } = defineProps({
    onCancel: Function,
    onSubmit: Function,
});

const { forms: { login } } = inject("data");

function handleSubmit(e) {
    onSubmit(e);
    e.preventDefault();
}

function handleChange(e) {
    console.log(e.target.value);
}
</script>

<template>
  <div :class="formStyles['form-container']">
    <div :class="formStyles['form-content']">
      <form
        id="form"
        :onSubmit="handleSubmit"
      >
        <Input
          id="username"
          :placeholder="login.items.username.placeholder"
          :label="login.items.username.label"
          :type="login.items.username.type"
          :container-class="formStyles['form-item']"
          :on-change="handleChange"
        />
        <Input
          id="password"
          :placeholder="login.items.password.placeholder"
          :label="login.items.password.label"
          :type="login.items.password.type"
          :container-class="formStyles['form-item']"
          :on-change="handleChange"
        />
        <div :class="[formStyles['form-actions'], formStyles['form-item']]">
          <Input
            id="submit"
            :placeholder="login.submit.placeholder"
            :label="login.submit.label"
            :type="login.submit.type"
            :container-class="formStyles['form-actions-item']"
            :on-change="handleSubmit"
          />
          <button
            id="form-reject-button"
            :class="[buttonStyles.button, buttonStyles['secondary-button'], buttonStyles.dark, formStyles['form-actions-item']]"
            :onClick="onCancel"
          >
            {{ login.cancel.label }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
