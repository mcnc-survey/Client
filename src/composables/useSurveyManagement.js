import { ref, computed } from "vue";
import Swal from "sweetalert2";
import surveyData from "@/data/surveyData";

const statusOrder = {
  진행중: 1,
  중단됨: 2,
  마감됨: 3,
};

export function useSurveyManagement(router) {
  const surveys = ref(surveyData);

  // 컴퓨티드 속성: 설문조사를 상태 및 최신 수정일 순으로 정렬
  const sortedSurveys = computed(() => {
    return surveys.value.slice().sort((a, b) => {
      const statusComparison =
        statusOrder[a.statusText] - statusOrder[b.statusText];
      if (statusComparison === 0) {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated); // 최신순 정렬
      }
      return statusComparison; // 상태 순서에 따른 정렬
    });
  });

  const goToSurveyStats = (surveyId) => {
    router.push({ name: "SurveyStats", params: { id: surveyId } });
  };

  // 메서드: 설문조사 미리보기
  const handlePreview = (surveyId) => {
    console.log("Preview survey:", surveyId);
  };

  // 메서드: 설문조사 링크 복사
  const handleLink = (surveyId) => {
    console.log("Copy link for survey:", surveyId);
  };

  // 메서드: 설문조사 편집
  const editSurvey = (surveyId) => {
    console.log("Edit survey:", surveyId);
    router.push({ name: "SurveyEdit", params: { id: surveyId } });
  };

  // 메서드: 설문조사 삭제
  const deleteSurvey = (surveyId) => {
    Swal.fire({
      html: `
        <div class="custom-alert-content">
          <p>설문을 삭제하면 모든 응답 데이터도 함께 삭제됩니다.</p>
          <p>계속하시겠습니까?</p>
          <small>* 삭제된 항목은 휴지통에 저장됩니다.</small>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      customClass: {
        popup: "custom-swal-popup",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleted survey:", surveyId);
        surveys.value = surveys.value.filter(
          (survey) => survey.id !== surveyId
        );
      }
    });
  };

  // 메서드: 설문조사 생성
  const createSurvey = () => {
    console.log("Create survey");
    router.push({ name: "SurveyCreate" });
  };

  return {
    surveys,
    sortedSurveys,
    goToSurveyStats,
    handlePreview,
    handleLink,
    editSurvey,
    deleteSurvey,
    createSurvey,
  };
}
