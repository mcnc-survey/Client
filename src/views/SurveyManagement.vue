<template>
  <div class="survey-management">
    <div class="header">
      <h2>설문조사 목록</h2>
      <button class="create-btn" @click="createSurvey">생성하기</button>
    </div>
    <div class="survey-list">
      <div v-for="survey in sortedSurveys" :key="survey.id" class="survey-item">
        <div class="survey-info">
          <button class="bookmark-button" @click="toggleBookmark(survey.id)">
            <img :src="survey.isLike
              ? require('@/assets/images/bookmark.svg')
              : require('@/assets/images/non-bookmark.svg')
              " alt="북마크" class="bookmark-icon" />
          </button>
          <p class="survey-info-title" @click="goToSurveyStats(survey.id)">
            {{ survey.title }}
          </p>
          <span :class="['status', getStatusClass(survey.status)]">{{
            statusDisplay(survey.status)
          }}</span>
        </div>
        <div class="survey-actions">
          <div class="management-buttons">
            <button class="icon-button" @click="exportSurvey(survey.id)">
              <i class="icon icon-export"></i>
            </button>
            <button class="icon-button" @click="handleLink(survey.id)">
              <i class="icon icon-link"></i>
            </button>
            <button class="icon-button" @click="editSurvey(survey.id)">
              <i class="icon icon-edit"></i>
            </button>
            <button class="icon-button" @click="deleteSurvey(survey.id)">
              <i class="icon icon-delete"></i>
            </button>
          </div>
          <span class="last-updated">최근 수정일: {{ formatDate(survey.lastModifiedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { surveyAPI } from "@/service/surveyService";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "@/utils/swalUtils";

const statusOrder = {
  ON: 1,
  WAIT: 2,
  END: 3,
};

export default {
  name: "SurveyManagement",
  setup() {
    const router = useRouter();
    const surveys = ref([]);

    // 설문조사 데이터 가져오기
    const fetchSurveys = async () => {
      try {
        const response = await surveyAPI.getSurveys();

        if (response.data.resultCode === "200") {
          surveys.value = response.data.body.filter(
            (survey) => survey.status !== "DELETE"
          );
        } else {
          throw new Error(
            response.data.message || "데이터를 가져오지 못했습니다."
          );
        }
      } catch (error) {
        console.error("설문조사 데이터 가져오기 실패:", error);
        toast.error("설문조사 데이터를 불러오는데 실패했습니다.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    };

    // 설문조사 데이터 정렬
    const sortedSurveys = computed(() => {
      return [...surveys.value].sort((a, b) => {
        // 즐겨찾기 우선 정렬
        if (a.isLike && !b.isLike) return -1;
        if (!a.isLike && b.isLike) return 1;

        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison === 0) {
          return new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt);
        }
        return statusComparison;
      });
    });


    const formatDate = (dateString) => {
      return new Date(dateString).toISOString().split("T")[0];
    };

    const getStatusClass = (status) => {
      switch (status) {
        case "ON":
          return "in-progress";
        case "WAIT":
          return "stopped";
        case "END":
          return "completed";
      }
    };

    const toggleBookmark = async (surveyId) => {
      const survey = surveys.value.find((s) => s.id === surveyId);
      if (survey) {

        try {
          await surveyAPI.bookmarkSurvey(surveyId);
          survey.isLike = !survey.isLike;

          const message = survey.isLike
            ? "즐겨찾기에 추가되었습니다."
            : "즐겨찾기에서 제거되었습니다.";
          const toastType = survey.isLike ? toast.success : toast.info;
          toastType(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true

          });
        } catch (error) {
          console.error("북마크 토글 실패:", error);
          toast.error("북마크 상태를 변경하지 못했습니다.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true
          });
        }
      }
    };

    const statusDisplay = (status) => {
      switch (status) {
        case "ON":
          return "진행중";
        case "WAIT":
          return "대기중";
        case "END":
          return "마감됨";
      }
    };

    const goToSurveyStats = (surveyId) => {
      router.push({ name: "SurveyStats", params: { id: surveyId } });
    };

    const exportSurvey = (surveyId) => {
      console.log("Exporting survey:", surveyId);
    };

    const handleLink = (surveyId) => {
      const survey = surveys.value.find((s) => s.id === surveyId);
      if (survey) {
        const link = survey.surveyLink;
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
      }
    };

    const editSurvey = (surveyId) => {
      router.push({ name: "SurveyEdit", params: { id: surveyId } });
    };

    const deleteSurvey = (surveyId) => {
      showConfirmAlert({
        html: "설문을 삭제하면 모든 응답 데이터도 함께 삭제됩니다.",
        subMessage: "* 삭제된 항목은 휴지통에 저장됩니다.",
        onConfirm: async () => {
          try {
            const response = await surveyAPI.softDeleteSurvey(surveyId);

            if (response.data.resultCode === "200" || response.data.message.includes("DELETED")) {
              surveys.value = surveys.value.filter((survey) => survey.id !== surveyId);

              showSuccessAlert("삭제 완료", "설문조사가 삭제되었습니다.");
            } else {
              throw new Error(response.data.message || "삭제 실패");
            }
          } catch (error) {
            // 실패 알림
            showErrorAlert(
              "삭제 실패",
              "설문조사 삭제 중 오류가 발생했습니다."
            );
            console.error("삭제 중 오류:", error);
          }
        },
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

    // 컴포넌트 마운트 시 데이터 가져오기
    onMounted(() => {
      fetchSurveys();
    });

    return {
      surveys,
      sortedSurveys,
      formatDate,
      toggleBookmark,
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
  flex-direction: column;
  padding: 0 16px 0 24px;
  height: calc(100vh - 60px);
  position: relative;
}

/* 기존 header 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin-bottom: 0;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0px;
}

/* 기존 action-btn 스타일 */
.create-btn {
  font-size: 0.975rem;
  padding-bottom: 2px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: Pretendard;
  font-weight: bold;
}

.survey-list {
  overflow-y: auto;
  height: calc(100% - 100px);
  padding-right: 8px;
}

/* 스크롤바 스타일링 */
.survey-list::-webkit-scrollbar {
  width: 8px;
}

.survey-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.survey-list::-webkit-scrollbar-thumb {
  background: #e8eaec;
  border-radius: 4px;
}

.survey-list::-webkit-scrollbar-thumb:hover {
  background: #d1d5d9;
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
  padding: 0 35px 0 25px;
  border-radius: 16px;
  margin-bottom: 13px;
}

.survey-info {
  height: 95px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.bookmark-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-icon {
  width: 28px;
  height: 28px;
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

.create-button {
  display: flex;
  gap: 10px;
}
</style>
