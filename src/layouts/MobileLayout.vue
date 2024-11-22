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
.mobile-layout {
  height: 100%; /* 화면 전체 높이 */
  display: flex; /* 레이아웃 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  background-color: #d9d9d9; /* 배경색 설정 */
  margin: 20px;
}
</style>
