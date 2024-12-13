import axios from "./mobileAxios";

export const API = {
  submitParticipantInfo(data, surveyId) {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.post(`auth/sign?t=${surveyId}`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer ${token}`, // Authorization 헤더 직접 추가
      },
    });
  },
};
