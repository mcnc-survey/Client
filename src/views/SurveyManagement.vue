<template>
  <div class="survey-management">
    <h2>설문조사 목록</h2>

    <div class="survey-list">
      <div v-for="survey in sortedSurveys" :key="survey.id" class="survey-item">
        <div class="survey-info">
          <p class="survey-info-title" @click="goToSurveyStats(survey.id)">{{ survey.title }}</p>
          <span :class="['status', getStatusClass(survey.status)]">{{ statusDisplay(survey.status) }}</span>
        </div>
        <div class="survey-actions">
          <div class="management-buttons">
            <button class="icon-button" @click="exportSurvey(survey.id)"><i class="icon icon-export"></i></button>
            <button class="icon-button" @click="handleLink(survey.id)"><i class="icon icon-link"></i></button>
            <button class="icon-button" @click="editSurvey(survey.id)"><i class="icon icon-edit"></i></button>
            <button class="icon-button" @click="deleteSurvey(survey.id)"><i class="icon icon-delete"></i></button>
          </div>
          <span class="last-updated">최근 수정일: {{ formatDate(survey.modified_at) }}</span>
        </div>
      </div>
    </div>
    <button class="create-survey-button" @click="createSurvey()">새로운 설문조사 만들기</button>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import surveyData from "@/data/surveyData";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/utils/swalUtils";

const statusOrder = {
  ON: 1,
  WAIT: 2,
  END: 3,
  DELETE: 4,
};

export default {
  name: "SurveyManagement",
  setup() {
    const router = useRouter();
    const surveys = ref(surveyData);

    const sortedSurveys = computed(() => {
      return surveys.value
        .filter((survey) => survey.status !== "DELETE")
        .sort((a, b) => {
          const statusComparison = statusOrder[a.status] - statusOrder[b.status];
          if (statusComparison === 0) {
            return new Date(b.modified_at) - new Date(a.modified_at);
          }
          return statusComparison;
        });
    });

    const formatDate = (dateString) => {
      return new Date(dateString).toISOString().split('T')[0];
    };

    const getStatusClass = (status) => {
      switch (status) {
        case "ON": return "in-progress";
        case "WAIT": return "stopped";
        case "END": return "completed";
        case "DELETE": return "deleted";
      }
    };

    const statusDisplay = (status) => {
      switch (status) {
        case "ON": return "진행중";
        case "WAIT": return "대기중";
        case "END": return "마감됨";
        case "DELETE": return "삭제됨";
      }
    };

    const goToSurveyStats = (surveyId) => {
      router.push({ name: "SurveyStats", params: { id: surveyId } });
    };

    const exportSurvey = (surveyId) => {
      console.log("Exporting survey:", surveyId);
    };

    const handleLink = (surveyId) => {
      const link = `https://example.com/survey/${surveyId}`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("링크가 복사되었습니다!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        })
        .catch(() => {
          toast.error("링크 복사에 실패했습니다.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        });
    };

    const editSurvey = (surveyId) => {
      router.push({ name: "SurveyEdit", params: { id: surveyId } });
    };

    const deleteSurvey = (surveyId) => {
      showConfirmAlert({
        html: '설문을 삭제하면 모든 응답 데이터도 함께 삭제됩니다.',
        subMessage: '* 삭제된 항목은 휴지통에 저장됩니다.',
        onConfirm: () => {
          try {
            const surveyIndex = surveys.value.findIndex((survey) => survey.id === surveyId);
            if (surveyIndex !== -1) {
              surveys.value[surveyIndex].status = "DELETE";
            }

            // 성공 알림
            showSuccessAlert('삭제 완료', '설문조사가 휴지통으로 이동되었습니다.');
          } catch (error) {
            // 실패 알림
            showErrorAlert('삭제 실패', '설문조사 삭제 중 오류가 발생했습니다.');
            console.error('삭제 중 오류:', error);
          }
        }
      });
    };

    const createSurvey = () => {
      router.push({ name: "SurveyCreate" }).catch((error) => {
        console.error("SurveyCreate 페이지로 이동 실패:", error);
        toast.error("설문조사 생성 페이지로 이동에 실패했습니다.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
    };

    return {
      surveys,
      sortedSurveys,
      formatDate,
      getStatusClass,
      statusDisplay,
      goToSurveyStats,
      exportSurvey,
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
  background-color: #f7f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 34px 0 44px;
  border-radius: 16px;
  margin-bottom: 13px;
}

.survey-info {
  height: 95px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.survey-info-title {
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
  align-items: flex-end;
  margin-top: 10px;
  gap: 15px;
}

.management-buttons {
  display: flex;
  gap: 15px;
}

.icon-button {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 21px;
  height: 21px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-export {
  width: 22px;
  height: 18px;
  margin-top: 2px;
  background-image: url("@/assets/images/icon-export.svg");
}

.icon-link {
  background-image: url("@/assets/images/icon-link.svg");
}

.icon-edit {
  background-image: url("@/assets/images/icon-edit.svg");
}

.icon-delete {
  background-image: url("@/assets/images/icon-delete.svg");
}

.last-updated {
  text-align: end;
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