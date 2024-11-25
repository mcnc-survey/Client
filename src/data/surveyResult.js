export default {
  resultCode: "200",
  message: "OK",
  body: {
    surveySummary: {
      respondentCount: 200, // 총 응답자 수
      endDate: "2024-11-26T23:59:59", // 설문 마감 날짜
      lastModifiedDate: "2024-11-25", // 최근 수정일
    },
    surveyResults: {
      1: {
        questionTitle: "1. 이 제품을 추천하시겠습니까?",
        responseType: "single", // 단일 선택
        options: [
          { id: 1, text: "네", count: 60 },
          { id: 2, text: "아니요", count: 40 },
        ],
      },
      2: {
        questionTitle: "2. 제품의 품질은 어떻습니까?",
        responseType: "multiple", // 다중 선택
        options: [
          { id: 1, text: "매우 만족합니다.", count: 30 },
          { id: 2, text: "만족합니다.", count: 20 },
          { id: 3, text: "보통입니다.", count: 35 },
          { id: 4, text: "불만족합니다.", count: 10 },
          { id: 5, text: "매우 불만족합니다.", count: 10 },
        ],
      },
      3: {
        questionTitle: "3. 제품 개선을 위한 의견을 자유롭게 작성해주세요.",
        responseType: "open", // 주관식
        responses: [
          "배송이 너무 늦어요",
          "품질이 좋았습니다",
          "가격이 조금 비싼 것 같아요",
          "디자인이 마음에 듭니다",
        ],
      },
    },
  },
};
