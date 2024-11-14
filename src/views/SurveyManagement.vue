<template>
  <div class="survey-management">
    <h2>설문조사 목록</h2>

    <div class="survey-list">
      <div v-for="survey in sortedSurveys" :key="survey.id" class="survey-item">
        <div class="survey-info">
          <p class="survey-title">{{ survey.title }}</p>
          <span :class="['status', getStatusClass(survey.status)]">{{ survey.status }}</span>
        </div>
        <div class="survey-actions">
          <div class="action-buttons">
            <button class="icon-button" @click="previewSurvey(survey.id)"><i class="icon icon-preview"></i></button>
            <button class="icon-button" @click="handleLink(survey.id)"><i class="icon icon-link"></i></button>
            <button class="icon-button" @click="editSurvey(survey.id)"><i class="icon icon-edit"></i></button>
            <button class="icon-button" @click="deleteSurvey(survey.id)"><i class="icon icon-delete"></i></button>
          </div>
          <span class="last-updated">최근 수정일: {{ survey.modified_at }}</span>
        </div>
      </div>
    </div>

    <button class="create-survey-button" @click="createSurvey()">새로운 설문조사 만들기</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useSurveyManagement } from '@/composables/useSurveyManagement';
import '@/assets/css/CustomAlert.css';
import '@/assets/css/SurveyManagement.css';
import '@/assets/css/common.css';

export default {
  name: 'SurveyManagement',

  setup() {
    const router = useRouter();
    const {
      surveys,
      sortedSurveys,
      getStatusClass,
      previewSurvey,
      handleLink,
      editSurvey,
      deleteSurvey,
      createSurvey,
    } = useSurveyManagement(router);

    return {
      surveys,
      sortedSurveys,
      getStatusClass,
      previewSurvey,
      handleLink,
      editSurvey,
      deleteSurvey,
      createSurvey,
    };
  },
};
</script>
