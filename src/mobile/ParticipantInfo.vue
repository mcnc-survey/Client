<template>
  <div class="mobile-survey-container">
    <p class="instruction">참여자 확인을 위해 아래 정보를 입력해주세요.</p>

    <!-- 이메일 -->
    <div class="input-group" @click="focusInput('email')">
      <label class="label">이메일</label>
      <div class="email-input-container">
        <input
          ref="email"
          type="email"
          class="input-field"
          placeholder="example@gmail.com"
          v-model="email"
        />
        <button
          class="verification-button"
          @click.stop="requestVerificationCode"
        >
          인증하기
        </button>
      </div>
    </div>

    <!-- 이름 -->
    <div class="input-group" @click="focusInput('name')">
      <label class="label">이름</label>
      <input
        ref="name"
        type="text"
        class="input-field"
        placeholder="홍길동"
        v-model="name"
      />
    </div>

    <!-- 전화번호 -->
    <div class="input-group" @click="focusInput('phone')">
      <label class="label">전화번호</label>
      <input
        ref="phone"
        type="tel"
        class="input-field"
        placeholder="숫자만 입력"
        v-model="phone"
      />
    </div>

    <!-- 완료 버튼 -->
    <div class="button-group">
      <button class="info-submit-button" @click="submitForm">완료</button>
    </div>

    <!-- 구분선 -->
    <div class="divider-line">
      <span class="divider-text">또는 소셜 계정으로 설문 참여하기</span>
    </div>

    <!-- 소셜 로그인 버튼 -->
    <div class="social-login-section">
      <div class="social-icons">
        <img
          src="../assets/images/login_google.svg"
          alt="google"
          class="social-icon"
          @click="handleSocialLogin('google')"
        />
        <img
          src="../assets/images/login_kakao.png"
          alt="kakao"
          class="social-icon"
          @click="handleSocialLogin('kakao')"
        />
        <img
          src="../assets/images/login_naver.svg"
          alt="naver"
          class="social-icon"
          @click="handleSocialLogin('naver')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: "",
      name: "",
      phone: "",
      verificationCode: "", // 인증 코드 저장
      token: this.$route.query.t, // URL에서 토큰 받기
    };
  },
  methods: {
    focusInput(field) {
      this.$refs[field].focus();
    },
    requestVerificationCode() {
      if (!this.email) {
        Swal.fire({
          icon: "error",
          title: "이메일을 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      // 서버로 인증 코드 요청 로직 (여기선 예제용)
      Swal.fire({
        title: "인증번호를 입력해주세요",
        input: "text",
        inputPlaceholder: "인증번호를 입력하세요",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        inputValidator: (value) => {
          if (!value) {
            return "인증번호를 입력해주세요.";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.verificationCode = result.value; // 인증 코드 저장
          Swal.fire("인증 성공", "인증번호가 확인되었습니다.", "success");
        }
      });
    },
    submitForm() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        Swal.fire({
          icon: "error",
          title: "유효한 이메일을 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }
      if (!this.name.trim()) {
        Swal.fire({
          icon: "error",
          title: "이름을 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }
      const phoneRegex = /^010\d{4}\d{4}$/;
      if (!phoneRegex.test(this.phone)) {
        Swal.fire({
          icon: "error",
          title: "유효한 전화번호를 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      if (!this.verificationCode) {
        Swal.fire({
          icon: "error",
          title: "이메일 인증을 완료해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      // 서버로 데이터 전송 로직
      const requestData = {
        email: this.email,
        name: this.name,
        phone: this.phone,
        verificationCode: this.verificationCode, // 인증 코드 포함
        token: this.token, // 토큰 포함
      };

      // 예제: 성공적으로 인증 완료 처리
      this.$router.push(`/mobile/survey?t=${this.token}`);
    },
    handleSocialLogin(platform) {
      this.$router.push(`/mobile/survey?t=${this.token}`);
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
  width: 100%;
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  color: #000000;
  margin-bottom: 40px;
}

/* input-group 기본 스타일 */
.input-group {
  position: relative;
  width: 100%;
  height: 63px;
  margin: 10px auto;
  background: #ffffff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 15px;
  box-sizing: border-box;
  transition: background-color 0.3s, border 0.3s;
}

/* input-group hover 및 포커스 스타일 */
.input-group:hover,
.input-group:focus-within {
  background: #f0f4f8; /* 배경색 밝게 변경 */
  border: 1px solid #c5dff0; /* 테두리 추가 */
}

/* 텍스트 입력 필드 */
.input-field {
  font-family: "Pretendard", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  border: none;
  background: transparent; /* 배경 기본 투명 */
  outline: none; /* 포커스 시 테두리 제거 */
  width: 100%; /* 입력 필드의 크기 확장 */
  pointer-events: none; /* input 자체 클릭 이벤트는 무시 */
}

.input-field:focus {
  pointer-events: auto; /* focus 상태에서는 입력 가능 */
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

/* 이메일 인증 버튼 스타일 */
.email-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.verification-button {
  font-size: 12px;
  color: #fff;
  background-color: #007bff;
  border: none;
  width: 100px;
  border-radius: 24.877px;
}

/* 완료 버튼 스타일 */
.info-submit-button {
  width: 157px;
  height: 45px;
  margin-top: 20px;
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
}

.info-submit-button:hover {
  background: #c5dff0;
}

/* 구분선 */
.divider-line {
  width: 100%;
  text-align: center;
  position: relative;
  margin: 70px 0 20px;
}

.divider-text {
  background-color: #f7f9fb; /* 배경색을 모바일 컨테이너와 동일하게 설정 */
  padding: 0 10px;
  font-size: 1rem;
  color: rgba(49, 49, 49, 0.3);
  display: inline-block;
  position: relative;
}

.social-login-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center; /* 추가 */
}

.social-icons {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-top: 10px;
}

.social-icon {
  width: 40px;
  height: 40px;
}
</style>
