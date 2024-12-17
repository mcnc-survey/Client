<template>
  <div class="survey-completion">
    <h2 class="survey-title">설문조사 생성</h2>
    <div class="survey-container">
      <div class="survey-content">
        <div class="completion-message">
          <p class="completion-title">설문조사 등록이 완료되었습니다!</p>
          <p class="completion-subtitle">참여 링크를 공유하고, 소중한 의견을 모아보세요.</p>
        </div>
        <div class="button-group">
          <button class="btn btn-secondary" @click="goToSurveyList">목록으로 돌아가기</button>
          <button class="btn btn-primary" @click="shareLink">공유하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify"; // toastify
import "vue3-toastify/dist/index.css"; // toastify 스타일 추가

// 토스트 메시지 옵션 객체
const toastOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 1000,
};

export default {
  name: "SurveyCompletion",

  setup() {
    const router = useRouter();

    const goToSurveyList = () => {
      router.push({ name: "SurveyManagement" }).catch((error) => {
        console.error("SurveyManagement 페이지로 이동 실패:", error);
      });
    };

    const shareLink = () => {
      // 공유 링크를 복사하는 로직
      const link = "https://example.com/survey-link"; // 실제 링크로 변경
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("링크가 복사되었습니다!", toastOptions);
        })
        .catch(() => {
          toast.error("링크 복사에 실패했습니다.", toastOptions);
        });
    };

    return {
      goToSurveyList,
      shareLink,
    };
  },
};
</script>

<style>
.survey-completion {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}

.survey-title {
  font-size: 1.25rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.survey-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 550px;
  width: 100%;
  background-color: #f7f9fb;
  border-radius: 24px;
}

.survey-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  border-radius: 24px;
  width: 80%;
  height: 80%;
}

.completion-message {
  text-align: center;
}

.completion-title {
  margin: 30px 0 0 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.completion-subtitle {
  margin: 13px 0 0;
  font-size: 1.25rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.btn {
  font-family: Pretendard;
  font-weight: bold;
  width: 200px;
  height: 45px;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  color: #000;
}

.btn-primary,
.btn-secondary {
  margin-top: 30px;
}

.btn-secondary {
  background-color: #efefef;
}

.btn-primary {
  background-color: #bfd0e0;
}
</style>