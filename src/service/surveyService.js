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
  bookmarkSurvey: (surveyId) => axios.get(`/surveys/survey-id/${surveyId}/like`),

  // 즐겨찾기 목록 조회
  getBookmarkSurveys: () => axios.get("/surveys/like"),

  // 삭제된 설문 목록 조회
  getDeletedSurveys: () => axios.get(`/surveys/delete`),

  // 설문 응답자 데이터 조회
  getSurveyStats: (surveyId) => axios.get(`/responses-aggregation/${surveyId}`),

  // 캘린더 설문 조회
  getCalendarSurvey: () => axios.get("/surveys/calendar"),

  // 설문 초대
  inviteSurvey: (surveyId, emails) => axios.post(`/surveys/survey-id/${surveyId}/invite`, { emails }),
};

export const authAPI = {
  
  // 관리자 회원가입
  doSignUp: (data) => axios.post("/auth/sign-up", data),

  // 관리자 로그인
  doLogin: (data) => axios.post("/auth/sign-in", data),

  // 관리자 로그아웃
  doLogout: () => axios.delete("/auth/sign-out"),

  // 관리자 비밀번호 찾기 
  requestPasswordChange: (email) => axios.get("/auth/password-change", { params: { email } }),

  // 관리자 비밀번호 변경
  changePassword: (data) => axios.post("/auth/password-change", data),

  //이메일 인증 요청
  sendVerificationEmail: (data) => axios.post("/auth/email-verify", data),

  //이메일 인증 코드 검증
  verifyEmailCode: (data) => axios.post("/auth/email-verify/check", data)
};

export const notificationAPI = {

  // 모든 알림 조회
  getNotifications: () => axios.get("/notifications"),
  
  // 알림 읽기
  readNotification: (notificationId) => axios.patch(`/notifications/read/${notificationId}`),

  // 알림 클릭 시 설문 존재 여부 확인
  checkNotification: (surveyId) => axios.get(`/surveys/survey-id/${surveyId}/check`),
  
  // 알림 삭제
  deleteNotification: (notificationId) => axios.delete(`/notifications/delete/${notificationId}`),
};