<template>
  <div class="mobile-survey-container">
    <p class="instruction">참여자 확인을 위해 아래 정보를 입력해주세요.</p>

    <!-- 이메일 -->
    <div class="input-group" @click="focusInput('email')">
      <label class="label">이메일</label>
      <input
        ref="email"
        type="email"
        class="input-field"
        placeholder="example@gmail.com"
        v-model="email"
      />
    </div>
    <button class="verification-button" @click.stop="requestVerificationCode">
      인증하기
    </button>

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
import { API } from "../service/mobileService";
export default {
  data() {
    return {
      email: "",
      name: "",
      phone: "",
      verificationCode: "",
      token: this.$route.query.t || "",
      accessToken: this.$route.query.token || "",
    };
  },
  beforeMount() {
    if (this.accessToken) {
      localStorage.setItem("accessToken", `${this.accessToken}`);
      this.$router.push("/mobile/survey");
    }
  },
  methods: {
    focusInput(field) {
      this.$refs[field].focus();
    },

    //-----------------------------------------------

    requestVerificationCode() {
      if (!this.email) {
        Swal.fire({
          icon: "error",
          title: "이메일을 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      // 인증 코드 요청 API 호출
      API.sendVerificationCode({ email: this.email })
        .then(() => {
          Swal.fire({
            title: "인증번호를 입력해주세요",
            html: `
         <div class="verification-inputs">
           <input type="text" maxlength="1" class="verification-input" data-index="0">
           <input type="text" maxlength="1" class="verification-input" data-index="1">
           <input type="text" maxlength="1" class="verification-input" data-index="2">
           <input type="text" maxlength="1" class="verification-input" data-index="3">
           <input type="text" maxlength="1" class="verification-input" data-index="4">
           <input type="text" maxlength="1" class="verification-input" data-index="5">
         </div>
         <style>
           .swal2-popup {
             padding-top: 2.5em !important;
           }
           .verification-inputs {
             display: flex;
             justify-content: center;
             gap: 8px;
             margin: 20px 0;
           }
           .verification-input {
             width: 40px;
             height: 48px;
             text-align: center;
             font-size: 20px;
             font-weight: bold;
             border: 2px solid #ddd;
             border-radius: 8px;
             outline: none;
           }
           .verification-input:focus {
             border-color: #4A90E2;
           }
           .swal2-title {
             font-size: 16px !important;
             font-weight: 500 !important;
             color: #333 !important;
             margin-top: 20px !important;
           }
           .swal2-actions {
             gap: 16px !important;
           }
           .swal2-confirm {
             background-color: #dae8f4 !important;
             color: #1c1d22 !important;
             font-size: 16px !important;
             font-weight: 700 !important;
             border-radius: 24px !important;
             padding: 12px 32px !important;
             border: none !important;
             box-shadow: none !important;
           }
           .swal2-cancel {
             background-color: #f5f5f5 !important;
             color: #666 !important;
             font-size: 16px !important;
             font-weight: 700 !important;
             border-radius: 24px !important;
             padding: 12px 32px !important;
             border: none !important;
             box-shadow: none !important;
           }
           .swal2-confirm:focus,
           .swal2-cancel:focus {
             box-shadow: none !important;
           }
         </style>
       `,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소",
            didOpen: () => {
              const inputs = document.querySelectorAll(".verification-input");
              inputs[0].focus();

              // 입력 처리
              inputs.forEach((input) => {
                input.addEventListener("input", function (e) {
                  const value = e.target.value;
                  const index = parseInt(this.getAttribute("data-index"));

                  // 영문자와 숫자만 허용
                  if (!/^[A-Za-z0-9]$/.test(value)) {
                    this.value = "";
                    return;
                  }

                  // 대문자로 변환
                  this.value = value.toUpperCase();

                  // 다음 입력창으로 포커스 이동
                  if (value && index < 5) {
                    inputs[index + 1].focus();
                  }
                });

                // 백스페이스 처리
                input.addEventListener("keydown", function (e) {
                  const index = parseInt(this.getAttribute("data-index"));
                  if (e.key === "Backspace" && !this.value && index > 0) {
                    inputs[index - 1].focus();
                  }
                });

                // 붙여넣기 처리
                input.addEventListener("paste", function (e) {
                  e.preventDefault();
                  const paste = (
                    e.clipboardData || window.clipboardData
                  ).getData("text");
                  const filtered = paste
                    .replace(/[^A-Za-z0-9]/g, "")
                    .slice(0, 6)
                    .toUpperCase();

                  if (filtered) {
                    // 각 문자를 input에 분배
                    filtered.split("").forEach((char, i) => {
                      if (i < inputs.length) {
                        inputs[i].value = char;
                      }
                    });

                    // 마지막으로 입력된 칸 다음으로 포커스 이동
                    const lastIndex = Math.min(
                      filtered.length,
                      inputs.length - 1
                    );
                    inputs[lastIndex].focus();
                  }
                });
              });
            },
            preConfirm: () => {
              const inputs = document.querySelectorAll(".verification-input");
              const code = Array.from(inputs)
                .map((input) => input.value.toLowerCase())
                .join("");

              if (code.length !== 6) {
                Swal.showValidationMessage(
                  "인증번호 6자리를 모두 입력해주세요."
                );
                return false;
              }

              return code;
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.verificationCode = result.value;
              this.verifyVerificationCode();
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "인증 코드 요청 실패",
            text: error.response?.data?.message || "다시 시도해주세요.",
            confirmButtonText: "확인",
          });
        });
    },
    //-------------------------------------------
    verifyVerificationCode() {
      if (!this.verificationCode) {
        Swal.fire({
          icon: "error",
          title: "인증번호를 입력해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      // 이메일 인증 코드 검증 API 호출
      API.checkVerificationCode({
        email: this.email,
        code: this.verificationCode,
      })
        .then((response) => {
          if (response.data.body.isValid) {
            // 인증 성공
            Swal.fire("인증 성공", "인증번호가 확인되었습니다.", "success");
          } else {
            // 인증 실패
            Swal.fire({
              icon: "error",
              title: "인증 실패",
              text: "인증번호가 일치하지 않습니다.",
              confirmButtonText: "확인",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "오류 발생",
            text:
              error.response?.data?.message ||
              "인증 과정에서 문제가 발생했습니다.",
            confirmButtonText: "확인",
          });
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

      const requestData = {
        name: this.name,
        email: this.email,
        phoneNumber: this.phone,
      };

      API.submitParticipantInfo(requestData, this.token)
        .then((response) => {
          if (response.data.success) {
            // 로그인 성공 시 토큰을 localStorage에 저장
            localStorage.setItem("surveyId", this.token);

            Swal.fire({
              icon: "success",
              title: "로그인 성공",
              text: "설문 페이지로 이동합니다.",
              confirmButtonText: "확인",
            }).then(() => {
              this.$router.push("/mobile/survey");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "로그인 실패",
              text: response.data.message || "다시 시도해주세요.",
              confirmButtonText: "확인",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "오류 발생",
            text:
              error.response?.data?.message || "서버와 통신에 실패했습니다.",
            confirmButtonText: "확인",
          });
        });
    },
    handleSocialLogin(platform) {
      const baseUrl = "https://mobile.mcnc-survey.store/oauth2/authorization";

      switch (platform) {
        case "kakao":
          window.location.href = `${baseUrl}/kakao?surveyId=${this.token}`;
          break;
        case "google":
          window.location.href = `${baseUrl}/google?surveyId=${this.token}`;
          break;
        case "naver":
          window.location.href = `${baseUrl}/naver?surveyId=${this.token}`;
          break;
        default:
          alert("지원하지 않는 플랫폼입니다.");
      }
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
}

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
  border-style: none;
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
  width: 157px;
  height: 45px;
  margin-bottom: 20px;
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
