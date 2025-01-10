// Author : 배수호
// Description : 모바일 전용 axios 인스턴스 생성 및 인터셉터 설정
// - 모바일 서버 주소 설정, 타임아웃 설정, 인증 토큰 관리
// - 요청 인터셉터: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
// - 응답 인터셉터: 응답 데이터에서 토큰 저장, 인증 에러 처리

import axios from "axios";

// 모바일 전용 axios 인스턴스 생성
const mobileInstance = axios.create({
  baseURL: "https://mobile.mcnc-survey.store", // 모바일 서버 주소
  timeout: 15000, // 타임아웃 설정
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  withCredentials: true, // 이 옵션 추가
});

// 응답 인터셉터
mobileInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    if (response.data && response.data.body && response.data.body.accessToken) {
      const accessToken = response.data.body.accessToken;
      // accessToken을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
    }
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response && error.response.status === 401) {
      // 인증 에러 처리
      console.error("Unauthorized access. Please log in again.");
    }
    return Promise.reject(error);
  }
);

// 요청 인터셉터
mobileInstance.interceptors.request.use(
  (config) => {
    // 요청 보내기 전 처리
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

export default mobileInstance;
