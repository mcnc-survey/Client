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
      />

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
      responses: {}, // 질문 ID를 키로 하고 응답 데이터를 값으로 저장
      token: localStorage.getItem("surveyId"),
    };
  },
  methods: {
    updateSelected(index, selectedOption) {
      console.log(`${selectedOption}`); // 선택된 값 저장
      this.responses[index] = selectedOption;
    },
    async fetchSurveyData() {
      try {
        const response = await axios.get(
          `https://mobile.mcnc-survey.store/responses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const surveyData = response.data.body.surveySnippet;

        this.survey.title = surveyData.title;
        this.survey.description = surveyData.description;
        this.survey.question = surveyData.question;

        // 질문 ID를 기반으로 responses 객체 초기화
        surveyData.question.forEach((q) => {
          this.responses[q.id] = q.questionType === "MULTIPLE_CHOICE" ? [] : "";
        });
      } catch (error) {
        console.error("설문 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    submitForm() {
      console.log("응답 데이터:", this.responses);
    },
    async submitForm() {
      console.log("응답 데이터:", this.responses);
      // await axios.post(
      //   `https://mobile.mcnc-survey.store/responses`,
      //   {
      //     responses: [
      //       {
      //         questionId: "a760e4ba-4bc5-4e86-8734-3300922edaa2",
      //         questionType: "SINGLE_CHOICE",
      //         orderNumber: 1,
      //         response: "FSD",
      //       },
      //       {
      //         questionId: "01f09426-4968-413c-8bab-3bccf4b15ab8",
      //         questionType: "MULTIPLE_CHOICE",
      //         orderNumber: 2,
      //         response: "SFD|`|SFD",
      //       },
      //       {
      //         questionId: "f439dcbf-114a-43b8-930b-f742526a239c",
      //         questionType: "SHORT_ANSWER",
      //         orderNumber: 3,
      //         response: "FSD",
      //       },
      //       {
      //         questionId: "7dad0be8-1dca-4219-a989-0416b0fa4c21",
      //         questionType: "LONG_ANSWER",
      //         orderNumber: 4,
      //         response: "FSD",
      //       },
      //     ],
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
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
