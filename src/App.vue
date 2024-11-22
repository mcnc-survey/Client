<template>
  <div id="app">
    <div class="container">
      <!-- 왼쪽 네비게이션 -->
      <Sidebar :isSidebarOpen="isSidebarOpen" />

      <div class="content-wrapper">
        <!-- 상단 탭바 -->
        <div class="topbar">
          <button @click="toggleSidebar">☰</button>
          <span>My Application</span>
          <button @click="toggleNotifications">☰</button>
        </div>

        <!-- 가운데 콘텐츠 -->
        <div class="content">
          <router-view></router-view>
        </div>
      </div>

      <!-- 오른쪽 알림 -->
      <Notifications :isNotificationsOpen="isNotificationsOpen" />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Notifications from "./components/Notifications.vue";

export default {
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
@font-face {
  font-family: "Pretendard";
  src: url("../public/fonts/Pretendard-Regular.woff2") format("woff2"),
    url("../public/fonts/Pretendard-Regular.woff") format("woff");
}

/* 전체 기본 폰트 설정 */
body {
  font-family: "Pretendard", Arial, sans-serif;
  font-weight: normal;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 전체 컨테이너 */
.container {
  display: flex;
  height: 100vh;
}

/* 가운데 콘텐츠 영역 */
.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 상단 탭바 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
}

.topbar button {
  background-color: #388e3c;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.topbar button:hover {
  background-color: #2e7d32;
}

.content {
  background-color: #ffffff;
  padding: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow-y: auto;
  height: 100vh;
}

.content::-webkit-scrollbar {
  display: none;
}
</style>
