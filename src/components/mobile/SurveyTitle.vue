<!--
  Author: 배수호
  Description: 설문 제목 및 설명 표시 컴포넌트
  - 설문 제목과 설명을 표시하는 간단한 컴포넌트
  - `title`과 `description`을 부모 컴포넌트로부터 받아와서 출력
  - 스타일은 설문 항목을 구분할 수 있도록 디자인됨
-->

<template>
  <div class="survey-box">
    <h2 class="survey-title">{{ title }}</h2>
    <p class="survey-description">{{ description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
  },
};
</script>

<style scoped>
.survey-box {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.survey-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.survey-description {
  font-size: 14px;
  color: #6e6a7c;
}
</style>
