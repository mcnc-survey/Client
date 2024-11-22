<template>
  <div class="survey-container">
    <p class="instruction">정보를 입력해 주세요.</p>

    <!-- 이메일 -->
    <div class="input-group">
      <div class="input-box">
        <label class="label">이메일</label>
        <input
          v-model="email"
          type="email"
          class="input-field"
          placeholder="이메일을 입력하세요."
          required
        />
      </div>
    </div>

    <!-- 이름 -->
    <div class="input-group">
      <div class="input-box">
        <label class="label">이름</label>
        <input
          v-model="name"
          type="text"
          class="input-field"
          placeholder="이름을 입력하세요."
          required
        />
      </div>
    </div>

    <!-- 전화번호 -->
    <div class="input-group">
      <div class="input-box">
        <label class="label">전화번호</label>
        <input
          v-model="phone"
          type="tel"
          class="input-field"
          placeholder="전화번호를 입력하세요."
          required
        />
      </div>
    </div>

    <!-- 완료 버튼 -->
    <div class="button-container">
      <button class="complete-button" @click="submitForm">완료</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      name: "",
      phone: "",
    };
  },
  methods: {
    submitForm() {
      if (this.email && this.name && this.phone) {
        // 모든 필드가 입력되었는지 확인
        this.$router.push("/mobile/survey");
      } else {
        alert("모든 정보를 입력해주세요.");
      }
    },
  },
};
</script>
<style>
/* 앱 전체가 화면 크기를 기준으로 동작하도록 설정 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100vh; /* 부모 요소 높이 */
}
</style>
