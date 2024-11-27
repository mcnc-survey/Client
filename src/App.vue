<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 전체 기본 폰트 설정 */
html,
body {
  font-family: "Pretendard", Arial, sans-serif;
  font-weight: normal;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box; /* 여백 및 패딩 포함 크기 조정 */
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
