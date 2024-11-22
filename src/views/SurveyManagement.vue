<template>
  <div class="survey-management">
    <h2>설문조사 목록</h2>

    <div class="survey-list">
      <div v-for="survey in sortedSurveys" :key="survey.id" class="survey-item">
        <div class="survey-info">
          <p class="survey-title" @click="goToSurveyStats(survey.id)">{{ survey.title }}</p>
          <span :class="['status', getStatusClass(survey.status)]">{{ survey.status }}</span>
        </div>
        <div class="survey-actions">
          <div class="management-buttons">
            <button class="icon-button" @click="handlePreview(survey.id)"><i class="icon icon-preview"></i></button>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // // sweetalert2
import { toast } from "vue3-toastify"; // toastify
import "vue3-toastify/dist/index.css"; // toastify 스타일 추가
import surveyData from "@/data/surveyData";
import '@/assets/css/CustomAlert.css';

const statusOrder = {
  진행중: 1,
  중단됨: 2,
  마감됨: 3,
};

// 토스트 메시지 옵션 객체
const toastOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 1000,
};

export default {
  name: "SurveyManagement",
  setup() {
    const router = useRouter();
    const surveys = ref(surveyData);

    // 설문조사를 상태 및 최신 수정일 순으로 정렬
    const sortedSurveys = computed(() => {
      return surveys.value.slice().sort((a, b) => {
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison === 0) {
          return new Date(b.modified_at) - new Date(a.modified_at); // 최신순 정렬
        }
        return statusComparison; // 상태 순서에 따른 정렬
      });
    });

    // 상태에 따른 클래스 매핑 함수
    const getStatusClass = (status) => {
      switch (status) {
        case "진행중":
          return "in-progress";
        case "중단됨":
          return "stopped";
        case "마감됨":
          return "completed";
      }
    };

    const goToSurveyStats = (surveyId) => {
      router.push({ name: "SurveyStats", params: { id: surveyId } });
    };

    const handlePreview = (surveyId) => {
      console.log("Preview survey:", surveyId);
    };

    const handleLink = (surveyId) => {
      const link = `https://example.com/survey/${surveyId}`; // 임시 링크
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("링크가 복사되었습니다!", toastOptions);
        })
        .catch(() => {
          toast.error("링크 복사에 실패했습니다.", toastOptions);
        });
    };

    const editSurvey = (surveyId) => {
      router.push({ name: "SurveyEdit", params: { id: surveyId } });
    };

    const deleteSurvey = (surveyId) => {
      Swal.fire({
        html: `
          <div class="custom-alert-content">
            <p>설문을 삭제하면 모든 응답 데이터도 함께 삭제됩니다.</p>
            <p>계속하시겠습니까?</p>
            <small>* 삭제된 항목은 휴지통에 저장됩니다.</small>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        customClass: {
          popup: "custom-swal-popup",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          surveys.value = surveys.value.filter((survey) => survey.id !== surveyId);
        }
      });
    };

    const createSurvey = () => {
      router.push({ name: "SurveyCreate" }).catch((error) => {
        console.error("SurveyCreate 페이지로 이동 실패:", error);
        toast.error("설문조사 생성 페이지로 이동에 실패했습니다.", toastOptions);
      });
    };

    return {
      surveys,
      sortedSurveys,
      getStatusClass,
      goToSurveyStats,
      handlePreview,
      handleLink,
      editSurvey,
      deleteSurvey,
      createSurvey,
    };
  },
};
</script>

<style scoped>
.survey-management {
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 0 24px;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.survey-item {
  height: 95px;
  background-color: #f7f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 44px;
  border-radius: 16px;
  margin-bottom: 13px;
}

.survey-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.survey-title {
  font-size: 1.625em;
  font-weight: bold;
  cursor: pointer;
}

.status {
  padding: 9px 28px;
  border-radius: 16px;
  font-size: 0.875em;
  font-weight: bold;
}

.status.in-progress {
  background-color: #fce391;
}

.status.stopped {
  background-color: #fba9a7;
}

.status.completed {
  background-color: #dee0e2;
}

.survey-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.management-buttons {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-preview {
  background-image: url("@/assets/images/icon-preview.png");
}

.icon-link {
  background-image: url("@/assets/images/icon-link.png");
}

.icon-edit {
  background-image: url("@/assets/images/icon-edit.png");
}

.icon-delete {
  background-image: url("@/assets/images/icon-delete.png");
}

.last-updated {
  color: #757575;
  font-size: 0.875em;
  margin-left: 4px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.create-survey-button {
  font-family: Pretendard;
  font-weight: bold;
  width: 100%;
  height: 3.25em;
  margin: 20px 0;
  padding: 20px;
  background-color: #dfe7ef;
  border-radius: 20px;
  border: none;
  font-size: 1.5em;
}
</style>