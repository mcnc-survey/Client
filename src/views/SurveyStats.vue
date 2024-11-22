<template>
  <div class="survey-stats">
    <div class="header">
      <button class="back-button" @click="goBack">
        <img src="../assets/images/back.svg" alt="뒤로가기" />
      </button>

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
        <button @click="deleteSurvey">휴지통</button>
        <button @click="deletePermanently">완전 삭제</button>
        <button @click="shareLink">링크 공유</button>
      </div>
    </div>

    <component :is="currentTabComponent" />
  </div>
</template>

<script>
import SurveyTab from "../components/SurveyTab.vue";
import StatsTab from "../components/StatsTab.vue";

export default {
  data() {
    return {
      activeTab: "stats",
      menuVisible: false,
    };
  },
  components: {
    SurveyTab,
    StatsTab,
  },
  computed: {
    currentTabComponent() {
      return this.activeTab === "stats" ? "StatsTab" : "SurveyTab";
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    setTab(tab) {
      this.activeTab = tab;
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    deleteSurvey() {
      alert("휴지통");
      this.menuVisible = false;
    },
    deletePermanently() {
      alert("완전 삭제 기능");
      this.menuVisible = false;
    },
    shareLink() {
      alert("링크 공유 기능");
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
}

.header {
  margin: 12px 0 16px;
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

.back-button img {
  width: 15px;
  height: 20px;
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
  padding: 10px 15px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
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
