<template>
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
/* 모바일 전용 스타일 */
.admin-layout {
  padding: 20px;
  font-size: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
