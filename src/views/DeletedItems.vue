<!--
  Author : 이새롬
  Description : 삭제된 설문조사 관리 페이지
  - 삭제된 설문 항목을 선택하고 복구하거나 영구 삭제할 수 있는 기능 제공
-->

<template>
  <div class="survey-deletedItems">
    <div class="header">
      <h2>삭제된 항목</h2>
      <div class="delete-actions">
        <button class="action-btn" @click="toggleSelectAll">
          {{ isAllSelected ? "선택 해제" : "전체 선택" }}
        </button>
        <button class="action-btn recover-btn" @click="restoreItems">
          복구하기
        </button>
        <button class="action-btn delete-btn" @click="deleteItemsPermanently">
          삭제하기
        </button>
      </div>
    </div>

    <!-- 항목 리스트 -->
    <div class="deleted-list">
      <div v-for="survey in surveys" :key="survey.id" class="deleted-item"
        :class="{ selected: selectedSurveys.includes(survey.id) }" @click="toggleSelection(survey.id)">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="selectedSurveys" :value="survey.id" class="checkbox-input" />
          <span class="checkbox-image"></span>
        </label>

        <!-- 항목 제목 -->
        <p class="deleted-title">{{ survey.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { emitter } from "@/eventBus/eventBus";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "@/utils/swalUtils";
import { surveyAPI } from "@/service/surveyService";

export default {
  name: "DeletedItems",
  setup() {
    const deletedSurveys = ref([]); // 삭제된 설문조사
    const selectedSurveys = ref([]); // 선택된 설문조사 ID 리스트
    const isAllSelected = ref(false); // 전체 선택 상태

    // 삭제된 설문조사 데이터 가져오기
    const fetchSurveys = async () => {
      try {
        const response = await surveyAPI.getDeletedSurveys();

        if (response.data.resultCode === "200") {
          deletedSurveys.value = response.data.body;
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

    // 컴포넌트 마운트 시 데이터 가져오기
    onMounted(() => {
      fetchSurveys();
    });

    // 전체 선택/선택 해제 토글
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedSurveys.value = []; // 선택 해제
      } else {
        selectedSurveys.value = deletedSurveys.value.map((survey) => survey.id); // 전체 선택
      }
      isAllSelected.value = !isAllSelected.value;
    };

    // 항목 선택/해제 토글
    const toggleSelection = (id) => {
      const index = selectedSurveys.value.indexOf(id);
      if (index === -1) {
        selectedSurveys.value.push(id); // 선택
      } else {
        selectedSurveys.value.splice(index, 1); // 선택 해제
      }
    };

    // 복구 로직
    const restoreItems = async () => {
      if (selectedSurveys.value.length === 0) {
        showErrorAlert("복구 실패", "복구할 설문을 선택하세요.");
        return;
      }

      try {
        const response = await surveyAPI.restoreSurvey({
          surveyIdList: selectedSurveys.value // 선택된 설문 ID 배열
        });
        // console.log("복구 응답:", response);

        // 응답의 resultCode가 '204'인 경우 성공 처리
        if (response.data.resultCode === "204") {
          // 복구된 항목은 삭제된 항목 리스트에서 제외
          deletedSurveys.value = deletedSurveys.value.filter(
            (survey) => !selectedSurveys.value.includes(survey.id)
          );

          selectedSurveys.value = []; // 선택 초기화
          isAllSelected.value = false; // 전체 선택 해제

          emitter.emit('updateBookmarks');

          // 성공 알림
          showSuccessAlert(
            "복구 완료",
            "선택된 설문조사가 성공적으로 복구되었습니다."
          );
        } else {
          // resultCode가 204가 아니면 오류 처리
          showErrorAlert("복구 실패", "설문조사 복구 중 오류가 발생했습니다.");
        }
      } catch (error) {
        // 실패 알림
        showErrorAlert("복구 실패", "설문조사 복구 중 오류가 발생했습니다.");
        console.error("복구 중 오류:", error);
      }
    };

    // 물리적 삭제
    const deleteItemsPermanently = async () => {
      if (selectedSurveys.value.length === 0) {
        showErrorAlert("삭제 실패", "삭제할 설문을 선택하세요.");
        return;
      }

      const surveyInfo = selectedSurveys.value.map((surveyId) => {
        const survey = deletedSurveys.value.find((s) => s.id === surveyId);
        return {
          surveyId: survey.id,
          title: survey.title, // 설문 제목을 name에 포함
        };
      });

      console.log(surveyInfo);

      showConfirmAlert({
        html: "설문을 삭제하면 모든 응답 데이터도 함께 삭제됩니다.",
        subMessage: "* 삭제 후에는 복구할 수 없습니다.",
        onConfirm: async () => {
          try {
            const payload = {
              surveyInfos: surveyInfo,
            };

            // API 호출
            const response = await surveyAPI.hardDeleteSurvey(payload);

            // 삭제된 설문조사 항목을 리스트에서 제외
            deletedSurveys.value = deletedSurveys.value.filter(
              (survey) => !selectedSurveys.value.includes(survey.id)
            );

            selectedSurveys.value = []; // 선택 초기화
            isAllSelected.value = false; // 전체 선택 해제

            if (response.data.resultCode === "204") {
              // 성공 알림
              showSuccessAlert(
                "삭제 완료",
                "선택된 설문조사가 성공적으로 삭제되었습니다."
              );
            } else {
              throw new Error('설문조사를 삭제하는 데 실패했습니다.');
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

    return {
      surveys: deletedSurveys,
      fetchSurveys,
      selectedSurveys,
      isAllSelected,
      toggleSelectAll,
      toggleSelection,
      restoreItems,
      deleteItemsPermanently,
    };
  },
};
</script>

<style scoped>
/* 스타일 내용은 그대로 유지 */
.survey-deletedItems {
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 0 24px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.25rem;
  font-weight: bold;
}

.delete-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  font-size: 0.975rem;
  padding-bottom: 2px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: Pretendard;
  font-weight: bold;
}

.delete-btn {
  color: #ed5454;
}

.deleted-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.deleted-item {
  height: 95px;
  background-color: #eeeef0;
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding-left: 25px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.deleted-title {
  font-size: 1.625em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 25px;
}

.deleted-item.selected {
  background-color: #fcd6d6;
}

.custom-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-input {
  display: none;
}

.checkbox-image {
  width: 23px;
  height: 23px;
  background-image: url("@/assets/images/unchecked.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: background-image 0.3s ease;
}

.checkbox-input:checked+.checkbox-image {
  background-image: url("@/assets/images/checked.png");
}
</style>
