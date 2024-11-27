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
  height: 100vh;
  width: 100vw;
  background-color: #f7f9fb;
  /*
  height: calc(100vh - 40px); 
  width: calc(100vw - 40px); 
  */
}
</style>
