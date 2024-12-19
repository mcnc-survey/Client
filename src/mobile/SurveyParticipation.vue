<template>
  <div class="survey-page">
    <SurveyTitle :title="survey.title" :description="survey.description" />
    <div
      class="survey-question"
      v-for="(question, index) in survey.question"
      :key="index"
    >
      <SurveySingleChoice
        v-if="question.questionType === 'SINGLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyMultipleChoice
        v-else-if="question.questionType === 'MULTIPLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyTextAnswer
        v-else-if="question.questionType === 'LONG_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="LONG_ANSWER"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyTextAnswer
        v-else-if="question.questionType === 'SHORT_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="SHORT_ANSWER"
        @update:selected="updateSelected(index, $event)"
      />
    </div>

    <button class="survey-submit-button" @click="submitForm">제출</button>
  </div>
</template>
<script>
import { API } from "../service/mobileService";
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
        question: {},
      },
      responses: [], // 질문 ID를 키로 하고 응답 데이터를 값으로 저장
      token: localStorage.getItem("surveyId"),
    };
  },
  methods: {
    updateSelected(index, selectedOption) {
      // 자식의 응답을 responses[index]에 저장
      this.responses[index] = selectedOption;
    },
    async fetchSurveyData() {
      try {
        const response = await API.getSurvey();

        const surveyData = response.data.body.surveySnippet;

        this.survey.title = surveyData.title;
        this.survey.description = surveyData.description;
        this.survey.question = surveyData.question;
      } catch (error) {
        console.error("설문 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    submitForm() {
      console.log("응답 데이터:", this.responses);
    },
    async submitForm() {
      try {
        // `responses` 배열을 생성
        const formattedResponses = this.survey.question.map(
          (question, index) => {
            const responseValue = this.responses[index]; // 해당 질문의 응답 데이터 가져오기
            let response = "";

            // MULTIPLE_CHOICE의 경우 배열 값을 `|`로 구분된 문자열로 변환
            if (Array.isArray(responseValue)) {
              response = responseValue.join("|");
            } else {
              response = responseValue;
            }

            return {
              questionId: question.id,
              questionType: question.questionType,
              orderNumber: question.order,
              response,
            };
          }
        );

        // 최종 payload 구조
        const payload = {
          responses: formattedResponses,
        };

        console.log("최종 payload:", JSON.stringify(payload, null, 2));

        // API 요청
        const response = await API.submitSurvey(payload);

        console.log("응답 전송 성공:", response.data);
      } catch (error) {
        console.error("응답 전송 중 오류 발생:", error);
      }
    },
  },
  created() {
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
