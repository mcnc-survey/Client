// components/BackButton.vue
<template>
  <button class="back-button" @click="goBack">
    <img :src="iconSrc" :alt="altText" />
  </button>
</template>

<script>
export default {
  props: {
    iconSrc: {
      type: String,
      default: () => require("../assets/images/back.svg"),
    },
    altText: {
      type: String,
      default: "뒤로가기",
    },
  },
  methods: {
    goBack() {
      // 뒤로 가기 동작 구현
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0 0 0;
}
</style>
