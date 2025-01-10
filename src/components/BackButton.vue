<!--
  Author: 이새롬
  Description: 뒤로가기 버튼 컴포넌트
  - 뒤로가기 버튼을 렌더링하고, 버튼 클릭 시 페이지를 이전 페이지로 이동
-->

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
