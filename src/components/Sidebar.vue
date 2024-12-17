<template>
  <nav v-if="isSidebarOpen" class="sidebar">
    <div class="user-info">
      <h>안녕하세요, <b>홍길동</b>님!</h>
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
    <router-link to="/" class="menu-item">로그아웃</router-link>
  </nav>
</template>

<script>
import { surveyAPI } from '@/service/surveyService';
import { emitter } from '@/eventBus/eventBus';

export default {
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isFavoritesOpen: true,
      isFavoritesHovered: false,
      favorites: [],
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
  },
  created() {
    this.fetchFavorites();
    emitter.on('updateBookmarks', () => {
      this.fetchFavorites();
    });
  },
  unmounted() {
    emitter.off('updateBookmarks');
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
</style>