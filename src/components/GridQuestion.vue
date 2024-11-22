<!-- components/questions/GridQuestion.vue -->
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
          <img src="@/assets/images/grid_choice.png" alt="삭제" />
        </button>
      </div>
    </div>

    <!-- 표 구성 영역 -->
    <div class="grid-builder">
      <!-- 행/열 선택 유형 -->
      <div class="select-type">
        <div class="type-selector">
          <label>
            <input 
              type="radio" 
              v-model="questionData.selectionType"
              value="single"
              @change="updateQuestion"
            >
            행마다 하나씩 선택
          </label>
          <label>
            <input 
              type="radio" 
              v-model="questionData.selectionType"
              value="multiple"
              @change="updateQuestion"
            >
            행마다 여러 개 선택
          </label>
        </div>
      </div>

      <!-- 표 미리보기 -->
      <div class="grid-preview" v-if="questionData.rows.length && questionData.columns.length">
        <table>
          <thead>
            <tr>
              <th></th>
              <th 
                v-for="(column, index) in questionData.columns" 
                :key="'col-'+index"
                class="column-header"
              >
                <div class="header-content">
                  <input
                    type="text"
                    v-model="column.text"
                    placeholder="열 제목"
                    @input="updateQuestion"
                  >
                  <button 
                    @click="removeColumn(index)"
                    class="remove-btn"
                    v-if="questionData.columns.length > 1"
                  >
                    <img src="@/assets/images/grid_choice.png" alt="열 삭제" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in questionData.rows" :key="'row-'+rowIndex">
              <td class="row-header">
                <div class="header-content">
                  <input
                    type="text"
                    v-model="row.text"
                    placeholder="행 제목"
                    @input="updateQuestion"
                  >
                  <button 
                    @click="removeRow(rowIndex)"
                    class="remove-btn"
                    v-if="questionData.rows.length > 1"
                  >
                    <img src="@/assets/images/grid_choice.png" alt="행 삭제" />
                  </button>
                </div>
              </td>
              <td 
                v-for="(column, colIndex) in questionData.columns" 
                :key="'cell-'+rowIndex+'-'+colIndex"
                class="grid-cell"
              >
                <div 
                  :class="['selection-indicator', 
                    questionData.selectionType === 'single' ? 'radio' : 'checkbox'
                  ]"
                ></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 행/열 추가 버튼 -->
      <div class="grid-actions">
        <button @click="addRow" class="add-btn">
          <img src="@/assets/images/grid_choice.png" alt="행 추가" />
          <span>행 추가</span>
        </button>
        <button @click="addColumn" class="add-btn">
          <img src="@/assets/images/grid_choice.png" alt="열 추가" />
          <span>열 추가</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
      questionData: {
        ...this.question,
        rows: this.question.rows || [
          { id: Date.now(), text: '' }
        ],
        columns: this.question.columns || [
          { id: Date.now(), text: '' }
        ],
        selectionType: this.question.selectionType || 'single'
      }
    }
  },

  methods: {
    adjustHeight(e) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
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
      this.questionData.rows.splice(index, 1);
      this.updateQuestion();
    },

    removeColumn(index) {
      this.questionData.columns.splice(index, 1);
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

/* 표 관련 스타일 */
.grid-builder {
  margin-top: 20px;
}

.select-type {
  margin-bottom: 20px;
}

.type-selector {
  display: flex;
  gap: 20px;
}

.type-selector label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.grid-preview {
  margin-bottom: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #F7F9FB;
  border-radius: 8px;
}

th, td {
  padding: 12px;
  border: 1px solid #E5E5E5;
}

.column-header, .row-header {
  background-color: #F7F9FB;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-content input {
  flex: 1;
  border: none;
  outline: none;
  padding: 4px;
  font-size: 14px;
  background: transparent;
  font-family: Pretendard;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
}

.remove-btn img {
  width: 14px;
  height: 14px;
}

.grid-cell {
  text-align: center;
}

.selection-indicator {
  margin: 0 auto;
}

.selection-indicator.radio {
  width: 20px;
  height: 20px;
  border: 2px solid #BFD0E0;
  border-radius: 50%;
}

.selection-indicator.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #BFD0E0;
  border-radius: 4px;
}

.grid-actions {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.add-btn {
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

.add-btn img {
  width: 16px;
  height: 16px;
}
</style>