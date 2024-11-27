<template>
  <div class="mobile-survey-container">
    <p class="instruction">
      참여자 확인을 위해 이메일, 이름, 전화번호가 필요합니다. 아래 정보를 입력해
      주세요.
    </p>

    <!-- 이메일 -->
    <div class="input-group">
      <label class="label">이메일</label>
      <input
        type="email"
        class="input-field"
        placeholder="example@gmail.com"
        v-model="email"
      />
    </div>

    <!-- 이름 -->
    <div class="input-group">
      <label class="label">이름</label>
      <input
        type="text"
        class="input-field"
        placeholder="홍길동"
        v-model="name"
      />
    </div>

    <!-- 전화번호 -->
    <div class="input-group">
      <div class="input-box">
        <label class="label">전화번호</label>
        <input
          type="tel"
          id="phone"
          class="input-field"
          v-model="phone"
          placeholder="010-1234-5678"
        />
      </div>
    </div>

    <!-- 완료 버튼 -->
    <div class="button-group">
      <button class="submit-button" @click="submitForm">완료</button>
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
        this.$router.push("/mobile/survey");
      } else {
        alert("모든 정보를 입력해주세요.");
      }
    },
  },
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.mobile-survey-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #f7f9fb;
  overflow: hidden;
  box-sizing: border-box;

  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  flex-direction: column; /* 필요하면 요소를 위에서 아래로 배치 */
}

/* 안내 텍스트 */
.instruction {
  width: 332px;
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  color: #000000;
}

/* 입력 그룹 */
.input-group {
  position: relative;
  width: 331px;
  height: 63px;
  margin: 20px auto;
  background: #ffffff;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  border-radius: 15px;
  flex-direction: column;
  justify-content: center;
  padding: 10px 15px;
  box-sizing: border-box;
}

/* 라벨 스타일 */
.label {
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  display: block;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #6e6a7c;
  margin-bottom: 5px;
}

/* 텍스트 입력 스타일 */
.input-field {
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  border: none;

  outline: none; /* 포커스 시 테두리 제거 */
}

/* 버튼 그룹 */
.button-group {
}

/* 완료 버튼 스타일 */
.submit-button {
  width: 157px;
  height: 45px;
  background: #dae8f4;
  border: none;
  border-radius: 24.877px;
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: #1c1d22;
  cursor: pointer;
}

.submit-button:hover {
  background: #c5dff0;
}
</style>
