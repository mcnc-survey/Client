<template>
    <div class="complete-container">
        <div class="complete-content">
            <div class="title-area">
                <h1>비밀번호 변경이 완료되었습니다.</h1>
                <p>이제부터 새로운 비밀번호로 로그인하실 수 있습니다.</p>
            </div>
        
            <div class="button-area">
                <button class="login-button" @click="backToLogin">로그인
                    <img 
                        src="@/assets/images/login_button.svg" 
                        alt="다음" 
                        class="arrow-icon">
                </button>
            </div>
        </div>
    </div>
</template>
  
<script>
  export default {
    name: 'FindPwCompletePage',
    data() {
      return {
        password: '',
        passwordConfirm: '',
        isPasswordInvalid: false,
        isConfirmInvalid: false
      }
    },
    computed: {
      isFormValid() {
        return this.password && this.passwordConfirm && !this.isPasswordInvalid && !this.isConfirmInvalid
      }
    },
    methods: {
      validatePassword() {
        // 비밀번호 유효성 검사: 8자 이상, 영문, 숫자, 특수문자 포함
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        this.isPasswordInvalid = this.password.length > 0 && !passwordRegex.test(this.password)
        
        // 비밀번호 확인 필드가 비어있지 않은 경우 일치 여부 검사
        if (this.passwordConfirm) {
          this.validatePasswordMatch()
        }
      },
      validatePasswordMatch() {
        this.isConfirmInvalid = this.passwordConfirm.length > 0 && this.password !== this.passwordConfirm
      },
      backToLogin() {
        this.$router.push("/");
      }
    }
  }
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
  
html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}

.complete-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
}
  
.complete-content {
    width: 100%;
    max-width: 400px;
    padding: 0 20px;
}
  
.title-area {
    margin-bottom: 30px;
    text-align: center;
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
  
.button-area {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.login-button {
    width: 35%;
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
}
  
.arrow-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    transform: translateY(2px);
}
</style>