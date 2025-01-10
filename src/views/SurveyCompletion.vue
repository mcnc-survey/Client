<!--
  Author: 이새롬
  Description: 설문조사 완료 페이지
  - 설문조사 등록 완료 후 사용자에게 안내 메시지 제공
  - 설문 목록으로 돌아가기 및 이메일 초대 기능 제공
-->

<template>
  <div class="survey-completion">
    <h2 class="survey-title">설문조사 완료</h2>
    <div class="survey-container">
      <div class="survey-content">
        <div class="completion-message">
          <p class="completion-title">설문조사 등록이 완료되었습니다!</p>
          <p class="completion-subtitle">참여 링크를 공유하고, 소중한 의견을 모아보세요.</p>
        </div>
        <div class="button-group">
          <button class="btn btn-secondary" @click="goToSurveyList">목록으로 돌아가기</button>
          <button class="btn btn-primary" @click="exportSurvey(surveyId)">이메일로 초대하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { surveyAPI } from "@/service/surveyService";
import { toast } from "vue3-toastify"; // toastify
import "vue3-toastify/dist/index.css"; // toastify 스타일 추가
import {
  showEmailInviteDialog
} from "@/utils/swalUtils";

export default {
  name: "SurveyCompletion",

  setup() {
    const router = useRouter();
    const route = useRoute();
    const surveyId = route.params.id;

    const goToSurveyList = () => {
      router.push({ name: "SurveyManagement" }).catch((error) => {
        console.error("SurveyManagement 페이지로 이동 실패:", error);
      });
    };

    const exportSurvey = async (surveyId) => {
      await showEmailInviteDialog({
        onConfirm: async (emails) => {
          try {
            await surveyAPI.inviteSurvey(surveyId, emails);
            toast.success('초대 메일이 발송되었습니다.', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          } catch (error) {
            throw new Error(error.response?.data?.message || '초대 처리 중 오류가 발생했습니다.');
          }
        }
      });
    };

    return {
      goToSurveyList,
      exportSurvey,
      surveyId,
    };
  },
};
</script>

<style>
.survey-completion {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}

.survey-title {
  font-size: 1.25rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.survey-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 550px;
  width: 100%;
  background-color: #f7f9fb;
  border-radius: 24px;
}

.survey-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  border-radius: 24px;
  width: 80%;
  height: 80%;
}

.completion-message {
  text-align: center;
}

.completion-title {
  margin: 30px 0 0 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.completion-subtitle {
  margin: 13px 0 0;
  font-size: 1.25rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.btn {
  font-family: Pretendard;
  font-weight: bold;
  width: 200px;
  height: 45px;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  color: #000;
}

.btn-primary,
.btn-secondary {
  margin-top: 40px;
}

.btn-secondary {
  background-color: #efefef;
}

.btn-primary {
  background-color: #bfd0e0;
}
</style>