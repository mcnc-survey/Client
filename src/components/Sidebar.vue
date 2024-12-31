<template>
  <nav v-if="isSidebarOpen" class="sidebar">
    <div class="sidebar-content">
      <div class="menu-top">
        <div class="user-info">
          <h>안녕하세요, <span class="user-name">{{ userName }}</span>님!</h>
        </div>
        <br />
        <!-- 즐겨찾기 헤더 -->
        <div @click="toggleFavoritesList" class="favorites-header" :class="{
          active: isFavoritesActive,
          hover: isFavoritesHovered,
        }" @mouseenter="isFavoritesHovered = true" @mouseleave="isFavoritesHovered = false">
          <button class="toggle-btn">
            <img :src="isFavoritesOpen ? require('@/assets/images/bookmark-open.svg') : require('@/assets/images/bookmark-close.svg')"
              alt="toggle-icon" class="toggle-icon" />
          </button>
          <p>즐겨찾기</p>
        </div>
        <!-- 즐겨찾기 목록 -->
        <transition name="fade">
          <ul v-if="isFavoritesOpen" class="favorites-list">
            <template v-if="favorites.length > 0">
              <li v-for="item in favorites" :key="item.id" :class="{
                active: isActiveRoute(`/web/stats/${item.id}`),
              }">
                <router-link :to="`/web/stats/${item.id}`">{{ item.title }}</router-link>
              </li>
            </template>
            <li v-else class="favorites-list-item empty-favorites">
              <span>즐겨찾기를 추가해주세요!</span>
            </li>
          </ul>
        </transition>
        <router-link to="/web/management" class="menu-item">
          설문조사 목록
        </router-link>
        <router-link to="/web/calendar" class="menu-item">캘린더</router-link>
        <router-link to="/web/recycle" class="menu-item">삭제된 항목</router-link>
      </div>
      
      <!-- 로그아웃 버튼 -->
      <div class="logout-section">
        <a @click="handleLogout" class="menu-item">
          <div class="logout-content">
            <img src="@/assets/images/logout_image.svg" alt="로그아웃" class="logout-icon" />
            <span>로그아웃</span>
          </div>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { surveyAPI, authAPI } from '@/service/surveyService';
import { emitter } from '@/eventBus/eventBus';
import { showErrorAlert, showConfirmAlert } from '@/utils/swalUtils';

export default {
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
    hasUnsavedChanges: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavoritesOpen: true,
      isFavoritesHovered: false,
      favorites: [],
      userName: localStorage.getItem('userName') || '사용자',
      localHasUnsavedChanges: false
    };
  },
  computed: {
    isFavoritesActive() {
      return this.favorites.some((item) =>
        this.isActiveRoute(`/web/stats/${item.id}`)
      );
    },
  },
  methods: {
    toggleFavoritesList() {
      this.isFavoritesOpen = !this.isFavoritesOpen;
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    async fetchFavorites() {
      try {
        const response = await surveyAPI.getBookmarkSurveys();
        if (response.data.success && response.data.resultCode === "200") {
          this.favorites = response.data.body;
        } else {
          console.error('즐겨찾기 데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('즐겨찾기 API 호출 중 오류 발생:', error);
      }
    },
    async handleLogout() {
      const isSurveyPage = ['SurveyCreate', 'SurveyEdit'].includes(this.$route.name);
      if (isSurveyPage && this.localHasUnsavedChanges ) {
        // 저장되지 않은 내용이 있는 경우
        showConfirmAlert({
          html: '저장되지 않은 내용이 있습니다. <br>로그아웃 하시겠습니까?',
          subMessage: '* 작성 중인 내용이 저장되지 않습니다.',
          confirmText: '로그아웃',
          cancelText: '취소',
          onConfirm: async () => {
            emitter.emit('clearUnsavedChanges');
            try {
              const response = await authAPI.doLogout();
              
              if (response.data.success) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userName');
                this.$router.push('/');
              }
            } catch (error) {
              console.error('로그아웃 에러:', error);
              showErrorAlert('로그아웃 실패', '로그아웃 처리 중 오류가 발생했습니다.');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userName');
              this.$router.push('/');
            }
          }
        });
      } else {
        // 저장되지 않은 내용이 없는 경우
        showConfirmAlert({
          title: '로그아웃',
          html: '정말 로그아웃 하시겠습니까?',
          subMessage: '',
          confirmText: '확인',
          cancelText: '취소',
          onConfirm: async () => {
            try {
              const response = await authAPI.doLogout();
              
              if (response.data.success) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userName');
                this.$router.push('/');
              }
            } catch (error) {
              console.error('로그아웃 에러:', error);
              showErrorAlert('로그아웃 실패', '로그아웃 처리 중 오류가 발생했습니다.');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userName');
              this.$router.push('/');
            }
          }
        });
      }
    }
  },
  created() {
    this.fetchFavorites();
    emitter.on('updateBookmarks', () => {
      this.fetchFavorites();
    });
    emitter.on('updateUnsavedChanges', (value) => {
      this.localHasUnsavedChanges = value;
    });
  },
  unmounted() {
    emitter.off('updateBookmarks');
    emitter.off('updateUnsavedChanges');
  },
};
</script>

<style scoped>
.sidebar {
  width: 15%;
  background-color: #fff;
  padding: 20px;
  transition: transform 0.3s ease;
  transform: translateX(0);
  border-right: 2px solid #E8E8E8;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu-top {
  flex-grow: 1;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info h {
  color: #000;
  margin: 5px 0 0 5px;
  font-size: 16px;
}

.user-name {
  font-weight: bold;
}

.sidebar a {
  display: block;
  margin: 5px 0;
  text-decoration: none;
  color: #999;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar a:hover {
  background-color: #ddd;
}

.sidebar .menu-item {
  padding-left: 10px;
}

.sidebar .menu-item.router-link-active {
  background-color: #ddd;
  font-weight: bold;
  color: black;
}

.toggle-btn {
  border: none;
  background-color: transparent;
  padding: 5px 5px 0;
  cursor: pointer;
}

.toggle-icon {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.favorites-list {
  padding: 0;
  margin: 0;
  margin-left: 20px;
}

.favorites-list li {
  list-style: none;
  padding: 0;
}

.favorites-list li.active {
  background-color: #bbb;
  font-weight: bold;
  border-radius: 4px;
}

.favorites-list li.active a {
  color: black;
}

.favorites-list li:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.favorites-header {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.favorites-header p {
  margin: 0;
  color: #999;
  transition: color 0.3s, background-color 0.3s;
}

.favorites-header.active p {
  color: black;
  font-weight: bold;
}

.favorites-header.active {
  background-color: #bbb;
  border-radius: 4px;
}

.favorites-header.hover {
  background-color: #ddd;
  border-radius: 4px;
}

.favorites-header:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.toggle-btn {
  border: none;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.3s ease;
}

.favorites-list-item {
  list-style: none;
  padding: 5px;
  margin-left: 10px;
  color: #999;
}

.empty-favorites {
  display: block;
  text-decoration: none;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.empty-favorites span {
  color: #999;
  display: block;
  padding: 5px;
}

.empty-favorites:hover {
  background-color: #ddd;
}

.logout-section .logout-content {
  display: flex;
  align-items: center;
  gap: 8px; 
  cursor: pointer;
}

.logout-section .menu-item {
  color: #000;
  font-weight: bold;
}

.logout-icon {
  width: 16px;
  height: 16px;
}
</style>