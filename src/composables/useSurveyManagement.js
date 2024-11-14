import { ref, computed } from "vue";
import Swal from "sweetalert2"; // sweetalert2
import surveyData from "@/data/surveyData";

import { toast } from "vue3-toastify"; // toastify
import "vue3-toastify/dist/index.css"; // toastify 스타일 추가

// 우선순위 설정 객체(진행중, 중단됨, 마감됨)
const statusOrder = {
  진행중: 1,
  중단됨: 2,
  마감됨: 3,
};

// 토스트 메시지 옵션 객체
const toastOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 1000,
};

export function useSurveyManagement(router) {
  const surveys = ref(surveyData); // 설문조사 목록

  // 설문조사를 상태 및 최신 수정일 순으로 정렬
  const sortedSurveys = computed(() => {
    return surveys.value.slice().sort((a, b) => {
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison === 0) {
        return new Date(b.modified_at) - new Date(a.modified_at); // 최신순 정렬
      }
      return statusComparison; // 상태 순서에 따른 정렬
    });
  });

  // 상태에 따른 클래스 매핑 함수
  const getStatusClass = (status) => {
    switch (status) {
      case "진행중":
        return "in-progress";
      case "중단됨":
        return "stopped";
      case "마감됨":
        return "completed";
    }
  };

  // 메서드: 설문조사 미리보기
  const previewSurvey = (surveyId) => {
    console.log("Preview survey:", surveyId);
    // TODO: 미리보기 기능 구현
  };

  // 메서드: 설문조사 링크 복사
  const handleLink = (surveyId) => {
    const link = `https://example.com/survey/${surveyId}`; // 임시 링크
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("링크가 복사되었습니다!", toastOptions);
      })
      .catch(() => {
        toast.error("링크 복사에 실패했습니다.", toastOptions);
      });
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
        surveys.value = surveys.value.filter(
          (survey) => survey.id !== surveyId
        );
      }
    });
  };

  // 메서드: 설문조사 생성
  const createSurvey = () => {
    router.push({ name: "SurveyCreate" }).catch((error) => {
      console.error("SurveyCreate 페이지로 이동 실패:", error);
      toast.error("설문조사 생성 페이지로 이동에 실패했습니다.", toastOptions);
    });
  };

  return {
    surveys,
    sortedSurveys,
    getStatusClass,
    previewSurvey,
    handleLink,
    editSurvey,
    deleteSurvey,
    createSurvey,
  };
}
