<template>
  <nav v-if="isSidebarOpen" class="sidebar">
    <div class="user-info">
      <img
        src="@/assets/images/icon-user.png"
        alt="User Image"
        class="user-image"
      />
      <h>홍길동</h>
    </div>
    <br />
    <!-- 즐겨찾기 헤더 -->
    <div
      class="favorites-header"
      :class="{
        active: isFavoritesActive,
        hover: isFavoritesHovered,
      }"
      @mouseenter="isFavoritesHovered = true"
      @mouseleave="isFavoritesHovered = false"
    >
      <button @click="toggleFavoritesList" class="toggle-btn">
        {{ isFavoritesOpen ? "▽" : "▶" }}
      </button>
      <p>즐겨찾기</p>
    </div>
    <!-- 즐겨찾기 목록 -->
    <transition name="fade">
      <ul v-if="isFavoritesOpen" class="favorites-list">
        <li
          v-for="(item, index) in favorites"
          :key="index"
          :class="{
            active: isActiveRoute(item.route),
          }"
        >
          <router-link :to="item.route">{{ item.label }}</router-link>
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
export default {
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isFavoritesOpen: true, // 즐겨찾기 리스트 표시 여부
      isFavoritesHovered: false, // hover 상태
      favorites: [
        { label: "입학 설명회 참가", route: "/web/edit/id1" },
        { label: "독립 서점 이용 경험", route: "/web/edit/id2" },
        { label: "지하철 앱 사용 경험", route: "/web/edit/id3" },
      ],
    };
  },
  computed: {
    isFavoritesActive() {
      return this.favorites.some((item) => this.isActiveRoute(item.route));
    },
  },
  methods: {
    toggleFavoritesList() {
      this.isFavoritesOpen = !this.isFavoritesOpen;
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 15%;
  background-color: #f4f4f4;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
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
.sidebar .menu-item.router-link-active {
  background-color: #bbb;
  font-weight: bold;
  color: black;
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
</style>
