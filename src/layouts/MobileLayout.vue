<!--
  Author: 배수호
  Description: 모바일 레이아웃 컴포넌트
  - 모바일 화면에 최적화된 레이아웃을 제공
  - 전체 화면을 차지하는 모바일 레이아웃으로, 하단의 주석 처리된 스타일은 모바일 화면에 여백을 추가할 수 있는 옵션
  - `<router-view />`로 라우트에 따른 콘텐츠를 동적으로 표시
-->

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
