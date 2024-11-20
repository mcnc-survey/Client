<template>
  <div class="mobile-layout">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "MobileLayout",
};
</script>

<style>
/* 모바일 전용 스타일 */
.mobile-layout {
  padding: 20px;
  font-size: 1rem;
  background-color: #f9f9f9;
}
</style>
