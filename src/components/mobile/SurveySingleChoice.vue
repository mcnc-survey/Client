<template>
  <div class="survey-box">
    <h3 class="question-title">{{ question }}</h3>
    <div class="options">
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="{ selected: selectedOption === option }"
        @click.prevent="toggleOption(option)"
      >
        <span class="option-text">{{ option }}</span>
        <input
          type="radio"
          :name="name"
          :value="option"
          class="radio-input"
          :checked="selectedOption === option"
          @change="selectOption(option)"
        />
        <span class="custom-radio"></span>
      </label>
    </div>
    <p v-if="required" class="required-text">* 필수 선택</p>
    <!-- Conditionally render the required text -->
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    question: String,
    options: Array,
    name: String,
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedOption: null,
    };
  },
  methods: {
    toggleOption(option) {
      // 두 번째 클릭 시 선택 해제
      this.selectedOption = this.selectedOption === option ? null : option;
      this.$emit("update:selected", this.selectedOption); // 부모에게 선택된 값 전달
    },
    selectOption(option) {
      // 라디오 버튼 변경 이벤트 처리
      this.selectedOption = option;
      this.$emit("update:selected", this.selectedOption); // 부모에게 선택된 값 전달
    },
    getResponse() {
      // 선택된 옵션 반환
      return this.selectedOption;
    },
  },
};
</script>

<style scoped>
.survey-box {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.question-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.options label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9fb; /* 기본 배경색 */
  border-radius: 13.94px; /* 라운드 처리 */
  padding: 10px 15px;
  margin-bottom: 10px;
  font-size: 14px;
  position: relative;
}

.options label.selected {
  background: #bfd0e0; /* 선택된 상태 배경색 */
}

.options .radio-input {
  display: none; /* 기본 라디오 버튼 숨김 */
}

.custom-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
  margin-left: 10px;
}

.radio-input:checked + .custom-radio {
  background-image: url("../../assets/images/selected.svg"); /* 이미지 경로 */
  background-repeat: no-repeat;
  background-position: center;
}

.radio-input:checked + .custom-radio::after {
  content: none; /* 기본 동그라미 제거 */
}

.option-text {
  flex-grow: 1;
  text-align: left;
}

.required-text {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
