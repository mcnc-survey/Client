<template>
  <div class="question">
    <!-- 질문 제목 -->
    <div class="question-header">
      <div class="question-title-wrapper">
        <div class="input-wrapper">
          <textarea
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

    <!-- 행/열 섹션 -->
    <div class="grid-section">
      <!-- 행 옵션 목록 -->
      <div class="grid-column">
        <div class="section-title">행</div>
        <div class="options-list">
          <div 
            v-for="(row, index) in questionData.rows" 
            :key="row.id"
            class="option-item"
          >
            <div class="radio-circle"></div>
            <input
              type="text"
              v-model="row.text"
              placeholder="행 입력"
              @input="updateQuestion"
            >
            <button 
              @click="removeRow(index)"
              class="remove-option"
              v-if="questionData.rows.length > 1"
            >
              <img src="@/assets/images/delete_option.png" alt="행 삭제" />
            </button>
          </div>
        </div>
        <div class="add-buttons">
          <button @click="addRow" class="add-option">
            <img src="@/assets/images/add_question.png" alt="행 추가" />
            <span>행 추가</span>
          </button>
        </div>
      </div>

      <!-- 열 옵션 목록 -->
      <div class="grid-column">
        <div class="section-title">열</div>
        <div class="options-list">
          <div 
            v-for="(column, index) in questionData.columns" 
            :key="column.id"
            class="option-item"
          >
            <input
              type="text"
              v-model="column.text"
              placeholder="열 입력"
              @input="updateQuestion"
            >
            <button 
              @click="removeColumn(index)"
              class="remove-option"
              v-if="questionData.columns.length > 1"
            >
              <img src="@/assets/images/delete_option.png" alt="열 삭제" />
            </button>
          </div>
        </div>
        <div class="add-buttons">
          <button @click="addColumn" class="add-option">
            <img src="@/assets/images/add_question.png" alt="열 추가" />
            <span>열 추가</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  name: 'GridQuestion',
  
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
        rows: this.question.rows || [
          { id: Date.now(), text: '' },
          { id: Date.now() + 1, text: '' }
        ],
        columns: this.question.columns || [
          { id: Date.now() + 2, text: '' },
          { id: Date.now() + 3, text: '' }
        ]
      })
    }
  },

  methods: {
    adjustHeight(e) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      this.updateQuestion();
    },

    addRow() {
      this.questionData.rows.push({
        id: Date.now(),
        text: ''
      });
      this.updateQuestion();
    },

    addColumn() {
      this.questionData.columns.push({
        id: Date.now(),
        text: ''
      });
      this.updateQuestion();
    },

    removeRow(index) {
      if (this.questionData.rows.length > 1) {
        this.questionData.rows.splice(index, 1);
        this.updateQuestion();
      }
    },

    removeColumn(index) {
      if (this.questionData.columns.length > 1) {
        this.questionData.columns.splice(index, 1);
        this.updateQuestion();
      }
    },

    copyQuestion() {
      const copiedQuestion = cloneDeep(this.questionData);
      
      // 새로운 ID 할당
      copiedQuestion.id = Date.now();
      
      // rows와 columns에 새로운 ID 부여
      copiedQuestion.rows = copiedQuestion.rows.map(row => ({
        ...row,
        id: Date.now() + Math.random()
      }));
      copiedQuestion.columns = copiedQuestion.columns.map(column => ({
        ...column,
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
          rows: newQuestion.rows || [
            { id: Date.now(), text: '' },
            { id: Date.now() + 1, text: '' }
          ],
          columns: newQuestion.columns || [
            { id: Date.now() + 2, text: '' },
            { id: Date.now() + 3, text: '' }
          ]
        });
      },
      deep: true
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

.grid-section {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.grid-column {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
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

.remove-option {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.remove-option img {
  width: 16px;
  height: 16px;
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
  width: 16px;
  height: 16px;
}
</style>