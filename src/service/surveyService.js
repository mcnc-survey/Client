import axios from "./axios";

export const surveyAPI = {
  
  // 설문 생성
  createSurvey: (data) => axios.post("/surveys", data),

  // 설문 상세 조회 (수정)
  getSurveyForEdit: (surveyId) => axios.get(`/surveys/survey-id/${surveyId}/edit`),

  // 설문 수정
  updateSurvey: (surveyId, data) => axios.put(`/surveys/survey-id/${surveyId}`, data),

  // 설문 미리보기 
  getSurveyDetail: (surveyId) => axios.get(`/surveys/survey-id/${surveyId}`),

  // 설문 목록 조회
  getSurveys: () => axios.get(`/surveys`),

  // 설문 삭제 (논리적)
  softDeleteSurvey: (surveyId) => axios.delete(`/surveys/survey-id/${surveyId}`),

  // 설문 복구
  restoreSurvey: (data) => axios.post("/surveys/restore", data),

  // 설문 삭제 (물리적)
  hardDeleteSurvey: (data) => axios.delete("/surveys", { data }),

  // 설문 북마크
  bookmarkSurvey: (surveyId) =>
    axios.get(`/surveys/survey-id/${surveyId}/like`),

  // 즐겨찾기 목록 조회
  getBookmarkSurveys: () => axios.get("/surveys/like"),

  // 삭제된 설문 목록 조회
  getDeletedSurveys: () => axios.get(`/surveys/delete`),

  // 설문 응답자 데이터 조회
  getSurveyStats: (surveyId) => axios.get(`/responses-aggregation/${surveyId}`),
};
