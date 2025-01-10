<!-- 
  Author : 한채영
  Description : 객관식(단일 선택) 질문 컴포넌트
  - 필수 응답 여부 선택, 복사, 삭제 관리
  - 옵션 추가/삭제, 기타 옵션 추가/삭제 
-->

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
            <img src="@/assets/images/copy_question.svg" alt="복사" />
          </button>
          <button @click="$emit('delete')" class="action-item delete-btn">
            <img src="@/assets/images/delete_question.svg" alt="삭제" />
          </button>
        </div>
      </div>
    </div>

    <!-- 선택지 목록 -->
    <div class="options-list">
      <div 
        v-for="(option, index) in questionData.options" 
        :key="option.id"
        class="option-item"
      >
        <div class="radio-circle"></div>
        <input
          type="text"
          :value="option.text"
          placeholder="옵션"
          @input="(e) => validateAndUpdateOption(option, e.target.value)"
          :readonly="option.isOther"
          :class="{ 'other-option': option.isOther }"
        >
        <button 
          @click="removeOption(index)"
          class="remove-option"
          v-if="questionData.options.length > 1"
        >
          <img src="@/assets/images/delete_option.svg" alt="옵션 삭제" />
        </button>
      </div>
    </div>

    <!-- 옵션 추가 버튼들 -->
    <div class="add-buttons">
      <button @click="addOption" class="add-option">
        <img src="@/assets/images/add_option.svg" alt="옵션 추가" />
        <span>옵션 추가</span>
      </button>
      <button @click="addOtherOption" class="add-option" v-if="!hasOtherOption">
        <img src="@/assets/images/add_option.svg" alt="기타 추가" />
        <span>기타 추가</span>
      </button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { nextTick } from 'vue';
import { showErrorAlert } from '@/utils/swalUtils';

export default {
  name: 'SingleChoiceQuestion',
  
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
        options: this.question.options || [
          { id: Date.now(), text: '' },
          { id: Date.now() + 1, text: '' }
        ]
      })
    }
  },

  computed: {
    hasOtherOption() {
      return this.questionData.options.some(option => option.isOther);
    },
    hasReachedMaxOptions() {
      return this.questionData.options.length >= 20;
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

    validateAndUpdateOption(option, value) {
      if (value.includes('|`|')) {
        // 특수문자 제거
        option.text = value.replace(/\|\`\|/g, '');
        // 에러 메시지 표시
        showErrorAlert(
          "옵션 입력 오류", 
          "'|`|' 문자는 옵션 텍스트에 사용할 수 없습니다."
        );
      } else {
        option.text = value;
      }
      this.updateQuestion();
    },

    addOption() {
      if (this.hasReachedMaxOptions) {
        showErrorAlert(
          "옵션 개수 초과",
          "옵션은 최대 20개까지만 추가할 수 있습니다."
        );
        return;
      }

      const otherOptionIndex = this.questionData.options.findIndex(
        option => option.isOther
      );
      
      const newOption = {
        id: Date.now(),
        text: ''
      };

      if (otherOptionIndex !== -1) {
        // 기타 옵션이 있으면 그 앞에 삽입
        this.questionData.options.splice(otherOptionIndex, 0, newOption);
      } else {
        // 기타 옵션이 없으면 마지막에 추가
        this.questionData.options.push(newOption);
      }
      
      this.updateQuestion();
    },

    addOtherOption() {
      if (this.hasReachedMaxOptions) {
        showErrorAlert(
          "옵션 개수 초과",
          "옵션은 최대 20개까지만 추가할 수 있습니다."
        );
        return;
      }

      if (!this.hasOtherOption) {
        this.questionData.options.push({
          id: Date.now(),
          text: '기타...',
          isOther: true,
          isReadOnly: true
        });
        this.updateQuestion();
      }
    },

    removeOption(index) {
      this.questionData.options.splice(index, 1);
      this.updateQuestion();
    },

    copyQuestion() {
      // lodash의 cloneDeep을 사용한 깊은 복사
      const copiedQuestion = cloneDeep(this.questionData);
      
      // 새로운 ID 할당
      copiedQuestion.id = Date.now();
      
      // 옵션들의 ID도 새로 생성
      copiedQuestion.options = copiedQuestion.options.map(option => ({
        ...option,
        id: Date.now() + Math.random()
      }));

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
  width: 18px;
  height: 18px;
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

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #BFD0E0;
  border-radius: 50%;
  flex-shrink: 0;
}

.option-item input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
  background: #F7F9FB;
  border-radius: 8px;
  font-family: Pretendard;
}

.option-item input.other-option {
  color: #666;
  background: #F0F0F0;
}

.remove-option {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.remove-option img {
  width: 18px;
  height: 18px;
}

.add-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-option {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  padding: 5px;
}

.add-option:hover {
  color: #333;
}

.add-option img {
  width: 18px;
  height: 18px;
}
</style>