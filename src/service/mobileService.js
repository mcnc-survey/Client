// Author : 배수호
// Description : API 요청 함수 정의
// - submitParticipantInfo : 설문 참여자 정보 제출 API
//   - 로컬 스토리지에서 accessToken 가져오기
//   - 설문 ID를 쿼리 파라미터로 포함
//   - Authorization 헤더 추가
//
// - sendVerificationCode : 이메일 인증 코드 전송 API
//   - 입력 데이터 기반으로 인증 코드 요청
//
// - checkVerificationCode : 이메일 인증 코드 확인 API
//   - 입력 데이터 기반으로 인증 코드 검증 요청
//
// - submitSurvey : 설문 응답 제출 API
//   - 로컬 스토리지에서 accessToken 가져오기
//   - Authorization 헤더 추가
//
// - getSurvey : 설문 응답 조회 API
//   - 로컬 스토리지에서 accessToken 가져오기
//   - Authorization 헤더 추가
//
// - editAnswer : 설문 응답 수정 API
//   - 로컬 스토리지에서 accessToken 가져오기
//   - Authorization 헤더 추가

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
  sendVerificationCode(data) {
    return axios.post(`auth/email-verify`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
      },
    });
  },
  checkVerificationCode(data) {
    return axios.post(`auth/email-verify/check`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
      },
    });
  },
  submitSurvey(data) {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.post(`responses`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getSurvey() {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.get(`responses`, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer ${token}`,
      },
    });
  },
  editAnswer(data) {
    // 로컬 스토리지에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    return axios.put(`responses`, data, {
      headers: {
        ...axios.defaults.headers.common, // 기존 공통 헤더 병합
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
