<template>
    <div class="reset-container">
        <div class="reset-content">
            <div class="title-area">
                <h1>비밀번호 재설정</h1>
                <p>새로운 비밀번호를 입력해주세요.</p>
            </div>
            
            <div class="form-field">
                <input 
                    :type="showPassword ? 'text' : 'password'"
                    id="password" 
                    class="input-field peer"
                    :class="{ 'invalid': isPasswordInvalid }"
                    v-model="password"
                    @input="validatePassword"
                    placeholder=" "
                    ref="resetPasswordInput"
                />
                <label 
                    for="password" 
                    class="floating-label"
                    :class="{ 'invalid-label': isPasswordInvalid }"
                >비밀번호를 입력해주세요.</label>
                <img 
                    v-if="password"
                    :src="showPassword 
                        ? require('@/assets/images/eye_hide.png')
                        : require('@/assets/images/eye_show.png')"
                    @click="togglePassword"
                    class="eye-icon"
                    :alt="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
                />
            </div>
            
            <div v-if="isPasswordInvalid" class="error-container">
                <p class="error-message">비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상입니다.</p>
            </div>
            
            <div class="form-field">
                <input 
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    id="passwordConfirm" 
                    class="input-field peer"
                    :class="{ 'invalid': isConfirmInvalid }"
                    v-model="passwordConfirm"
                    @input="validatePasswordMatch"
                    placeholder=" "
                    ref="resetConfirmPasswordInput"
                />
                <label 
                    for="passwordConfirm" 
                    class="floating-label"
                    :class="{ 'invalid-label': isConfirmInvalid }"
                >비밀번호를 다시 입력해주세요.</label>
                <img 
                    v-if="passwordConfirm"
                    :src="showPasswordConfirm
                        ? require('@/assets/images/eye_hide.png')
                        : require('@/assets/images/eye_show.png')"
                    @click="togglePasswordConfirm"
                    class="eye-icon"
                    :alt="showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'"
                />
            </div>
  
            <div v-if="isConfirmInvalid" class="error-container">
                <p class="error-message">비밀번호가 일치하지 않습니다.</p>
            </div>
  
            <div class="button-area">
                <button class="next-button" @click="handleResetPassword">완료
                    <img 
                        src="@/assets/images/login_button.svg" 
                        alt="다음" 
                        class="arrow-icon">
                </button>
                <button class="login-button" @click="backToLogin">돌아가서 로그인하기</button>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'FindPwResetPage',
    data() {
        return {
            password: '',
            passwordConfirm: '',
            isPasswordInvalid: false,
            isConfirmInvalid: false,
            showPassword: false,
            showPasswordConfirm: false
        }
    },
    computed: {
        isFormValid() {
            return this.password && this.passwordConfirm && !this.isPasswordInvalid && !this.isConfirmInvalid
        }
    },
    methods: {
        validatePassword() {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
            this.isPasswordInvalid = this.password.length > 0 && !passwordRegex.test(this.password)
            
            if (this.passwordConfirm) {
                this.validatePasswordMatch()
            }
        },
        validatePasswordMatch() {
            this.isConfirmInvalid = this.passwordConfirm.length > 0 && this.password !== this.passwordConfirm
        },
        togglePassword() {
            this.showPassword = !this.showPassword
        },
        togglePasswordConfirm() {
            this.showPasswordConfirm = !this.showPasswordConfirm
        },
        handleResetPassword() {
            // 입력창 2개 다 비어있을 경우
            if(!this.password && !this.passwordConfirm) {
                this.$refs.resetPasswordInput.focus();
                return;
            }

            //비밀번호 입력창만 비어있을 경우
            if(!this.password) {
                this.$refs.resetPasswordInput.focus();
                return;
            }

            //비밀번호 확인 입력창만 비어있을 경우
            if(!this.passwordConfirm) {
                this.$refs.resetConfirmPasswordInput.focus();
                return;
            }

            this.validatePassword();
            this.validatePasswordMatch();

            if(!this.isPasswordInvalid && !this.isConfirmInvalid) {
                this.$router.push("/help/complete");
            }
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

.reset-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
}
  
.reset-content {
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
  
.form-field + .form-field {
    margin-top: 16px;
}
  
.input-field {
    width: 100%;
    padding: 15px;
    padding-top: 20px;
    padding-bottom: 10px;
    padding-right: 45px;
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
  
.login-button {
    width: 100%;
    height: 40px;
    background-color: #ECF1F6;
    color: #000000;
    font-weight: bold;
    border: none;
    border-radius: 28.42px;
    font-size: 0.9rem;
    cursor: pointer;
}

.eye-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    cursor: pointer;
    padding: 2px;
}
  
/* 브라우저 자동완성 배경색 제거 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>