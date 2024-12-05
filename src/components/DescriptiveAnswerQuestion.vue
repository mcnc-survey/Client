<template>
  <div class="question">
    <!-- 질문 제목 -->
    <div class="question-header">
      <div class="question-title-wrapper">
        <div class="input-wrapper">
          <textarea
            ref="titleTextarea"
            v-model="questionData.title"
            class="question-title"
            placeholder="질문"
            rows="1"
            @input="adjustHeight"
            @focus="titleFocused = true"
            @blur="titleFocused = false"
          ></textarea>
          <div class="underline" :class="{ focused: titleFocused }"></div>
        </div>
      </div>
      <div class="question-actions">
        <!-- 옵션 컨테이너 -->
        <div class="options-container">
          <label class="action-item required-toggle">
            <span class="toggle-label">필수</span>
            <div class="toggle-switch">
              <input 
                type="checkbox"
                v-model="questionData.required"
                @change="updateQuestion"
              >
              <span class="slider"></span>
            </div>
          </label>
          <button @click="copyQuestion" class="action-item copy-btn">
            <img src="@/assets/images/copy_question.png" alt="복사" />
          </button>
          <button @click="$emit('delete')" class="action-item delete-btn">
            <img src="@/assets/images/delete_question.png" alt="삭제" />
          </button>
        </div>
      </div>
    </div>

    <!-- 답변 입력창 미리보기 -->
    <div class="answer-preview">
      <textarea 
        readonly 
        placeholder="참여자의 답변 입력란 (최대 2000자)"
        class="preview-input"
        rows="4"
      ></textarea>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { nextTick } from 'vue';

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
      titleFocused: false,
      questionData: cloneDeep({
        ...this.question,
        type: 'long'
      })
    }
  },

  methods: {
    adjustHeight(e) {
      const textarea = e?.target || this.$refs.titleTextarea;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        if (e) this.updateQuestion();
      }
    },

    updateAllTextareas() {
      nextTick(() => {
        this.adjustHeight();
      });
    },

    copyQuestion() {
      // lodash의 cloneDeep을 사용한 깊은 복사
      const copiedQuestion = cloneDeep(this.questionData);
      
      // 새로운 ID 할당
      copiedQuestion.id = Date.now();

      this.$emit('copy', copiedQuestion);
    },

    updateQuestion() {
      const updatedQuestion = cloneDeep(this.questionData);
      this.$emit('update', updatedQuestion);
    }
  },

  watch: {
    question: {
      handler(newQuestion) {
        this.questionData = cloneDeep({
          ...newQuestion,
          options: newQuestion.options || [
            { id: Date.now(), text: '' },
            { id: Date.now() + 1, text: '' }
          ]
        });
        this.updateAllTextareas();
      },
      deep: true
    },
    'questionData.title': {
      handler() {
        this.updateAllTextareas();
      }
    }
  },

  mounted() {
    this.updateAllTextareas();
  },

  updated() {
    this.updateAllTextareas();
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

.input-wrapper {
  position: relative;
  width: 100%;
}

.question-title {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  padding-top: 10px;
  resize: none;
  font-family: Pretendard;
  background: transparent;
  overflow-y: hidden; /* 세로 스크롤바 제거 */
  min-height: 24px; /* 기본 최소 높이 설정 */
  line-height: 1.5; /* 줄 간격 설정 */
  display: block; /* block 요소로 설정 */
  box-sizing: border-box; /* 패딩을 포함한 크기 계산 */
}

.underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: transparent;
  transition: 0.2s ease;
}

.input-wrapper:not(:focus-within):hover .underline {
  background: rgba(191, 208, 224, 0.4);
}

.underline.focused {
  background: #bfd0e0;
  height: 1px;
}

.question-actions {
  display: flex;
  align-items: center;
}

.options-container {
  display: flex;
  align-items: center;
  background: #F7F9FB;
  border-radius: 8px;
  padding: 4px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
}

.action-item:hover {
  background: #E8EEF3;
}

.action-item img {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.required-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
}

.toggle-label {
  font-size: 10px;
  color: #000;
  font-weight: bold;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #FFFFFF;
  transition: .4s;
  border-radius: 18px;
  border: 1.5px solid #E8EEF3;
  cursor: pointer;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: #E8EEF3;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + .slider {
  background-color: #FFFFFF;
  border-color: #000;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(13px);
  background-color: #000;
}

.answer-preview {
  margin-top: 20px;
}

.preview-input {
  width: 90%;
  max-width: 400px;
  padding: 8px 12px;
  border: 1px solid #BFD0E0;
  border-radius: 8px;
  font-size: 14px;
  font-family: Pretendard;
  background-color: #F7F9FB;
  cursor: default;
  color: #666;
  outline: none;
  resize: none;
}
</style>