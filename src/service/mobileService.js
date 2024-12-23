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
  submitSurvey(data) {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.post(`responses`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4ZGI5N2Y1OC0zZTIwLTRkMjUtODdlZS02OGE2ZjI5NzEyOTIiLCJzdXJ2ZXlJZCI6ImhlbGxvIiwibmFtZSI6IuyImO2YuOuwsCIsImVtYWlsIjoicW90bmdoNjg1OUBnbWFpbC5jb20iLCJpYXQiOjE3MzQ5MTk2MTcsImV4cCI6MTczNDkxOTYxOH0.Umk3JLUL6p5U0EvUjDxyNzVtgQjK-ISp57ul4w8fCHXYVrQrDJBZhBvMSFtPv11RfLqR9-pJoT1iOHPGKIwL-w`, // Authorization 헤더 직접 추가
      },
    });
  },
  getSurvey() {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.get(`responses`, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4ZGI5N2Y1OC0zZTIwLTRkMjUtODdlZS02OGE2ZjI5NzEyOTIiLCJzdXJ2ZXlJZCI6ImhlbGxvIiwibmFtZSI6IuyImO2YuOuwsCIsImVtYWlsIjoicW90bmdoNjg1OUBnbWFpbC5jb20iLCJpYXQiOjE3MzQ5MTk2MTcsImV4cCI6MTczNDkxOTYxOH0.Umk3JLUL6p5U0EvUjDxyNzVtgQjK-ISp57ul4w8fCHXYVrQrDJBZhBvMSFtPv11RfLqR9-pJoT1iOHPGKIwL-w`, // Authorization 헤더 직접 추가
      },
    });
  },
  editAnswer(data) {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.put(`responses`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4ZGI5N2Y1OC0zZTIwLTRkMjUtODdlZS02OGE2ZjI5NzEyOTIiLCJzdXJ2ZXlJZCI6ImhlbGxvIiwibmFtZSI6IuyImO2YuOuwsCIsImVtYWlsIjoicW90bmdoNjg1OUBnbWFpbC5jb20iLCJpYXQiOjE3MzQ5MTk2MTcsImV4cCI6MTczNDkxOTYxOH0.Umk3JLUL6p5U0EvUjDxyNzVtgQjK-ISp57ul4w8fCHXYVrQrDJBZhBvMSFtPv11RfLqR9-pJoT1iOHPGKIwL-w`, // Authorization 헤더 직접 추가
      },
    });
  },
};
