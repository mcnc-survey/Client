<template>
  <div class="identify-container">
      <div class="identify-content">
          <div class="title-area">
          <h1>비밀번호 찾기</h1>
          <p>비밀번호 재설정을 위해 정확한 이메일을 입력해주세요.</p>
      </div>

      <div class="form-field">
        <input 
          type="email" 
          id="email" 
          class="input-field peer"
          :class="{ 'invalid': isInvalid }"
          v-model="email"
          @input="validateEmail"
          placeholder=" "
          ref="identifyEmailInput"
        />
        <label 
          for="email" 
          class="floating-label"
          :class="{ 'invalid-label': isInvalid }"
        >이메일을 입력해주세요.</label>
      </div>
      
      <div v-if="isInvalid" class="error-container">
        <p class="error-message">올바른 이메일 형식이 아닙니다.</p>
      </div>

      <div class="button-area">
        <button class="next-button" @click="handleNextStep" :disabled="isLoading">
          {{ isLoading ? '전송 중...' : '이메일 전송' }}
          <img 
            v-if="!isLoading"
            src="@/assets/images/login_button.svg" 
            alt="다음" 
            class="arrow-icon"
          >
        </button>
        <button class="login-button" @click="backToLogin">돌아가서 로그인하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { showErrorAlert } from '@/utils/swalUtils';
import { authAPI } from '@/service/surveyService';

export default {
name: 'FindPwIdentifyPage',
data() {
  return {
    email: '',
    isInvalid: false,
    isLoading: false
  }
},
created() {
      // 기존 이메일 데이터 제거
      sessionStorage.removeItem('resetEmail');
  },
methods: {
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    this.isInvalid = this.email.length > 0 && !emailRegex.test(this.email)
  },
  async handleNextStep() {
    if(this.isLoading) return;
    if(!this.email) {
      this.$refs.identifyEmailInput.focus();
      return;
    }

    this.validateEmail();
      if(this.isInvalid) {
        return;
      }

      try {
        this.isLoading = true;
        const response = await authAPI.requestPasswordChange(this.email);

        if (response.data.success) {
          sessionStorage.setItem('resetEmail', this.email);
          this.$router.push("/help/verify");
        } else {
          showErrorAlert("이메일 전송 실패", response.data.body || "이메일 전송에 실패했습니다.");
        }
        } catch (error) {
          this.isLoading = true;
          // API 응답에서 가입되지 않은 이메일 에러를 확인
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.body || error.response.data.message;
              if (errorMessage === '가입되지 않은 이메일입니다.') {
                showErrorAlert("이메일 전송 실패", "가입되지 않은 이메일입니다.");
              } else {
                showErrorAlert("오류 발생", "서비스 접속에 실패했습니다. 잠시 후 다시 시도해주세요.");
              }
          } else {
            showErrorAlert("오류 발생", "서비스 접속에 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
      }
  },
  backToLogin() {
    this.$router.push("/");
  }
}
}
</script>

<style scoped>
.identify-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: white;
}

.identify-content {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
}

.title-area {
  margin-bottom: 20px;
  text-align: left;
}

.title-area h1 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.title-area p {
  font-size: 0.8rem;
  color: #666;
}

.form-field {
  position: relative;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 15px;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: transparent;
}

.input-field:focus {
  outline: none;
  border-color: #A8C5DA;
  border-width: 2px;
}

.input-field.invalid {
  border-color: #FF6B6B;
  border-width: 2px;
}

.floating-label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #B3B3B3;
  pointer-events: none;
  transition: all 0.2s ease-out;
  background-color: white;
  padding: 0 5px;
  transform-origin: 0;
}

.invalid-label {
  color: #FF6B6B;
}

.input-field:not(:placeholder-shown) ~ .floating-label,
.input-field:focus ~ .floating-label {
  transform: translateY(-180%) scale(0.85);
}

.input-field:focus ~ .floating-label {
  color: #A8C5DA;
}

.input-field.invalid:focus ~ .floating-label,
.input-field.invalid:not(:placeholder-shown) ~ .floating-label {
  color: #FF6B6B;
}

.error-container {
  margin-bottom: 16px;
}

.error-message {
  color: #FF6B6B;
  font-size: 0.8rem;
  margin-left: 5px;
}

.button-area {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.next-button {
  width: 160px;
  height: 40px;
  background-color: #A8C5DA;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 28.42px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.3s;
}

.next-button:disabled {
  opacity: 0.7;
  cursor: default;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.login-button {
  width: 100%;
  height: 45px;
  background-color: #ECF1F6;
  color: #000000;
  font-weight: bold;
  border: none;
  border-radius: 28.42px;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 브라우저 자동완성 배경색 제거 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>