<!-- 
  Author: 배수호 
  Description: 설문조사 제출 확인 페이지 
  - 설문 응답 제출 완료 메시지와 홈으로 돌아가기 버튼 렌더링
-->

<template>
  <div class="confirmation-page">
    <div class="confirmation-content">
      <h1 class="confirmation-title">설문 제출이 완료되었습니다!</h1>
      <p class="confirmation-message">
        응답이 성공적으로 제출되었습니다. 참여해 주셔서 감사합니다.
      </p>
      <router-link :to="`/mobile?t=${surveyId}`">
        <button class="home-button">홈으로 돌아가기</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      surveyId: localStorage.getItem("surveyId"),
    };
  },
};
</script>

<style scoped>
.confirmation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #f4f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.confirmation-content {
  text-align: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.confirmation-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.confirmation-message {
  font-size: 16px;
  color: #777;
  margin-top: 0;
  line-height: 1.6;
}

.home-button {
  margin-top: 30px;
  padding: 12px 30px;
  background-color: #bfd0e0;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #45a049;
}
</style>
