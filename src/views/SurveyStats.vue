<!-- 
  Author: 이새롬
  Description: 설문조사 통계 및 관리 페이지 
  - 설문 통계 보기 및 설문 관리(삭제 및 링크 공유) 기능 제공
  - 설문 및 통계 탭 간 전환 기능 포함
-->

<template>
  <div class="survey-stats">
    <div class="header">
      <BackButton />

      <div class="tab-container">
        <div class="tab-buttons">
          <button :class="{ active: activeTab === 'survey' }" @click="setTab('survey')">설문</button>
          <button :class="{ active: activeTab === 'stats' }" @click="setTab('stats')">통계</button>
        </div>
      </div>

      <button class="menu-button" @click="toggleMenu">
        <img src="../assets/images/menu.svg" alt="메뉴 버튼" />
      </button>

      <div v-if="menuVisible" class="menu-dropdown">
        <button @click="deleteItemSoftly">휴지통</button>
        <button @click="shareLink">링크 공유</button>
      </div>
    </div>

    <component :is="currentTabComponent" :surveyId="surveyId" />
  </div>
</template>

<script>
import BackButton from "../components/BackButton.vue";
import SurveyTab from "../components/SurveyTab.vue";
import StatsTab from "../components/StatsTab.vue";
import { surveyAPI } from "@/service/surveyService";
import { emitter } from "@/eventBus/eventBus";
import { toast } from "vue3-toastify";
import {
  showSuccessAlert,
  showErrorAlert,
} from "@/utils/swalUtils";

export default {
  data() {
    return {
      activeTab: "stats",
      menuVisible: false,
    };
  },
  components: {
    BackButton,
    SurveyTab,
    StatsTab,
  },
  computed: {
    currentTabComponent() {
      return this.activeTab === "stats" ? "StatsTab" : "SurveyTab";
    },
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab;
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },

    async deleteItemSoftly() {
      try {
        const surveyId = this.$route.params.id;
        const response = await surveyAPI.softDeleteSurvey(surveyId);

        if (response.data.resultCode === "200" || response.data.message.includes("DELETED")) {
          showSuccessAlert("삭제 완료", "설문조사가 휴지통으로 이동되었습니다.");

          // 북마크 업데이트 이벤트 발생
          emitter.emit('updateBookmarks');
          this.$router.push({ name: 'SurveyManagement' });
        } else {
          throw new Error(response.data.message || "삭제 실패");
        }
      } catch (error) {
        console.error("설문조사 삭제 오류:", error);
        showErrorAlert("삭제 실패", "설문조사를 삭제하는 중 오류가 발생했습니다.");
      }

      this.menuVisible = false;
    },

    async shareLink() {
      const surveyLink = JSON.parse(history.state.surveyLink);
      try {
        await navigator.clipboard.writeText(surveyLink);
        toast.success("설문 링크가 복사되었습니다!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } catch (error) {
        console.error("링크 공유 오류:", error);
        toast.error("링크 복사에 실패했습니다.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }

      this.menuVisible = false;
    },
  },
};
</script>

<style scoped>
.survey-stats {
  font-family: Pretendard;
  display: flex;
  flex-direction: column;
  padding: 0 25px 25px;
  height: 100%;
}

.header {
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;
}

.header button {
  background-color: #f0f0f0;
  cursor: pointer;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
}

.menu-button img {
  width: 8px;
  height: 20px;
}

.menu-dropdown {
  position: absolute;
  top: 35px;
  right: 3px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 150px;
}

.menu-dropdown button {
  padding: 10px 20px;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 14px;
}

.menu-dropdown button:hover {
  background: #f0f0f0;
}

.tab-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.tab-buttons {
  display: flex;
  gap: 10px;
}

.tab-buttons button {
  font-family: Pretendard;
  padding: 10px 20px;
  border: none;
  border-radius: 16px;
  background-color: #f7f9fb;
  cursor: pointer;
  font-size: 16px;
}

.tab-buttons .active {
  border-radius: 16px;
  background: #e5ecf6;
  font-weight: bold;
}
</style>
