<template>
    <div class="verify-container">
        <div class="verify-content">
            <div class="title-area">
                <h1>이메일이 발송되었습니다.</h1>
                <p>비밀번호 재설정을 위한 이메일을 확인해주세요.</p>
            </div>
        
            <div class="button-area">
                <button class="next-button" @click="sendAgain">다시 보내기</button>
                <button class="login-button" @click="backToLogin">돌아가서 로그인하기</button>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'FindPwVerifyPage',
    data() {
      return {
        email: '',
        isInvalid: false
      }
    },
    methods: {
      backToLogin() {
        this.$router.push("/");
      },
      sendAgain() {
        // api 연동할 때 다른 로직 들어가야함
        this.$router.push("/help/reset");
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