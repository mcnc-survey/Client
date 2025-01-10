<!-- 
  Author : 한채영
  Description : 비밀번호 찾기 - 이메일 인증 안내 페이지 
  - 이메일 재전송 기능
-->

<template>
    <div class="verify-container">
        <div class="verify-content">
            <div class="title-area">
                <h1>이메일이 발송되었습니다.</h1>
                <p>비밀번호 재설정을 위한 이메일을 확인해주세요.</p>
            </div>
        
            <div class="button-area">
                <button 
                    class="next-button" 
                    @click="sendAgain"
                    :disabled="isLoading"
                >
                {{ isLoading ? '재전송중...' : '재전송하기' }}
                </button>
                <button class="login-button" @click="backToLogin">돌아가서 로그인하기</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { showErrorAlert, showSuccessAlert } from '@/utils/swalUtils';
import { authAPI } from '@/service/surveyService';

export default {
    name: 'FindPwVerifyPage',
    data() {
        return {
            email: null,
            isLoading: false
        }
    },
    created() {
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            this.$router.push('/help/identify');
            return;
        }
        this.email = email;
    },
    methods: {
        async sendAgain() {
            if(this.isLoading) return;

            const email = sessionStorage.getItem('resetEmail');
            if (!email) {
                showErrorAlert("오류 발생", "이메일 정보가 없습니다. 다시 시도해주세요.");
                this.$router.push('/help/identify');
                return;
            }

            try {
                this.isLoading = true;
                const response = await authAPI.requestPasswordChange(email);
                
                if (response.data.success) {
                    showSuccessAlert("이메일 전송 완료", "이메일이 재전송되었습니다.");
                } else {
                    showErrorAlert("이메일 전송 실패", response.data.body || "이메일 전송에 실패했습니다.");
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    showErrorAlert("이메일 전송 실패", "가입되지 않은 이메일입니다.");
                } else {
                    showErrorAlert("오류 발생", "서비스 접속에 실패했습니다. 잠시 후 다시 시도해주세요.");
                }
                console.error('Password change request failed:', error);
            } finally {
                this.isLoading = false;
            }
        },
        backToLogin() {
            sessionStorage.removeItem('resetEmail');
            this.$router.push("/");
        },
    }
}
</script>
  
<style scoped>
.verify-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
}
  
.verify-content {
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
  
.button-area {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 60px;
}
  
.next-button {
    width: fit-content;  /* 또는 width: auto */
    min-width: 120px;    /* 최소 너비 설정 (너무 좁아지지 않도록) */
    padding: 0 20px;     /* 좌우 여백 추가 */
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
    transition: opacity 0.3s;
}

.next-button:disabled {
    opacity: 0.7;
    cursor: default;
}

.login-button {
    width: 90%;
    height: 40px;
    background-color: #ECF1F6;
    color: #000000;
    font-weight: bold;
    border: none;
    border-radius: 28.42px;
    font-size: 0.9rem;
    cursor: pointer;
}
</style>  