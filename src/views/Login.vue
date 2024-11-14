<template>
  <div class="container">
    <div class="left-bg">
      <div class="login-layout">
        <h2>로그인</h2>
        <div class="form-field relative">
          <input 
            type="email" 
            id="email" 
            class="input-field peer" 
            placeholder=" "
            required 
          />
          <label for="email" class="floating-label">이메일</label>
        </div>
        
        <div class="form-field relative">
          <input 
            type="password" 
            id="password" 
            class="input-field peer" 
            placeholder=" "
            required 
          />
          <label for="password" class="floating-label">비밀번호</label>
        </div>
        
        <div class="login-options">
          <button class="login-button" @click="doLogin">
            로그인
            <img src="../assets/login_button.svg" alt="arrow icon" class="button-icon" />
          </button>
          <span class="forgot-password">Forgot your password?</span>
        </div>
        
        <div class="create-account-container">
          <router-link to="/signup" class="create-account">CREATE NEW ACCOUNT</router-link>
        </div>

        <div class="social-login-section">
          <div class="divider-line">
            <span class="divider-text">Or Sign in with</span>
          </div>
          <div class="social-icons">
            <img src="../assets/login_google.svg" alt="Facebook" class="social-icon" />
            <img src="../assets/login_kakao.svg" alt="Google" class="social-icon" />
            <img src="../assets/login_naver.svg" alt="Twitter" class="social-icon" />
          </div>
        </div>
      </div>
    </div>
    <div class="right-bg">
      <img src="../assets/login_image.svg" class="right-background-img" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  methods: {
    doLogin() {
      this.$router.push('/survey-management');
    }
  }
}
</script>

<style scoped>
.container {
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
  width: 90%;
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
  transition: all 0.2s ease-out;
}

.input-field:focus {
  outline: none;
  border-color: #A8C5DA;
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

.input-field:not(:placeholder-shown) ~ .floating-label {
  transform: translateY(-180%) scale(0.85);
  color: #B3B3B3;
}

.input-field:focus ~ .floating-label {
  transform: translateY(-180%) scale(0.85);
  color: #A8C5DA;
}

.input-field::placeholder {
  color: transparent;
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
  background-color: #A8C5DA;
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
  font-size: 0.9rem;
  color: #B3B3B3;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
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
  height: 20px;
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
  content: '';
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

/* 브라우저 자동완성 배경색 제거 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>