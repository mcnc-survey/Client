<template>
  <div class="question-type-tab" :style="tabStyle">
    <div class="tab-items">
      <!-- v-if 제거하고 disabled 조건 추가 -->
      <div 
        class="tab-item" 
        :class="{ 'disabled': isTitleSelected }"
        @click="!isTitleSelected && $emit('change-type', 'single')"
      >
        <img src="@/assets/images/single_multiple_choice.png" alt="단일 선택" />
        <span>단일 선택</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ 'disabled': isTitleSelected }"
        @click="!isTitleSelected && $emit('change-type', 'multiple')"
      >
        <img src="@/assets/images/single_multiple_choice.png" alt="중복 선택" />
        <span>중복 선택</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ 'disabled': isTitleSelected }"
        @click="!isTitleSelected && $emit('change-type', 'grid')"
      >
        <img src="@/assets/images/grid_choice.png" alt="표 만들기" />
        <span>표형</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ 'disabled': isTitleSelected }"
        @click="!isTitleSelected && $emit('change-type', 'short')"
      >
        <img src="@/assets/images/short_answer.png" alt="단답형" />
        <span>단답형</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ 'disabled': isTitleSelected }"
        @click="!isTitleSelected && $emit('change-type', 'long')"
      >
        <img src="@/assets/images/descriptive_answer.png" alt="장문형" />
        <span>장문형</span>
      </div>

      <div 
        class="tab-item add-question"
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
    },
    isTitleSelected: {  // 새로운 prop 추가
      type: Boolean,
      default: false
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

/* disabled 상태 스타일 추가 */
.tab-item.disabled {
  opacity: 0.5;
  cursor: default;
}

/* disabled 상태에서는 hover 효과 제거 */
.tab-item:not(.disabled):hover {
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
  padding-top: 13px;
  border-top: 1px solid #eee;  /* 항상 동일한 border 적용 */
}
</style>