<template>
  <div class="login-container">
    <div class="left-bg">
      <div class="login-layout">
        <h2>로그인</h2>

        <!-- 이메일 입력 필드 -->
        <div
          class="form-field relative"
          :class="{ 'has-error': emailError && emailTouched }"
        >
          <input
            type="email"
            id="email"
            class="input-field peer"
            :class="{ 'error-border': emailError && emailTouched }"
            v-model="email"
            @blur="validateEmail"
            placeholder=" "
            required
          />
          <label
            for="email"
            class="floating-label"
            :class="{ 'error-label': emailError && emailTouched }"
            >이메일</label
          >
          <span v-if="emailError && emailTouched" class="error-message"
            >잘못된 이메일 형식입니다.</span
          >
        </div>

        <!-- 비밀번호 입력 필드 -->
        <div
          class="form-field relative"
          :class="{ 'has-error': passwordError && passwordTouched }"
        >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="input-field peer"
            :class="{ 'error-border': passwordError && passwordTouched }"
            v-model="password"
            @blur="validatePassword"
            placeholder=" "
            required
          />
          <label
            for="password"
            class="floating-label"
            :class="{ 'error-label': passwordError && passwordTouched }"
            >비밀번호</label
          >
          <div
            v-if="password.length > 0"
            class="password-toggle"
            @click="togglePassword"
          >
            <img
              :src="
                showPassword
                  ? require('../assets/images/eye_hide.png')
                  : require('../assets/images/eye_show.png')
              "
              :alt="showPassword ? '비밀번호 숨기기' : '비밀번호 표시'"
              class="eye-icon"
            />
          </div>
          <span v-if="passwordError && passwordTouched" class="error-message"
            >영문과 특수문자를 포함하여 8자리 이상으로 입력해주세요.</span
          >
        </div>

        <div class="login-options">
          <button class="login-button" @click="doLogin">
            로그인
            <img
              src="../assets/images/login_button.svg"
              alt="arrow icon"
              class="button-icon"
            />
          </button>
          <span class="forgot-password">Forgot your password?</span>
        </div>

        <div class="create-account-container">
          <router-link to="/signup" class="create-account"
            >CREATE NEW ACCOUNT</router-link
          >
        </div>

        <div class="social-login-section">
          <div class="divider-line">
            <span class="divider-text">Or Sign in with</span>
          </div>
          <div class="social-icons">
            <img
              src="../assets/images/login_google.svg"
              alt="google"
              class="social-icon"
            />
            <img
              src="../assets/images/login_kakao.png"
              alt="kakao"
              class="social-icon"
            />
            <img
              src="../assets/images/login_naver.svg"
              alt="naver"
              class="social-icon"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="right-bg">
      <img
        src="../assets/images/login_image.svg"
        class="right-background-img"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      emailError: false,
      passwordError: false,
      emailTouched: false,
      passwordTouched: false,
      showPassword: false,
    };
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
    validatePassword() {
      if (this.password.length === 0) {
        this.passwordError = false;
        return;
      }
      this.passwordTouched = true;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
      const hasMinLength = this.password.length >= 8;
      this.passwordError = !(hasSpecialChar && hasMinLength);
    },
    doLogin() {
      this.$router.push("/web/management");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.login-layout {
  width: 100%;
  max-width: 350px;
  min-width: 280px;
  padding: 0 20px;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  text-align: left;
  font-weight: bold;
}

.form-field {
  position: relative;
  margin: 20px 0;
  width: 100%;
  margin-bottom: 20px;
  transition: margin-bottom 0.2s ease;
}

.password-toggle {
  position: absolute;
  right: 15px; /* Adjusted from 0 to 5px to bring the icon closer */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 비밀번호 입력필드에서 텍스트 입력 영역을 눈 아이콘 전까지로 제한 */
input[type="password"],
input[type="text"] {
  padding-right: 50px;
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
  box-sizing: border-box; /* 모든 입력창에 box-sizing 적용 */
}

.input-field:focus {
  outline: none;
  border-color: #a8c5da;
  border-width: 2px;
}

.error-border {
  border-color: #ff6b6b !important;
  border-width: 2px;
}

.floating-label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #b3b3b3;
  pointer-events: none;
  transition: all 0.2s ease-out;
  background-color: white;
  padding: 0 5px;
}

.error-label {
  color: #ff6b6b;
}

.input-field:focus ~ .floating-label,
.input-field:not(:placeholder-shown) ~ .floating-label {
  transform: translateY(-180%) scale(0.85);
}

.input-field:focus ~ .floating-label {
  color: #a8c5da;
}

/* 에러 상태일 때는 focus 상태에서도 빨간색 유지 */
.error-border:focus ~ .floating-label {
  color: #ff6b6b;
}

.input-field::placeholder {
  color: transparent;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -25px;
  color: #ff6b6b;
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

.login-options {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}

.login-button {
  width: 45%;
  padding: 10px;
  background-color: #a8c5da;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 28.42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: bold;
  height: 40px;
}

.button-icon {
  width: 18px;
  height: 18px;
}

.forgot-password {
  font-size: 0.8rem;
  color: #b3b3b3;
  cursor: pointer;
  font-weight: bold;
  margin-left: 20px;
}

.create-account-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.create-account {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: rgba(168, 197, 218, 0.3);
  color: #000000;
  font-size: 0.75rem;
  border-radius: 28.42px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-login-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.divider-line {
  width: 100%;
  text-align: center;
  position: relative;
  margin: 15px 0;
}

.divider-line::before,
.divider-line::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 70px);
  height: 1px;
  background-color: rgba(49, 49, 49, 0.3);
}

.divider-line::before {
  left: 0;
}

.divider-line::after {
  right: 0;
}

.divider-text {
  background-color: #fff;
  padding: 0 10px;
  font-size: 1rem;
  color: rgba(49, 49, 49, 0.3);
  display: inline-block;
  position: relative;
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
  cursor: pointer;
}

.left-bg {
  width: 40%;
  min-width: 350px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.right-bg {
  width: 60%;
  min-width: 350px;
  background-color: #f7f9fb;
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

/* 브라우저 자동완성 배경색 제거 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
