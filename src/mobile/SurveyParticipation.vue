<!-- 
  Author: 배수호 
  Description: 설문조사 질문 탭 컴포넌트 
  - 설문조사 데이터를 로드하여 제목, 설명, 기간, 질문, 응답 렌더링
  - 질문 유형(단일 선택, 다중 선택, 단답형, 장문형)에 따라 동적 렌더링
-->

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
        :initEtc="question.prevEtc"
        :initSelected="question.prevAnswer"
        :etc="question.etc"
        :setEtc="getEtc(index)"
        @update:selected="updateSelected(index, $event)"
      />

      <SurveyMultipleChoice
        v-else-if="question.questionType === 'MULTIPLE_CHOICE'"
        :question="question.title"
        :options="question.columns"
        :name="`question${question.id}`"
        :required="question.required"
        :initSelected="question.prevAnswer"
        :initEtc="question.prevEtc"
        :etc="question.etc"
        :setEtc="getEtc(index)"
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
import Swal from "sweetalert2"; // SweetAlert2 임포트

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
      responses: [],
      token: localStorage.getItem("surveyId"),
      prevResult: {},
      etcValue: [],
    };
  },
  methods: {
    getEtc(index) {
      return (v) => {
        this.etcValue[index] = v;
        console.log(this.etcValue, "");
      };
    },
    updateSelected(index, selectedOption) {
      console.log(this.value);
      console.log("selectOptions: ", selectedOption);
      this.responses[index] = selectedOption;
    },
    async fetchSurveyData() {
      try {
        const response = await API.getSurvey();
        const surveyData = response.data.body.surveySnippet;
        const prevData = response.data.body.responseResult || {};

        this.prevResult = prevData;
        this.survey.title = surveyData.title;
        this.survey.description = surveyData.description;
        this.survey.question = surveyData.question.map((question, index) => {
          const prevResponse = prevData[index + 1] || {};
          return {
            ...question,
            prevAnswer: prevResponse.response || "",
            prevEtc: prevResponse.etc || "", // etc 값을 별도로 저장
          };
        });
      } catch (error) {
        console.error("설문 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    async submitForm() {
      try {
        let isSubmitSuccessful = false;

        if (Object.keys(this.prevResult).length > 0) {
          const prevResultArray = Object.values(this.prevResult);

          const updatedPrevResult = prevResultArray.map((item, index) => {
            let responseValue = this.responses[index] || item.response;
            if (Array.isArray(responseValue)) {
              responseValue = responseValue.join("|`|");
            }
            if (responseValue === "") {
              responseValue = null;
            }
            if (
              this.survey.question[index]?.questionType === "SINGLE_CHOICE" &&
              this.etcValue[index] &&
              this.etcValue[index].length > 0
            ) {
              responseValue = null;
            }
            return {
              ...item,
              isRequired: this.survey.question[index]?.required || false,
              questionType: this.survey.question[index]?.questionType,
              etc: this.etcValue[index] === "" ? null : this.etcValue[index],
              response: responseValue,
            };
          });

          const editPayload = { responses: updatedPrevResult };
          const editResponse = await API.editAnswer(editPayload);

          if (editResponse.data.success) {
            isSubmitSuccessful = true;
          } else {
            Swal.fire({
              title: "응답 제출 실패",
              text: editResponse.data.message,
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        } else {
          const formattedResponses = this.survey.question.map(
            (question, index) => {
              const responseValue = this.responses[index];
              let response = responseValue; // 기본값으로 responseValue 할당

              // 배열인 경우 join 처리
              if (Array.isArray(responseValue)) {
                response = responseValue.join("|`|");
              }

              // 빈 문자열이면 null로 변환
              if (response === "") {
                response = null;
              }

              return {
                questionId: question.id,
                questionType: question.questionType,
                orderNumber: question.order,
                isRequired: question.required,
                response,
                etc: this.etcValue[index] === "" ? null : this.etcValue[index],
              };
            }
          );

          const submitPayload = { responses: formattedResponses };
          const submitResponse = await API.submitSurvey(submitPayload);

          if (submitResponse.data.success) {
            isSubmitSuccessful = true;
          } else {
            Swal.fire({
              title: "응답 제출 실패",
              text: submitResponse.data.message,
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        }

        if (isSubmitSuccessful) {
          this.$router.push("/mobile/confirmation"); // 응답 제출 성공 시 확인 페이지로 이동
        }
      } catch (error) {
        console.error("응답 처리 중 오류 발생:", error);
        Swal.fire({
          title: "응답 제출 실패",
          text: "응답 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
          icon: "error",
          confirmButtonText: "확인",
        });
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
