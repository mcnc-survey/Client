<template>
  <div class="survey-create-complete">
    <h2>설문조사 생성</h2>
    <div class="survey-complete-area">
      <div class="survey-complete-assets">
        <div class="completion-message">
          <p class="completion-title">설문조사 등록이 완료되었습니다!</p>
          <p class="completion-instruction">참여 링크를 공유하고, 소중한 의견을 모아보세요.</p>
          <img src="@/assets/images/img-koala.png" alt="Koala" class="koala-image" />
        </div>
        <div class="complete-buttons">
          <button class="back-button" @click="goToSurveyList">목록으로 돌아가기</button>
          <button class="share-button" @click="shareLink">공유하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useSurveyCompletion } from '@/composables/useSurveyCompletion.js';
import '@/assets/css/SurveyCompletion.css';
import '@/assets/css/common.css';

export default {
  name: "SurveyCompletion",

  setup() {
    const router = useRouter();
    const {
      goToSurveyList,
      shareLink,
    } = useSurveyCompletion(router);

    return {
      goToSurveyList,
      shareLink,
    };
  },
};
</script>