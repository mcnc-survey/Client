<template>
  <div class="container">
    <div class="left-bg">
      <div class="signup-layout">
        <h2>회원가입</h2>

        <!-- 이름 입력 영역 -->
        <div class="name-container">
          <div class="form-field relative">
            <input type="text" id="lastName" class="input-field peer" placeholder=" " />
            <label for="lastName" class="floating-label">성</label>
          </div>
          <div class="form-field relative">
            <input type="text" id="firstName" class="input-field peer" placeholder=" " />
            <label for="firstName" class="floating-label">이름</label>
          </div>
        </div>

        <div class="form-field relative">
          <input type="email" id="email" class="input-field peer" placeholder=" " />
          <label for="email" class="floating-label">이메일</label>
        </div>

        <div class="form-field relative">
          <input type="tel" id="phone" class="input-field peer" placeholder=" " />
          <label for="phone" class="floating-label">전화번호</label>
        </div>

        <div class="form-field relative">
          <input type="password" id="password" class="input-field peer" placeholder=" " />
          <label for="password" class="floating-label">비밀번호</label>
        </div>

        <div class="form-field relative">
          <input type="password" id="confirmPassword" class="input-field peer" placeholder=" " />
          <label for="confirmPassword" class="floating-label">비밀번호 확인</label>
        </div>

        <button class="signup-button">
          회원가입
        </button>

        <div class="goto-login-container">
          <router-link to="/" class="goto-login">로그인하러 가기</router-link>
        </div>
      </div>
    </div>
    <div class="right-bg">
      <img src="../assets/signup_image.svg" class="right-background-img" />
    </div>
  </div>
</template>

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

h2 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  text-align: left;
  font-weight: bold;
}

.name-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.name-field {
  width: calc(50% - 5px); /* gap 고려한 너비 */
}

.input-field,
.signup-button {
  width: 100%; /* 너비를 100%로 설정 */
  box-sizing: border-box; /* padding과 border 포함하여 너비를 맞추기 */
}

.signup-button {
  padding: 10px;
  margin-top: 20px;
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
  height: 40px; /* 버튼 높이를 고정 */
}

.input-field {
  padding: 15px;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  transition: all 0.2s ease-out;
}

.input-field::placeholder {
  color: transparent;
}

.input-field:focus {
  outline: none;
  border-color: #A8C5DA;
  border-width: 2px;
}

.form-field {
  position: relative;
  margin: 15px 0;
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

.input-field:not(:placeholder-shown) ~ .floating-label,
.input-field:focus ~ .floating-label {
  transform: translateY(-180%) scale(0.85);
  color: #A8C5DA;
}

.goto-login-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.goto-login {
  width: 100%;
  padding: 10px;
  background-color: rgba(168, 197, 218, 0.3);
  color: #000000;
  font-size: 0.8rem;
  border-radius: 28.42px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 브라우저 자동완성 배경색 제거 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
