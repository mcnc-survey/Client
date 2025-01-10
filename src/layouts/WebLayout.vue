<!--
  Author: 배수호
  Description: 웹 레이아웃 컴포넌트
  - 왼쪽 사이드바와 오른쪽 알림 패널을 포함한 기본 레이아웃 제공
  - 상단 탭바에는 페이지 타이틀과 알림 버튼이 포함됨
  - 라우트 변경 시 페이지 타이틀을 동적으로 업데이트
  - 사이드바와 알림 패널의 열기/닫기 토글 기능 제공
-->

<template>
  <div class="container">
    <!-- 왼쪽 네비게이션 -->
    <Sidebar :isSidebarOpen="isSidebarOpen" />

    <div class="content-wrapper">
      <!-- 상단 탭바 -->
      <div class="topbar">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <img
            :src="require('@/assets/images/sidetab.svg')"
            alt="Toggle Sidebar"
            class="icon"
          />
        </button>
        <span class="title">{{ title }}</span>
        <button class="notifications-toggle" @click="toggleNotifications">
          <img
            :src="require('@/assets/images/alarm.svg')"
            alt="Toggle Notifications"
            class="icon"
          />
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
import { emitter } from "@/eventBus/eventBus";

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
      title: "마음의 소리",
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
  watch: {
    // 라우트가 변경될 때마다 title 업데이트
    $route(to) {
      this.title = to.meta.title || "마음의 소리"; // 라우터 meta의 title을 설정
    },
  },
  created() {
    // 이벤트 수신: updateTitle 이벤트가 발생하면 title 업데이트
    emitter.on("updateTitle", (newTitle) => {
      this.title = newTitle;
    });

    // 최초 라우트 메타 title 설정
    this.title = this.$route.meta.title || "마음의 소리";
  },
  beforeUnmount() {
    // 이벤트 해제 (메모리 누수 방지)
    emitter.off("updateTitle");
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
  padding: 17px 40px;
  color: #ecf0f1;
  border-bottom: 2px solid #e8e8e8;
}

.sidebar-toggle,
.notifications-toggle {
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
}

.icon {
  margin-top: 5px;
  width: 22px;
  height: 22px;
}

.title {
  font-size: 16px;
  color: #000;
  position: absolute;
  margin-left: 40px;
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
  height: 100%;
}
</style>
