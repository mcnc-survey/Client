<!-- components/questions/ShortAnswerQuestion.vue -->
<template>
  <div class="question">
    <!-- 질문 제목 -->
    <div class="question-header">
      <div class="question-title-wrapper">
        <textarea
          v-model="questionData.title"
          class="question-title"
          placeholder="질문"
          rows="1"
          @input="adjustHeight"
        ></textarea>
      </div>
      <div class="question-actions">
        <label class="required-toggle">
          <input 
            type="checkbox"
            v-model="questionData.required"
            @change="updateQuestion"
          >
          필수
        </label>
        <button @click="$emit('delete')" class="delete-btn">
          <img src="@/assets/images/short_answer.png" alt="삭제" />
        </button>
      </div>
    </div>

    <!-- 답변 설정 영역 -->
    <div class="answer-settings">
      <!-- 답변 형식 선택 -->
      <div class="format-selector">
        <label class="format-item">
          <input 
            type="radio" 
            v-model="questionData.format" 
            value="text"
            @change="updateQuestion"
          >
          <span>텍스트</span>
        </label>
        <label class="format-item">
          <input 
            type="radio" 
            v-model="questionData.format" 
            value="number"
            @change="updateQuestion"
          >
          <span>숫자</span>
        </label>
        <label class="format-item">
          <input 
            type="radio" 
            v-model="questionData.format" 
            value="date"
            @change="updateQuestion"
          >
          <span>날짜</span>
        </label>
        <label class="format-item">
          <input 
            type="radio" 
            v-model="questionData.format" 
            value="time"
            @change="updateQuestion"
          >
          <span>시간</span>
        </label>
      </div>

      <!-- 형식별 추가 설정 -->
      <div class="format-options" v-if="questionData.format === 'text'">
        <div class="option-group">
          <label>최대 글자 수:</label>
          <input 
            type="number" 
            v-model.number="questionData.maxLength"
            min="1"
            @change="updateQuestion"
          >
        </div>
      </div>

      <div class="format-options" v-if="questionData.format === 'number'">
        <div class="option-group">
          <label>최솟값:</label>
          <input 
            type="number" 
            v-model.number="questionData.minValue"
            @change="updateQuestion"
          >
        </div>
        <div class="option-group">
          <label>최댓값:</label>
          <input 
            type="number" 
            v-model.number="questionData.maxValue"
            @change="updateQuestion"
          >
        </div>
      </div>
    </div>

    <!-- 미리보기 영역 -->
    <div class="answer-preview">
      <div class="preview-label">답변 입력창 미리보기:</div>
      <div class="preview-input" :class="questionData.format">
        <template v-if="questionData.format === 'text'">
          <input type="text" readonly placeholder="단답형 텍스트" />
          <div class="max-length" v-if="questionData.maxLength">
            최대 {{ questionData.maxLength }}자
          </div>
        </template>
        <input 
          v-else-if="questionData.format === 'number'" 
          type="number"
          readonly 
          placeholder="숫자 입력"
        />
        <input 
          v-else-if="questionData.format === 'date'" 
          type="date"
          readonly 
        />
        <input 
          v-else-if="questionData.format === 'time'" 
          type="time"
          readonly 
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShortAnswerQuestion',
  
  props: {
    question: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      questionData: {
        ...this.question,
        format: this.question.format || 'text',
        maxLength: this.question.maxLength || null,
        minValue: this.question.minValue || null,
        maxValue: this.question.maxValue || null
      }
    }
  },

  watch: {
    'questionData.format'(newFormat) {
      if (newFormat === 'text') {
        this.questionData.minValue = null;
        this.questionData.maxValue = null;
      } else if (newFormat === 'number') {
        this.questionData.maxLength = null;
      } else {
        this.questionData.maxLength = null;
        this.questionData.minValue = null;
        this.questionData.maxValue = null;
      }
      this.updateQuestion();
    }
  },

  methods: {
    adjustHeight(e) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    updateQuestion() {
      this.$emit('update', {...this.questionData});
    }
  }
}
</script>

<style scoped>
.question {
  width: 100%;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.question-title-wrapper {
  flex: 1;
  margin-right: 20px;
}

.question-title {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  padding: 0;
  resize: none;
  font-family: Pretendard;
  background: transparent;
}

.question-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.required-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.delete-btn img {
  width: 18px;
  height: 18px;
}

/* 답변 설정 영역 */
.answer-settings {
  margin-top: 20px;
  padding: 15px;
  background-color: #F7F9FB;
  border-radius: 8px;
}

.format-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.format-options {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.option-group input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #BFD0E0;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

/* 미리보기 영역 */
.answer-preview {
  margin-top: 20px;
}

.preview-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.preview-input {
  position: relative;
  max-width: 400px;
}

.preview-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #BFD0E0;
  border-radius: 4px;
  font-size: 14px;
  font-family: Pretendard;
  background-color: #F7F9FB;
  cursor: default;
}

.preview-input.text input {
  padding-right: 80px;
}

.max-length {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #666;
}

/* 입력 필드 비활성화 스타일 */
input[readonly] {
  opacity: 0.7;
  cursor: default;
}

/* 라디오 버튼 커스텀 스타일 */
input[type="radio"] {
  margin: 0;
  vertical-align: middle;
}
</style>