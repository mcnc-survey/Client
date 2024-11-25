<template>
  <div class="question-type-tab" :style="tabStyle">
    <div class="tab-items">
      <template v-if="selectedQuestionIndex !== null">
        <div class="tab-item" @click="$emit('change-type', 'single')">
          <img src="@/assets/images/single_multiple_choice.png" alt="단일 선택" />
          <span>단일 선택</span>
        </div>
        <div class="tab-item" @click="$emit('change-type', 'multiple')">
          <img src="@/assets/images/single_multiple_choice.png" alt="중복 선택" />
          <span>중복 선택</span>
        </div>
        <div class="tab-item" @click="$emit('change-type', 'grid')">
          <img src="@/assets/images/grid_choice.png" alt="표 만들기" />
          <span>표형</span>
        </div>
        <div class="tab-item" @click="$emit('change-type', 'short')">
          <img src="@/assets/images/short_answer.png" alt="단답형" />
          <span>단답형</span>
        </div>
        <div class="tab-item" @click="$emit('change-type', 'long')">
          <img src="@/assets/images/descriptive_answer.png" alt="장문형" />
          <span>장문형</span>
        </div>
      </template>
      <div 
        class="tab-item add-question" 
        :class="{ 'with-border': selectedQuestionIndex !== null }"
        @click="$emit('add-question')"
      >
        <img src="@/assets/images/add_option.png" alt="질문 추가" />
        <span>질문 추가</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionTypeTab',
  props: {
    selectedQuestionIndex: {
      type: Number,
      default: null
    },
    sideTabTop: {
      type: Number,
      default: 0
    }
  },
  computed: {
    tabStyle() {
      return {
        transform: `translateY(${this.sideTabTop}px)`,
        transition: 'transform 0.3s ease'
      }
    }
  }
}
</script>

<style scoped>
.question-type-tab {
  position: sticky;
  top: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 10px;
  width: 100%;
}

.tab-items {
  display: flex;
  flex-direction: column;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item:hover {
  background: #F7F9FB;
}

.tab-item img {
  width: 16px;
  height: 16px;
}

.tab-item span {
  font-size: 14px;
  color: #666;
}

.add-question {
  margin-top: 5px;
  padding-top: 5px;
}

.add-question.with-border {
  border-top: 1px solid #eee;
}
</style>