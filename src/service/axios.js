import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://web.mcnc-survey.store',  // 기본 서버 주소
    timeout: 15000,  // 타임아웃 설정
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true 
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        // 요청 보내기 전 처리
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => {
        if (response.data?.body?.accessToken) {
            localStorage.setItem('accessToken', response.data.body.accessToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // accessToken이 만료된 경우 (401 에러)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 현재 가지고 있는 만료된 accessToken과 함께 재발급 요청
                const response = await instance.post('/token/reissue');
                if (response.data.success) {
                    // 새로운 accessToken 저장
                    const newAccessToken = response.data.body.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    
                    // 실패했던 원래 요청의 헤더에 새로운 accessToken 설정
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    // 원래 요청 재시도
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                // refreshToken도 만료되었거나 재발급 실패
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;