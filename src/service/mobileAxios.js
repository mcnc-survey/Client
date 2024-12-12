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

// 요청 인터셉터
mobileInstance.interceptors.request.use(
  (config) => {
    // 요청 보내기 전 처리
    const token = localStorage.getItem("token");
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

// 응답 인터셉터
mobileInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response && error.response.status === 401) {
      // 인증 에러 처리
    }
    return Promise.reject(error);
  }
);

export default mobileInstance;
