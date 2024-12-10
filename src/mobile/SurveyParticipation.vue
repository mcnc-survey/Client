<template>
  <div class="survey-page">
    <SurveyTitle
      title="설문 제목"
      description="설문에 대한 간략한 설명을 여기에 작성합니다. 설명이 길어질 경우 자동으로 줄바꿈이 적용됩니다."
    />

    <SurveySingleChoice
      question="질문 1: 단일 선택"
      :options="['선택지 1', '선택지 2', '선택지 3']"
      name="question1"
      :required="true"
    />

    <SurveyMultipleChoice
      question="질문 2: 다중 선택"
      :options="['선택지 1', '선택지 2', '선택지 3']"
      name="question2"
      :required="true"
    />
    <SurveyMultipleChoice
      question="질문 2: 다중 선택"
      :options="['선택지 1', '선택지 2', '선택지 3']"
      name="question2"
      :required="true"
    />

    <SurveyTextAnswer question="질문 3: 주관식" :required="true" />

    <!-- 제출 버튼 -->
    <button class="survey-submit-button" @click="submitForm">제출</button>
  </div>
</template>

<script>
import SurveyTitle from "../components/mobile/SurveyTitle.vue";
import SurveySingleChoice from "../components/mobile/SurveySingleChoice.vue";
import SurveyMultipleChoice from "../components/mobile/SurveyMultipleChoice.vue";
import SurveyTextAnswer from "../components/mobile/SurveyTextAnswer.vue";

export default {
  components: {
    SurveyTitle,
    SurveySingleChoice,
    SurveyMultipleChoice,
    SurveyTextAnswer,
  },
  methods: {
    submitForm() {
      // 모든 조건 통과 시 설문 페이지로 이동
      this.$router.push("/mobile/completion");
    },
  },
};
</script>

<style scoped>
.survey-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box; /* padding을 포함하여 크기 계산 */

  display: flex;
  align-items: center;
  flex-direction: column;
}

.survey-submit-button {
  margin-top: auto; /* 버튼을 페이지의 하단으로 이동 */
  margin-bottom: 20px; /* 부모의 padding과 조화롭게 간격 추가 */
  padding: 10px 0;
  width: 157px;
  height: 45px;
  background-color: #bfd0e0;

  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #1c1d22;
  border: none;
  border-radius: 24.877px;
}
</style>
