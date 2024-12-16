<template>
  <div class="survey-page">
    <!-- 설문 제목 및 설명 -->
    <SurveyTitle :title="survey.title" :description="survey.description" />

    <!-- 질문 목록 -->
    <div
      class="survey-question"
      v-for="(question, index) in survey.question"
      :key="index"
    >
      <!-- 단일 선택 질문 -->
      <SurveySingleChoice
        v-if="question.questionType === 'SINGLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
      />

      <!-- 다중 선택 질문 -->
      <SurveyMultipleChoice
        v-else-if="question.questionType === 'MULTIPLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
      />

      <!-- 텍스트 입력 질문 -->
      <SurveyTextAnswer
        v-else-if="question.questionType === 'LONG_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="LONG_ANSWER"
      />

      <!-- 텍스트 입력 질문 -->
      <SurveyTextAnswer
        v-else-if="question.questionType === 'SHORT_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="SHORT_ANSWER"
      />
    </div>

    <button class="survey-submit-button" @click="submitForm">제출</button>
  </div>
</template>

<script>
import axios from "axios";

import SurveyTitle from "../components/mobile/SurveyTitle.vue";
import SurveySingleChoice from "../components/mobile/SurveySingleChoice.vue";
import SurveyMultipleChoice from "../components/mobile/SurveyMultipleChoice.vue";
import SurveyTextAnswer from "@/components/mobile/SurveyTextAnswer.vue";

export default {
  components: {
    SurveyTitle,
    SurveySingleChoice,
    SurveyMultipleChoice,
    SurveyTextAnswer,
  },
  data() {
    return {
      survey: {
        title: "",
        description: "",
        question: [],
      },
    };
  },
  methods: {
    async fetchSurveyData() {
      try {
        const response = await axios.get(
          "https://mobile.mcnc-survey.store/responses/hello",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const surveyData = response.data.body.surveySnippet;

        // 가져온 데이터를 컴포넌트 데이터에 저장
        this.survey.title = surveyData.title;
        this.survey.description = surveyData.description;
        this.survey.question = surveyData.question;
      } catch (error) {
        console.error("설문 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    submitForm() {
      // 예시: 제출 후 이동
      this.$router.push("/mobile/completion");
    },
  },
  created() {
    // 페이지 로딩 시 설문 데이터 가져오기
    this.fetchSurveyData();
  },
};
</script>
<style scoped>
.survey-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 질문 컨테이너 너비 조정 */
.survey-question {
  width: 100%;
  box-sizing: border-box;
}

/* 제출 버튼 스타일 */
.survey-submit-button {
  margin-top: auto;
  margin-bottom: 20px;
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
