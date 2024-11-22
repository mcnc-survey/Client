<!-- components/questions/LongAnswerQuestion.vue -->
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
          <img src="@/assets/images/descriptive_answer.png" alt="삭제" />
        </button>
      </div>
    </div>

    <!-- 답변 설정 영역 -->
    <div class="answer-settings">
      <!-- 글자 수 제한 설정 -->
      <div class="limit-settings">
        <label class="limit-toggle">
          <input 
            type="checkbox"
            v-model="questionData.hasLimit"
            @change="updateQuestion"
          >
          글자 수 제한
        </label>
        
        <div class="limit-inputs" v-if="questionData.hasLimit">
          <div class="option-group">
            <label>최소 글자 수:</label>
            <input 
              type="number" 
              v-model.number="questionData.minLength"
              min="0"
              :max="questionData.maxLength"
              @change="updateQuestion"
            >
          </div>
          <div class="option-group">
            <label>최대 글자 수:</label>
            <input 
              type="number" 
              v-model.number="questionData.maxLength"
              :min="questionData.minLength"
              @change="updateQuestion"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 미리보기 영역 -->
    <div class="answer-preview">
      <div class="preview-label">답변 입력창 미리보기:</div>
      <div class="preview-input">
        <textarea 
          readonly 
          placeholder="장문형 텍스트를 입력하세요."
          rows="4"
        ></textarea>
        <div class="length-counter" v-if="questionData.hasLimit">
          <span>0</span>
          <template v-if="questionData.minLength && questionData.maxLength">
            / {{ questionData.minLength }}-{{ questionData.maxLength }}
          </template>
          <template v-else-if="questionData.maxLength">
            / {{ questionData.maxLength }}
          </template>
          <span>자</span>
        </div>
        <div class="length-guide" v-if="questionData.hasLimit">
          <template v-if="questionData.minLength && questionData.maxLength">
            {{ questionData.minLength }}자 이상 {{ questionData.maxLength }}자 이하로 입력해주세요.
          </template>
          <template v-else-if="questionData.maxLength">
            {{ questionData.maxLength }}자 이하로 입력해주세요.
          </template>
          <template v-else-if="questionData.minLength">
            {{ questionData.minLength }}자 이상 입력해주세요.
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LongAnswerQuestion',
  
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
        hasLimit: this.question.hasLimit || false,
        minLength: this.question.minLength || null,
        maxLength: this.question.maxLength || null
      }
    }
  },

  watch: {
    'questionData.hasLimit'(newValue) {
      if (!newValue) {
        this.questionData.minLength = null;
        this.questionData.maxLength = null;
        this.updateQuestion();
      }
    },
    'questionData.minLength'(newValue) {
      if (this.questionData.maxLength && newValue > this.questionData.maxLength) {
        this.questionData.minLength = this.questionData.maxLength;
      }
    },
    'questionData.maxLength'(newValue) {
      if (this.questionData.minLength && newValue < this.questionData.minLength) {
        this.questionData.maxLength = this.questionData.minLength;
      }
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

.limit-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.limit-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.limit-inputs {
  display: flex;
  gap: 20px;
  padding-left: 20px;
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
  max-width: 600px;
}

.preview-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #BFD0E0;
  border-radius: 4px;
  font-size: 14px;
  font-family: Pretendard;
  background-color: #F7F9FB;
  resize: vertical;
  min-height: 100px;
}

.length-counter {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #666;
  background-color: rgba(247, 249, 251, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

.length-guide {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

/* 입력 필드 비활성화 스타일 */
textarea[readonly] {
  opacity: 0.7;
  cursor: default;
}

/* 체크박스 커스텀 스타일 */
input[type="checkbox"] {
  margin: 0;
  vertical-align: middle;
}
</style>