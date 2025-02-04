<!-- 
  Author : 한채영
  Description : 관리자 회원가입 페이지 
  - 이메일 유효성 검사
-->

<template>
  <div class="container">
    <div class="left-bg">
      <div class="signup-layout">
        <div class="header">
          <router-link to="/" class="back-link">
            <img src="../assets/images/arrow_back.svg" alt="back" class="back-arrow" />
          </router-link>
          <h2>회원가입</h2>
        </div>

        <div class="form-field relative">
          <input type="text" id="userName" class="input-field peer" v-model="userName" placeholder=" " ref="userNameInput" />
          <label for="userName" class="floating-label">이름</label>
        </div>

        <div class="form-field relative" :class="{ 'has-error': emailError && emailTouched }">
          <div class="email-verification-container">
            <div class="email-input-wrapper">
              <input type="email" id="email" class="input-field peer email-input"
                :class="{ 'error-border': emailError && emailTouched }" 
                v-model="email" 
                @input="validateEmail"
                :disabled="isEmailVerified"
                placeholder=" " 
                ref="emailInput" />
              <label for="email" class="floating-label" :class="{ 'error-label': emailError && emailTouched }">이메일</label>
            </div>
            <button 
              class="verify-button" 
              @click="sendVerificationEmail"
              :disabled="!email || emailError || isEmailVerified"
            >
              {{ isEmailVerified ? '인증완료' : '이메일 인증' }}
            </button>
          </div>
          <span v-if="emailError && emailTouched" class="error-message">잘못된 이메일 형식입니다</span>

          <!-- 인증 코드 입력 UI -->
          <div v-if="showVerificationInput && !isEmailVerified" class="verification-container">
            <div class="verification-input-wrapper">
              <div class="code-input-container">
                <input 
                  type="text"
                  v-model="verificationCode"
                  class="verification-code-input"
                  maxlength="6"
                  placeholder="인증코드 6자리 입력"
                />
                <span class="timer">{{ formatTime(timeLeft) }}</span>
              </div>
              <button 
                class="verification-submit-button"
                :disabled="verificationCode.length !== 6"
                @click="verifyCode"
              >
                입력
              </button>
            </div>
          </div>
        </div>

        <div class="form-field relative" :class="{ 'has-error': phoneError && phoneTouched }">
          <input type="tel" id="phone" class="input-field peer" :class="{ 'error-border': phoneError && phoneTouched }"
            v-model="phone" @input="validatePhone" placeholder=" " ref="phoneInput" />
          <label for="phone" class="floating-label" :class="{ 'error-label': phoneError && phoneTouched }">전화번호 (숫자만 입력)</label>
          <span v-if="phoneError && phoneTouched" class="error-message">올바른 전화번호 형식이 아닙니다</span>
        </div>

        <div class="form-field relative" :class="{ 'has-error': passwordError && passwordTouched }">
          <input :type="showPassword ? 'text' : 'password'" id="password" class="input-field peer"
            :class="{ 'error-border': passwordError && passwordTouched }" v-model="password" @input="validatePassword"
            placeholder=" " ref="passwordInput" />
          <label for="password" class="floating-label"
            :class="{ 'error-label': passwordError && passwordTouched }">비밀번호</label>
          <div v-if="password.length > 0" class="password-toggle" @click="togglePassword">
            <img
              :src="showPassword ? require('../assets/images/eye_hide.svg') : require('../assets/images/eye_show.svg')"
              :alt="showPassword ? '비밀번호 숨기기' : '비밀번호 표시'" class="eye-icon" />
          </div>
          <span v-if="passwordError && passwordTouched" class="error-message">비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자입니다.</span>
        </div>

        <div class="form-field relative" :class="{ 'has-error': confirmPasswordError && confirmPasswordTouched }">
          <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" class="input-field peer"
            :class="{ 'error-border': confirmPasswordError && confirmPasswordTouched }" v-model="confirmPassword"
            @input="validateConfirmPassword" placeholder=" " ref="confirmPasswordInput" />
          <label for="confirmPassword" class="floating-label"
            :class="{ 'error-label': confirmPasswordError && confirmPasswordTouched }">비밀번호 확인</label>
          <div v-if="confirmPassword.length > 0" class="password-toggle" @click="toggleConfirmPassword">
            <img
              :src="showConfirmPassword ? require('../assets/images/eye_hide.svg') : require('../assets/images/eye_show.svg')"
              :alt="showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'" class="eye-icon" />
          </div>
          <span v-if="confirmPasswordError && confirmPasswordTouched" class="error-message">비밀번호가 일치하지 않습니다</span>
        </div>

        <button class="signup-button" @click="doSignup">회원가입</button>
      </div>
    </div>
    <div class="right-bg">
      <img src="../assets/images/signup_image.svg" class="right-background-img" />
    </div>
  </div>
</template>

<script>
import { showNavigateAlert, showErrorAlert } from '@/utils/swalUtils';
import { authAPI } from '@/service/surveyService';

