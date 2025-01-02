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
        :initSelected="question.prevAnswer"
        :etc="question.etc"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyMultipleChoice
        v-else-if="question.questionType === 'MULTIPLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
        :initSelected="question.prevAnswer"
        :etc="question.etc"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyTextAnswer
        v-else-if="question.questionType === 'LONG_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="LONG_ANSWER"
        :initAnswer="question.prevAnswer"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyTextAnswer
        v-else-if="question.questionType === 'SHORT_ANSWER'"
        :question="question.title"
        :name="`question${question.id}`"
        :required="question.required"
        type="SHORT_ANSWER"
        :initAnswer="question.prevAnswer"
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
      prevResult: {},
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
        const prevData = response.data.body.responseResult || {}; // 안전한 기본값
        const prevResultArray = Object.values(prevData).map(
          (item) => item.response
        );

        this.prevResult = prevData;
        this.survey.title = surveyData.title;
        this.survey.description = surveyData.description;
        // 질문과 이전 응답을 매핑
        this.survey.question = surveyData.question.map((question, index) => {
          return {
            ...question,
            prevAnswer: prevResultArray[index] || "", // 이전 응답값이 없으면 빈 문자열
          };
        });
      } catch (error) {
        console.error("설문 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    submitForm() {
      console.log("응답 데이터:", this.responses);
    },
    async submitForm() {
      try {
        if (Object.keys(this.prevResult).length > 0) {
          // prevResult 데이터를 기반으로 payload 생성
          // JSON 형태의 prevResult를 배열로 변환
          const prevResultArray = Object.values(this.prevResult);

          // survey.question에서 각 질문의 required 값을 가져와 prevResult에 추가
          const updatedPrevResult = prevResultArray.map((item, index) => {
            let responseValue = this.responses[index] || item.response;

            // MULTIPLE_CHOICE의 경우 배열을 `|`로 구분된 문자열로 변환
            if (Array.isArray(responseValue)) {
              responseValue = responseValue.join("|`|");
            }

            return {
              ...item,
              isRequired: this.survey.question[index]?.required || false, // question.required를 가져와 추가
              response: responseValue,
            };
          });

          const editPayload = { responses: updatedPrevResult };

          console.log("editAnswer API payload:", editPayload);

          // editAnswer API 호출
          const editResponse = await API.editAnswer(editPayload);
          console.log("editAnswer API 호출 성공:", editResponse);
        } else {
          // 새 응답 저장을 위한 `responses` 배열 생성
          const formattedResponses = this.survey.question.map(
            (question, index) => {
              const responseValue = this.responses[index]; // 해당 질문의 응답 데이터 가져오기
              let response = "";

              // MULTIPLE_CHOICE의 경우 배열 값을 `|`로 구분된 문자열로 변환
              if (Array.isArray(responseValue)) {
                response = responseValue.join("|`|");
              } else {
                response = responseValue;
              }

              return {
                questionId: question.id,
                questionType: question.questionType,
                orderNumber: question.order,
                isRequired: question.required,
                response,
              };
            }
          );

          // submitSurvey용 최종 payload
          const submitPayload = {
            responses: formattedResponses,
          };

          console.log(
            "submitSurvey API payload:",
            JSON.stringify(submitPayload, null, 2)
          );

          // submitSurvey API 호출
          const submitResponse = await API.submitSurvey(submitPayload);
          console.log("submitSurvey API 호출 성공:", submitResponse.data);
        }
      } catch (error) {
        console.error("응답 처리 중 오류 발생:", error);
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
