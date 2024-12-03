export const surveyDetail = {
  resultCode: "200",
  message: "OK",
  body: {
    id: "7a762f88-0aa9-48b0-8a12-fc680523cd67",
    title: "고객 만족도 조사",
    description: "고객님들의 서비스 만족도를 조사하기 위한 설문입니다.",
    startAt: "2024-11-26T09:00",
    endAt: "2024-11-30T18:00",
    question: [
      {
        id: "3220c2f8-92f5-40ba-991f-0b07a3c361bc",
        title: "전반적인 서비스 만족도",
        questionType: "SINGLE_CHOICE",
        order: 1,
        required: true, //필수 질문 여부 확인, 필수:true, not 필수:false
        columns: "매우 불만족,불만족,보통,만족,매우 만족",
        etc: false, //'기타'옵션 여부 확인, singlechoice, multiplechoice 외에는 null
        rows: null
      },
      {
        id: "4331d3g9-93g6-41ba-992g-1c18b4d472cd",
        title: "개선이 필요한 점을 자유롭게 작성해주세요.",
        questionType: "SHORT_ANSWER",
        order: 2,
        required: true,
        columns: null,
        etc: null,
        rows: null
      },
      {
        id: "5331d3g9-93g6-42ba-993g-2c18b4d472cd",
        title: "다음 중 추가로 제공되었으면 하는 기능은 무엇인가요?",
        questionType: "MULTIPLE_CHOICE",
        order: 3,
        required: true,
        columns: "더 다양한 옵션 제공, 더 저렴한 가격, 개선된 사용자 인터페이스, 추가적인 고객 지원",
        etc: true,
        rows: null
      },
      {
        id: "6331d3g9-94g6-43ba-993g-3c18b4da42cd",
        title: "서비스와 관련하여 추가로 하고 싶은 말이 있으시면 작성해주세요.",
        questionType: "LONG_ANSWER",
        order: 4,
        required: false,
        columns: null,
        etc: null,
        rows: null
      }
    ]
  }
};