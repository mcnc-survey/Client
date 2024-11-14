import { useRouter } from "vue-router";

export function useSurveyCompletion() {
  const router = useRouter();

  const goToSurveyList = () => {
    // 설문조사 목록 페이지로 이동
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
        alert("링크가 복사되었습니다!");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다.");
      });
  };

  return {
    goToSurveyList,
    shareLink,
  };
}
