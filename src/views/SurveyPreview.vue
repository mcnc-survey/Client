<template>
    <div class="survey-preview">
      <div class="header">
        <h2>미리보기</h2>
        <div class="header-buttons">
          <button class="close-btn" @click="closeTab">미리보기 종료</button>
        </div>
      </div>
      
      <div v-if="surveyData" class="preview-container">
        <!-- 설문 제목 영역 -->
        <div class="title-section">
          <h1 class="survey-title">{{ surveyData.title }}</h1>
          <p class="survey-description">{{ surveyData.description }}</p>
          <div class="survey-period">
            <div class="period-display">
                {{ 
                    surveyData.startDate && surveyData.endDate ? 
                    `${surveyData.startDate} ${formatDisplayTime(surveyData.startTime)} ~ 
                    ${surveyData.endDate} ${formatDisplayTime(surveyData.endTime)}` : 
                    '시작 날짜 ~ 종료 날짜' 
                }}
            </div>
          </div>
        </div>
  
        <!-- 질문 영역 -->
        <div class="questions-section">
          <div v-for="(question, index) in surveyData.questions" :key="index" class="question-item">
            <div class="question-header">
                <span class="question-number">{{ index + 1 }}. </span>
                <span class="question-title">{{ question.title }}</span>
                <span v-if="question.required" class="required-mark">*</span>
            </div>
  
            <!-- 객관식 질문 -->
            <div v-if="question.type === 'single'" class="options-container">
              <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                <input
                  type="radio"
                  :name="'question-' + index"
                  :id="'option-' + index + '-' + optIndex"
                  :value="option.text"
                >
                <label :for="'option-' + index + '-' + optIndex">{{ option.text }}</label>
              </div>
            </div>
  
            <!-- 체크박스 질문 -->
            <div v-else-if="question.type === 'multiple'" class="options-container">
              <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                <input
                  type="checkbox"
                  :id="'option-' + index + '-' + optIndex"
                  :value="option.text"
                >
                <label :for="'option-' + index + '-' + optIndex">{{ option.text }}</label>
              </div>
            </div>
  
            <!-- 그리드 질문 -->
            <div v-else-if="question.type === 'grid'" class="grid-container">
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th v-for="(column, colIndex) in question.columns" :key="colIndex">
                    {{ column.text }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, rowIndex) in question.rows" :key="rowIndex">
                    <td>{{ row.text }}</td>
                    <td v-for="(column, colIndex) in question.columns" :key="colIndex">
                    <input
                        type="radio"
                        :name="'grid-' + index + '-' + rowIndex"
                        :value="column.text"
                    >
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
  
            <!-- 주관식 짧은 답변 -->
            <div v-else-if="question.type === 'short'" class="text-answer">
                <input
                    type="text"
                    placeholder="답변을 입력하세요 (최대 100자)"
                    class="short-answer-input"
                    maxlength="100"
                    @input="checkInputLength($event, 100)"
                >
            </div>
  
            <!-- 주관식 긴 답변 -->
            <div v-else-if="question.type === 'long'" class="text-answer">
                <textarea
                    placeholder="답변을 입력하세요 (최대 2000자)"
                    class="long-answer-input"
                    maxlength="2000"
                    @input="checkInputLength($event, 2000)"
                ></textarea>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="error-message">
        미리보기 데이터를 찾을 수 없습니다.
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'SurveyPreview',
    setup() {
        const surveyData = ref(null);
  
        onMounted(() => {
            // sessionStorage에서 데이터 가져오기
            const previewData = sessionStorage.getItem('surveyPreviewData');
            if (previewData) {
            surveyData.value = JSON.parse(previewData);
            // 데이터를 사용한 후 삭제
            sessionStorage.removeItem('surveyPreviewData');
            }
        });
  
        const closeTab = () => {
            window.close();
        };
  
        const formatDisplayTime = (time) => {
            if (!time) return "";
            const [hours, minutes] = time.split(":").map(Number);
            const ampm = hours < 12 ? "오전" : "오후";
            const hour = hours % 12 || 12;
            return `${ampm} ${hour}:${minutes.toString().padStart(2, "0")}`;
        };
  
        const checkInputLength = (event, maxLength) => {
            const input = event.target;
            if (input.value.length > maxLength) {
                input.value = input.value.slice(0, maxLength);
            }
        };
  
        return {
            surveyData,
            closeTab,
            formatDisplayTime,
            checkInputLength
        };
    }
  }
  </script>
  
  <style scoped>
  .survey-preview {
    min-height: 100vh;
    background-color: #f7f9fb;
  }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .header h2 {
    font-size: 1.25em;
    font-weight: 700;
    margin: 0;
  }
  
  .header-buttons {
    display: flex;
    gap: 10px;
  }
  
  .close-btn {
    padding: 8px 20px;
    border-radius: 28.42px;
    border: none;
    background: #BFD0E0;
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .preview-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .title-section {
    background: white;
    border-radius: 23.38px;
    padding: 30px;
    margin-bottom: 20px;
  }
  
  .survey-title {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  
  .survey-description {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666;
  }
  
  .survey-period {
    font-size: 14px;
    color: #666;
  }
  
  .period-display {
    padding: 8px 30px;
    background-color: #f7f9fb;
    border-radius: 23.38px;
    width: fit-content;
    color: #000;
    font-family: Pretendard;
    font-weight: bold;
    font-size: 13px;
  }
  
  .question-item {
    background: white;
    border-radius: 23.38px;
    padding: 30px;
    margin-bottom: 15px;
  }
  
  .question-header {
    margin-bottom: 20px;
  }
  
  .question-number {
    font-weight: 600;
  }
  
  .question-title {
    font-weight: 600;
    flex: 1;
  }
  
  .required-mark {
    color: #ff6b6b;
    font-weight: bold;
    margin-left: 4px;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .option-item input[type="radio"],
  .option-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  
  .option-item label {
    cursor: pointer;
  }
  
  .grid-container {
    overflow-x: auto;
    margin-top: 10px;
  }
  
  .grid-container table {
    width: 100%;
    border-collapse: collapse;
    min-width: 400px;
  }
  
  .grid-container th,
  .grid-container td {
    padding: 12px;
    text-align: center;
    border: 1px solid #eee;
  }
  
  .grid-container th:first-child,
  .grid-container td:first-child {
    text-align: left;
    min-width: 150px;
  }
  
  .grid-container input[type="radio"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  
  .text-answer input,
  .text-answer textarea {
    width: 95%;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 8px;
    font-family: Pretendard;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .text-answer input:focus,
  .text-answer textarea:focus {
    border-color: #bfd0e0;
  }
  
  .short-answer-input {
    height: 40px;
  }
  
  .long-answer-input {
    height: 120px;
    resize: vertical;
    min-height: 80px;
    resize: none;
  }
  
  .error-message {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #ff6b6b;
  }
  
  @media (max-width: 768px) {
    .preview-container {
        padding: 10px;
    }
  
    .title-section,
    .question-item {
      padding: 20px;
    }
  
    .survey-title {
      font-size: 20px;
    }
  }
  </style>