export default {
  name: 'SignupPage',
  data() {
    return {
      userName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',

      emailError: false,
      phoneError: false,
      passwordError: false,
      confirmPasswordError: false,

      emailTouched: false,
      phoneTouched: false,
      passwordTouched: false,
      confirmPasswordTouched: false,

      showPassword: false,
      showConfirmPassword: false,

      // 이메일 인증 관련 상태
      isEmailVerified: false,
      showVerificationInput: false,
      verificationCode: '',

      // 타이머 관련 상태
      timeLeft: 300,
      timerInterval: null
    }
  },
  computed: {
    isFormValid() {
      return this.userName &&
        this.email && !this.emailError &&
        this.isEmailVerified &&
        this.phone && !this.phoneError &&
        this.password && !this.passwordError &&
        this.confirmPassword && !this.confirmPasswordError;
    }
  },
  methods: {
    validateEmail() {
      if (this.email.length === 0) {
        this.emailError = false;
        return;
      }
      this.emailTouched = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = !emailRegex.test(this.email);
    },
    validatePhone() {
      if (this.phone.length === 0) {
        this.phoneError = false;
        return;
      }
      this.phoneTouched = true;
      // 전화번호 형식: 000-0000-0000 또는 000-000-0000
      const phoneRegex = /^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$/;
      this.phoneError = !phoneRegex.test(this.phone);
    },
    validatePassword() {
      if (this.password.length === 0) {
        this.passwordError = false;
        return;
      }
      this.passwordTouched = true;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
      const hasMinLength = this.password.length >= 8;
      const hasMaxLength = this.password.length <= 20;
      const hasLetter = /[A-Za-z]/.test(this.password);  // 영문 포함
      const hasNumber = /[0-9]/.test(this.password);     // 숫자 포함
      this.passwordError = !(hasSpecialChar && hasMinLength && hasMaxLength && hasLetter && hasNumber);

      // 비밀번호가 변경되면 비밀번호 확인도 재검증
      if (this.confirmPasswordTouched) {
        this.validateConfirmPassword();
      }
    },
    validateConfirmPassword() {
      if (this.confirmPassword.length === 0) {
        this.confirmPasswordError = false;
        return;
      }
      this.confirmPasswordTouched = true;
      this.confirmPasswordError = this.password !== this.confirmPassword;
    },
    async sendVerificationEmail() {
      try {
        const response = await authAPI.sendVerificationEmail({
          email: this.email
        });
        
        if (response.data.success) {
          this.showVerificationInput = true;
          this.verificationCode = '';
          this.startTimer();
          showNavigateAlert({
            html: "인증 메일 발송",
            subMessage: "입력하신 이메일로 인증코드가 발송되었습니다.",
            confirmText: "확인"
          });
        }
      } catch (error) {
        if (error.response?.data?.resultCode === 'A003') {
          showErrorAlert("이메일 전송 실패", "이미 가입된 이메일입니다.");
        } else {
          showErrorAlert("이메일 전송 실패", "인증 이메일 전송에 실패했습니다.");
        }
      }
    },

    async verifyCode() {
      try {
        const response = await authAPI.verifyEmailCode({
          email: this.email,
          code: this.verificationCode
        });
        
        if (response.data.success && response.data.body.isValid) {
          this.isEmailVerified = true;
          this.showVerificationInput = false;
          this.stopTimer();
          showNavigateAlert({
            html: "인증 완료",
            subMessage: "이메일 인증이 완료되었습니다.",
            confirmText: "확인"
          });
        } else {
          showErrorAlert("인증 실패", "잘못된 인증번호입니다.");
        }
      } catch (error) {
        showErrorAlert("인증 실패", "인증 처리 중 오류가 발생했습니다.");
      }
    },
    async doSignup() {
      // 이름 체크
      if (!this.userName) {
        this.$refs.userNameInput.focus();
        return;
      }

      // 이메일 체크
      if (!this.email) {
        this.$refs.emailInput.focus();
        this.emailTouched = true;
        return;
      }

      // 전화번호 체크
      if (!this.phone) {
        this.$refs.phoneInput.focus();
        this.phoneTouched = true;
        return;
      }

      // 비밀번호 체크
      if (!this.password) {
        this.$refs.passwordInput.focus();
        this.passwordTouched = true;
        return;
      }

      // 비밀번호 확인 체크
      if (!this.confirmPassword) {
        this.$refs.confirmPasswordInput.focus();
        this.confirmPasswordTouched = true;
        return;
      }

      // 모든 필드의 유효성 검사 실행
      this.validateEmail();
      this.validatePhone();
      this.validatePassword();
      this.validateConfirmPassword();

      // 모든 유효성 검사 통과 확인
      if (this.isFormValid) {
        try {
          const signupData = {
            userName: this.userName,
            phoneNumber: this.phone,
            email: this.email,
            password: this.password
          };

          const response = await authAPI.doSignUp(signupData);

          if(response.data.success) {
            showNavigateAlert({
              html: "회원가입 완료",
              subMessage: "가입이 성공적으로 완료되었습니다.",
              confirmText: "로그인",
              onConfirm: () => {
                this.$router.push("/");
              }
            });
          } 
          
        } catch(error) {
          // 400 Bad Request이고 에러 코드가 A003인 경우
          if (error.response?.status === 400 && error.response?.data?.resultCode === 'A003') {
            showErrorAlert("회원가입 실패", "이미 존재하는 이메일입니다.");
          }
          else if(error.response?.status === 400 && error.response?.data?.resultCode === 'A005') {
            showErrorAlert("회원가입 실패", "인증되지 않은 이메일입니다.");
          }
          else {
            showErrorAlert("회원가입 실패", "회원가입 중 오류가 발생했습니다.");
          }
        }

        console.log('회원가입 시도', {
          userName: this.userName,
          email: this.email,
          phone: this.phone,
          password: this.password
        });
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      this.timeLeft = 300;
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          // 컴포넌트가 마운트된 상태일 때만 경고창 표시
          if (!this.isEmailVerified && this.$el && document.body.contains(this.$el)) {
            this.showVerificationInput = false;
            showErrorAlert("인증 시간 만료", "인증 시간이 만료되었습니다. 다시 시도해주세요.");
          }
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.showVerificationInput = false;
      this.timeLeft = 0;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.stopTimer();
    this.showVerificationInput = false;
    next();
  },
  beforeDestroy() {
    this.stopTimer();
  },
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 600px;
}

.signup-layout {
  width: 100%;
  max-width: 400px;
  min-width: 280px;
  padding: 0 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.back-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.back-arrow {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

h2 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  cursor: default;
}

.form-field {
  position: relative;
  margin: 20px 0;
  transition: margin-bottom 0.2s ease;
}

.form-field.has-error {
  margin-bottom: 40px;
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

/* 비밀번호 입력필드에서 텍스트 입력 영역을 눈 아이콘 전까지로 제한 */
input[type="password"],
input[type="text"] {
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 25px;
  height: 25px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.eye-icon:hover {
  opacity: 0.8;
}

.input-field::placeholder {
  color: transparent;
}

.input-field:focus {
  outline: none;
  border-color: #A8C5DA;
  border-width: 2px;
}

.error-border {
  border-color: #FF6B6B !important;
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

.error-label {
  color: #FF6B6B;
}

.input-field:not(:placeholder-shown)~.floating-label,
.input-field:focus~.floating-label {
  transform: translateY(-180%) scale(0.85);
}

/* 포커스일 때만 파란색으로 변경 */
.input-field:focus~.floating-label {
  color: #A8C5DA;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -25px;
  color: #FF6B6B;
  font-size: 0.73rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  width: 130%;
}

.has-error .error-message {
  opacity: 1;
  transform: translateY(0);
}

/* 에러 상태일 때는 focus 상태에서도 빨간색 유지 */
.error-border:focus~.floating-label {
  color: #FF6B6B;
}

.signup-button {
  width: 100%;
  padding: 10px;
  margin-top: 30px;
  background-color: #A8C5DA;
  color: white;
  font-size: 0.9rem;
  border: none;
  border-radius: 28.42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: bold;
  height: 40px;
  box-sizing: border-box;
}

.left-bg {
  width: 60%;
  min-width: 350px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.right-bg {
  width: 40%;
  min-width: 350px;
  background-color: #F7F9FB;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.right-background-img {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.email-verification-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.email-input-wrapper {
  flex: 1;
  position: relative;
}

.email-input {
  width: 100%;
}

.verify-button {
  width: 90px;
  height: 48px;
  background-color: #A8C5DA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.verify-button:disabled {
  background-color: #A8C5DA;
  cursor: default;
}

/* 이메일 인증 완료 시 입력 필드 스타일 */
input:disabled {
  background-color: #f5f5f5;
  cursor: default
}

.signup-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.verification-container {
  margin-top: 10px;
}

.verification-input-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.code-input-container {
  position: relative;
  flex: 1;
}

.verification-code-input {
  width: 100%;
  padding: 15px 60px 12px 15px; /* 오른쪽 패딩을 늘려서 타이머 공간 확보 */
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  letter-spacing: 4px;
}

.verification-code-input:focus {
  outline: none;
  border-color: #A8C5DA;
  border-width: 2px;
}

.verification-submit-button {
  width: 90px;
  height: 45px;
  background-color: #A8C5DA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.verification-submit-button:disabled {
  background-color: #ddd;
  cursor: default;
}

.timer {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #FF6B6B;
  font-size: 0.9rem;
  font-weight: bold;
}

/* 브라우저 자동완성 배경색 제거 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* placeholder와 floating label 겹치지 않도록 */
.input-field:focus::placeholder {
  opacity: 0;
}

/* 에러 상태에서 input focus 시에도 에러 스타일 유지 */
.error-border:focus {
  border-color: #FF6B6B !important;
}
</style>