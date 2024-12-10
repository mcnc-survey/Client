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
  height: 100%; /* 높이 지정 */
}
</style>
