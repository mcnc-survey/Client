<template>
  <div class="container">
    <!-- 왼쪽 네비게이션 -->
    <Sidebar :isSidebarOpen="isSidebarOpen" />

    <div class="content-wrapper">
      <!-- 상단 탭바 -->
      <div class="topbar">
        <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
        <span class="title">My Application</span>
        <button class="notifications-toggle" @click="toggleNotifications">
          🔔
        </button>
      </div>

      <!-- 가운데 콘텐츠 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>

    <!-- 오른쪽 알림 -->
    <Notifications :isNotificationsOpen="isNotificationsOpen" />
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import Notifications from "../components/Notifications.vue";

export default {
  name: "WebLayout",
  components: {
    Sidebar,
    Notifications,
  },
  data() {
    return {
      isSidebarOpen: true,
      isNotificationsOpen: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleNotifications() {
      this.isNotificationsOpen = !this.isNotificationsOpen;
    },
  },
};
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #34495e;
  color: #ecf0f1;
  border-bottom: 1px solid #2c3e50;
}

.sidebar-toggle,
.notifications-toggle {
  background: none;
  border: none;
  color: #ecf0f1;
  font-size: 20px;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fff;
  overflow-y: auto; /* 세로 스크롤 추가 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  height: 100%; /* 높이 지정 */
  padding-right: 8px; /* 스크롤바 간격 */
}

/* 스크롤바 스타일링 */
.content::-webkit-scrollbar {
  width: 8px; /* 스크롤바 너비 */
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1; /* 스크롤바 트랙 배경 */
  border-radius: 4px; /* 둥근 모서리 */
}

.content::-webkit-scrollbar-thumb {
  background: #e8eaec; /* 스크롤바 색상 */
  border-radius: 4px; /* 둥근 모서리 */
}

.content::-webkit-scrollbar-thumb:hover {
  background: #d1d5d9; /* 호버 시 색상 */
}
</style>
