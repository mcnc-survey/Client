<!-- components/questions/MultipleChoiceQuestion.vue -->
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
          <img src="@/assets/images/single_multiple_choice.png" alt="삭제" />
        </button>
      </div>
    </div>

    <!-- 선택지 목록 -->
    <div class="options-list">
      <div 
        v-for="(option, index) in questionData.options" 
        :key="index"
        class="option-item"
      >
        <div class="checkbox-square"></div>
        <input
          type="text"
          v-model="option.text"
          placeholder="옵션"
          @input="updateQuestion"
        >
        <button 
          @click="removeOption(index)"
          class="remove-option"
          v-if="questionData.options.length > 1"
        >
          <img src="@/assets/images/single_multiple_choice.png" alt="옵션 삭제" />
        </button>
      </div>
    </div>

    <!-- 옵션 추가 버튼 -->
    <div class="button-group">
      <button @click="addOption" class="add-option">
        <img src="@/assets/images/single_multiple_choice.png" alt="옵션 추가" />
        <span>옵션 추가</span>
      </button>
      
      <!-- 최소/최대 선택 수 설정 -->
      <div class="selection-limits">
        <div class="limit-input">
          <span>최소 선택:</span>
          <input 
            type="number" 
            v-model.number="questionData.minSelect"
            min="0"
            :max="questionData.options.length"
            @input="updateQuestion"
          >
        </div>
        <div class="limit-input">
          <span>최대 선택:</span>
          <input 
            type="number" 
            v-model.number="questionData.maxSelect"
            :min="questionData.minSelect || 1"
            :max="questionData.options.length"
            @input="updateQuestion"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleChoiceQuestion',
  
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
        options: this.question.options || [
          { id: Date.now(), text: '' }
        ],
        minSelect: this.question.minSelect || 0,
        maxSelect: this.question.maxSelect || null
      }
    }
  },

  watch: {
    'questionData.minSelect'(newValue) {
      // 최소 선택 수가 최대 선택 수보다 크면 최대 선택 수를 조정
      if (this.questionData.maxSelect && newValue > this.questionData.maxSelect) {
        this.questionData.maxSelect = newValue;
      }
    },
    'questionData.maxSelect'(newValue) {
      // 최대 선택 수가 최소 선택 수보다 작으면 최소 선택 수를 조정
      if (newValue && newValue < this.questionData.minSelect) {
        this.questionData.minSelect = newValue;
      }
    }
  },

  methods: {
    adjustHeight(e) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    addOption() {
      this.questionData.options.push({
        id: Date.now(),
        text: ''
      });
      this.updateQuestion();
    },

    removeOption(index) {
      this.questionData.options.splice(index, 1);
      
      // 옵션이 삭제될 때 최소/최대 선택 수 조정
      if (this.questionData.maxSelect > this.questionData.options.length) {
        this.questionData.maxSelect = this.questionData.options.length;
      }
      if (this.questionData.minSelect > this.questionData.options.length) {
        this.questionData.minSelect = this.questionData.options.length;
      }
      
      this.updateQuestion();
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

.checkbox-square {
  width: 20px;
  height: 20px;
  border: 2px solid #BFD0E0;
  border-radius: 4px;
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

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
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

.add-option img {
  width: 16px;
  height: 16px;
}

.selection-limits {
  display: flex;
  gap: 20px;
  align-items: center;
}

.limit-input {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.limit-input input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #BFD0E0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.limit-input input::-webkit-inner-spin-button, 
.limit-input input::-webkit-outer-spin-button { 
  opacity: 1;
}
</style>