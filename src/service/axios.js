/**  
Author : 한채영
Description : Axios 인스턴스 설정 및 인터셉터 구현
*/

import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://web.mcnc-survey.store',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true 
});

// 토큰 재발급 진행 중인지 확인하는 변수
let isRefreshing = false;
// 토큰 재발급 대기중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 재발급 대기중인 요청들을 처리하는 함수
const onRrefreshed = (token) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// 실패한 요청을 대기열에 추가하는 함수
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
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

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // 토큰 재발급 요청
                    const response = await instance.post('/token/reissue');
                    if (response.data.success) {
                        const newAccessToken = response.data.body.accessToken;
                        localStorage.setItem('accessToken', newAccessToken);
                        
                        // 대기중인 요청들 처리
                        onRrefreshed(newAccessToken);
                        
                        // 현재 실패한 요청 재시도
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // 재발급 진행 중일 때의 새로운 요청들
                return new Promise(resolve => {
                    addRefreshSubscriber(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(instance(originalRequest));
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);

export default instance;