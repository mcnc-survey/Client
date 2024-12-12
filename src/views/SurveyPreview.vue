<template>
  <div class="survey-preview">
    <div class="header">
      <h2>설문 미리보기</h2>
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
      <div class="required-notice">* 필수 질문</div>

      <!-- 질문 영역 -->
      <div class="questions-section">
        <div v-for="(question, index) in surveyData.questions" :key="index" class="question-item">
          <div class="question-header">
              <span v-if="question.required" class="required-mark">*</span>
              <span class="question-number">{{ index + 1 }}. </span>
              <span class="question-title">{{ question.title }}</span>
          </div>

          <!-- 객관식 질문 -->
          <div v-if="question.type === 'single'" class="options-container">
            <div v-for="(option, optIndex) in question.options" :key="optIndex">
              <div class="option-item">
                <input
                  type="radio"
                  :name="'question-' + index"
                  :id="'option-' + index + '-' + optIndex"
                  :value="option.text"
                  @change="handleSingleChoice(index, optIndex)"
                >
                <label :for="'option-' + index + '-' + optIndex">{{ option.text }}</label>
              </div>
              <div v-if="option.isOther && selectedOptions[index] === optIndex" class="other-input-container">
                <div class="input-wrapper">
                  <textarea
                    placeholder="기타 내용을 입력해주세요"
                    class="other-input"
                    rows="1"
                    @input="adjustHeight"
                  ></textarea>
                  <div class="underline"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 체크박스 질문 -->
          <div v-else-if="question.type === 'multiple'" class="options-container">
            <div v-for="(option, optIndex) in question.options" :key="optIndex">
              <div class="option-item">
                <input
                  type="checkbox"
                  :id="'option-' + index + '-' + optIndex"
                  :value="option.text"
                  @change="handleMultipleChoice(index, optIndex)"
                >
                <label :for="'option-' + index + '-' + optIndex">{{ option.text }}</label>
              </div>
              <div v-if="option.isOther && selectedOptions[index]?.includes(optIndex)" class="other-input-container">
                <div class="input-wrapper">
                  <textarea
                    placeholder="기타 내용을 입력해주세요"
                    class="other-input"
                    rows="1"
                    @input="adjustHeight"
                  ></textarea>
                  <div class="underline"></div>
                </div>
              </div>
            </div>
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
      const selectedOptions = ref([]);

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

      const adjustHeight = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
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

      // 객관식 질문에서 기타 옵션이 선택되었을 때 처리
      const handleSingleChoice = (questionIndex, optionIndex) => {
        selectedOptions.value[questionIndex] = optionIndex;
      };

      // 체크박스 질문에서 기타 옵션이 선택되었을 때 처리
      const handleMultipleChoice = (questionIndex, optionIndex) => {
        // 선택된 옵션들
        const options = selectedOptions.value[questionIndex] || [];

        if (options.includes(optionIndex)) {
          // 선택된 옵션 해제
          selectedOptions.value[questionIndex] = options.filter(index => index !== optionIndex);
        } else {
          // 새로운 옵션 추가
          options.push(optionIndex);
          selectedOptions.value[questionIndex] = options;
        }
      };

      return {
          surveyData,
          selectedOptions,
          closeTab,
          formatDisplayTime,
          checkInputLength,
          adjustHeight,
          handleSingleChoice,
          handleMultipleChoice
      };
  }
}
</script>

<style scoped>
.survey-preview {
  min-height: 100vh;
  background-color: #f7f9fb;
  height: 100%;
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
  height: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

/* Chrome, Safari, Opera를 위한 스크롤바 숨기기 */
.preview-container::-webkit-scrollbar {
  display: none;
}

.title-section {
  background: white;
  border-radius: 23.38px;
  padding: 30px;
  margin-bottom: 10px;
}

.survey-title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 15px;
  white-space: pre-line;
}

.survey-description {
  font-size: 16px;
  margin-bottom: 20px;
  color: #666;
  white-space: pre-line;
}

.survey-period {
  font-size: 14px;
  color: #666;
}

.required-notice {
  text-align: right;
  color: #ff6b6b;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-right: 10px;
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
  white-space: pre-line;
}

.required-mark {
  color: #ff6b6b;
  font-weight: bold;
  margin-right: 4px;
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
  accent-color: steelblue;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.option-item label {
  cursor: pointer;
}

.other-input-container {
  margin-top: 8px;
  margin-left: 24px;
  width: calc(100% - 24px);
}

.other-input-container .input-wrapper {
  position: relative;
  width: 100%;
}

.other-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: Pretendard;
  font-size: 14px;
  resize: none;
  overflow: hidden;
}

.other-input-container .underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #eee;
  transition: background 0.2s ease;
}

.other-input:focus + .underline {
  background: #bfd0e0;
}

.input-wrapper:hover .underline {
  background: rgba(191, 208, 224, 0.4);
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